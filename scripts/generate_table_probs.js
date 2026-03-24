#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const CSV_URL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglandLeagueResults_wRanks.csv";
const DEDUCT_CSV_URL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglishTeamPointDeductions.csv";
const TIERS = [1, 2, 3, 4];

const SIMS = Number.parseInt(process.env.SIMS || "1000000", 10);
const OUT_PATH = path.join(process.cwd(), "assets", "data", "tableProbs.json");

const ELO_PER_NAT_LOGIT = 400.0 / Math.log(10.0);

function seasonStartYearFromSeasonStr(seasonStr) {
  const m = String(seasonStr || "").match(/^(\d{4})\s*\/\s*(\d{4})$/);
  if (m) return Number.parseInt(m[1], 10);
  const m2 = String(seasonStr || "").match(/(\d{4})/);
  return m2 ? Number.parseInt(m2[1], 10) : new Date().getFullYear();
}

function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

function safeProbs(arr, floor = 1e-3) {
  const p = arr.map((v) => clamp(+v, floor, 1 - floor));
  const s = p.reduce((a, b) => a + b, 0);
  return p.map((v) => v / s);
}

function eloToSkill(elo, beta = 0.9, base = 1000.0, mult = 2.0, offset = 0.0) {
  const S = ELO_PER_NAT_LOGIT * beta * mult;
  return (elo - base) / S + offset;
}

function eraProbsFromYear(year) {
  const h = (year - 1888) * -0.141579 + 60.5636;
  const a = (year - 1888) * 0.075714 + 19.4769;
  const d = (year - 1888) * 0.065851 + 19.9608;
  const pH = Math.max(h, 0.001);
  const pD = Math.max(d, 0.001);
  const pA = Math.max(a, 0.001);
  const s = pH + pD + pA;
  return [pH / s, pD / s, pA / s];
}

function deltaBaseAndKappa(year) {
  const [pH, pD, pA] = eraProbsFromYear(year);
  const DeltaBase = 0.5 * Math.log(pH / pA);
  const kappa = (pD / (1 - pD)) * 2.0 * Math.cosh(DeltaBase);
  return [DeltaBase, kappa];
}

function predictProbs(sH, sA, year, beta = 1.0) {
  const [DeltaBase, kappa] = deltaBaseAndKappa(year);
  const DeltaStar = beta * (sH - sA) + DeltaBase;
  const u = Math.exp(DeltaStar);
  const v = Math.exp(-DeltaStar);
  const Den = u + v + kappa;
  const pH = u / Den;
  const pA = v / Den;
  const pD = kappa / Den;
  return [pH, pD, pA];
}

function matchProbabilities(homeElo, awayElo, seasonStartYear, beta = 0.9) {
  const sH = eloToSkill(homeElo, beta);
  const sA = eloToSkill(awayElo, beta);
  const rho = 0.997;
  const xH = rho * sH + (1 - rho);
  const xA = rho * sA + (1 - rho);
  const p = predictProbs(xH, xA, seasonStartYear, beta);
  return safeProbs(p, 1e-3);
}

function latestElosByScanningBackwards(seasonTierRows, teams) {
  const need = new Set(teams);
  const elo = {};
  for (let i = seasonTierRows.length - 1; i >= 0; i--) {
    if (need.size === 0) break;
    const r = seasonTierRows[i];
    const ht = r.HomeTeam;
    const at = r.AwayTeam;

    if (need.has(ht)) {
      const v = Number.parseFloat(r.HomeRank_after);
      if (Number.isFinite(v)) {
        elo[ht] = v;
        need.delete(ht);
      }
    }
    if (need.has(at)) {
      const v = Number.parseFloat(r.AwayRank_after);
      if (Number.isFinite(v)) {
        elo[at] = v;
        need.delete(at);
      }
    }
  }
  return elo;
}

function inferRemainingFixturesDoubleRoundRobin(playedRows, teams) {
  const playedPairs = new Set();
  for (const r of playedRows) playedPairs.add(`${r.HomeTeam}|||${r.AwayTeam}`);

  const rem = [];
  for (const h of teams) {
    for (const a of teams) {
      if (h === a) continue;
      const key = `${h}|||${a}`;
      if (!playedPairs.has(key)) rem.push([h, a]);
    }
  }
  return rem;
}

