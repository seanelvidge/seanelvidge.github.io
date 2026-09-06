const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const H = require("../assets/js/football-win-history.js");
const D = require("../assets/js/football-results-data.js");
const teams = ["Arsenal", "Tottenham Hotspur"];
const rows = [
  ["1992-08-10", 0, 2, 0, 1, 0],
  ["1992-09-12", 1, 1, 1, 1, 0],
  ["1993-01-09", 1, 3, 0, 1, 1],
];
const history = H.fromRows(teams, rows);
const styles = [
  { colour: "#3266AD", dash: [] },
  { colour: "#D1495B", dash: [8, 4] },
];
const theme = () => ({ text: "#24292f", border: "#dce1e7" });
const configuration = () => H.config({ teams, history, styles, theme, date: (day) => day });

test("CSV-built history matches the H2H calculations, including draws and home/away orientation", () => {
  const matches = D.normaliseMatches(history[0].map((point) => ({ ...point.match, Season: "1992/1993", Tier: "1", Division: "Premier League" })));
  const expected = D.headToHead(matches, ...teams).history;
  for (let side = 0; side < 2; side++) {
    assert.deepEqual(
      history[side].map(({ x, y }) => ({ x, y })),
      expected[side].map(({ x, y }) => ({ x, y }))
    );
  }
  assert.equal(history[0][0].x, Date.UTC(1992, 7, 10));
  assert.equal(history[0][1].match.HomeTeam, "Tottenham Hotspur");
  assert.deepEqual(
    history[0].map((point) => point.y),
    [1, 1, 1]
  );
  assert.deepEqual(
    history[1].map((point) => point.y),
    [0, 0, 1]
  );
});

test("shared chart retains the H2H steps, UTC time scale, integer totals and clickable legend", () => {
  const config = configuration();
  assert.equal(config.type, "line");
  assert.equal(config.options.parsing, false);
  assert.equal(config.options.scales.x.type, "time");
  assert.equal(config.options.scales.x.adapters.date.zone, "utc");
  assert.equal(config.options.scales.y.beginAtZero, true);
  assert.equal(config.options.scales.y.ticks.precision, 0);
  assert.equal(config.options.plugins.legend.display, true);
  assert.equal(config.options.interaction.intersect, false);
  assert.equal(config.data.datasets[0].stepped, "before");
  assert.deepEqual(config.data.datasets[1].borderDash, [8, 4]);
  assert.equal(config.data.datasets[1].borderColor, styles[1].colour);
  const chart = { options: config.options };
  config.options.onResize(chart, { width: 320 });
  assert.equal(chart.options.scales.x.ticks.maxTicksLimit, 3);
  config.options.onResize(chart, { width: 1200 });
  assert.equal(chart.options.scales.x.ticks.maxTicksLimit, 10);
});

test("tooltips show the correct dated score and cumulative wins", () => {
  const callbacks = configuration().options.plugins.tooltip.callbacks;
  assert.equal(callbacks.title([{ raw: history[0][2] }]), "1993-01-09 · Tottenham Hotspur 3–0 Arsenal");
  assert.equal(callbacks.label({ dataset: { label: teams[0] }, parsed: { y: 1 } }), "Arsenal: 1 wins");
  assert.equal(callbacks.title([]), "");
});

test("theme changes update chart labels, axes and borders", () => {
  let update;
  const chart = {
    options: configuration().options,
    update: (mode) => {
      update = mode;
    },
  };
  H.updateTheme(chart, { text: "#edf1f5", border: "#48515c" });
  assert.equal(chart.options.plugins.legend.labels.color, "#edf1f5");
  for (const axis of Object.values(chart.options.scales)) {
    assert.equal(axis.ticks.color, "#edf1f5");
    assert.equal(axis.title.color, "#edf1f5");
    assert.equal(axis.grid.color, "#48515c");
    assert.equal(axis.border.color, "#48515c");
  }
  assert.equal(update, "none");
});

test("a single match remains visible and an empty history does not invent results", () => {
  const one = H.config({ teams, history: H.fromRows(teams, rows.slice(0, 1)), styles, theme, date: String });
  assert.equal(one.data.datasets[0].pointRadius, 4);
  assert.deepEqual(H.fromRows(teams, []), [[], []]);
});

test("both pages use the shared chart and the rivalry initializer does not fetch any data", () => {
  const read = (file) => fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  assert.match(read("assets/js/football-h2h.js"), /FootballWinHistory\.config/);
  assert.match(read("assets/js/rivalry-chart.js"), /FootballWinHistory\.config/);
  assert.doesNotMatch(read("assets/js/rivalry-chart.js"), /\bfetch\s*\(|\.csv\s*\(|XMLHttpRequest/);
  assert.match(read("_pages/h2h.md"), /football-win-history\.js/);
  assert.match(read("_layouts/rivalry.liquid"), /football-win-history\.js/);
  assert.doesNotMatch(read("_layouts/rivalry.liquid"), /<h2>Data and method<\/h2>/);
});

test("a missing chart library or the theme's legacy Chart constructor shows a readable fallback", () => {
  const script = fs.readFileSync(path.join(__dirname, "../assets/js/rivalry-chart.js"), "utf8");
  for (const Chart of [undefined, function LegacyChart() {}]) {
    const elements = {
      "rivalry-wins": {},
      "rivalry-chart-display": { hidden: true },
      "rivalry-chart-status": { textContent: "Loading" },
    };
    const warnings = [];
    vm.runInNewContext(script, {
      window: { Chart, luxon: {}, FootballWinHistory: H },
      document: { getElementById: (id) => elements[id] },
      console: { warn: (...args) => warnings.push(args) },
    });
    assert.equal(elements["rivalry-chart-display"].hidden, true);
    assert.match(elements["rivalry-chart-status"].textContent, /chart could not load/);
    assert.equal(warnings.length, 1);
  }
});
