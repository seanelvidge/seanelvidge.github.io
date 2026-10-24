---
layout: post
title: Tracking Football Team Strengths with a Bayesian Kalman Model
date: 2025-12-15 09:20:00
description: How a Bayesian extended Kalman filter estimates English football team strengths, uncertainty and match probabilities from historical league results.
tags: football mathematics
related_posts: true
thumbnail: assets/img/football_rankings.png
image_alt: Illustration of three teams' performance ratings changing over time.
last_modified_at: 2026-10-24
---

Not all football-rating systems are the same. Many of the public ones, like the excellent [ClubElo](http://clubelo.com/System), do a fine job of ranking teams using elegant updates. Win and your rating rises, lose and it falls; the amount you move depends on how "surprised" the model was.

This model begins in the same spirit but replaces those heuristic updates with a probabilistic engine: a _Bayesian Extended Kalman Filter_ coupled to a modern version of the Bradley–Terry model (with added draws). The core idea is simple: treat each team's strength as something hidden that we estimate and track through time, with uncertainty that expands between matches and contracts when new results arrive.

> **Update, 24 October 2026:** The model now also learns from the margin of victory. The new article, [Does a 4–0 Win Tell Us More Than a 1–0 Win?]({% post_url 2026-10-24-Football_rankings_and_winning_margins %}), explains that extension, the validation across ten seasons and the change to uncertainty in the league-table predictor. This article remains the introduction to the underlying rating framework and its results-only update.

The results-only calendar model described below was reviewed in October 2026. On 20,096 evaluation matches from 2016/17–2025/26, it achieves a mean-per-outcome Brier score of **0.207478** and log loss of **1.035789**. Settings were selected using 2000/01–2015/16. The [first mathematical review](https://github.com/seanelvidge/England-football-results/blob/main/validation/REPORT.md) explains the move to elapsed calendar time, nonzero initial uncertainty and division-specific parameters, together with the removal of the former innovation-dispersion controller. The filter remains a Gaussian approximation; the latest margin-based model and its scores are covered in the follow-up article.

The rest of this post goes into the mathematical details of the ranking algorithm, but if you want to access the underlying data it is [available here](https://github.com/seanelvidge/England-football-results) (specifically the file [`EnglandLeagueResults_wRanks.csv`](https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglandLeagueResults_wRanks.csv)).

## The Big Picture

Try the model through the [interactive team rankings history]({{ '/teamRankings' | relative_url }}) or the [match win, draw and loss probability calculator]({{ '/matchProbs' | relative_url }}). For background on updating uncertain estimates, my [Bayes' theorem explainer]({% post_url 2023-01-14-Maths_on_a_Mug_15 %}) and [Kalman filter notes]({{ '/kalman' | relative_url }}) introduce the underlying ideas.

Imagine every team has a hidden "true strength" $$s_i$$. Before a match, the home and away teams carry beliefs about their current strengths, each with an associated uncertainty. When they play, the result provides new information that updates those beliefs.

In the ClubElo framework this update is written directly as

$$
R_{\text{new}} = R_{\text{old}} + K(S - E),
$$

where $$S$$ is the score (1 for a win, 0.5 for a draw, 0 for a loss), $$E$$ is the expected probability, and $$K$$ is a fixed responsiveness parameter.

Here, the same logic is embedded in a [Kalman filter](https://en.wikipedia.org/wiki/Kalman_filter), which means the effective $$K$$ is learned automatically. The update size depends on two things: how uncertain we are about the teams, and how surprising the result was. Upsets between uncertain teams lead to large updates; shocks between well-understood teams barely move the needle.

Between matches, team strengths are not frozen. Instead, they evolve according to a _mean-reverting stochastic process_, allowing form to drift while preventing runaway behaviour. Newly promoted teams begin with large uncertainty and adapt quickly; established teams gravitate toward long-term baselines rather than rising indefinitely.

## Modelling Match Outcomes (Wins, Draws, Losses)

Match outcomes are modelled using the [Davidson extension](https://www.jstor.org/stable/2283595) of the [Bradley–Terry model](https://en.wikipedia.org/wiki/Bradley%E2%80%93Terry_model), which naturally incorporates draws. The probability of each outcome is

$$
\Pr(\text{Home}) = \frac{e^{\Delta}}{e^{\Delta} + e^{-\Delta} + \kappa},
$$

$$
\Pr(\text{Draw}) = \frac{\kappa}{e^{\Delta} + e^{-\Delta} + \kappa},
$$

$$
\Pr(\text{Away}) = \frac{e^{-\Delta}}{e^{\Delta} + e^{-\Delta} + \kappa},
$$

where

$$
\Delta = \beta (s_H - s_A) + h.
$$

Here, $$s_H$$ and $$s_A$$ are the latent strengths of the home and away teams, $$\beta$$ is a scaling parameter, $$\kappa$$ controls the draw rate, and $$h$$ is the home-advantage term.

## Home Advantage - Explicit and Time-Varying

Home advantage is not treated as a fixed constant. Instead, it is explicitly modelled and allowed to vary over time. Historical analysis shows that home-win rates in English football have declined dramatically since the late 19th century, falling from well above 60% to closer to 40–45% in the modern era (see [this analysis](https://seanelvidge.com/articles/2025/Home_advantage_in_English_football/)).

The results-only model learns $$h$$ and $$\log\kappa$$ separately for each division tier. After each date, it updates them using that date's outcome residuals; every prediction on the date uses the parameters available before those results. This replaces the earlier fixed calendar-year trend. The margin extension adds another tier-specific parameter, explained in the follow-up. Comparisons across remote eras and different divisions still depend partly on the tier priors.

## Validation and Rating Scale

Predictive accuracy is measured using the [Brier score](https://en.wikipedia.org/wiki/Brier_score), here averaged over both matches and the three outcomes. The summed multiclass convention would give a value three times larger. The later-season comparison above is the evidence for improvement; fitting or scoring the full history alone would not establish predictive value. Calibration is also checked by outcome and forecast probability, and is not perfect.

Internally, the filter operates on a latent "skill" scale roughly spanning $$-3$$ to $$+3$$. However for presentation, these values are mapped linearly onto an Elo-style scale, centred on 1000 points, with elite teams reaching 1800+ and lower-league teams clustering about a thousand points below. This transformation is purely cosmetic; all inference happens on the latent scale.

## Part II — If You Dare Read On: The Mathematics

## 1. State Evolution ([Ornstein–Uhlenbeck](https://en.wikipedia.org/wiki/Ornstein%E2%80%93Uhlenbeck_process) Dynamics)

Each team’s latent strength evolves as

$$
s_{i,t+1} = r_i\, s_{i,t} + (1 - r_i)\, \mu_{\text{tier}(i,t)} + \varepsilon_{i,t},
$$

with

$$
\varepsilon_{i,t} \sim \mathcal{N}(0, q_i).
$$

For $$d_i$$ days since the previous match, $$r_i=0.995^{d_i/7}$$ and $$q_i=0.0017(1-r_i^2)/(1-0.995^2)$$. The tier means are $$1.5, 0.3, -0.3, -0.6$$ and a new team starts at its tier mean with variance $$0.25$$. A division change retains its previous skill and multiplies its previous variance by $$1.5$$ before the time transition. The latter is a modelling heuristic. These transitions allow uncertainty to tend towards the process’s stationary variance during inactivity.

## 2. Observation Model

Given predicted strengths $$s_H$$ and $$s_A$$, the model produces a probability vector

$$
\mathbf{p} =
\begin{bmatrix}
p_H \\
p_D \\
p_A
\end{bmatrix},
$$

using the Davidson–Bradley–Terry equations above. The Jacobian matrix $$H$$ is computed by differentiating $$\mathbf{p}$$ with respect to the state vector $$[s_H, s_A]^T$$, enabling linearisation of the nonlinear observation model.

## 3. The Results-Only Extended Kalman Filter

The categorical update provides the baseline for the model. The [new article]({% post_url 2026-10-24-Football_rankings_and_winning_margins %}) shows how the scalar update incorporates winning-margin information.

Prediction step:

$$
x^- = F x_t + (I-F)\mu,
$$

$$
P^- = F P_t F^\top + Q,
$$

where $$F = \operatorname{diag}(r_H,r_A)$$ and $$Q=\operatorname{diag}(q_H,q_A)$$. Home and away teams may have different elapsed times.

Observation noise:

$$
R = \operatorname{diag}(\mathbf{p}) - \mathbf{p}\mathbf{p}^\top.
$$

Update step:

$$
K = P^- H^\top \bigl(H P^- H^\top + R\bigr)^{+},
$$

$$
x_{t+1} = x^- + K (y - \mathbf{p}),
$$

$$
P_{t+1} = (I - K H) P^-.
$$

The superscript $$+$$ denotes a pseudoinverse: the three categorical probabilities sum to one, leaving only two independent residuals. The results-only update has an equivalent scalar score/information form, avoiding a singular matrix inversion. The filter retains each team’s marginal variance while discarding induced cross-team covariance. The old normalised-innovation controller has been removed; its target of two corrected a dimension error but did not establish exact categorical or Bayesian uncertainty calibration.

## Why This Matters

The model makes its evolution, observation and prior assumptions explicit, so they can be tested chronologically. Its strength estimates and uncertainty provide the starting point for both match forecasts and the [league table predictor]({{ '/tableProbs' | relative_url }}). The [winning-margin update]({% post_url 2026-10-24-Football_rankings_and_winning_margins %}) builds on this framework and tests how much more the score can tell us.
