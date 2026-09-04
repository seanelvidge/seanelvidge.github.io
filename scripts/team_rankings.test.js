// Run with: node --test scripts/team_rankings.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const { parseDate, addRows, summarise, chooseStyle } = require("../assets/js/team-rankings-data.js");

test("historical dates are parsed at UTC midnight, invalid dates are rejected", () => {
  assert.equal(parseDate("1888-09-08"), Date.UTC(1888, 8, 8));
  for (const value of ["", "not a date", "2025-02-29", "2024-13-01", "08/09/1888"]) {
    assert.ok(Number.isNaN(parseDate(value)), value);
  }
  assert.equal(parseDate("2024-02-29"), Date.UTC(2024, 1, 29));
});

test("home and away post-match ratings are combined chronologically, including across chunks", () => {
  const histories = new Map();
  addRows(histories, [{ Date: "2000-01-03", HomeTeam: "B", AwayTeam: "A", HomeRank_after: "900", AwayRank_after: "1200" }]);
  addRows(histories, [
    { Date: "2000-01-01", HomeTeam: "A", AwayTeam: "B", HomeRank_before: "9999", HomeRank_after: "1000", AwayRank_after: "950" },
    { Date: "2000-01-04", HomeTeam: "A", AwayTeam: "B", HomeRank_after: "1200", AwayRank_after: "900" },
  ]);
  const { records, start, end } = summarise(histories);
  assert.deepEqual(
    histories.get("A").map((point) => point.y),
    [1000, 1200, 1200]
  );
  assert.equal(records.get("A").min.y, 1000);
  assert.equal(records.get("A").max.x, parseDate("2000-01-03"));
  assert.equal(records.get("A").maxCount, 2);
  assert.equal(records.get("B").minCount, 2);
  assert.equal(records.get("A").latest.x, parseDate("2000-01-04"));
  assert.equal(start, parseDate("2000-01-01"));
  assert.equal(end, parseDate("2000-01-04"));
});

test("missing ratings, invalid dates and future fixtures do not invent points or teams", () => {
  const histories = new Map();
  const row = { Date: "2000-01-01", HomeTeam: "A", AwayTeam: "B", HomeRank_after: "", AwayRank_after: "1000" };
  addRows(histories, [row, { ...row, Date: "bad" }, { ...row, Date: "2000-01-03" }, { ...row, AwayRank_after: "1000oops" }], parseDate("2000-01-02"));
  assert.deepEqual([...histories.keys()], ["B"]);
  assert.equal(histories.get("B").length, 1);
  const single = summarise(histories).records.get("B");
  assert.deepEqual(single.min, single.max);
  assert.equal(single.minCount, 1);
});

test("primary club colours are preferred, with secondary colours used for similar shades", () => {
  const arsenal = chooseStyle({ PriColour: "#ef0107", SecColour: "#9C824A" });
  assert.equal(arsenal.colour, "#EF0107");
  const liverpool = chooseStyle({ PriColour: "#C8102E", SecColour: "#F6EB61" }, [arsenal]);
  assert.equal(liverpool.colour, "#F6EB61");
  assert.deepEqual(liverpool.dash, []);
  const blue = chooseStyle({ PriColour: "#00F", SecColour: "#FFF" }, [arsenal]);
  assert.equal(blue.colour, "#0000FF");
});

test("secondary clashes receive a distinct line pattern; missing colours use a stable fallback", () => {
  const selected = [{ colour: "#FF0000" }, { colour: "#0000FF" }];
  const style = chooseStyle({ PriColour: "#FF0000", SecColour: "#0000FF" }, selected);
  assert.equal(style.colour, "#0000FF");
  assert.ok(style.dash.length > 0);
  assert.match(chooseStyle({ PriColour: "invalid" }).colour, /^#[0-9A-F]{6}$/);
  assert.deepEqual(chooseStyle(), chooseStyle());
});
