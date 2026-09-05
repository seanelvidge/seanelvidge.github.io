(function () {
  "use strict";
  const UI = FootballTools,
    D = FootballRankingsData;
  const el = (id) => document.getElementById(`match-${id}`);
  const form = el("form"),
    status = el("status");
  let data, chart;

  function updateTheme() {
    if (!chart) return;
    const theme = UI.theme(el("tool"));
    chart.data.datasets[0].borderColor = theme.muted;
    for (const axis of Object.values(chart.options.scales)) {
      axis.ticks.color = theme.text;
      axis.grid.color = theme.border;
      axis.border.color = theme.border;
      axis.title.color = theme.text;
    }
    chart.update("none");
  }

  function calculate() {
    try {
      const teams = [UI.matchName(el("home").value, data.teams), UI.matchName(el("away").value, data.teams)];
      if (teams[0] === teams[1]) throw new Error("Choose two different teams.");
      el("home").value = teams[0];
      el("away").value = teams[1];
      const styles = [D.chooseStyle(data.clubs.get(teams[0]))];
      styles.push(D.chooseStyle(data.clubs.get(teams[1]), styles));
      const ranks = teams.map((team) => data.ranks.get(team));
      const year = new Date().getFullYear();
      const probabilities = MatchProbabilities.probabilities(ranks[0].latest.y, ranks[1].latest.y, year);
      el("matchup").replaceChildren();
      teams.forEach((team, i) => {
        const club = UI.element("div", "football-panel football-club");
        club.style.setProperty("--team-colour", styles[i].colour);
        const img = UI.crest(team, data.clubs);
        if (img) club.append(img);
        const info = UI.element("div"),
          rank = ranks[i];
        info.append(UI.element("p", "rankings-note match-role", i ? "Away team" : "Home team"), UI.element("h2", "", team));
        const delta = rank.previous ? rank.latest.y - rank.previous.y : null;
        const trend = delta === null ? "" : ` · ${delta > 0 ? "↑ +" : delta < 0 ? "↓ " : "→ "}${delta.toFixed(1)} since previous match`;
        info.append(UI.element("p", "match-rating", `Rating ${rank.latest.y.toLocaleString("en-GB", { maximumFractionDigits: 1 })}`));
        info.append(UI.element("p", "rankings-note", `${UI.date(rank.latest.x)}${trend}`));
        if (data.inactive.has(team)) info.append(UI.element("p", "rankings-note", "Inactive club · last recorded rating"));
        club.append(info);
        if (i) el("matchup").append(UI.element("span", "rankings-note", "vs"));
        el("matchup").append(club);
      });
      const labels = ["Home win", "Draw", "Away win"],
        colours = [styles[0].colour, "#8793A3", styles[1].colour];
      el("scorecards").replaceChildren(
        ...probabilities.map((p, i) => {
          const card = UI.element("div", "football-panel football-scorecard");
          card.style.setProperty("--team-colour", colours[i]);
          card.append(
            UI.element("h3", "", labels[i]),
            UI.element("strong", "", `${(p * 100).toFixed(1)}%`),
            UI.element("span", "rankings-note", i === 1 ? "Level at full time" : teams[i === 0 ? 0 : 1])
          );
          return card;
        })
      );
      el("output").hidden = false;
      el("summary").textContent = `Latest recorded ratings · ${year} home-advantage model · percentages rounded to one decimal place`;
      if (chart) chart.destroy();
      chart = new Chart(el("chart"), {
        type: "bar",
        data: {
          labels,
          datasets: [{ data: probabilities.map((p) => p * 100), backgroundColor: colours, borderWidth: 1, borderRadius: 6, maxBarThickness: 48 }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          indexAxis: "y",
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => ` ${context.parsed.x.toFixed(2)}%` } } },
          scales: {
            x: {
              min: 0,
              max: 100,
              ticks: { callback: (value) => `${value}%` },
              title: { display: true, text: "Estimated probability" },
              grid: {},
              border: {},
            },
            y: { ticks: {}, title: {}, grid: { display: false }, border: {} },
          },
        },
      });
      updateTheme();
      UI.url({ team1: teams[0], team2: teams[1] });
      status.textContent = `Probabilities calculated for ${teams[0]} at home to ${teams[1]}.`;
    } catch (error) {
      status.textContent = error.message;
      el("output").hidden = true;
      UI.url({});
    }
  }

  async function load() {
    el("retry").hidden = true;
    el("controls").disabled = true;
    status.textContent = "Loading team ratings…";
    try {
      if (!window.Chart) throw new Error("The chart library could not load. Reload the page to try again.");
      const [rows, clubs, activity] = await Promise.all([
        UI.csv("EnglandLeagueResults_wRanks.csv", D.REQUIRED_COLUMNS, true, false),
        UI.csv("EnglishTeamLogos.csv", ["Team", "LogoURL", "PriColour"]).catch(() => null),
        UI.csv("EnglishTeamActivePeriods.csv", ["Team", "ActivePeriods"]).catch(() => null),
      ]);
      const histories = new Map();
      D.addRows(histories, rows);
      const summary = D.summarise(histories);
      if (!summary.records.size) throw new Error("No valid team ratings were found. Please try again.");
      const ranks = new Map([...summary.records].map(([team, record]) => [team, { ...record, previous: histories.get(team).at(-2) }]));
      data = {
        ranks,
        teams: [...ranks.keys()].sort((a, b) => a.localeCompare(b, "en")),
        clubs: new Map((clubs || []).map((row) => [row.Team.trim(), row])),
        inactive: new Set((activity || []).filter((row) => !/present\s*$/i.test(row.ActivePeriods.trim())).map((row) => row.Team.trim())),
      };
      UI.options(el("teams"), data.teams);
      el("controls").disabled = false;
      el("data-note").textContent = `${data.teams.length} teams · database through ${UI.date(summary.end)}.${
        clubs ? "" : " Club colours and crests are unavailable; alternative colours are used."
      }${activity ? "" : " Club activity information is unavailable."}`;
      status.textContent = "Choose a home team and an away team to get started.";
      const params = new URLSearchParams(location.search);
      el("home").value = params.get("team1") || "";
      el("away").value = params.get("team2") || "";
      if (el("home").value && el("away").value) calculate();
    } catch (error) {
      status.textContent = error.message;
      el("retry").hidden = false;
    }
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculate();
  });
  el("swap").addEventListener("click", () => {
    [el("home").value, el("away").value] = [el("away").value, el("home").value];
    if (el("home").value && el("away").value) calculate();
  });
  form.addEventListener("input", () => {
    el("output").hidden = true;
    UI.url({});
    status.textContent = "Selections changed. Calculate to update the probabilities.";
  });
  el("reset").addEventListener("click", () => {
    form.reset();
    el("output").hidden = true;
    if (chart) chart.destroy();
    chart = null;
    UI.url({});
    status.textContent = "Choose a home team and an away team to get started.";
    el("home").focus();
  });
  el("share").addEventListener("click", async () => {
    await UI.share(status);
    if (status.textContent.startsWith("Link copied.")) status.textContent = "Link copied with the selected home and away teams.";
  });
  el("retry").addEventListener("click", load);
  new MutationObserver(updateTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  load();
})();
