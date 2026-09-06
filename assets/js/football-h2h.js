(function () {
  "use strict";
  const UI = FootballTools,
    D = FootballResultsData;
  const el = (id) => document.getElementById(`h2h-${id}`),
    form = el("form"),
    status = el("status");
  let data, period, stats, teams, styles;
  let charts = [],
    visibleMatches = 25;

  function destroyCharts() {
    charts.forEach((chart) => chart.destroy());
    charts = [];
  }
  function matchRow(match) {
    const row = UI.element("div", "football-match");
    row.append(UI.element("div", "football-match-meta", `${UI.date(match.Date)} · ${match.Division}`));
    row.append(UI.element("span", `football-home football-team-name${match.hGoal > match.aGoal ? " football-winner" : ""}`, match.HomeTeam));
    row.append(UI.element("span", "football-score", `${match.hGoal} – ${match.aGoal}`));
    row.append(UI.element("span", `football-team-name${match.aGoal > match.hGoal ? " football-winner" : ""}`, match.AwayTeam));
    return row;
  }
  function renderMatches() {
    const meetings = el("order").value === "newest" ? stats.meetings.slice().reverse() : stats.meetings;
    const count = Math.min(visibleMatches, meetings.length);
    el("matches").replaceChildren(...meetings.slice(0, count).map(matchRow));
    el("results-count").textContent = `Showing ${count} of ${meetings.length} meetings · home team first`;
    el("more").hidden = count === meetings.length;
  }
  function renderMatchup() {
    el("matchup").replaceChildren();
    teams.forEach((team, i) => {
      const club = UI.element("div", "football-panel football-club");
      club.style.setProperty("--team-colour", styles[i].colour);
      const img = UI.crest(team, data.clubs);
      if (img) club.append(img);
      club.append(UI.element("h2", "", team));
      if (i === 1) el("matchup").append(UI.element("span", "rankings-note", "vs"));
      el("matchup").append(club);
    });
  }
  function renderStatistics() {
    el("scorecards").replaceChildren();
    [
      [`${teams[0]} wins`, stats.wins[0], styles[0].colour],
      ["Draws", stats.draws, "#8793A3"],
      [`${teams[1]} wins`, stats.wins[1], styles[1].colour],
    ].forEach(([label, value, colour]) => {
      const card = UI.element("div", "football-panel football-scorecard");
      card.style.setProperty("--team-colour", colour);
      card.append(
        UI.element("h3", "", label),
        UI.element("strong", "", value),
        UI.element("span", "rankings-note", `${((100 * value) / stats.meetings.length).toFixed(1)}% of meetings`)
      );
      el("scorecards").append(card);
    });
    const goals = UI.element("div", "football-goals");
    teams.forEach((team, i) => {
      if (i === 1) goals.append(UI.element("span", "rankings-note", "Goals scored"));
      const side = UI.element("div");
      side.append(UI.element("strong", "", stats.goals[i]), UI.element("span", "rankings-note", team));
      goals.append(side);
    });
    el("goals").replaceChildren(goals);
    el("records").replaceChildren();
    teams.forEach((team, i) => {
      const record = stats.biggest[i],
        card = UI.element("article", "football-panel football-record");
      card.style.setProperty("--team-colour", styles[i].colour);
      card.append(UI.element("h3", "", team));
      if (!record.matches.length) card.append(UI.element("p", "rankings-note", "No wins in this period."));
      else {
        card.append(UI.element("strong", "", `${record.margin}-goal winning margin`));
        card.append(matchRow(record.matches[0]));
        if (record.matches.length > 1) {
          const details = document.createElement("details");
          details.append(UI.element("summary", "", `Show ${record.matches.length - 1} more tied record${record.matches.length > 2 ? "s" : ""}`));
          details.append(...record.matches.slice(1).map(matchRow));
          card.append(details);
        }
      }
      el("records").append(card);
    });
  }
  function updateTheme() {
    const colours = UI.theme(el("tool"));
    charts.forEach((chart) => {
      chart.options.plugins.legend.labels.color = colours.text;
      for (const axis of Object.values(chart.options.scales)) {
        axis.ticks.color = colours.text;
        axis.title.color = colours.text;
        axis.grid.color = colours.border;
        axis.border.color = colours.border;
      }
      chart.update("none");
    });
  }
  function wrapLabel(label) {
    const words = label.split(" "),
      lines = [""];
    for (const word of words) {
      if ((lines[lines.length - 1] + word).length > 20) lines.push("");
      lines[lines.length - 1] += (lines[lines.length - 1] ? " " : "") + word;
    }
    return lines;
  }
  function renderCharts() {
    destroyCharts();
    const common = () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { display: false, labels: { usePointStyle: true, boxWidth: 10, font: { size: 12 } } } },
    });
    const axis = (label) => ({ ticks: { precision: 0 }, title: { display: !!label, text: label }, grid: {}, border: {} });
    const outcomes = new Chart(el("outcomes"), {
      type: "bar",
      data: {
        labels: [wrapLabel(`${teams[0]} wins`), ["Draws"], wrapLabel(`${teams[1]} wins`)],
        datasets: [
          {
            label: "Matches",
            data: [stats.wins[0], stats.draws, stats.wins[1]],
            backgroundColor: [styles[0].colour, "#8793A3", styles[1].colour],
            borderColor: UI.theme(el("tool")).muted,
            borderWidth: 1,
            borderRadius: 5,
            maxBarThickness: 30,
          },
        ],
      },
      options: { ...common(), indexAxis: "y", scales: { x: { ...axis("Matches"), beginAtZero: true }, y: axis("") } },
    });
    const history = new Chart(
      el("history"),
      FootballWinHistory.config({
        teams,
        history: stats.history,
        styles,
        theme: () => UI.theme(el("tool")),
        date: UI.date,
      })
    );
    charts = [outcomes, history];
    updateTheme();
    el("outcomes").setAttribute("aria-label", `${teams[0]}: ${stats.wins[0]} wins. ${stats.draws} draws. ${teams[1]}: ${stats.wins[1]} wins.`);
    el("history").setAttribute("aria-label", `Cumulative wins over ${stats.meetings.length} meetings. Individual results are listed below.`);
  }
  function compare() {
    try {
      teams = [UI.matchName(el("team1").value, data.teams), UI.matchName(el("team2").value, data.teams)];
      if (teams[0] === teams[1]) throw new Error("Choose two different teams to compare.");
      const chosen = period(),
        premier = el("premier").checked;
      styles = [FootballRankingsData.chooseStyle(data.clubs.get(teams[0]))];
      styles.push(FootballRankingsData.chooseStyle(data.clubs.get(teams[1]), styles));
      el("team1").value = teams[0];
      el("team2").value = teams[1];
      stats = D.headToHead(data.matches, teams[0], teams[1], chosen, premier);
      UI.url({ team1: teams[0], team2: teams[1], ...UI.periodParams(chosen), PLEra: premier ? "true" : null });
      renderMatchup();
      el("output").hidden = false;
      el("summary").textContent = `${UI.periodLabel(chosen)}${premier ? " · Premier League era" : ""} · ${stats.meetings.length} league meetings${
        stats.meetings.length ? ` · ${UI.date(stats.meetings[0].Date)} – ${UI.date(stats.meetings[stats.meetings.length - 1].Date)}` : ""
      }`;
      el("empty").hidden = stats.meetings.length !== 0;
      el("statistics").hidden = !stats.meetings.length;
      if (!stats.meetings.length) {
        destroyCharts();
        status.textContent = "No meetings found. Try another period.";
        return;
      }
      renderStatistics();
      renderCharts();
      visibleMatches = 25;
      renderMatches();
      status.textContent = "Comparison ready. Change the teams or period to explore more results.";
    } catch (error) {
      status.textContent = error.message;
      el("output").hidden = true;
      destroyCharts();
    }
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (data) compare();
  });
  el("swap").addEventListener("click", () => {
    const team = el("team1").value;
    el("team1").value = el("team2").value;
    el("team2").value = team;
    if (el("team1").value && el("team2").value) compare();
  });
  el("reset").addEventListener("click", () => {
    form.reset();
    el("season").value = data.seasons[0];
    UI.panels(form, "period");
    el("output").hidden = true;
    destroyCharts();
    UI.url({});
    status.textContent = "Choose two teams to compare.";
    el("team1").focus();
  });
  el("share").addEventListener("click", () => UI.share(status));
  el("order").addEventListener("change", () => {
    visibleMatches = 25;
    renderMatches();
  });
  el("more").addEventListener("click", () => {
    visibleMatches += 25;
    renderMatches();
  });
  new MutationObserver(updateTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  async function load() {
    el("retry").hidden = true;
    el("controls").disabled = true;
    status.textContent = "Loading league results…";
    try {
      if (!window.Chart || !window.luxon) throw new Error("A chart library could not load. Check your connection and reload the page.");
      data = await UI.load(false);
      period = UI.initPeriod("h2h", data);
      UI.options(el("teams"), data.teams);
      const params = new URLSearchParams(window.location.search);
      el("team1").value = params.get("team1") || "";
      el("team2").value = params.get("team2") || "";
      if (params.has("season")) {
        UI.chooseRadio(form, "period", "season");
        el("season").value = params.get("season");
      } else if (params.has("startDate") || params.has("endDate")) {
        UI.chooseRadio(form, "period", "dates");
        el("start").value = params.get("startDate") || "";
        el("end").value = params.get("endDate") || "";
      }
      el("premier").checked = params.get("PLEra") === "true";
      el("controls").disabled = false;
      el("data-note").textContent = `Results through ${UI.date(data.matches[data.matches.length - 1].Date)}. Reload for new results.${
        data.colourWarning
      }`;
      status.textContent = `${data.teams.length} teams available. Choose two teams to compare.`;
      if (el("team1").value || el("team2").value) compare();
    } catch (error) {
      status.textContent = error.message;
      el("retry").hidden = false;
    }
  }
  el("retry").addEventListener("click", load);
  load();
})();
