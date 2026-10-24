#!/usr/bin/env node
// Same production simulator, with historical inputs and explicit frozen settings.
const fs = require("node:fs");
const Match = require("../assets/js/match-probabilities-data.js");
const League = require("../assets/js/league-simulation.js");
const { computePointsSoFar, inferRemainingFixturesDoubleRoundRobin } = require("./generate_table_probs.js");
const cases = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const configs = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
const sims = Number(process.env.BACKTEST_SIMS || 20000);
const rows = [];
for (const [index, c] of cases.entries()) {
  const indices = new Map(c.teams.map((team, i) => [team, i]));
  const points = computePointsSoFar(c.played, c.adjustments, c.season, c.teams);
  const basePoints = c.teams.map((team) => points[team]);
  const remaining = inferRemainingFixturesDoubleRoundRobin(c.played, c.teams);
  for (const config of configs) {
    const model = c.snapshots[config.model];
    const fixtures = remaining.map(([home, away]) => {
      const h = Match.forecastTeam(model.teams[home], c.cutoff, model, c.tier);
      const a = Match.forecastTeam(model.teams[away], c.cutoff, model, c.tier);
      const baseline = model.tiers[c.tier];
      const [pH, pD, pA] = Match.fromSkills(h.skill, a.skill, baseline.home_advantage, baseline.log_draw, model.beta);
      return { h: indices.get(home), a: indices.get(away), pH, pD, pA };
    });
    const strength = League.strengthDistribution(model, c.teams, c.tier, c.cutoff, fixtures, config);
    const result = League.computePositionProbabilitiesMC(c.teams, basePoints, fixtures, sims, `${c.season}|${c.tier}|${c.fraction}`, strength);
    const n = c.teams.length;
    for (let k = 1; k <= n; k++) {
      if (Math.abs(c.teams.reduce((sum, team) => sum + result.posProbs[team][k], 0) - 1) > 1e-12)
        throw new Error("Position columns do not sum to one");
    }
    c.teams.forEach((team, i) => {
      const p = Array.from(result.posProbs[team]);
      let cdf = 0,
        rps = 0,
        expectedRank = 0;
      for (let k = 1; k <= n; k++) {
        cdf += p[k];
        expectedRank += k * p[k];
        if (k < n) rps += (cdf - Number(c.actualRank[i] <= k)) ** 2 / (n - 1);
      }
      if (Math.abs(cdf - 1) > 1e-12) throw new Error("Position rows do not sum to one");
      let pointsCDF = 0,
        pointsCRPS = 0;
      // Include actual values outside forecast support (e.g. future deductions).
      const pmf = result.pointDistribution[i];
      const low = Math.min(basePoints[i], c.actualPoints[i]);
      const high = Math.max(basePoints[i] + pmf.length - 1, c.actualPoints[i]);
      for (let score = low; score < high; score++) {
        pointsCDF += pmf[score - basePoints[i]] || 0;
        pointsCRPS += (pointsCDF - Number(c.actualPoints[i] <= score)) ** 2;
      }
      const summary = result.pointSummary[i];
      rows.push({
        model: config.name,
        season: c.season,
        tier: c.tier,
        fraction: c.fraction,
        team,
        rps,
        points_crps: pointsCRPS,
        rank_mae: Math.abs(expectedRank - c.actualRank[i]),
        points_error: summary.mean - c.actualPoints[i],
        coverage80: Number(c.actualPoints[i] >= summary.lower80 && c.actualPoints[i] <= summary.upper80),
        coverage95: Number(c.actualPoints[i] >= summary.lower95 && c.actualPoints[i] <= summary.upper95),
        width80: summary.upper80 - summary.lower80,
        width95: summary.upper95 - summary.lower95,
        title_brier: (p[1] - Number(c.actualRank[i] === 1)) ** 2,
        top6_brier: (p.slice(1, 7).reduce((a, b) => a + b, 0) - Number(c.actualRank[i] <= 6)) ** 2,
        bottom3_brier: (p.slice(n - 2).reduce((a, b) => a + b, 0) - Number(c.actualRank[i] > n - 3)) ** 2,
      });
    });
  }
  if (index % 10 === 0) console.log(`Validated ${index + 1}/${cases.length} forecast origins`);
}
fs.writeFileSync(process.argv[4], JSON.stringify({ sims, configs, forecasts: cases.length, rows }));
