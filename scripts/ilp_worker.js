#!/usr/bin/env node
/* eslint-disable no-console */
const { parentPort } = require("worker_threads");
const lpSolver = require("javascript-lp-solver");

function solvePositionWithILP(teams, fixtures, basePoints, targetIndex, targetPos) {
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
  const M = (maxBase + 3 * maxRem) - minBase;

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
    addVar(e, { [diff_eq_hi]: -M, [diff_eq_lo]: M });

    for (const [v, coef] of Object.entries(ptCoeffs[j])) {
      addVar(v, { [diff_ge]: coef, [diff_le]: coef, [diff_eq_hi]: coef, [diff_eq_lo]: coef });
    }
    for (const [v, coef] of Object.entries(ptCoeffs[targetIndex])) {
      addVar(v, { [diff_ge]: -coef, [diff_le]: -coef, [diff_eq_hi]: -coef, [diff_eq_lo]: -coef });
    }

    const baseDiff = basePoints[j] - basePoints[targetIndex];
    model.constraints[diff_ge].min = 1 - M - baseDiff;
    model.constraints[diff_le].max = -1 + M - baseDiff;
    model.constraints[diff_eq_hi].max = M - baseDiff;
    model.constraints[diff_eq_lo].min = -M - baseDiff;
  }

  model.constraints["g_sum_max"] = { max: targetPos - 1 };
  model.constraints["ge_sum_min"] = { min: targetPos - 1 };

  for (let j = 0; j < teams.length; j++) {
    if (j === targetIndex) continue;
    addVar(`g_${j}`, { g_sum_max: 1, ge_sum_min: 1 });
    addVar(`e_${j}`, { ge_sum_min: 1 });
  }

  const res = lpSolver.Solve(model);
  if (!res.feasible) return null;

  const results = [];
  for (let i = 0; i < fixtures.length; i++) {
    const vH = `m${i}_H`;
    const vD = `m${i}_D`;
    const vA = `m${i}_A`;
    if (res[vH] === 1) results[i] = 0;
    else if (res[vD] === 1) results[i] = 1;
    else results[i] = 2;
  }

  return results;
}

parentPort.on("message", (payload) => {
  try {
    const { teams, fixtures, basePoints, targetIndex, targetPos } = payload;
    const res = solvePositionWithILP(teams, fixtures, basePoints, targetIndex, targetPos);
    parentPort.postMessage({ ok: true, res });
  } catch (err) {
    parentPort.postMessage({ ok: false, error: String(err && err.message ? err.message : err) });
  }
});
