// Build all club records and the current league tables once, before Jekyll.
// node scripts/generate_team_pages.js --data-dir ../England-football-results
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const Papa = require("papaparse");
const prettier = require("prettier");
const { parseDate, normaliseColour } = require("../assets/js/team-rankings-data.js");
const { leagueTable } = require("../assets/js/football-results-data.js");
const { normaliseName } = require("../assets/js/football-team-routes.js");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "_data/football_teams.json");
const ALIASES_FILE = path.join(ROOT, "assets/data/Alt_Names.csv");
const FILES = {
  periods: "EnglishTeamActivePeriods.csv",
  logos: "EnglishTeamLogos.csv",
  results: "EnglandLeagueResults_wRanks.csv",
  deductions: "EnglishTeamPointDeductions.csv",
};
const SOURCE = "https://github.com/seanelvidge/England-football-results";

function parseCSV(text, required, label) {
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: "greedy", transformHeader: (s) => s.trim() });
  if (parsed.errors.length || !required.every((key) => parsed.meta.fields?.includes(key))) throw new Error(`${label}: incomplete or invalid CSV.`);
  return parsed.data;
}

function periodsFor(value, seasonYear) {
  const spans = String(value)
    .split(";")
    .map((part) => {
      const match = part.trim().match(/^(\d{4})(?:-(\d{4}|present))?$/);
      if (!match) throw new Error(`Invalid active period: ${part}`);
      const start = Number(match[1]);
      const open = match[2] === "present";
      const end = open ? seasonYear : Number(match[2] || match[1]);
      if (!open && end < start) throw new Error(`Reversed active period: ${part}`);
      return { start, end: Math.min(end, seasonYear), open };
    })
    .filter((span) => span.start <= seasonYear)
    .sort((a, b) => a.start - b.start);
  const merged = [];
  for (const span of spans) {
    const previous = merged.at(-1);
    if (previous && span.start <= previous.end) throw new Error("Overlapping active periods.");
    if (previous && span.start === previous.end + 1) {
      previous.end = span.end;
      previous.open = span.open;
    } else merged.push({ ...span });
  }
  return {
    total_years: merged.reduce((sum, span) => sum + span.end - span.start + 1, 0),
    latest_spell_years: merged.length ? merged.at(-1).end - merged.at(-1).start + 1 : 0,
    latest_spell_start: merged.at(-1)?.start ?? null,
    latest_spell_end: merged.at(-1)?.end ?? null,
    active_in_latest_season: merged.some((span) => span.start <= seasonYear && span.end >= seasonYear),
    periods: merged,
  };
}

