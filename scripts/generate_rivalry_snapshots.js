// CSV-only rivalry records, generated before Jekyll builds the pages.
// Live refresh: node scripts/generate_rivalry_snapshots.js --refresh
// Offline JSON preview: node scripts/generate_rivalry_snapshots.js results.csv YYYY-MM-DD
// The live refresh has exactly one permitted source; it never scrapes other sites.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { isDeepStrictEqual } = require("node:util");
const Papa = require("papaparse");
const D = require("../assets/js/football-results-data.js");
const { parseDate } = require("../assets/js/team-rankings-data.js");
const CSV_URL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/main/EnglandLeagueResults.csv";
const OUTPUT_PATH = path.join(__dirname, "../_data/football_rivalries.json");
const PAIRS = [
  { slug: "manchester-united-vs-liverpool", teams: ["Manchester United", "Liverpool"] },
  { slug: "arsenal-vs-tottenham", teams: ["Arsenal", "Tottenham Hotspur"] },
];
function snapshot(csv, asOf) {
  const timestamp = parseDate(asOf);
  if (!Number.isFinite(timestamp)) throw new Error("Use an explicit snapshot date in YYYY-MM-DD format.");
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: "greedy" });
  const required = ["Date", "Season", "HomeTeam", "AwayTeam", "hGoal", "aGoal", "Division", "Tier"];
  if (parsed.errors.length || !required.every((column) => parsed.meta.fields?.includes(column)))
    throw new Error("Incomplete or invalid results CSV.");
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
    source: CSV_URL,
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
            // Embed only this pair's matches and CSV-derived cumulative totals.
            // The browser never needs to download the full database to plot them.
            win_history: stats.meetings.map((match, i) => [
              match.Date,
              teams.indexOf(match.HomeTeam),
              match.hGoal,
              match.aGoal,
              stats.history[0][i].y,
              stats.history[1][i].y,
            ]),
          },
        ];
      })
    ),
  };
}

async function refresh({ fetchImpl = globalThis.fetch, asOf = new Date().toISOString().slice(0, 10), outputPath = OUTPUT_PATH } = {}) {
  // Do not follow redirects to a different data provider or continue with a failed
  // download. A failed refresh must stop deployment, preserving the live site.
  const response = await fetchImpl(CSV_URL, { redirect: "error", signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`Results CSV download failed (HTTP ${response.status}).`);
  const csv = await response.text();
  const next = snapshot(csv, asOf);
  const previousText = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : null;
  const previous = previousText ? JSON.parse(previousText) : null;
  if (previous) {
    if (next.database_through < previous.database_through)
      throw new Error("Results CSV coverage has moved backwards; refusing to replace the saved data.");
    for (const [slug, record] of Object.entries(next.rivalries)) {
      // Allow ordinary historical corrections, but reject a suspiciously large
      // loss of match history (e.g. a truncated download with a valid CSV header).
      if (record.played < (previous.rivalries?.[slug]?.played || 0) * 0.95)
        throw new Error(`Results CSV is missing a substantial part of ${slug}'s match history.`);
    }
  }
  const serialized = JSON.stringify(next, null, 2) + "\n";
  if (isDeepStrictEqual(next, previous)) return { changed: false, data: next };

  // Write on the same filesystem and rename only after validation and a complete
  // write; an interrupted refresh cannot leave half a JSON file for Jekyll.
  const temporary = fs.mkdtempSync(path.join(path.dirname(outputPath), ".rivalry-refresh-"));
  const temporaryFile = path.join(temporary, "football_rivalries.json");
  try {
    fs.writeFileSync(temporaryFile, serialized, "utf8");
    fs.renameSync(temporaryFile, outputPath);
  } finally {
    if (fs.existsSync(temporaryFile)) fs.unlinkSync(temporaryFile);
    fs.rmdirSync(temporary);
  }
  return { changed: true, data: next };
}

async function main() {
  const [file, asOf, ...extra] = process.argv.slice(2);
  if (file === "--refresh" && !asOf) {
    const { changed, data } = await refresh();
    console.log(
      `${changed ? "Refreshed" : "Verified"} rivalry records from the results CSV; results through ${data.database_through}, checked ${data.as_of}.`
    );
  } else if (file && asOf && !extra.length && !file.startsWith("--")) {
    process.stdout.write(JSON.stringify(snapshot(fs.readFileSync(file, "utf8"), asOf), null, 2) + "\n");
  } else {
    throw new Error("Usage: node scripts/generate_rivalry_snapshots.js --refresh OR results.csv YYYY-MM-DD");
  }
}
if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
module.exports = { snapshot, refresh, CSV_URL };
