const test = require("node:test");
const assert = require("node:assert/strict");
const Papa = require("papaparse");
const { snapshot } = require("./generate_rivalry_snapshots.js");
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
  const result = snapshot(Papa.unparse(rows.reverse()), "2026-01-04");
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

test("saved editorial snapshots contain only the selected rivalries and internally consistent totals", () => {
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
