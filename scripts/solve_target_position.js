#!/usr/bin/env node
/* eslint-disable no-console */
const Papa = require("papaparse");
const solver = require("javascript-lp-solver");

const CSV_URL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglandLeagueResults_wRanks.csv";
const DEDUCT_CSV_URL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglishTeamPointDeductions.csv";

const targetTeam = process.argv[2];
const targetPos = Number.parseInt(process.argv[3] || "0", 10);
const targetTier = Number.parseInt(process.argv[4] || "1", 10);

if (!targetTeam || !targetPos || !targetTier) {
  console.error("Usage: node scripts/solve_target_position.js <Team Name> <Position> <Tier>");
  process.exit(1);
}

function seasonStartYearFromSeasonStr(seasonStr) {
  const m = String(seasonStr || "").match(/^(\d{4})\s*\/\s*(\d{4})$/);
  if (m) return Number.parseInt(m[1], 10);
  const m2 = String(seasonStr || "").match(/(\d{4})/);
  return m2 ? Number.parseInt(m2[1], 10) : new Date().getFullYear();
}

const ELO_PER_NAT_LOGIT = 400.0 / Math.log(10.0);
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

function buildSolverModel(teams, fixtures, basePoints, targetIndex, targetPos) {
  const model = {
    optimize: "obj",
    opType: "max",
    constraints: {},
    variables: {},
    binaries: {},
  };

  model.constraints["obj"] = { max: 0 };

  const remainingCounts = new Array(teams.length).fill(0);
  for (const f of fixtures) {
    remainingCounts[f.h] += 1;
    remainingCounts[f.a] += 1;
  }
  const maxBase = Math.max(...basePoints);
  const minBase = Math.min(...basePoints);
  const maxRem = Math.max(...remainingCounts);
  const M = maxBase + 3 * maxRem - minBase;

  function addVar(name, coeffs) {
    if (!model.variables[name]) model.variables[name] = { obj: 0 };
    for (const [cname, val] of Object.entries(coeffs)) {
      model.variables[name][cname] = (model.variables[name][cname] || 0) + val;
    }
  }

  for (let i = 0; i < fixtures.length; i++) {
    const vH = `m${i}_H`;
    const vD = `m${i}_D`;
    const vA = `m${i}_A`;

    model.constraints[`m${i}_sum`] = { min: 1, max: 1 };
    addVar(vH, { [`m${i}_sum`]: 1 });
    addVar(vD, { [`m${i}_sum`]: 1 });
    addVar(vA, { [`m${i}_sum`]: 1 });

    model.binaries[vH] = 1;
    model.binaries[vD] = 1;
    model.binaries[vA] = 1;
  }

  function pointsCoeffs(teamIndex) {
    const coeffs = {};
    for (let i = 0; i < fixtures.length; i++) {
      const f = fixtures[i];
      if (f.h === teamIndex) {
        coeffs[`m${i}_H`] = (coeffs[`m${i}_H`] || 0) + 3;
        coeffs[`m${i}_D`] = (coeffs[`m${i}_D`] || 0) + 1;
      } else if (f.a === teamIndex) {
        coeffs[`m${i}_A`] = (coeffs[`m${i}_A`] || 0) + 3;
        coeffs[`m${i}_D`] = (coeffs[`m${i}_D`] || 0) + 1;
      }
    }
    return coeffs;
  }

  const ptCoeffs = teams.map((_, idx) => pointsCoeffs(idx));

  for (let j = 0; j < teams.length; j++) {
    if (j === targetIndex) continue;
    const g = `g_${j}`;
    const l = `l_${j}`;
    const e = `e_${j}`;

    model.binaries[g] = 1;
    model.binaries[l] = 1;
    model.binaries[e] = 1;

    model.constraints[`cmp_sum_${j}`] = { min: 1, max: 1 };
    addVar(g, { [`cmp_sum_${j}`]: 1 });
    addVar(l, { [`cmp_sum_${j}`]: 1 });
    addVar(e, { [`cmp_sum_${j}`]: 1 });

    const diff_ge = `diff_ge_${j}`;
    const diff_le = `diff_le_${j}`;
    const diff_eq_hi = `diff_eq_hi_${j}`;
    const diff_eq_lo = `diff_eq_lo_${j}`;

    model.constraints[diff_ge] = { min: 1 - M };
    model.constraints[diff_le] = { max: -1 + M };
    model.constraints[diff_eq_hi] = { max: M };
    model.constraints[diff_eq_lo] = { min: -M };

    addVar(g, { [diff_ge]: -M });
    addVar(l, { [diff_le]: M });
    addVar(e, { [diff_eq_hi]: M, [diff_eq_lo]: -M });

    const baseDiff = basePoints[j] - basePoints[targetIndex];
    model.constraints[diff_ge].min = 1 - M - baseDiff;
    model.constraints[diff_le].max = -1 + M - baseDiff;
    model.constraints[diff_eq_hi].max = M - baseDiff;
    model.constraints[diff_eq_lo].min = -M - baseDiff;

    for (const [v, coef] of Object.entries(ptCoeffs[j])) {
      addVar(v, { [diff_ge]: coef, [diff_le]: coef, [diff_eq_hi]: coef, [diff_eq_lo]: coef });
    }
    for (const [v, coef] of Object.entries(ptCoeffs[targetIndex])) {
      addVar(v, { [diff_ge]: -coef, [diff_le]: -coef, [diff_eq_hi]: -coef, [diff_eq_lo]: -coef });
    }
  }

  model.constraints["g_sum_max"] = { max: targetPos - 1 };
  model.constraints["ge_sum_min"] = { min: targetPos - 1 };

  for (let j = 0; j < teams.length; j++) {
    if (j === targetIndex) continue;
    addVar(`g_${j}`, { g_sum_max: 1, ge_sum_min: 1 });
    addVar(`e_${j}`, { ge_sum_min: 1 });
  }

  return model;
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function main() {
  const [csvText, deductText] = await Promise.all([fetchText(CSV_URL), fetchText(DEDUCT_CSV_URL)]);
  const rows = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
  if (!rows.length) throw new Error("No CSV rows loaded.");

  const latestSeason = rows[rows.length - 1].Season;
  const seasonStartYear = seasonStartYearFromSeasonStr(latestSeason);

  const deductRows = Papa.parse(deductText, { header: true, skipEmptyLines: true }).data;
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

  const seasonTier = rows.filter((r) => String(r.Season) === String(latestSeason) && String(r.Tier) === String(targetTier));
  const played = seasonTier.filter((r) => r.Result === "H" || r.Result === "D" || r.Result === "A");
  const teamSet = new Set();
  for (const r of played) {
    teamSet.add(r.HomeTeam);
    teamSet.add(r.AwayTeam);
  }
  const teams = Array.from(teamSet).sort();
  const idx = teams.indexOf(targetTeam);
  if (idx < 0) throw new Error(`Team not found: ${targetTeam}`);

  const pts = computePointsSoFar(played, adjustments, latestSeason);
  const basePoints = teams.map((t) => pts[t] || 0);
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

  const model = buildSolverModel(teams, fixtures, basePoints, idx, targetPos);
  const res = solver.Solve(model);
  if (!res.feasible) {
    console.log(JSON.stringify({ feasible: false }));
    return;
  }

  const results = [];
  for (let i = 0; i < fixtures.length; i++) {
    const vH = `m${i}_H`;
    const vD = `m${i}_D`;
    const vA = `m${i}_A`;
    if (res[vH] === 1) results[i] = 0;
    else if (res[vD] === 1) results[i] = 1;
    else results[i] = 2;
  }

  console.log(JSON.stringify({ feasible: true, results }));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
