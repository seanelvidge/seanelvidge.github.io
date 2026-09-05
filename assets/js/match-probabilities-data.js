/* The existing era-adjusted probability model, independent of the page UI. */
(function (root) {
  "use strict";
  // Typical Elo-per-natural-logit scaling (400 / ln(10)).
  const ELO_PER_NAT_LOGIT = 400 / Math.log(10); // ~173.7178

  function clamp(x, lo, hi) {
    return Math.max(lo, Math.min(hi, x));
  }

  function safe_probs(p, floor = 1e-3) {
    let pc = p.map((v) => clamp(v, floor, 1.0 - floor));
    const s = pc.reduce((a, b) => a + b, 0);
    return pc.map((v) => v / s);
  }

  function elo_to_skill(elo, beta = 0.9, base = 1000.0, mult = 2.0, offset = 0.0) {
    const S = ELO_PER_NAT_LOGIT * beta * mult;
    const s = (elo - base) / S + offset;
    return s;
  }

  function era_probs_from_year(year) {
    // Percentages -> probabilities, clipped and normalized
    const h = (year - 1888) * -0.141579 + 60.5636;
    const a = (year - 1888) * 0.075714 + 19.4769;
    const d = (year - 1888) * 0.065851 + 19.9608;

    // clip each to >= 0.001 (Python np.clip(..., 0.001, None))
    let pH_pct = Math.max(h, 0.001);
    let pD_pct = Math.max(d, 0.001);
    let pA_pct = Math.max(a, 0.001);

    // normalize to sum to 1
    const sum = pH_pct + pD_pct + pA_pct;
    pH_pct /= sum;
    pD_pct /= sum;
    pA_pct /= sum;

    // return pH, pA, pD (note order swap from [H,D,A])
    return { pH: pH_pct, pA: pA_pct, pD: pD_pct };
  }

  function delta_base_and_kappa(year) {
    // Get the era-dependent probabilities pH, pA, pD
    const { pH, pA, pD } = era_probs_from_year(year);

    // Delta_base = 0.5 * ln(pH/pA)
    const Delta_base = 0.5 * Math.log(pH / pA);

    // kappa = (pD / (1 - pD)) * 2*cosh(Delta_base)
    const kappa = (pD / (1 - pD)) * 2 * Math.cosh(Delta_base);

    return { Delta_base, kappa };
  }

  function predict_probs(sH, sA, year, beta = 1.0) {
    const { Delta_base, kappa } = delta_base_and_kappa(year);

    const Delta_star = beta * (sH - sA) + Delta_base;

    const u = Math.exp(Delta_star);
    const v = Math.exp(-Delta_star);
    const Den = u + v + kappa;

    const pH = u / Den;
    const pA = v / Den;
    const pD = kappa / Den;

    return [pH, pD, pA]; // [Home, Draw, Away]
  }

  function probabilities(t1elo, t2elo, year, beta = 0.9) {
    // const mu_tier = {1: +1.5, 2: +0.3, 3: -0.3, 4: -0.6};

    const sH = elo_to_skill(t1elo, beta);
    const sA = elo_to_skill(t2elo, beta);

    const rho = 0.997;
    const x_minus = [
      rho * sH + (1 - rho), //* mu_tier[tier],
      rho * sA + (1 - rho), //* mu_tier[tier]
    ];

    let p = predict_probs(x_minus[0], x_minus[1], year, beta);
    p = safe_probs(p, 1e-3);
    return p; // [home win, draw, away win]
  }

  const api = { probabilities };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.MatchProbabilities = api;
})(globalThis);
