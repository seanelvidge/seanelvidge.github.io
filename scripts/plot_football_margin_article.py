"""Recreate the October 2026 article figures from saved validation results.

Run: python scripts/plot_football_margin_article.py (requires matplotlib).
No model fitting, network access, or changes to the underlying validation.
"""
import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import PercentFormatter

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "assets/data/footballMarginValidation.json"
GREEN, ORANGE, GREY = "#21734f", "#b76b24", "#777777"


def save(figure, name):
    for directory, extension in [("img", "png"), ("pdf", "pdf")]:
        destination = ROOT / "assets" / directory / f"{name}.{extension}"
        destination.parent.mkdir(parents=True, exist_ok=True)
        figure.savefig(destination, dpi=200, facecolor="white")
    plt.close(figure)


def main():
    data = json.loads(DATA.read_text())
    plt.rcParams.update({
        "font.family": "DejaVu Sans", "font.size": 12,
        "axes.spines.top": False, "axes.spines.right": False,
        "axes.titlepad": 16, "axes.labelpad": 10,
        "savefig.bbox": "tight", "savefig.pad_inches": .18,
    })
    seasons = data["seasons"]
    weighted = sum(s["matches"] * s["log_loss_reduction"] for s in seasons) / sum(s["matches"] for s in seasons)
    assert abs(weighted + data["paired_match_changes"]["log_loss"]["mean"]) < 1e-14
    assert sum(s["matches"] for s in seasons) == 20096

    fig, ax = plt.subplots(figsize=(9.2, 5.1), layout="constrained")
    bars = ax.bar(range(len(seasons)), [s["log_loss_reduction"] for s in seasons], color=GREEN, width=.7, zorder=3)
    ax.axhline(weighted, color=ORANGE, linestyle="--", linewidth=1.6, label="Overall improvement (weighted by matches)")
    ax.set_xticks(range(len(seasons)), [s["season"] for s in seasons], rotation=40, ha="right")
    ax.set(title="Winning margins improve predictions in all ten seasons",
           ylabel="Reduction in match log loss", xlabel="Evaluation season", ylim=(0, .0054))
    ax.yaxis.grid(True, alpha=.16, zorder=0)
    ax.legend(loc="upper right", frameon=False, fontsize=10)
    ax.bar_label(bars, fmt="%.4f", padding=4, fontsize=9, bbox={"facecolor": "white", "edgecolor": "none", "pad": .5})
    save(fig, "football-margin-season-validation")

    fig, ax = plt.subplots(figsize=(8.5, 3.4), layout="constrained")
    for index, (key, label) in enumerate([("brier_mean", "Brier score"), ("log_loss", "Log loss")]):
        baseline = data["match_comparison"]["results_only"][key]
        change = data["paired_match_changes"][key]
        mean = -change["mean"] / baseline * 100
        low, high = -change["upper95"] / baseline * 100, -change["lower95"] / baseline * 100
        ax.errorbar(mean, index, xerr=[[mean-low], [high-mean]], fmt="o", color=GREEN, capsize=6, markersize=8, linewidth=2)
        ax.text(mean, index+.21, f"{mean:.2f}% improvement", ha="center", fontsize=11, color=GREEN)
    ax.axvline(0, color=GREY, linestyle="--", linewidth=1)
    ax.set(title="A small improvement, supported by both scores",
           xlabel="Relative score reduction, with 95% intervals", xlim=(-.04, .4), xticks=[0, .1, .2, .3, .4], ylim=(-.5, 1.65),
           yticks=[0, 1], yticklabels=["Brier score", "Log loss"])
    ax.xaxis.set_major_formatter(PercentFormatter(xmax=100, decimals=1))
    ax.xaxis.grid(True, alpha=.16)
    ax.spines["left"].set_visible(False)
    ax.tick_params(axis="y", length=0)
    save(fig, "football-margin-confidence-intervals")

    fig, ax = plt.subplots(figsize=(9.2, 5.2), layout="constrained")
    fractions = [0., .25, .5, .75]
    models = [
        ("results_fixed", "Results only; fixed strength estimates", GREY, "s"),
        ("margin_fixed", "Winning margins; fixed strength estimates", ORANGE, "^"),
        ("margin_posterior", "Winning margins; uncertain fixed strengths", GREEN, "o"),
    ]
    for name, label, colour, marker in models:
        values = [100*data["league"]["by_fraction"][str(f)][name]["coverage80"] for f in fractions]
        ax.plot([100*f for f in fractions], values, color=colour, marker=marker, linewidth=2.2, markersize=6, label=label)
    ax.axhline(80, color="#333333", linestyle="--", linewidth=1.3, label="Intended coverage: 80%")
    ax.set(title="Allowing for uncertain strengths makes the ranges more realistic",
           xlabel="Approximate share of season completed", ylabel="Actual coverage of 80% points intervals",
           xticks=[0, 25, 50, 75], ylim=(50, 100))
    ax.yaxis.set_major_formatter(PercentFormatter(xmax=100, decimals=0))
    ax.xaxis.set_major_formatter(PercentFormatter(xmax=100, decimals=0))
    ax.yaxis.grid(True, alpha=.16)
    ax.legend(loc="upper center", bbox_to_anchor=(.5, -.21), frameon=False, fontsize=10, ncol=2)
    save(fig, "football-league-uncertainty-validation")


if __name__ == "__main__":
    main()
