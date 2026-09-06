/* Shared cumulative-wins chart for the H2H tool and CSV-generated rivalry pages. */
(function (root) {
  "use strict";

  // Compact build-time rows: date, home-team index, home goals, away goals,
  // first team's cumulative wins, second team's cumulative wins.
  function fromRows(teams, rows) {
    const history = [[], []];
    for (const [day, home, homeGoals, awayGoals, firstWins, secondWins] of rows) {
      const x = Date.parse(`${day}T00:00:00Z`);
      const match = { Date: day, HomeTeam: teams[home], AwayTeam: teams[1 - home], hGoal: homeGoals, aGoal: awayGoals };
      history[0].push({ x, y: firstWins, match });
      history[1].push({ x, y: secondWins, match });
    }
    return history;
  }

  function config({ teams, history, styles, theme, date }) {
    const colours = theme();
    const axis = (label) => ({
      ticks: { precision: 0, color: colours.text },
      title: { display: !!label, text: label, color: colours.text },
      grid: { color: colours.border },
      border: { color: colours.border },
    });
    return {
      type: "line",
      plugins: [
        {
          id: "clubLineContrast",
          beforeDatasetDraw(chart) {
            chart.ctx.save();
            chart.ctx.shadowColor = theme().text;
            chart.ctx.shadowBlur = 2;
          },
          afterDatasetDraw(chart) {
            chart.ctx.restore();
          },
        },
      ],
      data: {
        datasets: teams.map((team, i) => ({
          label: team,
          data: history[i],
          borderColor: styles[i].colour,
          backgroundColor: styles[i].colour,
          borderDash: styles[i].dash,
          borderWidth: 2.5,
          // Hold the previous total until the next match date, including draws.
          stepped: "before",
          pointRadius: history[i].length === 1 ? 4 : 0,
          pointHoverRadius: 5,
          pointHitRadius: 10,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        parsing: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: true, labels: { color: colours.text, usePointStyle: true, boxWidth: 10, font: { size: 12 } } },
          tooltip: {
            callbacks: {
              title: (items) => {
                const m = items[0]?.raw.match;
                return m ? `${date(m.Date)} · ${m.HomeTeam} ${m.hGoal}–${m.aGoal} ${m.AwayTeam}` : "";
              },
              label: (context) => `${context.dataset.label}: ${context.parsed.y} wins`,
            },
          },
        },
        onResize(chart, size) {
          chart.options.scales.x.ticks.maxTicksLimit = Math.max(3, Math.floor(size.width / 110));
        },
        scales: {
          x: {
            ...axis("Year"),
            type: "time",
            adapters: { date: { zone: "utc" } },
            time: { minUnit: "day", displayFormats: { year: "yyyy", month: "MMM yyyy", day: "d MMM yyyy" } },
            ticks: { color: colours.text, maxTicksLimit: 5, maxRotation: 0, autoSkipPadding: 16 },
          },
          y: { ...axis("Cumulative wins"), beginAtZero: true },
        },
      },
    };
  }

  function updateTheme(chart, colours) {
    chart.options.plugins.legend.labels.color = colours.text;
    for (const axis of Object.values(chart.options.scales)) {
      axis.ticks.color = colours.text;
      axis.title.color = colours.text;
      axis.grid.color = colours.border;
      axis.border.color = colours.border;
    }
    chart.update("none");
  }

  const api = { fromRows, config, updateTheme };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.FootballWinHistory = api;
})(globalThis);
