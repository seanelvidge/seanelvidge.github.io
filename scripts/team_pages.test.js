const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const Papa = require("papaparse");
const YAML = require("yaml");
const { snapshot, writeSnapshot, periodsFor, assignSlugs, clubStyle, inkOn } = require("./generate_team_pages.js");

const roster = [
  { Team: "Alpha", ShortName: "Alpha", ActivePeriods: "1900-1902;2024-present" },
  { Team: "Beta", ShortName: "Beta", ActivePeriods: "2025-present" },
  { Team: "Old Club", ShortName: "Old Club", ActivePeriods: "2024" },
];
const match = (Date, HomeTeam, AwayTeam, hGoal, aGoal, HomeRank_after, AwayRank_after, Season = "2025/2026", Tier = "1") => ({
  Date,
  Season,
  HomeTeam,
  AwayTeam,
  hGoal,
  aGoal,
  HomeRank_after,
  AwayRank_after,
  Tier,
  Division: `Division ${Tier}`,
});
const rows = [
  match("2024-08-01", "Alpha", "Old Club", 4, 0, 1000, 900, "2024/2025"),
  match("2025-08-01", "Alpha", "Beta", 2, 0, 1010, 990),
  match("2025-08-08", "Beta", "Alpha", 1, 1, 995, 1010),
  match("2025-08-15", "Beta", "Alpha", 0, 4, 970, 1030),
  match("2025-08-22", "Alpha", "Beta", 0, 2, 1000, 1000),
  match("2025-08-29", "Beta", "Alpha", 2, 0, 1020, 980),
  match("2025-09-05", "Alpha", "Beta", 1, 0, 1005, 995),
  match("2025-09-12", "Alpha", "Beta", 9, 0, 2000, 100),
];
const adjustments = [
  { Season: "2025/2026", Date: "2025-09-01", Team: "Alpha", Pts_deducted: "3" },
  { Season: "2025/2026", Date: "2025-09-12", Team: "Beta", Pts_deducted: "6" },
  { Season: "2024/2025", Date: "2024-09-01", Team: "Alpha", Pts_deducted: "4" },
];
function inputs(matches = rows, clubs = roster, deductions = adjustments) {
  return {
    periods: Papa.unparse(clubs),
    logos: Papa.unparse(clubs.map(({ Team }) => ({ Team, LogoURL: "https://example.com/crest.svg", PriColour: "#345", SecColour: "bad" }))),
    results: Papa.unparse(matches),
    deductions: Papa.unparse({ fields: ["Season", "Date", "Team", "Pts_deducted"], data: deductions }),
  };
}

test("records use the club's perspective, all tied goal margins, post-match ratings and dated history", () => {
  const data = snapshot(inputs([...rows].reverse()), "2025-09-05");
  const alpha = data.clubs.find((c) => c.name === "Alpha");
  assert.equal(data.matches, 7);
  assert.equal(data.database_through, "2025-09-05");
  assert.equal(alpha.match_count, 7);
  assert.deepEqual(
    alpha.recent.map((m) => m.result),
    ["W", "L", "L", "W", "D"]
  );
  assert.equal(alpha.recent[1].venue, "A");
  assert.deepEqual([alpha.recent[1].goals_for, alpha.recent[1].goals_against], [0, 2]);
  assert.deepEqual(alpha.rating, { value: 1005, date: "2025-09-05", rank: 1, joint: false, out_of: 2 });
  assert.deepEqual(alpha.highest_rating, { value: 1030, date: "2025-08-15", occurrences: 1 });
  assert.deepEqual(alpha.lowest_rating, { value: 980, date: "2025-08-29", occurrences: 1 });
  assert.equal(alpha.biggest_win.margin, 4);
  assert.deepEqual(
    alpha.biggest_win.matches.map((m) => [m.date, m.opponent]),
    [
      ["2024-08-01", "Old Club"],
      ["2025-08-15", "Beta"],
    ]
  );
  assert.equal(alpha.biggest_defeat.margin, 2);
  assert.equal(alpha.biggest_defeat.matches.length, 2);
  assert.equal(alpha.biggest_win.matches[0].opponent_url, "/teams/Old_Club/");
  assert.equal(data.clubs.find((c) => c.name === "Old Club").status, "historical");
  assert.equal(data.clubs.find((c) => c.name === "Old Club").rating.rank, undefined);
  assert.equal(alpha.primary, "#334455");
});

