// Run with: node --test scripts/football_results.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const D = require("../assets/js/football-results-data.js");

function match(Date, Season, HomeTeam, AwayTeam, hGoal, aGoal, Tier = "1") {
  return { Date, Season, HomeTeam, AwayTeam, hGoal, aGoal, Tier, Division: `Division ${Tier}` };
}
const normalise = (rows) => D.normaliseMatches(rows, Date.UTC(2026, 8, 5));

test("normalisation excludes unfinished and invalid matches without inventing 0-0 draws", () => {
  const good = match("2001-01-01", "2000/2001", "A", "B", 0, 0);
  const rows = normalise([good, { ...good, hGoal: "" }, { ...good, aGoal: "NaN" }, { ...good, Date: "2001-02-30" }, { ...good, Date: "2099-01-01" }]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].hGoal, 0);
});

test("period selection validates seasons and dates and preserves inclusive open ranges", () => {
  const seasons = ["2023/2024", "1888/1889"];
  assert.throws(() => D.resolvePeriod({ mode: "season", season: "2024" }, seasons), /full season/);
  assert.throws(() => D.resolvePeriod({ mode: "dates", start: "2024-02-01", end: "2024-01-01" }, seasons), /start date/);
  assert.deepEqual(D.resolvePeriod({ mode: "dates", end: "2024-02-01" }, seasons, true), { mode: "dates", start: "2023-07-01", end: "2024-02-01" });
  assert.equal(D.resolvePeriod({ mode: "dates", end: "1889-01-01" }, seasons, true).start, "1888-09-08");
  assert.equal(D.resolvePeriod({ mode: "dates", end: "2024-02-01" }, seasons).start, "1888-09-08");
  assert.equal(D.resolvePeriod({ mode: "dates", start: "2024-02-01" }, seasons, true, "2024-02-02").end, "2024-02-02");
  assert.equal(D.inPeriod({ Date: "2024-02-01" }, { start: "2024-02-01", end: "2024-02-01" }), true);
});

test("wins are worth two points through the end of 1980/81, and three in 1981/82", () => {
  const rows = normalise([match("1981-05-01", "1980/1981", "A", "B", 2, 0), match("1981-09-01", "1981/1982", "A", "B", 1, 0)]);
  assert.equal(D.leagueTable(rows, [], { season: "1980/1981" }).rows[0].Points, 2);
  assert.equal(D.leagueTable(rows, [], { season: "1981/1982" }).rows[0].Points, 3);
  assert.equal(D.leagueTable(rows, [], { start: "1981-01-01", end: "1981-12-31" }).rows[0].Points, 5);
});

test("season and date-range deductions are applied inclusively and may add points", () => {
  const rows = normalise([match("2024-01-01", "2023/2024", "A", "B", 1, 0)]);
  const deductions = [
    { Team: "A", Season: "2023/2024", Date: "2024-01-02", Pts_deducted: "4" },
    { Team: "B", Season: "2023/2024", Date: "2024-01-01", Pts_deducted: "-2" },
  ];
  assert.equal(D.leagueTable(rows, deductions, { season: "2023/2024" }).rows.find((r) => r.Team === "A").Points, -1);
  const day = D.leagueTable(rows, deductions, { start: "2024-01-01", end: "2024-01-01" });
  assert.equal(day.rows[0].Points, 3);
  assert.equal(day.rows[1].Points, 2);
  assert.equal(day.rows[1].Adjustment, 2);
});

test("historical goal average and modern goal difference determine tied standings", () => {
  const make = (season, date) => normalise([match(date, season, "A", "C", 8, 4), match(date, season, "B", "D", 2, 0)]);
  const old = D.leagueTable(make("1975/1976", "1976-01-01"), [], { season: "1975/1976" });
  assert.equal(old.goalAverage, true);
  assert.equal(old.rows[0].Team, "B");
  const modern = D.leagueTable(make("1976/1977", "1977-01-01"), [], { season: "1976/1977" });
  assert.equal(modern.goalAverage, false);
  assert.equal(modern.rows[0].Team, "A");
});

test("2019/20 lower-division season standings use points per game, not raw points", () => {
  const rows = normalise([
    match("2020-01-01", "2019/2020", "A", "C", 1, 0, "3"),
    match("2020-01-02", "2019/2020", "B", "D", 1, 0, "3"),
    match("2020-01-03", "2019/2020", "B", "D", 0, 0, "3"),
  ]);
  const result = D.leagueTable(rows, [], { season: "2019/2020", tier: "3" });
  assert.equal(result.ppg, true);
  assert.equal(result.rows[0].Team, "A");
  assert.equal(result.rows[1].Points, 4);
  const range = D.leagueTable(rows, [], { start: "2020-01-01", end: "2020-01-03", tier: "3" });
  assert.equal(range.ppg, false);
  assert.equal(range.rows[0].Team, "B");
});

test("withdrawn clubs and the Leeds City/Port Vale inherited record are preserved", () => {
  for (const [season, date, tier, club] of [
    ["1931/1932", "1931-09-01", "3", "Wigan Borough"],
    ["1961/1962", "1961-09-01", "4", "Accrington Stanley"],
  ]) {
    const result = D.leagueTable(normalise([match(date, season, club, "A", 1, 0, tier), match(date, season, "A", "B", 1, 0, tier)]), [], {
      season,
      tier,
    });
    assert.equal(
      result.rows.some((r) => r.Team === club),
      false
    );
    assert.equal(result.rows[0].Played, 1);
  }
  const rows = normalise([
    match("1919-09-01", "1919/1920", "Leeds City", "A", 1, 0, "2"),
    match("1920-01-01", "1919/1920", "Port Vale", "A", 2, 0, "2"),
  ]);
  const merged = D.leagueTable(rows, [], { season: "1919/1920", tier: "2" }).rows[0];
  assert.equal(merged.Team, "Leeds City & Port Vale");
  assert.equal(merged.Played, 2);
  assert.equal(merged.Points, 4);
});

test("head-to-head accounts for home/away orientation, tied records, chronology and era filters", () => {
  const rows = normalise([
    match("1993-01-01", "1992/1993", "B", "A", 0, 3),
    match("1990-01-01", "1989/1990", "A", "B", 3, 0),
    match("1994-01-01", "1993/1994", "A", "B", 1, 1),
    match("1995-01-01", "1994/1995", "A", "C", 8, 0),
  ]);
  const stats = D.headToHead(rows, "A", "B");
  assert.deepEqual(stats.wins, [2, 0]);
  assert.equal(stats.draws, 1);
  assert.deepEqual(stats.goals, [7, 1]);
  assert.equal(stats.biggest[0].matches.length, 2);
  assert.equal(stats.biggest[1].matches.length, 0);
  assert.deepEqual(
    stats.history[0].map((p) => p.y),
    [1, 2, 2]
  );
  assert.equal(D.headToHead(rows, "A", "B", {}, true).meetings.length, 2);
  assert.equal(D.headToHead(rows, "A", "B", { start: "1993-01-01", end: "1993-01-01" }).meetings.length, 1);
  assert.equal(D.headToHead(rows, "A", "B", { season: "2000/2001" }).meetings.length, 0);
});