function hashStringToSeed(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


function fillMissingExamples(teams, fixtures, basePoints, examples, possibleByTeam, seedKey) {
  const N = teams.length;
  const missing = new Set();
  for (const t of teams) {
    const poss = possibleByTeam[t] || [];
    for (let pos = 1; pos <= N; pos++) {
      if (poss[pos] && !(examples[t] && examples[t][pos])) missing.add(`${t}|||${pos}`);
    }
  }

  if (!missing.size) return examples;

  const maxExtra = Number.parseInt(process.env.EXAMPLE_MAX_SIMS || "200000", 10);
  const batch = 5000;
  let done = 0;

  while (missing.size > 0 && done < maxExtra) {
    const seedFn = hashStringToSeed(`${seedKey}|extra|${done}`);
    const rng = mulberry32(seedFn());

    for (let s = 0; s < batch && done < maxExtra; s++, done++) {
      const pts = new Float64Array(N);
      for (let i = 0; i < N; i++) pts[i] = basePoints[i] || 0;

      const results = new Uint8Array(fixtures.length);
      for (let i = 0; i < fixtures.length; i++) {
        const f = fixtures[i];
        const r = rng();
        if (r < f.pH) {
          pts[f.h] += 3;
          results[i] = 0;
        } else if (r < f.pH + f.pD) {
          pts[f.h] += 1;
          pts[f.a] += 1;
          results[i] = 1;
        } else {
          pts[f.a] += 3;
          results[i] = 2;
        }
      }

      const indices = new Array(N);
      for (let i = 0; i < N; i++) indices[i] = i;
      indices.sort((i, j) => pts[j] - pts[i]);

      let start = 0;
      while (start < N) {
        let end = start + 1;
        while (end < N && pts[indices[end]] === pts[indices[start]]) end++;
        for (let i = end - 1; i > start; i--) {
          const j = start + Math.floor(rng() * (i - start + 1));
          const tmp = indices[i];
          indices[i] = indices[j];
          indices[j] = tmp;
        }
        start = end;
      }

      for (let pos = 1; pos <= N; pos++) {
        const teamName = teams[indices[pos - 1]];
        const key = `${teamName}|||${pos}`;
        if (missing.has(key)) {
          if (!examples[teamName]) examples[teamName] = {};
          examples[teamName][pos] = Array.from(results);
          missing.delete(key);
        }
      }
    }
  }

  return examples;
}


function buildDeterministicResults(teams, fixtures, targetIndex, mode) {
  const results = new Uint8Array(fixtures.length);

  for (let i = 0; i < fixtures.length; i++) {
    const f = fixtures[i];
    const h = f.h;
    const a = f.a;

    if (h === targetIndex || a === targetIndex) {
      const targetIsHome = h === targetIndex;
      if (mode === "win") {
        results[i] = targetIsHome ? 0 : 2;
      } else {
        results[i] = targetIsHome ? 2 : 0;
      }
      continue;
    }

    // For other fixtures, pick the most likely outcome.
    const pH = f.pH;
    const pD = f.pD;
    const pA = f.pA;
    if (pH >= pD && pH >= pA) results[i] = 0;
    else if (pD >= pH && pD >= pA) results[i] = 1;
    else results[i] = 2;
  }

  return Array.from(results);
}

function rankFromResults(teams, fixtures, basePoints, results) {
  const N = teams.length;
  const pts = new Float64Array(N);
  for (let i = 0; i < N; i++) pts[i] = basePoints[i] || 0;

  for (let i = 0; i < fixtures.length; i++) {
    const f = fixtures[i];
    const code = results[i];
    if (code === 0) pts[f.h] += 3;
    else if (code === 1) { pts[f.h] += 1; pts[f.a] += 1; }
    else pts[f.a] += 3;
  }

  const indices = new Array(N);
  for (let i = 0; i < N; i++) indices[i] = i;
  indices.sort((i, j) => {
    if (pts[j] !== pts[i]) return pts[j] - pts[i];
    return teams[i].localeCompare(teams[j]);
  });

  return indices;
}

function addExtremeExamples(teams, fixtures, basePoints, examples, possibleByTeam) {
  for (let i = 0; i < teams.length; i++) {
    for (const mode of ["win", "lose"]) {
      const results = buildDeterministicResults(teams, fixtures, i, mode);
      const ranking = rankFromResults(teams, fixtures, basePoints, results);
      const pos = ranking.indexOf(i) + 1;
      if (pos < 1) continue;
      const teamName = teams[i];
      if (possibleByTeam && possibleByTeam[teamName] && !possibleByTeam[teamName][pos]) continue;
      if (!examples[teamName]) examples[teamName] = {};
      if (!examples[teamName][pos]) examples[teamName][pos] = results;
    }
  }

  return examples;
}

function sampleSeasonWithTilt(teams, fixtures, basePoints, rng, targetIndex, tiltMode) {
  const N = teams.length;
  const pts = new Float64Array(N);
  for (let i = 0; i < N; i++) pts[i] = basePoints[i] || 0;

  const results = new Uint8Array(fixtures.length);

  for (let i = 0; i < fixtures.length; i++) {
    const f = fixtures[i];
    let pH = f.pH;
    let pD = f.pD;
    let pA = f.pA;

    if (targetIndex !== null && (f.h === targetIndex || f.a === targetIndex)) {
      const targetIsHome = f.h === targetIndex;
      let winBoost = 1.0;
      let drawBoost = 1.0;
      let loseBoost = 1.0;
      if (tiltMode === "up") {
        winBoost = 2.0;
        drawBoost = 1.0;
        loseBoost = 0.5;
      } else if (tiltMode === "down") {
        winBoost = 0.5;
        drawBoost = 1.0;
        loseBoost = 2.0;
      }

      if (targetIsHome) {
        pH *= winBoost;
        pD *= drawBoost;
        pA *= loseBoost;
      } else {
        pH *= loseBoost;
        pD *= drawBoost;
        pA *= winBoost;
      }

      const s = pH + pD + pA;
      pH /= s;
      pD /= s;
      pA /= s;
    }

    const r = rng();
    if (r < pH) {
      pts[f.h] += 3;
      results[i] = 0;
    } else if (r < pH + pD) {
      pts[f.h] += 1;
      pts[f.a] += 1;
      results[i] = 1;
    } else {
      pts[f.a] += 3;
      results[i] = 2;
    }
  }

  const indices = new Array(N);
  for (let i = 0; i < N; i++) indices[i] = i;
  indices.sort((i, j) => pts[j] - pts[i]);

  let start = 0;
  while (start < N) {
    let end = start + 1;
    while (end < N && pts[indices[end]] === pts[indices[start]]) end++;
    for (let i = end - 1; i > start; i--) {
      const j = start + Math.floor(rng() * (i - start + 1));
      const tmp = indices[i];
      indices[i] = indices[j];
      indices[j] = tmp;
    }
    start = end;
  }

  return { indices, results: Array.from(results) };
}

function fillMissingExamplesImportance(teams, fixtures, basePoints, examples, possibleByTeam, seedKey) {
  const N = teams.length;
  const missing = new Set();
  for (const t of teams) {
    const poss = possibleByTeam[t] || [];
    for (let pos = 1; pos <= N; pos++) {
      if (poss[pos] && !(examples[t] && examples[t][pos])) missing.add(`${t}|||${pos}`);
    }
  }
  if (!missing.size) return examples;

  const maxExtra = Number.parseInt(process.env.IMPORTANCE_MAX_SIMS || "200000", 10);
  const perTeamBatch = 5000;
  const tiltModes = ["up", "down", "neutral"];

  for (let ti = 0; ti < teams.length && missing.size > 0; ti++) {
    const team = teams[ti];
    const teamMissing = new Set();
    for (let pos = 1; pos <= N; pos++) {
      const key = `${team}|||${pos}`;
      if (missing.has(key)) teamMissing.add(pos);
    }
    if (!teamMissing.size) continue;

    let done = 0;
    for (const mode of tiltModes) {
      if (!teamMissing.size) break;
      const seedFn = hashStringToSeed(`${seedKey}|importance|${team}|${mode}`);
      const rng = mulberry32(seedFn());

      for (let s = 0; s < perTeamBatch && done < maxExtra; s++, done++) {
        const sim = sampleSeasonWithTilt(teams, fixtures, basePoints, rng, ti, mode === "neutral" ? null : ti);
        const pos = sim.indices.indexOf(ti) + 1;
        if (teamMissing.has(pos)) {
          if (!examples[team]) examples[team] = {};
          examples[team][pos] = sim.results;
          teamMissing.delete(pos);
          missing.delete(`${team}|||${pos}`);
          if (!teamMissing.size) break;
        }
      }
    }
  }

  return examples;
}


function reverseSearchExamples(teams, fixtures, basePoints, examples, possibleByTeam, seedKey) {
  const N = teams.length;
  const maxTries = Number.parseInt(process.env.REVERSE_MAX_TRIES || "30000", 10);

  for (let ti = 0; ti < teams.length; ti++) {
    const team = teams[ti];
    const poss = possibleByTeam[team] || [];

    for (let targetPos = 1; targetPos <= N; targetPos++) {
      if (!poss[targetPos]) continue;
      if (examples[team] && examples[team][targetPos]) continue;

      const seedFn = hashStringToSeed(`${seedKey}|reverse|${team}|${targetPos}`);
      const rng = mulberry32(seedFn());
      let tilt = targetPos <= Math.ceil(N / 2) ? "up" : "down";

      for (let attempt = 0; attempt < maxTries; attempt++) {
        const sim = sampleSeasonWithTilt(teams, fixtures, basePoints, rng, ti, tilt);
        const pos = sim.indices.indexOf(ti) + 1;
        if (pos === targetPos) {
          if (!examples[team]) examples[team] = {};
          examples[team][targetPos] = sim.results;
          break;
        }

        // adapt tilt based on current rank
        if (pos < targetPos) {
          tilt = "down";
        } else if (pos > targetPos) {
          tilt = "up";
        }
      }
    }
  }

  return examples;
}

function computePositionProbabilitiesMC(teams, basePoints, fixtures, sims, seedKey) {
  const N = teams.length;
  const counts = {};
  for (const t of teams) counts[t] = new Float64Array(N + 1);

  const examples = {};
  for (const t of teams) examples[t] = {};

  const seedFn = hashStringToSeed(seedKey);
  const rng = mulberry32(seedFn());

  const pts0 = new Float64Array(N);
  for (let i = 0; i < N; i++) pts0[i] = basePoints[i];

  const indices = new Array(N);
  for (let i = 0; i < N; i++) indices[i] = i;

  for (let s = 0; s < sims; s++) {
    const pts = pts0.slice();
    const results = new Uint8Array(fixtures.length);

    for (let i = 0; i < fixtures.length; i++) {
      const f = fixtures[i];
      const r = rng();
      if (r < f.pH) {
        pts[f.h] += 3;
        results[i] = 0;
      } else if (r < f.pH + f.pD) {
        pts[f.h] += 1;
        pts[f.a] += 1;
        results[i] = 1;
      } else {
        pts[f.a] += 3;
        results[i] = 2;
      }
    }

    indices.sort((i, j) => pts[j] - pts[i]);
    let start = 0;
    while (start < N) {
      let end = start + 1;
      while (end < N && pts[indices[end]] === pts[indices[start]]) end++;
      for (let i = end - 1; i > start; i--) {
        const j = start + Math.floor(rng() * (i - start + 1));
        const tmp = indices[i];
        indices[i] = indices[j];
        indices[j] = tmp;
      }
      start = end;
    }

    for (let pos = 1; pos <= N; pos++) {
      const teamIdx = indices[pos - 1];
      const teamName = teams[teamIdx];
      counts[teamName][pos] += 1;

      if (!examples[teamName][pos]) {
        examples[teamName][pos] = Array.from(results);
      }
    }
  }

  const out = {};
  for (const t of teams) {
    const arr = new Float64Array(N + 1);
    for (let pos = 1; pos <= N; pos++) arr[pos] = counts[t][pos] / sims;
    out[t] = arr;
  }

  return { posProbs: out, examples };
}

function computeImpossiblePositions(teams, basePoints, remainingCounts) {
  const N = teams.length;
  const minPts = new Float64Array(N);
  const maxPts = new Float64Array(N);

  for (let i = 0; i < N; i++) {
    minPts[i] = basePoints[i];
    maxPts[i] = basePoints[i] + 3 * remainingCounts[i];
  }

  const out = {};
  for (let i = 0; i < N; i++) {
    const t = teams[i];
    const impossible = new Array(N + 1).fill(false);

    let guaranteedAbove = 0;
    let possibleAbove = 0;
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      if (minPts[j] > maxPts[i]) guaranteedAbove++;
      if (maxPts[j] >= minPts[i]) possibleAbove++;
    }

    for (let pos = 1; pos <= N; pos++) {
      if (pos <= guaranteedAbove) {
        impossible[pos] = true;
      } else if (possibleAbove < pos - 1) {
        impossible[pos] = true;
      }
    }

    out[t] = impossible;
  }

  return out;
}

