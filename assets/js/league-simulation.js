/* Shared season simulator for the generator, historical validation and browser. */
(function (root) {
  "use strict";
  const Match = typeof module !== "undefined" && module.exports ? require("./match-probabilities-data.js") : root.MatchProbabilities;
  const VERSION = "fixed-uncertain-strength-v1";
  // Carry the filter's existing uncertainty through the season. Extra future-form
  // variance was tested, but worsened later final-points scores; it is disabled.
  const DEFAULT_UNCERTAINTY = Object.freeze({ posteriorScale: 1, futureScale: 0, seasonWeeks: 40 });

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
    return () => {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normalGenerator(rng) {
    let spare = null;
    return () => {
      if (spare !== null) {
        const value = spare;
        spare = null;
        return value;
      }
      const radius = Math.sqrt(-2 * Math.log(1 - rng()));
      const angle = 2 * Math.PI * rng();
      spare = radius * Math.sin(angle);
      return radius * Math.cos(angle);
    };
  }

  function averageProcessVariance(weeks, weeklyRho, weeklyVariance) {
    // Variance of the average of future OU innovations over [0, weeks].
    // This supplies a single season-level offset; paths are never simulated.
    if (weeks === 0 || weeklyVariance === 0) return 0;
    if (!(weeks > 0 && weeklyRho > 0 && weeklyRho < 1 && weeklyVariance >= 0)) throw new Error("Invalid process variance inputs.");
    const a = -Math.log(weeklyRho);
    const x = a * weeks;
    // Stable small-x expansion of x - 2(1-exp(-x)) + (1-exp(-2x))/2.
    const integral = x < 0.01 ? x ** 3 * (1 / 3 - x / 4 + (7 * x * x) / 60 - x ** 3 / 24) : x + 2 * Math.expm1(-x) - Math.expm1(-2 * x) / 2;
    return (((2 * weeklyVariance) / (1 - weeklyRho ** 2)) * integral) / (x * x);
  }

  function strengthDistribution(model, teams, tier, date, fixtures, settings = DEFAULT_UNCERTAINTY) {
    const { posteriorScale = 1, futureScale = 0, seasonWeeks = 40 } = settings;
    if (![posteriorScale, futureScale, seasonWeeks].every((x) => Number.isFinite(x) && x >= 0))
      throw new Error("Invalid season uncertainty settings.");
    const remaining = teams.map(() => 0);
    for (const f of fixtures) {
      remaining[f.h]++;
      remaining[f.a]++;
    }
    const states = teams.map((team) => Match.forecastTeam(model.teams[team], date, model, tier));
    return {
      means: states.map((s) => s.skill),
      variances: states.map(
        (s, i) =>
          posteriorScale * s.variance +
          futureScale *
            averageProcessVariance((seasonWeeks * remaining[i]) / (2 * (teams.length - 1)), model.weekly_rho, model.weekly_process_variance)
      ),
      beta: model.beta,
      homeAdvantage: model.tiers[tier].home_advantage,
      logDraw: model.tiers[tier].log_draw,
    };
  }

  function computePositionProbabilitiesMC(teams, basePoints, fixtures, sims, seedKey, strength = null) {
    if (!Number.isInteger(sims) || sims < 1) throw new Error("Simulation count must be a positive integer.");
    const n = teams.length;
    const counts = Object.fromEntries(teams.map((t) => [t, new Float64Array(n + 1)]));
    const remaining = teams.map(() => 0);
    for (const f of fixtures) {
      remaining[f.h]++;
      remaining[f.a]++;
    }
    const pointCounts = remaining.map((r) => new Uint32Array(3 * r + 1));
    const examples = Object.fromEntries(teams.map((t) => [t, {}]));
    const rng = mulberry32(hashStringToSeed(seedKey)());
    const normal = normalGenerator(mulberry32(hashStringToSeed(seedKey + "|strength")()));
    const indices = teams.map((_, i) => i);
    const factors = new Float64Array(n);
    const sampledSkills = new Float64Array(n);
    const stochastic = strength && strength.variances.some((v) => v > 0);
    if (
      strength &&
      (strength.means.length !== n ||
        strength.variances.length !== n ||
        !strength.variances.every((v) => Number.isFinite(v) && v >= 0) ||
        !strength.means.every(Number.isFinite))
    )
      throw new Error("Invalid strength distribution.");
    const homeFactor = strength ? Math.exp(strength.homeAdvantage) : 1;
    const drawFactor = strength ? Math.exp(strength.logDraw) : 1;
    const pts = new Float64Array(n);
    const results = new Uint8Array(fixtures.length);
    for (let simulation = 0; simulation < sims; simulation++) {
      pts.set(basePoints);
      if (stochastic) {
        // Exactly ONE latent strength draw per team, shared by all its fixtures.
        for (let i = 0; i < n; i++) {
          sampledSkills[i] = strength.means[i] + Math.sqrt(strength.variances[i]) * normal();
          factors[i] = Math.exp(strength.beta * sampledSkills[i]);
        }
      }
      for (let i = 0; i < fixtures.length; i++) {
        const f = fixtures[i];
        let pH = f.pH,
          pD = f.pD;
        if (stochastic) {
          const u = (homeFactor * factors[f.h]) / factors[f.a];
          if (u > 0 && Number.isFinite(u)) {
            const total = u + drawFactor + 1 / u;
            pH = u / total;
            pD = drawFactor / total;
          } else {
            [pH, pD] = Match.fromSkills(sampledSkills[f.h], sampledSkills[f.a], strength.homeAdvantage, strength.logDraw, strength.beta);
          }
        }
        const r = rng();
        if (r < pH) {
          pts[f.h] += 3;
          results[i] = 0;
        } else if (r < pH + pD) {
          pts[f.h]++;
          pts[f.a]++;
          results[i] = 1;
        } else {
          pts[f.a] += 3;
          results[i] = 2;
        }
      }
      indices.sort((i, j) => pts[j] - pts[i]);
      let start = 0;
      while (start < n) {
        let end = start + 1;
        while (end < n && pts[indices[end]] === pts[indices[start]]) end++;
        for (let i = end - 1; i > start; i--) {
          const j = start + Math.floor(rng() * (i - start + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        start = end;
      }
      for (let position = 1; position <= n; position++) {
        const i = indices[position - 1],
          team = teams[i];
        counts[team][position]++;
        pointCounts[i][pts[i] - basePoints[i]]++;
        if (!examples[team][position]) examples[team][position] = Array.from(results);
      }
    }
    const posProbs = Object.fromEntries(teams.map((t) => [t, counts[t].map((v) => v / sims)]));
    const pointDistribution = pointCounts.map((row) => Float64Array.from(row, (v) => v / sims));
    const pointSummary = pointCounts.map((row, i) => {
      let mean = 0,
        second = 0,
        cumulative = 0;
      const quantiles = [],
        levels = [0.025, 0.1, 0.9, 0.975];
      row.forEach((count, points) => {
        mean += ((basePoints[i] + points) * count) / sims;
        second += ((basePoints[i] + points) ** 2 * count) / sims;
        cumulative += count;
        while (quantiles.length < levels.length && cumulative >= levels[quantiles.length] * sims) quantiles.push(basePoints[i] + points);
      });
      return {
        mean,
        variance: Math.max(0, second - mean * mean),
        lower95: quantiles[0],
        lower80: quantiles[1],
        upper80: quantiles[2],
        upper95: quantiles[3],
      };
    });
    return { posProbs, examples, pointSummary, pointDistribution };
  }

  const api = { VERSION, DEFAULT_UNCERTAINTY, averageProcessVariance, strengthDistribution, computePositionProbabilitiesMC };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.LeagueSimulation = api;
})(globalThis);