function slugPart(name) {
  const slug = String(name).trim().replace(/\s+/g, "_");
  if (!slug || /[\/\\\x00-\x1f?#%]/.test(slug) || slug === "." || slug === "..") throw new Error(`Unsafe team URL: ${name}`);
  return slug;
}

// Keep clubs with the same nickname distinct. The most recent club gets the
// short address; older clubs use full names, with their first year if needed.
function assignSlugs(clubs) {
  const groups = new Map();
  for (const club of clubs) {
    const short = slugPart(club.short_name);
    if (!groups.has(short)) groups.set(short, []);
    groups.get(short).push(club);
  }
  const used = new Set(groups.keys());
  for (const [short, group] of groups) {
    group.sort(
      (a, b) =>
        Number(b.current) - Number(a.current) ||
        (b.membership.latest_spell_end ?? -1) - (a.membership.latest_spell_end ?? -1) ||
        a.name.localeCompare(b.name)
    );
    group[0].slug = short;
    for (const club of group.slice(1)) {
      // Jekyll removes a final "./" from permalinks (e.g. "Accrington F.C.").
      let slug = slugPart(club.name.replace(/\.+$/, ""));
      if (used.has(slug)) slug += `_${club.membership.periods[0]?.start || "historical"}`;
      if (used.has(slug)) throw new Error(`Team URL collision for ${club.name}`);
      used.add(slug);
      club.slug = slug;
    }
    for (const club of group) club.related_clubs = group.filter((other) => other !== club).map((other) => other.name);
  }
  for (const club of clubs) club.url = `/teams/${club.slug}/`;
}

function buildAliases(clubs, csv = "") {
  const canonical = new Map();
  const lookup = new Map();
  const redirects = new Map();
  const canonicalSlugs = new Set(clubs.map((club) => club.slug));
  for (const club of clubs) {
    const key = normaliseName(club.slug);
    if (!key || (canonical.has(key) && canonical.get(key) !== club.url)) throw new Error(`Ambiguous or unsafe canonical team name: ${club.slug}`);
    canonical.set(key, club.url);
    lookup.set(key, club.url);
  }

  function register(name, target, explicit = false) {
    const key = normaliseName(name);
    if (!key) throw new Error(`Invalid team alias: ${name}`);
    if (canonical.has(key) && canonical.get(key) !== target && !explicit) return;
    if (lookup.has(key) && lookup.get(key) !== target) throw new Error(`Ambiguous team alias: ${name}`);
    lookup.set(key, target);
    // Spaces become underscores, with compact and lowercase versions too.
    // A trailing full stop is removed because Jekyll strips "./" in URLs.
    const spaced = name.normalize("NFKC").trim().replace(/\s+/g, "_").replace(/\.+$/, "");
    const compact = spaced.replace(/[_-]+/g, "");
    for (const slug of new Set([spaced, compact, spaced.toLowerCase(), compact.toLowerCase()])) {
      if (canonicalSlugs.has(slug)) continue;
      if (redirects.has(slug) && redirects.get(slug) !== target) throw new Error(`Conflicting team alias URL: ${slug}`);
      redirects.set(slug, target);
    }
  }

  for (const club of clubs) {
    register(club.slug, club.url);
    register(club.name, club.url);
    register(club.short_name, club.url);
  }
  const baseNames = new Map(lookup);
  const parsed = Papa.parse(csv, { delimiter: ",", skipEmptyLines: "greedy" });
  if (parsed.errors.length) throw new Error("Alt_Names.csv: invalid CSV.");
  for (const row of parsed.data) {
    const names = row.map((name) => name.trim()).filter(Boolean);
    const targets = new Set(names.map((name) => baseNames.get(normaliseName(name))).filter(Boolean));
    if (targets.size !== 1)
      throw new Error(`Alt_Names.csv: ${targets.size ? "conflicting clubs" : "no recognised club"} in row: ${names.join(", ")}`);
    for (const name of names) register(name, [...targets][0], true);
  }
  const sorted = (map) => Object.fromEntries([...map].sort(([a], [b]) => a.localeCompare(b)));
  return { redirects: sorted(redirects), lookup: sorted(lookup) };
}

function inkOn(hex) {
  const channels = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05) ? "#000000" : "#FFFFFF";
}

function clubStyle(row = {}) {
  const primary = normaliseColour(row.PriColour) || "#334155";
  const secondary = normaliseColour(row.SecColour) || "#CBD5E1";
  let logo = "/assets/img/blank-crest.png";
  try {
    const url = new URL(row.LogoURL);
    if (url.protocol === "https:") logo = url.href;
  } catch (_) {
    /* Clubs without a valid logo use the site's existing crest. */
  }
  return { primary, secondary, on_primary: inkOn(primary), on_secondary: inkOn(secondary), logo };
}

function recordMatch(match, name) {
  const home = match.HomeTeam === name;
  const goalsFor = home ? match.hGoal : match.aGoal;
  const goalsAgainst = home ? match.aGoal : match.hGoal;
  return {
    date: match.Date,
    season: match.Season,
    division: match.Division,
    tier: Number(match.Tier),
    opponent: home ? match.AwayTeam : match.HomeTeam,
    venue: home ? "H" : "A",
    goals_for: goalsFor,
    goals_against: goalsAgainst,
    result: goalsFor > goalsAgainst ? "W" : goalsFor < goalsAgainst ? "L" : "D",
  };
}

function updateExtreme(previous, value, date, higher) {
  if (!previous || (higher ? value > previous.value : value < previous.value)) return { value, date, occurrences: 1 };
  if (value === previous.value) previous.occurrences++;
  return previous;
}

function updateBiggest(previous, match, margin) {
  if (!previous || margin > previous.margin) return { margin, matches: [match] };
  if (margin === previous.margin) previous.matches.push(match);
  return previous;
}

function snapshot(texts, asOf, sourceCommit = null) {
  const timestamp = parseDate(asOf);
  if (!Number.isFinite(timestamp)) throw new Error("Use a real as-of date in YYYY-MM-DD format.");
  const periods = parseCSV(texts.periods, ["Team", "ShortName", "ActivePeriods"], FILES.periods);
  const logos = parseCSV(texts.logos, ["Team", "LogoURL", "PriColour", "SecColour"], FILES.logos);
  const raw = parseCSV(
    texts.results,
    ["Date", "Season", "HomeTeam", "AwayTeam", "hGoal", "aGoal", "Division", "Tier", "HomeRank_after", "AwayRank_after"],
    FILES.results
  );
  const deductions = parseCSV(texts.deductions, ["Season", "Date", "Team", "Pts_deducted"], FILES.deductions);
  if (!periods.length || !raw.length) throw new Error("The club list and results must not be empty.");
  const names = new Set();
  for (const row of periods) {
    if (!row.Team?.trim() || row.Team !== row.Team.trim() || !row.ShortName?.trim() || names.has(row.Team))
      throw new Error(`Missing or duplicate club name: ${row.Team}`);
    names.add(row.Team);
  }
  const seen = new Set();
  const matches = [];
  for (const row of raw) {
    const time = parseDate(row.Date);
    if (!Number.isFinite(time)) throw new Error(`Invalid match date: ${row.Date}`);
    if (time > timestamp) continue;
    const years = row.Season?.match(/^(\d{4})\/(\d{4})$/);
    if (!years || Number(years[2]) !== Number(years[1]) + 1 || !/^[1-4]$/.test(row.Tier) || !row.Division?.trim())
      throw new Error(`Invalid season or division on ${row.Date}`);
    if (!names.has(row.HomeTeam) || !names.has(row.AwayTeam) || row.HomeTeam === row.AwayTeam)
      throw new Error(`Match club is missing from ${FILES.periods}: ${row.HomeTeam} / ${row.AwayTeam}`);
    for (const key of ["hGoal", "aGoal", "HomeRank_after", "AwayRank_after"]) {
      if (!/^-?\d+$/.test(String(row[key])) || !Number.isSafeInteger(Number(row[key])) || (/Goal$/.test(key) && Number(row[key]) < 0))
        throw new Error(`Invalid ${key} on ${row.Date}`);
    }
    for (const team of [row.HomeTeam, row.AwayTeam]) {
      const key = JSON.stringify([row.Date, team]);
      if (seen.has(key)) throw new Error(`Duplicate team appearance on ${row.Date}: ${team}`);
      seen.add(key);
    }
    matches.push({ ...row, timestamp: time, hGoal: Number(row.hGoal), aGoal: Number(row.aGoal) });
  }
  matches.sort((a, b) => a.timestamp - b.timestamp);
  if (!matches.length) throw new Error("No completed results by the chosen date.");
  const seasonYear = Math.max(...new Set(matches.map((m) => Number(m.Season.slice(0, 4)))));
  const season = `${seasonYear}/${seasonYear + 1}`;
  const latestMatches = matches.filter((m) => m.Season === season);
  for (const row of deductions) {
    if (!Number.isFinite(parseDate(row.Date)) || !String(row.Pts_deducted).trim() || !Number.isInteger(Number(row.Pts_deducted)))
      throw new Error(`Invalid points adjustment for ${row.Team}`);
  }
  const effectiveDeductions = deductions.filter((row) => row.Date <= asOf);
  const logoMap = new Map(logos.map((row) => [row.Team, row]));
  if (logoMap.size !== logos.length) throw new Error("Duplicate club in logo metadata.");
  const clubs = periods.map((row) => ({
    name: row.Team,
    short_name: row.ShortName.trim(),
    ...clubStyle(logoMap.get(row.Team)),
    membership: periodsFor(row.ActivePeriods, seasonYear),
    match_count: 0,
    recent: [],
    latest: null,
    rating: null,
    highest_rating: null,
    lowest_rating: null,
    biggest_win: null,
    biggest_defeat: null,
    current: false,
    standing: null,
  }));
  const byName = new Map(clubs.map((club) => [club.name, club]));
  for (const match of matches) {
    for (const side of ["Home", "Away"]) {
      const club = byName.get(match[`${side}Team`]);
      const record = recordMatch(match, club.name);
      const rating = Number(match[`${side}Rank_after`]);
      club.match_count++;
      club.latest = record;
      club.recent.push(record);
      if (club.recent.length > 5) club.recent.shift();
      club.rating = { value: rating, date: match.Date };
      club.highest_rating = updateExtreme(club.highest_rating, rating, match.Date, true);
      club.lowest_rating = updateExtreme(club.lowest_rating, rating, match.Date, false);
      const margin = record.goals_for - record.goals_against;
      if (margin > 0) club.biggest_win = updateBiggest(club.biggest_win, record, margin);
      if (margin < 0) club.biggest_defeat = updateBiggest(club.biggest_defeat, record, -margin);
    }
  }
  const leagues = [...new Set(latestMatches.map((m) => m.Tier))].sort().map((tier) => {
    const result = leagueTable(latestMatches, effectiveDeductions, { season, tier });
    const tieKeys = result.rows.map((row) => [result.ppg ? row.PPG : row.Points, result.goalAverage ? row.GR : row.GD, row.GF].join("|"));
    const rows = result.rows.map((row, i) => ({
      team: row.Team,
      position: tieKeys.indexOf(tieKeys[i]) + 1,
      joint: tieKeys.filter((key) => key === tieKeys[i]).length > 1,
      played: row.Played,
      won: row.Won,
      drawn: row.Drawn,
      lost: row.Lost,
      goals_for: row.GF,
      goals_against: row.GA,
      goal_difference: row.GD,
      points: row.Points,
      adjustment: row.Adjustment,
    }));
    for (const row of rows) {
      const club = byName.get(row.team);
      if (!club) throw new Error(`Cannot associate current table row with a club: ${row.team}`);
      club.current = true;
      club.standing = { ...row, tier: Number(tier), division: result.matches.at(-1).Division, season, club_count: rows.length };
    }
    return { tier: Number(tier), division: result.matches.at(-1).Division, season, through: result.matches.at(-1).Date, rows };
  });
  const ranked = clubs.filter((club) => club.current && club.rating).sort((a, b) => b.rating.value - a.rating.value || a.name.localeCompare(b.name));
  for (const club of ranked) {
    club.rating.rank = ranked.findIndex((other) => other.rating.value === club.rating.value) + 1;
    club.rating.joint = ranked.filter((other) => other.rating.value === club.rating.value).length > 1;
    club.rating.out_of = ranked.length;
  }
  assignSlugs(clubs);
  for (const club of clubs) {
    club.status = club.current ? "current" : club.membership.active_in_latest_season ? "awaiting_results" : "historical";
    club.related_clubs = club.related_clubs.map((name) => ({ name, url: byName.get(name).url }));
    for (const record of [...club.recent, ...(club.biggest_win?.matches || []), ...(club.biggest_defeat?.matches || [])]) {
      record.opponent_url = byName.get(record.opponent).url;
    }
    club.recent.reverse(); // Most recent first; the form strip reverses this for left-to-right chronology.
  }
  for (const league of leagues) for (const row of league.rows) row.url = byName.get(row.team).url;
  clubs.sort((a, b) => a.name.localeCompare(b.name));
  return {
    schema_version: 1,
    as_of: asOf,
    database_through: matches.at(-1).Date,
    season,
    matches: matches.length,
    source: SOURCE,
    source_commit: sourceCommit,
    source_hashes: Object.fromEntries(
      Object.entries(FILES).map(([key, name]) => [name, crypto.createHash("sha256").update(texts[key]).digest("hex")])
    ),
    current_clubs: clubs.filter((club) => club.current).length,
    aliases: buildAliases(clubs, texts.aliases),
    aliases_source_sha256: crypto
      .createHash("sha256")
      .update(texts.aliases || "")
      .digest("hex"),
    clubs,
    leagues,
  };
}

async function writeSnapshot(data, outputPath = OUTPUT) {
  const previous = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, "utf8")) : null;
  if (previous && (data.database_through < previous.database_through || data.matches < previous.matches * 0.95))
    throw new Error("Results coverage moved backwards or lost substantial history; the saved club records were not replaced.");
  const config = await prettier.resolveConfig(OUTPUT);
  const plugins = config?.plugins?.map((plugin) => (typeof plugin === "string" ? require.resolve(plugin, { paths: [ROOT] }) : plugin));
  const text = await prettier.format(JSON.stringify(data), { ...config, plugins, filepath: OUTPUT });
  if (fs.existsSync(outputPath) && fs.readFileSync(outputPath, "utf8") === text) return false;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const temporary = fs.mkdtempSync(path.join(path.dirname(outputPath), ".team-refresh-"));
  const file = path.join(temporary, "snapshot.json");
  try {
    fs.writeFileSync(file, text);
    fs.renameSync(file, outputPath);
  } finally {
    if (fs.existsSync(file)) fs.unlinkSync(file);
    fs.rmdirSync(temporary);
  }
  return true;
}