function computePointsSoFar(playedRows, adjustments, seasonStr) {
  const teams = new Set();
  for (const r of playedRows) {
    teams.add(r.HomeTeam);
    teams.add(r.AwayTeam);
  }

  const pts = {};
  for (const t of teams) pts[t] = 0;

  for (const r of playedRows) {
    const ht = r.HomeTeam;
    const at = r.AwayTeam;
    const res = String(r.Result || "");
    if (res === "H") pts[ht] += 3;
    else if (res === "A") pts[at] += 3;
    else if (res === "D") {
      pts[ht] += 1;
      pts[at] += 1;
    }
  }

  const season = String(seasonStr || "").trim();
  const bySeason = adjustments[season] || {};
  for (const t of teams) {
    if (Number.isFinite(bySeason[t])) pts[t] += bySeason[t];
  }

  return pts;
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function main() {
  const [csvText, deductText] = await Promise.all([fetchText(CSV_URL), fetchText(DEDUCT_CSV_URL)]);

  const rows = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  }).data;

  if (!rows.length) throw new Error("No CSV rows loaded.");
  const latestSeason = rows[rows.length - 1].Season;
  const seasonStartYear = seasonStartYearFromSeasonStr(latestSeason);

  const deductRows = Papa.parse(deductText, {
    header: true,
    skipEmptyLines: true,
  }).data;

  const adjustments = {};
  for (const r of deductRows) {
    const season = String(r.Season || "").trim();
    const team = String(r.Team || "").trim();
    if (!season || !team) continue;
    const pts = Number.parseFloat(r.Pts_deducted);
    if (!Number.isFinite(pts) || pts === 0) continue;
    if (!adjustments[season]) adjustments[season] = {};
    if (!adjustments[season][team]) adjustments[season][team] = 0;
    adjustments[season][team] -= pts;
  }

  const out = {
    generated_at: new Date().toISOString(),
    sims: SIMS,
    season: latestSeason,
    last_result_date: rows[rows.length - 1].Date || "",
    tiers: [],
  };

  for (const tier of TIERS) {
    const seasonTier = rows.filter((r) => String(r.Season) === String(latestSeason) && String(r.Tier) === String(tier));
    if (!seasonTier.length) continue;

    const divisionSet = new Set(seasonTier.map((r) => r.Division).filter(Boolean));
    const divisionName = divisionSet.size ? Array.from(divisionSet)[0] : `Tier ${tier}`;

    const played = seasonTier.filter((r) => r.Result === "H" || r.Result === "D" || r.Result === "A");

    const teamSet = new Set();
    for (const r of played) {
      teamSet.add(r.HomeTeam);
      teamSet.add(r.AwayTeam);
    }
    const teams = Array.from(teamSet).sort();
    if (teams.length < 2) continue;

    const pts = computePointsSoFar(played, adjustments, latestSeason);
    const elos = latestElosByScanningBackwards(seasonTier, teams);
    const remaining = inferRemainingFixturesDoubleRoundRobin(played, teams);

    const teamIndex = new Map();
    for (let i = 0; i < teams.length; i++) teamIndex.set(teams[i], i);

    const fixtures = [];
    for (const [h, a] of remaining) {
      const eH = elos[h];
      const eA = elos[a];
      if (!Number.isFinite(eH) || !Number.isFinite(eA)) continue;
      const [pH, pD, pA] = matchProbabilities(eH, eA, seasonStartYear, 0.9);
      fixtures.push({ h: teamIndex.get(h), a: teamIndex.get(a), pH, pD, pA });
    }

    const basePoints = teams.map((t) => pts[t] || 0);
    const seedKey = `${latestSeason}|${tier}|${teams.length}|${fixtures.length}|${SIMS}`;
    const simResult = computePositionProbabilitiesMC(teams, basePoints, fixtures, SIMS, seedKey);
    const posProbs = simResult.posProbs;
    let examples = simResult.examples;

    const remainingCounts = new Array(teams.length).fill(0);
    for (const f of fixtures) {
      remainingCounts[f.h] += 1;
      remainingCounts[f.a] += 1;
    }
    const impossible = computeImpossiblePositions(teams, basePoints, remainingCounts);

    const possible = {};
    for (const t of teams) {
      possible[t] = (impossible[t] || []).map((v) => !v);
    }

    examples = addExtremeExamples(teams, fixtures, basePoints, examples, possible);
    examples = fillMissingExamples(teams, fixtures, basePoints, examples, possible, seedKey);
    examples = fillMissingExamplesImportance(teams, fixtures, basePoints, examples, possible, seedKey);
    examples = reverseSearchExamples(teams, fixtures, basePoints, examples, possible, seedKey);

    const posProbsPlain = {};
    for (const t of teams) posProbsPlain[t] = Array.from(posProbs[t] || []);

    const fixturePairs = fixtures.map((f) => [f.h, f.a, f.pH, f.pD, f.pA]);

    out.tiers.push({
      tier,
      division: divisionName,
      teams,
      basePoints,
      fixtures: fixturePairs,
      posProbs: posProbsPlain,
      examples,
      impossible,
    });
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out));
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
