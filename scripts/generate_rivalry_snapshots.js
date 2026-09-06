// Curated league-only snapshots. No network access and no arbitrary pair generation.
// node scripts/generate_rivalry_snapshots.js /path/to/EnglandLeagueResults.csv 2026-09-06
// Review stdout, then save it as _data/football_rivalries.json.
const fs = require("node:fs");
const crypto = require("node:crypto");
const Papa = require("papaparse");
const D = require("../assets/js/football-results-data.js");
const { parseDate } = require("../assets/js/team-rankings-data.js");
const PAIRS = [
  { slug: "manchester-united-vs-liverpool", teams: ["Manchester United", "Liverpool"] },
  { slug: "arsenal-vs-tottenham", teams: ["Arsenal", "Tottenham Hotspur"] },
];
function snapshot(csv, asOf) {
  const timestamp = parseDate(asOf);
  if (!Number.isFinite(timestamp)) throw new Error("Use an explicit snapshot date in YYYY-MM-DD format.");
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: "greedy" });
  const required = ["Date", "Season", "HomeTeam", "AwayTeam", "hGoal", "aGoal", "Division", "Tier"];
  if (parsed.errors.length || !required.every((column) => parsed.meta.fields.includes(column))) throw new Error("Incomplete or invalid results CSV.");
  const matches = D.normaliseMatches(parsed.data, timestamp + 86400000 - 1);
  if (!matches.length) throw new Error("No completed matches in the selected period.");
  const compact = (match) => ({
    date: match.Date,
    season: match.Season,
    home: match.HomeTeam,
    away: match.AwayTeam,
    home_goals: match.hGoal,
    away_goals: match.aGoal,
    division: match.Division,
    tier: match.Tier,
  });
  return {
    as_of: asOf,
    database_through: matches.at(-1).Date,
    source: "https://raw.githubusercontent.com/seanelvidge/England-football-results/main/EnglandLeagueResults.csv",
    source_sha256: crypto.createHash("sha256").update(csv).digest("hex"),
    rivalries: Object.fromEntries(
      PAIRS.map(({ slug, teams }) => {
        const stats = D.headToHead(matches, ...teams);
        if (!stats.meetings.length) throw new Error("No meetings found for " + slug);
        const venue = teams.map((team) => {
          const subset = stats.meetings.filter((m) => m.HomeTeam === team);
          const s = D.headToHead(subset, ...teams);
          return { home: team, played: subset.length, wins: s.wins, draws: s.draws };
        });
        const premier = D.headToHead(
          stats.meetings.filter((m) => m.Date >= "1992-08-01" && m.Tier === "1"),
          ...teams
        );
        return [
          slug,
          {
            teams,
            played: stats.meetings.length,
            wins: stats.wins,
            draws: stats.draws,
            goals: stats.goals,
            venue,
            first: compact(stats.meetings[0]),
            latest: compact(stats.meetings.at(-1)),
            biggest: stats.biggest.map((record) => ({ margin: record.margin, matches: record.matches.map(compact) })),
            premier: { played: premier.meetings.length, wins: premier.wins, draws: premier.draws },
            recent: stats.meetings.slice(-10).reverse().map(compact),
          },
        ];
      })
    ),
  };
}
if (require.main === module) {
  try {
    const [file, asOf] = process.argv.slice(2);
    if (!file || !asOf) throw new Error("Usage: node scripts/generate_rivalry_snapshots.js results.csv YYYY-MM-DD");
    process.stdout.write(JSON.stringify(snapshot(fs.readFileSync(file, "utf8"), asOf), null, 2) + "\n");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = { snapshot };