async function main() {
  const options = {};
  const args = process.argv.slice(2);
  while (args.length) {
    const key = args.shift();
    if (!["--data-dir", "--as-of", "--output"].includes(key) || !args.length || options[key])
      throw new Error("Usage: node scripts/generate_team_pages.js --data-dir PATH [--as-of YYYY-MM-DD] [--output FILE]");
    options[key] = args.shift();
  }
  if (!options["--data-dir"]) throw new Error("Supply --data-dir pointing to the England-football-results checkout.");
  const directory = path.resolve(options["--data-dir"]);
  const texts = Object.fromEntries(Object.entries(FILES).map(([key, file]) => [key, fs.readFileSync(path.join(directory, file), "utf8")]));
  texts.aliases = fs.readFileSync(ALIASES_FILE, "utf8");
  let sourceCommit = null;
  try {
    sourceCommit = execFileSync("git", ["-C", directory, "rev-parse", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch (_) {
    /* A downloaded directory of CSVs is also supported. */
  }
  const data = snapshot(texts, options["--as-of"] || new Date().toISOString().slice(0, 10), sourceCommit);
  const changed = await writeSnapshot(data, options["--output"] || OUTPUT);
  console.log(
    `${changed ? "Updated" : "Verified"} ${data.clubs.length} club pages and ${data.leagues.length} league tables; results through ${
      data.database_through
    }.`
  );
}

if (require.main === module)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
module.exports = { FILES, ALIASES_FILE, snapshot, writeSnapshot, periodsFor, assignSlugs, buildAliases, clubStyle, inkOn };
