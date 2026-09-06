const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const Papa = require("papaparse");
const { snapshot, refresh, CSV_URL } = require("./generate_rivalry_snapshots.js");
const saved = require("../_data/football_rivalries.json");

function match(Date, HomeTeam, AwayTeam, hGoal, aGoal, Tier = "1") {
  return { Date, Season: "2025/2026", HomeTeam, AwayTeam, hGoal, aGoal, Division: "Test division", Tier };
}
const rows = [
  match("2026-01-01", "Liverpool", "Manchester United", 2, 0),
  match("2026-01-02", "Manchester United", "Liverpool", 1, 1),
  match("2026-01-03", "Manchester United", "Liverpool", 0, 2),
  match("2026-01-04", "Manchester United", "Liverpool", 1, 0, "2"),
  match("2026-01-02", "Arsenal", "Tottenham Hotspur", 3, 0),
  match("2026-01-03", "Tottenham Hotspur", "Arsenal", 2, 1),
  match("2026-01-04", "Arsenal", "Tottenham Hotspur", "", ""),
  match("2026-01-05", "Manchester United", "Liverpool", 9, 0),
];

test("snapshots share the H2H calculations, preserve tied records and exclude unfinished/future matches", () => {
  const result = snapshot(Papa.unparse([...rows].reverse()), "2026-01-04");
  const record = result.rivalries["manchester-united-vs-liverpool"];
  assert.equal(record.played, 4);
  assert.deepEqual(record.wins, [1, 2]);
  assert.equal(record.draws, 1);
  assert.equal(record.biggest[1].margin, 2);
  assert.equal(record.biggest[1].matches.length, 2);
  assert.equal(record.premier.played, 3);
  assert.equal(record.first.date, "2026-01-01");
  assert.equal(record.recent[0].date, "2026-01-04");
  assert.equal(result.database_through, "2026-01-04");
  assert.equal(result.rivalries["arsenal-vs-tottenham"].played, 2);
  assert.match(result.source_sha256, /^[a-f0-9]{64}$/);
});

test("snapshot generation requires valid input and an explicit real date", () => {
  assert.throws(() => snapshot(Papa.unparse(rows), "2026-02-30"), /explicit snapshot date/);
  assert.throws(() => snapshot("Date,HomeTeam\n2026-01-01,Arsenal", "2026-01-04"), /invalid results CSV/);
});

test("saved records contain only the selected rivalries and internally consistent totals", () => {
  assert.deepEqual(Object.keys(saved.rivalries).sort(), ["arsenal-vs-tottenham", "manchester-united-vs-liverpool"]);
  for (const record of Object.values(saved.rivalries)) {
    assert.equal(record.wins[0] + record.wins[1] + record.draws, record.played);
    assert.equal(
      record.venue.reduce((sum, venue) => sum + venue.played, 0),
      record.played
    );
    assert.ok(record.latest.date <= saved.as_of);
    assert.ok(record.premier.played <= record.played);
    assert.ok(record.recent.length <= 10);
    record.biggest.forEach((biggest, team) =>
      biggest.matches.forEach((m) => {
        const margin = m.home === record.teams[team] ? m.home_goals - m.away_goals : m.away_goals - m.home_goals;
        assert.equal(margin, biggest.margin);
      })
    );
  }
});

function outputFixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "rivalry-records-test-"));
  const outputPath = path.join(directory, "football_rivalries.json");
  const previous = JSON.stringify(snapshot(Papa.unparse(rows), "2026-01-04"), null, 2) + "\n";
  fs.writeFileSync(outputPath, previous);
  t.after(() => {
    fs.unlinkSync(outputPath);
    fs.rmdirSync(directory);
  });
  return { directory, outputPath, previous };
}
const responseFor = (csv) => ({ ok: true, text: async () => csv });

test("automatic refresh fetches only the first-party results CSV and updates every derived record", async (t) => {
  const { directory, outputPath } = outputFixture(t);
  const calls = [];
  const updated = [...rows, match("2026-01-05", "Tottenham Hotspur", "Arsenal", 4, 0)];
  const result = await refresh({
    asOf: "2026-01-05",
    outputPath,
    fetchImpl: async (url, options) => {
      calls.push(url);
      assert.equal(options.redirect, "error");
      assert.ok(options.signal instanceof AbortSignal);
      return responseFor(Papa.unparse(updated));
    },
  });
  assert.deepEqual(calls, [CSV_URL]);
  assert.equal(result.changed, true);
  const next = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  assert.equal(next.as_of, "2026-01-05");
  assert.equal(next.database_through, "2026-01-05");
  assert.equal(next.rivalries["manchester-united-vs-liverpool"].played, 5);
  assert.equal(next.rivalries["manchester-united-vs-liverpool"].biggest[0].margin, 9);
  const derby = next.rivalries["arsenal-vs-tottenham"];
  assert.equal(derby.played, 3);
  assert.deepEqual(derby.wins, [1, 2]);
  assert.equal(derby.biggest[1].margin, 4);
  assert.equal(derby.latest.date, "2026-01-05");
  assert.deepEqual(fs.readdirSync(directory), ["football_rivalries.json"]);
});