test("current standings use the latest season and only adjustments effective by the snapshot date", () => {
  const data = snapshot(inputs(), "2025-09-05");
  const [alpha, beta] = data.leagues[0].rows;
  assert.equal(data.season, "2025/2026");
  assert.deepEqual([alpha.team, alpha.played, alpha.won, alpha.drawn, alpha.lost, alpha.points, alpha.adjustment], ["Alpha", 6, 3, 1, 2, 7, -3]);
  assert.deepEqual([beta.team, beta.played, beta.won, beta.drawn, beta.lost, beta.points, beta.adjustment], ["Beta", 6, 2, 1, 3, 7, 0]);
  assert.deepEqual([alpha.goals_for, alpha.goals_against, alpha.goal_difference, alpha.position], [8, 5, 3, 1]);
  assert.equal(data.clubs.find((c) => c.name === "Alpha").standing.points, alpha.points);
  const credit = [{ Season: "2025/2026", Date: "2025-09-01", Team: "Beta", Pts_deducted: "-2" }];
  assert.equal(snapshot(inputs(rows, roster, credit), "2025-09-05").leagues[0].rows.find((c) => c.team === "Beta").points, 9);
});

test("equal table records and ratings receive joint ranks; empty win/loss records stay empty", () => {
  const data = snapshot(inputs([match("2025-08-01", "Alpha", "Beta", 0, 0, 1000, 1000)], roster, []), "2025-08-02");
  assert.deepEqual(
    data.leagues[0].rows.map((c) => [c.position, c.joint]),
    [
      [1, true],
      [1, true],
    ]
  );
  for (const club of data.clubs.filter((c) => c.current)) {
    assert.equal(club.rating.rank, 1);
    assert.equal(club.rating.joint, true);
    assert.equal(club.biggest_win, null);
    assert.equal(club.biggest_defeat, null);
  }
});

test("rating extremes retain the first matching date and count subsequent ties", () => {
  const matches = rows.slice(1, 3).map((row) => ({ ...row, HomeRank_after: 1000, AwayRank_after: 1000 }));
  const club = snapshot(inputs(matches, roster, []), "2025-09-05").clubs[0];
  assert.deepEqual(club.highest_rating, { value: 1000, date: "2025-08-01", occurrences: 2 });
  assert.deepEqual(club.lowest_rating, club.highest_rating);
});

test("membership counts inclusive season years, joins adjacent spells and handles single or future years", () => {
  const m = periodsFor("1900-1902;1903-1904;2024-present", 2025);
  assert.equal(m.total_years, 7);
  assert.equal(m.latest_spell_years, 2);
  assert.equal(m.periods.length, 2);
  assert.equal(m.active_in_latest_season, true);
  assert.equal(periodsFor("1893", 2025).total_years, 1);
  assert.equal(periodsFor("1921-1971;2020-2025", 2026).latest_spell_years, 6);
  assert.equal(periodsFor("2027-present", 2026).total_years, 0);
  assert.throws(() => periodsFor("1900-1899", 2025), /Reversed/);
  assert.throws(() => periodsFor("1900-1902;1902-1903", 2025), /Overlapping/);
});

test("new members without results have no invented league position, rating or division", () => {
  const clubs = [...roster, { Team: "New Club", ShortName: "New Club", ActivePeriods: "2025-present" }];
  const club = snapshot(inputs(rows, clubs), "2025-09-05").clubs.find((c) => c.name === "New Club");
  assert.equal(club.status, "awaiting_results");
  assert.equal(club.standing, null);
  assert.equal(club.rating, null);
  assert.equal(club.match_count, 0);
  assert.equal(club.url, "/teams/New_Club/");
});

test("namesakes get distinct stable addresses while ordinary names only replace spaces", () => {
  const clubs = [
    { name: "Wimbledon", short_name: "Wimbledon", current: false, membership: periodsFor("1977-2003", 2026) },
    { name: "AFC Wimbledon", short_name: "Wimbledon", current: true, membership: periodsFor("2011-present", 2026) },
    { name: "Aston Villa", short_name: "Aston Villa", current: true, membership: periodsFor("1888-present", 2026) },
    { name: "Loughborough", short_name: "L'boro", current: false, membership: periodsFor("1895-1899", 2026) },
  ];
  assignSlugs(clubs);
  assert.deepEqual(
    clubs.map((c) => c.url),
    ["/teams/Wimbledon_1977/", "/teams/Wimbledon/", "/teams/Aston_Villa/", "/teams/L'boro/"]
  );
  assert.deepEqual(clubs[0].related_clubs, ["AFC Wimbledon"]);
  const reversed = JSON.parse(JSON.stringify(clubs)).reverse();
  assignSlugs(reversed);
  assert.deepEqual(
    reversed.map((c) => c.url).reverse(),
    clubs.map((c) => c.url)
  );
  assert.throws(() => assignSlugs([{ ...clubs[0], short_name: "../escape" }]), /Unsafe/);
});

test("crest fallbacks and colour contrasts work for light, dark and invalid metadata", () => {
  assert.equal(inkOn("#FFFFFF"), "#000000");
  assert.equal(inkOn("#000000"), "#FFFFFF");
  assert.equal(inkOn("#FFFF00"), "#000000");
  const style = clubStyle({ LogoURL: "javascript:alert(1)", PriColour: "invalid", SecColour: "#fff" });
  assert.equal(style.logo, "/assets/img/blank-crest.png");
  assert.equal(style.primary, "#334155");
  assert.equal(style.secondary, "#FFFFFF");
});

