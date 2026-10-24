#!/usr/bin/env node
// Evaluate historical snapshots through the production probability/simulation code.
const fs = require("node:fs");
const Match = require("../assets/js/match-probabilities-data.js");
const { computePositionProbabilitiesMC, computePointsSoFar, inferRemainingFixturesDoubleRoundRobin } = require("./generate_table_probs.js");
const cases = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const sims = Number(process.env.BACKTEST_SIMS || 20000);
const rows = [];
for (const [caseIndex, c] of cases.entries()) {
  const indices = new Map(c.teams.map((team, i) => [team, i]));
  const points = computePointsSoFar(c.played, c.adjustments, c.season, c.teams);
  const basePoints = c.teams.map((team) => points[team]);
  const remaining = inferRemainingFixturesDoubleRoundRobin(c.played, c.teams);
  for (const name of ["legacy3", "legacy2", "candidate", "climatology"]) {
    const model = c.snapshots[name];
    const fixtures = remaining.map(([h, a]) => {
      let probabilities;
      if (name === "candidate") {
        // Frozen v2 historical states, using the unchanged shared Davidson map.
        const home = Match.forecastTeam(model.teams[h], c.cutoff, model, c.tier);
        const away = Match.forecastTeam(model.teams[a], c.cutoff, model, c.tier);
        const nuisance = model.tiers[c.tier];
        probabilities = Match.fromSkills(home.skill, away.skill, nuisance.home_advantage, nuisance.log_draw, model.beta);
      } else if (name === "climatology") probabilities = c.climatology;
      else {
        const elo = (team) => Math.round(1000 + (800 / Math.log(10)) * 0.9 * model.teams[team].skill);
        probabilities = Match.probabilities(elo(h), elo(a), Number(c.season.slice(0, 4)));
      }
      const [pH, pD, pA] = probabilities;
      return { h: indices.get(h), a: indices.get(a), pH, pD, pA };
    });
    const { posProbs, pointSummary } = computePositionProbabilitiesMC(c.teams, basePoints, fixtures, sims, `${c.season}|${c.tier}|${c.fraction}`);
    const n = c.teams.length;
    for (let position = 1; position <= n; position++) {
      const total = c.teams.reduce((sum, team) => sum + posProbs[team][position], 0);
      if (Math.abs(total - 1) > 1e-12) throw new Error("Position columns do not sum to one");
    }
    c.teams.forEach((team, i) => {
      const p = Array.from(posProbs[team]);
      let cdf = 0,
        rps = 0,
        expectedRank = 0;
      for (let k = 1; k <= n; k++) {
        cdf += p[k];
        expectedRank += k * p[k];
        if (k < n) rps += (cdf - Number(c.actualRank[i] <= k)) ** 2 / (n - 1);
      }
      if (Math.abs(cdf - 1) > 1e-12) throw new Error("Position rows do not sum to one");
      const summary = pointSummary[i];
      rows.push({
        model: name,
        season: c.season,
        tier: c.tier,
        fraction: c.fraction,
        team,
        rps,
        rank_mae: Math.abs(expectedRank - c.actualRank[i]),
        points_error: summary.mean - c.actualPoints[i],
        coverage80: Number(c.actualPoints[i] >= summary.lower80 && c.actualPoints[i] <= summary.upper80),
        coverage95: Number(c.actualPoints[i] >= summary.lower95 && c.actualPoints[i] <= summary.upper95),
        title_brier: (p[1] - Number(c.actualRank[i] === 1)) ** 2,
        top6_brier: (p.slice(1, 7).reduce((a, b) => a + b, 0) - Number(c.actualRank[i] <= 6)) ** 2,
        bottom3_brier: (p.slice(n - 2).reduce((a, b) => a + b, 0) - Number(c.actualRank[i] > n - 3)) ** 2,
      });
    });
  }
  if (caseIndex % 10 === 0) console.log(`Validated ${caseIndex + 1}/${cases.length} forecast origins`);
}
fs.writeFileSync(process.argv[3], JSON.stringify({ sims, forecasts: cases.length, rows }));