test("a corrected score refreshes totals even when the newest match date has not changed", async (t) => {
  const { outputPath, previous } = outputFixture(t);
  const corrected = rows.map((row) => (row.HomeTeam === "Tottenham Hotspur" ? { ...row, hGoal: 0, aGoal: 2 } : row));
  const { data } = await refresh({ outputPath, asOf: "2026-01-04", fetchImpl: async () => responseFor(Papa.unparse(corrected)) });
  assert.deepEqual(data.rivalries["arsenal-vs-tottenham"].wins, [2, 0]);
  assert.equal(data.database_through, JSON.parse(previous).database_through);
  assert.notEqual(data.source_sha256, JSON.parse(previous).source_sha256);
});

test("an unchanged CSV and as-of date do not rewrite the data file", async (t) => {
  const { outputPath, previous: original } = outputFixture(t);
  // Formatting changes (e.g. Prettier's compact arrays) are not data updates.
  const previous = JSON.stringify(JSON.parse(original)) + "\n";
  fs.writeFileSync(outputPath, previous);
  const before = fs.statSync(outputPath).mtimeMs;
  const result = await refresh({ outputPath, asOf: "2026-01-04", fetchImpl: async () => responseFor(Papa.unparse(rows)) });
  assert.equal(result.changed, false);
  assert.equal(fs.readFileSync(outputPath, "utf8"), previous);
  assert.equal(fs.statSync(outputPath).mtimeMs, before);
});

test("network errors, invalid CSVs and missing clubs leave the last valid file untouched", async (t) => {
  const { directory, outputPath, previous } = outputFixture(t);
  const failures = [
    async () => {
      throw new Error("Network unavailable");
    },
    async () => ({ ok: false, status: 503 }),
    async () => responseFor("<html>Upstream error</html>"),
    async () => responseFor(""),
    async () => responseFor(Papa.unparse(rows.filter((row) => row.HomeTeam !== "Arsenal" && row.AwayTeam !== "Arsenal"))),
  ];
  for (const fetchImpl of failures) {
    await assert.rejects(refresh({ outputPath, asOf: "2026-01-04", fetchImpl }));
    assert.equal(fs.readFileSync(outputPath, "utf8"), previous);
    assert.deepEqual(fs.readdirSync(directory), ["football_rivalries.json"]);
  }
});

test("well-formed but stale or substantially truncated results cannot replace the previous records", async (t) => {
  const { outputPath, previous } = outputFixture(t);
  const stale = rows.filter((row) => row.Date < "2026-01-04");
  await assert.rejects(
    refresh({ outputPath, asOf: "2026-01-04", fetchImpl: async () => responseFor(Papa.unparse(stale)) }),
    /coverage has moved backwards/
  );
  const truncated = rows.filter((row) => row.Date !== "2026-01-01");
  await assert.rejects(
    refresh({ outputPath, asOf: "2026-01-04", fetchImpl: async () => responseFor(Papa.unparse(truncated)) }),
    /missing a substantial part/
  );
  assert.equal(fs.readFileSync(outputPath, "utf8"), previous);
});

test("the daily deployment pipeline refreshes and validates the rivalry pages before publishing", () => {
  const deploy = fs.readFileSync(path.join(__dirname, "../.github/workflows/deploy.yml"), "utf8");
  const daily = fs.readFileSync(path.join(__dirname, "../.github/workflows/generate_table_probs.yml"), "utf8");
  assert.match(daily, /cron: "0 1 \* \* \*"/);
  assert.match(deploy, /workflows: \["Generate table probabilities"\]/);
  const refreshStep = deploy.indexOf("node scripts/generate_rivalry_snapshots.js --refresh");
  const build = deploy.indexOf("bundle exec jekyll build");
  const validate = deploy.indexOf("bundle exec ruby scripts/check_rivalry_pages.rb");
  const publish = deploy.indexOf("uses: JamesIves/github-pages-deploy-action");
  assert.ok(refreshStep > 0 && refreshStep < build && build < validate && validate < publish);
  assert.doesNotMatch(deploy, /continue-on-error:/);
});