test("disambiguating an old club's full name does not leave a final dot that Jekyll strips from the route", () => {
  const clubs = [
    { name: "Accrington F.C.", short_name: "Accrington", current: false, membership: periodsFor("1888-1892", 2026) },
    { name: "Accrington Stanley", short_name: "Accrington", current: true, membership: periodsFor("2006-present", 2026) },
  ];
  assignSlugs(clubs);
  assert.equal(clubs[0].url, "/teams/Accrington_F.C/");
  assert.equal(clubs[1].url, "/teams/Accrington/");
});

test("malformed or duplicated source records fail instead of silently publishing misleading statistics", () => {
  assert.throws(() => snapshot(inputs(), "2025-02-30"), /real as-of date/);
  assert.throws(() => snapshot(inputs([...rows, rows[0]]), "2025-09-05"), /Duplicate team appearance/);
  assert.throws(() => snapshot(inputs([{ ...rows[1], aGoal: "" }]), "2025-09-05"), /Invalid aGoal/);
  assert.throws(() => snapshot(inputs([{ ...rows[1], HomeRank_after: "NaN" }]), "2025-09-05"), /Invalid HomeRank/);
  assert.throws(() => snapshot(inputs([{ ...rows[1], HomeTeam: "Unknown" }]), "2025-09-05"), /missing from/);
  assert.throws(() => snapshot(inputs(rows, [...roster, roster[0]]), "2025-09-05"), /duplicate club/);
});

test("refresh is deterministic and refuses a backwards or truncated database without replacing the saved snapshot", async (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "team-pages-test-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, "teams.json");
  const data = snapshot(inputs(), "2025-09-05");
  assert.equal(await writeSnapshot(data, file), true);
  const saved = fs.readFileSync(file, "utf8");
  assert.equal(await writeSnapshot(data, file), false);
  await assert.rejects(writeSnapshot({ ...data, database_through: "2025-09-04" }, file), /moved backwards/);
  await assert.rejects(writeSnapshot({ ...data, matches: 1 }, file), /lost substantial history/);
  assert.equal(fs.readFileSync(file, "utf8"), saved);
  assert.deepEqual(fs.readdirSync(directory), ["teams.json"]);
});

test("the complete saved snapshot has a page for each club, consistent standings and resolvable opponent links", () => {
  const data = require("../_data/football_teams.json");
  const names = new Set(data.clubs.map((c) => c.name));
  const urls = new Set(data.clubs.map((c) => c.url));
  assert.equal(names.size, data.clubs.length);
  assert.equal(urls.size, data.clubs.length);
  assert.equal(
    data.clubs.reduce((n, c) => n + c.match_count, 0),
    data.matches * 2
  );
  assert.equal(
    data.leagues.reduce((n, league) => n + league.rows.length, 0),
    data.current_clubs
  );
  for (const club of data.clubs) {
    assert.equal(club.recent.length, Math.min(5, club.match_count));
    assert.ok(!club.rating || (club.lowest_rating.value <= club.rating.value && club.rating.value <= club.highest_rating.value));
    for (const match of [...club.recent, ...(club.biggest_win?.matches || []), ...(club.biggest_defeat?.matches || [])]) {
      assert.ok(names.has(match.opponent) && urls.has(match.opponent_url));
      assert.ok(match.date <= data.database_through);
    }
  }
  for (const league of data.leagues) {
    assert.equal(
      league.rows.reduce((n, c) => n + c.goal_difference, 0),
      0
    );
    for (const row of league.rows) {
      assert.equal(row.played, row.won + row.drawn + row.lost);
      assert.equal(row.points, row.won * 3 + row.drawn + row.adjustment);
    }
  }
});

test("both deployments refresh clubs from one database checkout and verify the output before publishing", () => {
  for (const workflow of ["deploy.yml", "nightly-lsi.yml"]) {
    const config = YAML.parse(fs.readFileSync(path.join(__dirname, "../.github/workflows", workflow), "utf8"));
    const steps = config.jobs.deploy.steps;
    const checkout = steps.findIndex((s) => s.with?.repository === "seanelvidge/England-football-results");
    assert.equal(steps[checkout]?.with.path, ".football-source");
    const refresh = steps.findIndex((s) => s.run?.includes("node scripts/generate_team_pages.js --data-dir .football-source"));
    const build = steps.findIndex((s) => s.run?.includes("bundle exec jekyll build"));
    const verify = steps.findIndex((s) => s.run?.includes("bundle exec ruby scripts/check_team_pages.rb _site"));
    const publish = steps.findIndex((s) => s.uses?.startsWith("JamesIves/github-pages-deploy-action@"));
    assert.ok(checkout >= 0 && checkout < refresh && refresh < build && build < verify && verify < publish, workflow);
    assert.ok(steps[refresh].run.includes("scripts/team_pages.test.js"), workflow);
    assert.ok(
      steps.every((s) => !s["continue-on-error"]),
      workflow
    );
  }
});
