---
layout: page
permalink: /tableProbs
title: League Table Predictor
description: Probabilistic league table predictor for each English football league tier.
nav: false
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>

  <style>
    .tier-block { margin: 18px 0 34px 0; }
    .tier-title { margin: 6px 0 10px 0; }
    .meta { color: #444; font-size: 0.95em; margin: 4px 0 10px 0; }

    .status {
      padding: 10px 12px;
      background: #f6f6f6;
      border-radius: 10px;
      border: 1px solid #e6e6e6;
      margin: 12px 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace;
      font-size: 12px;
      white-space: pre-wrap;
    }

    /* Full-bleed container: lets the table area exceed the GitHub Pages content width */
    .full-bleed {
      width: 100vw;
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      padding-left: 12px;
      padding-right: 12px;
    }

    .table-scroll {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: 10px;
      border: 1px solid #e6e6e6;
      background: #f0f0f0;
      padding: 10px;
    }

    /* Create a gap between all cells */
    .probTable {
      width: 100%;
      border-collapse: separate !important;
      border-spacing: 6px 6px;     /* cell gaps */
      background: transparent;
      table-layout: fixed;
      min-width: 980px;
    }

    .probTable thead th {
      background-color: #3b5fd0;
      color: #fff;
      text-transform: uppercase;
      text-align: center;
      font-weight: 700;
      padding: 6px 8px;
      font-size: 12px;
      white-space: nowrap;
      border-radius: 8px;
    }

    /* Column widths */
    .probTable thead th.posHead { width: 56px; }
    .probTable thead th.teamHead { text-align: left; width: 150px; }

    .probTable tbody td {
      background: #ffffff;
      border: none !important;
      padding: 6px 8px;
      line-height: 1.2;
      color: #000;
      font-size: 12px;
      text-align: center;
      white-space: nowrap;
      border-radius: 8px;
    }

    /* Position chip */
    .pos-cell {
      background-color: #b2182b !important;
      color: #fff !important;
      font-weight: 800;
      text-align: center !important;
    }

    /* Team cell (white background, dark text) */
    .team-cell {
      background-color: #ffffff !important;
      color: #333 !important;
      font-weight: 800;
      text-align: left !important;
      width: 150px;
    }

    .team-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
    }

    .team-logo {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      flex: 0 0 auto;
      background: rgba(0,0,0,0.06);
    }

    .team-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333 !important; /* keep constant across theme toggles */
    }

    /* If theme styles links, lock those too */
    .team-cell a,
    .team-cell a:visited,
    .team-cell a:hover,
    .team-cell a:active {
      color: #333 !important;
      text-decoration: none !important;
    }

    /* Max cell full red */
    .max-cell {
      background-color: #b2182b !important;
      color: #fff !important;
      font-weight: 800;
    }

    .controls-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin: 6px 0 10px 0;
    }

    .btn {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid #cfcfcf;
      background: #ffffff;
      color: #333;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
    }
    .btn:hover { background: #f3f3f3; }

    .toggle-btn { margin-left: auto; }

    .smallnote { color: #666; font-size: 0.9em; margin-top: 6px; }

    /* View toggling */
    .view-mobile .full-matrix-wrap { display: none; }
    .view-mobile .mobile-summary-wrap { display: block; }

    .view-full .full-matrix-wrap { display: block; }
    .view-full .mobile-summary-wrap { display: none; }

    /* Mobile table can be narrower */
    .mobile-summary-wrap .probTable { min-width: 260px; table-layout: auto; }
    .mobile-summary-wrap .probTable thead th.teamHead { width: 120px; }
  
    .example-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .example-modal.open { display: flex; }

    .example-modal__inner {
      background: #fff;
      border-radius: 12px;
      width: min(700px, 90vw);
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
      display: flex;
      flex-direction: column;
    }

    .example-modal__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #e6e6e6;
      background: #f7f7f7;
    }

    .example-modal__title {
      font-weight: 800;
      font-size: 14px;
    }

    .example-modal__close {
      border: 1px solid #cfcfcf;
      background: #fff;
      border-radius: 8px;
      padding: 4px 8px;
      cursor: pointer;
      font-weight: 700;
      font-size: 12px;
    }

    .example-modal__body {
      padding: 12px 16px;
      overflow: auto;
    }

    .example-section {
      margin-bottom: 16px;
    }

    .example-team-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 800;
      margin: 8px 0;
    }

    .example-team-logo {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(0,0,0,0.06);
    }

    .example-match {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 10px;
      padding: 6px 8px;
      border: 1px solid #e6e6e6;
      border-radius: 8px;
      margin: 6px 0;
      background: #fff;
      font-size: 12px;
    }

    .example-match__result {
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 6px;
      background: #f0f0f0;
      min-width: 72px;
      text-align: center;
      white-space: nowrap;
    }

    .example-match__meta {
      color: #555;
    }

    .example-match__teams {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 2px;
      width: 100%;
    }

    .example-team {
      display: flex;
      align-items: center;
      gap: 3px;
      min-width: 0;
    }

    .example-team--away {
      justify-content: flex-end;
    }

    .example-team-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 120px;
    }

    .example-vs {
      color: #666;
      font-weight: 700;
      text-align: center;
      min-width: 12px;
    }

    .clickable-cell { cursor: pointer; }
    .clickable-cell:hover { outline: 2px solid rgba(59, 95, 208, 0.4); }

  </style>
</head>

<body>
Position probabilities for the season.

<div class="meta">Based on 100k Monte Carlo simulations of the remaining fixtures, assuming team strengths remain constant.</div>
<div class="meta" id="asof-date"></div>

  <div id="tables"></div>


  <div id="example-modal" class="example-modal" aria-hidden="true">
    <div class="example-modal__inner">
      <div class="example-modal__header">
        <div id="example-modal-title" class="example-modal__title"></div>
        <button id="example-modal-close" class="example-modal__close" type="button">Close</button>
      </div>
      <div id="example-modal-body" class="example-modal__body"></div>
    </div>
  </div>

  <script>
    // ------------------------------------------------------------
    // Config
    // ------------------------------------------------------------
    const CSV_URL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglandLeagueResults_wRanks.csv";
    const PRECOMPUTED_URL = "{{ '/assets/data/tableProbs.json' | relative_url }}";
    const LOGO_CSV_URL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglishTeamLogos.csv";
    const DEDUCT_CSV_URL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglishTeamPointDeductions.csv";
	const SHORTNAME_CSV_URL =
    "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglishTeamActivePeriods.csv";
    const TIERS = [1, 2, 3, 4];

    window.tableProbsExamples = {};
    window.tableProbsFixtures = {};
    window.tableProbsTeams = {};
    window.tableProbsBasePoints = {};

    // ------------------------------------------------------------
    // Status logging
    // ------------------------------------------------------------
    function logStatus(msg) {
      const el = document.getElementById("status");
      if (!el) return;
      el.textContent += (el.textContent.endsWith("\n") || el.textContent === "" ? "" : "\n") + msg;
    }

    // ------------------------------------------------------------
    // Small-screen detection
    // ------------------------------------------------------------
    function isSmallScreen() {
      return window.matchMedia && window.matchMedia("(max-width: 720px)").matches;
    }

    // ------------------------------------------------------------
    // Load team logos (same pattern as your other pages)
    // ------------------------------------------------------------
    function loadTeamLogos() {
      return fetch(LOGO_CSV_URL)
        .then(res => res.text())
        .then(text => {
          const rows = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
          const dict = {};
          rows.forEach(row => {
            if (row.Team && row.LogoURL) dict[String(row.Team).trim()] = String(row.LogoURL).trim();
          });
          window.teamLogos = dict;
        })
        .catch(() => { window.teamLogos = {}; });
    }
	
	// ------------------------------------------------------------
    // Load short names
    // Returns: mapping from full team name to short name (for displaying in table)
    // ------------------------------------------------------------
	function loadTeamShortNames() {
	  return fetch(SHORTNAME_CSV_URL)
		.then(res => res.text())
		.then(text => {
		  const rows = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
		  const map = {};
		  rows.forEach(r => {
			if (r.Team && r.ShortName) {
			  map[String(r.Team).trim()] = String(r.ShortName).trim();
			}
		  });
		  window.teamShortNames = map;
		})
		.catch(() => { window.teamShortNames = {}; });
	}
	
	function getShortTeamName(team) {
	  const m = window.teamShortNames || {};
	  return m[team] || team; // fallback to full name
	}

    // ------------------------------------------------------------
    // Load point deductions/additions (signed)
    // Returns: window.pointAdjustmentsBySeason[season][team] = total adjustment
    // ------------------------------------------------------------
    function loadPointDeductions() {
      return fetch(DEDUCT_CSV_URL)
        .then(res => res.text())
        .then(text => {
          const rows = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
          const seasonMap = {};
          rows.forEach(r => {
            const season = String(r.Season || "").trim();
            const team = String(r.Team || "").trim();
            if (!season || !team) return;

            const pts = parseFloat(r.Pts_deducted);
            if (!Number.isFinite(pts) || pts === 0) return;

            if (!seasonMap[season]) seasonMap[season] = {};
            if (!seasonMap[season][team]) seasonMap[season][team] = 0;
            seasonMap[season][team] -= pts;
          });
          window.pointAdjustmentsBySeason = seasonMap;
        })
        .catch(() => { window.pointAdjustmentsBySeason = {}; });
    }

    function getSeasonPointAdjustment(seasonStr, teamName) {
      const s = String(seasonStr || "").trim();
      const t = String(teamName || "").trim();
      const bySeason = window.pointAdjustmentsBySeason || {};
      const m = bySeason[s] || {};
      return Number.isFinite(m[t]) ? m[t] : 0;
    }

    // ------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------
    function seasonStartYearFromSeasonStr(seasonStr) {
      const m = String(seasonStr || "").match(/^(\d{4})\s*\/\s*(\d{4})$/);
      if (m) return parseInt(m[1], 10);
      const m2 = String(seasonStr || "").match(/(\d{4})/);
      return m2 ? parseInt(m2[1], 10) : (new Date()).getFullYear();
    }

    function toFloat(x, fallback = NaN) {
      const v = parseFloat(x);
      return Number.isFinite(v) ? v : fallback;
    }

    function clamp(x, lo, hi) {
      return Math.max(lo, Math.min(hi, x));
    }

    function formatAsOfDate(dateStr) {
      const s = String(dateStr || "").trim();
      if (!s) return "";
      const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (m) return `${m[3]}/${m[2]}/${m[1]}`;
      return s;
    }

    function safeProbs(arr, floor = 1e-3) {
      const p = arr.map(v => clamp(+v, floor, 1 - floor));
      const s = p.reduce((a, b) => a + b, 0);
      return p.map(v => v / s);
    }

    // Table cell formatting:
    // - impossible => "-"
    // - zero but possible => "<1%"
    // - true 100% is "100%"
    function formatPctCell(p, impossible = false) {
      if (impossible) return "-";
      if (!Number.isFinite(p)) return "-";

      // Exactly 0 but still possible
      if (p === 0) return "<1%";

      // Exactly 1 (i.e. 100%)
      if (p === 1) return "100%";

      const pct = Math.round(100 * p);

      // Rounds to 0 but not actually 0
      if (pct === 0) return "<1%";

      // Rounds to 100 but not actually 1
      if (pct === 100) return ">99%";

      return `${pct}%`;
    }

    // Same formatting for mobile summary cells
    function pctIntOrTinyOrDash(p) {
      return formatPctCell(p, false);
    }

    // ------------------------------------------------------------
    // Match probabilities (port of matchProbs.md logic)
    // ------------------------------------------------------------
    const ELO_PER_NAT_LOGIT = 400.0 / Math.log(10.0);

    function eloToSkill(elo, beta = 0.9, base = 1000.0, mult = 2.0, offset = 0.0) {
      const S = ELO_PER_NAT_LOGIT * beta * mult;
      return (elo - base) / S + offset;
    }

    function eraProbsFromYear(year) {
      const h = (year - 1888) * (-0.141579) + 60.5636;
      const a = (year - 1888) * ( 0.075714) + 19.4769;
      const d = (year - 1888) * ( 0.065851) + 19.9608;
      let pH = Math.max(h, 0.001);
      let pD = Math.max(d, 0.001);
      let pA = Math.max(a, 0.001);
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

    // ------------------------------------------------------------
    // Points so far (with point deductions/additions applied)
    // ------------------------------------------------------------
    function computePointsSoFar(playedRows, seasonStr) {
      const teams = new Set();
      for (const r of playedRows) { teams.add(r.HomeTeam); teams.add(r.AwayTeam); }
      const pts = {};
      for (const t of teams) pts[t] = 0;

      for (const r of playedRows) {
        const ht = r.HomeTeam, at = r.AwayTeam;
        const res = String(r.Result || "");
        if (res === "H") pts[ht] += 3;
        else if (res === "A") pts[at] += 3;
        else if (res === "D") { pts[ht] += 1; pts[at] += 1; }
      }

      // apply season point adjustments
      for (const t of teams) {
        pts[t] += getSeasonPointAdjustment(seasonStr, t);
      }
      return pts;
    }

    // ------------------------------------------------------------
    // Latest Elo by scanning backwards (home/away aware)
    // ------------------------------------------------------------
    function latestElosByScanningBackwards(seasonTierRows, teams) {
      const need = new Set(teams);
      const elo = {};
      for (let i = seasonTierRows.length - 1; i >= 0; i--) {
        if (need.size === 0) break;
        const r = seasonTierRows[i];
        const ht = r.HomeTeam, at = r.AwayTeam;

        if (need.has(ht)) {
          const v = toFloat(r.HomeRank_after, NaN);
          if (Number.isFinite(v)) { elo[ht] = v; need.delete(ht); }
        }
        if (need.has(at)) {
          const v = toFloat(r.AwayRank_after, NaN);
          if (Number.isFinite(v)) { elo[at] = v; need.delete(at); }
        }
      }
      return elo;
    }

    // ------------------------------------------------------------
    // Remaining fixtures inferred: all unplayed ordered pairs (home,away)
    // ------------------------------------------------------------
    function inferRemainingFixturesDoubleRoundRobin(playedRows, teams) {
      const playedPairs = new Set();
      for (const r of playedRows) playedPairs.add(r.HomeTeam + "|||" + r.AwayTeam);

      const rem = [];
      for (const h of teams) {
        for (const a of teams) {
          if (h === a) continue;
          const key = h + "|||" + a;
          if (!playedPairs.has(key)) rem.push([h, a]);
        }
      }
      return rem;
    }

    // ------------------------------------------------------------
    // Monte Carlo position probabilities (random tie-break on points)
    // ------------------------------------------------------------
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
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
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

    // ------------------------------------------------------------
    // Shading + logos
    // ------------------------------------------------------------
    function applyRowHeat(td, p, maxP) {
      // Keep "-" and "<1%" white (i.e. anything that rounds to 0 or is <=0)
      if (!Number.isFinite(p) || p <= 0 || !Number.isFinite(maxP) || maxP <= 0) return;
      if (Math.round(100 * p) === 0) return;

      const ratio = clamp(p / maxP, 0, 1);
      const alpha = 0.10 + 0.90 * ratio;
      td.style.backgroundColor = `rgba(178, 24, 43, ${alpha})`;

      // For higher alpha, white text; otherwise let default stand
      if (alpha > 0.55) td.style.color = "#fff";
      td.style.fontWeight = (ratio > 0.80) ? "800" : "600";
    }

    function getLogoUrl(teamName) {
      const logos = window.teamLogos || {};
      const key = String(teamName || "").trim();
      return logos[key] || "";
    }

    // ------------------------------------------------------------
    // Mobile summary rows: Team | 1 | Top6 | Bottom3
    // ------------------------------------------------------------
    function buildMobileSummaryRows(teams, posProbs, impossibleByTeam) {
      const N = teams.length;
      const topK = Math.min(6, N);
      const bottomK = Math.min(3, N);

      const ordered = teams.map(t => {
        let ep = 0;
        for (let pos = 1; pos <= N; pos++) ep += pos * (posProbs[t][pos] || 0);
        return { team: t, ep };
      }).sort((a,b) => a.ep - b.ep);

      return ordered.map(o => {
        const t = o.team;
        const p1 = posProbs[t][1] || 0;
        const imp = (impossibleByTeam && impossibleByTeam[t]) ? impossibleByTeam[t] : [];

        let top6 = 0;
        let top6AllImpossible = true;
        for (let pos = 1; pos <= topK; pos++) {
          top6 += (posProbs[t][pos] || 0);
          if (!imp[pos]) top6AllImpossible = false;
        }

        let bottom3 = 0;
        let bottom3AllImpossible = true;
        for (let pos = N - bottomK + 1; pos <= N; pos++) {
          bottom3 += (posProbs[t][pos] || 0);
          if (!imp[pos]) bottom3AllImpossible = false;
        }

        return { team: t, p1, top6, bottom3, imp1: !!imp[1], top6AllImpossible, bottom3AllImpossible };
      });
    }

    // ------------------------------------------------------------
    // Download as image: ALWAYS capture the full matrix element
    // ------------------------------------------------------------
	async function downloadElementAsImage(elementToCapture, filenameBase) {
	  const temp = document.createElement("div");
	  temp.style.position = "fixed";
	  temp.style.left = "-9999px";
	  temp.style.top = "0";
	  temp.style.padding = "16px";
	  temp.style.backgroundColor = "#ffffff";

	  // Clone
	  const clone = elementToCapture.cloneNode(true);
	  clone.querySelectorAll("button").forEach(b => b.remove());
	  clone.style.display = "block";

	  // IMPORTANT: unwrap scroll containers in the clone
	  const scrolls = clone.querySelectorAll(".table-scroll");
	  scrolls.forEach(s => {
		s.style.overflow = "visible";
		s.style.maxWidth = "none";
		s.style.width = "fit-content";
	  });

	  // The full-bleed 100vw trick hurts capture; neutralise it in the clone
	  const bleeds = clone.querySelectorAll(".full-bleed");
	  bleeds.forEach(b => {
		b.style.width = "fit-content";
		b.style.marginLeft = "0";
		b.style.marginRight = "0";
		b.style.paddingLeft = "0";
		b.style.paddingRight = "0";
	  });

	  // Expand to the full table width
	  const table = clone.querySelector("table.probTable");
	  if (table) {
		// Ensure table is laid out at its intrinsic width
		table.style.width = "max-content";
		table.style.minWidth = "unset";
	  }

	  temp.appendChild(clone);
	  document.body.appendChild(temp);

	  // After it’s in the DOM, we can measure true scrollWidth
	  let captureWidth = 1200;
	  let captureHeight = 800;
	  if (table) {
		captureWidth = Math.ceil(table.scrollWidth) + 40;   // padding buffer
		captureHeight = Math.ceil(table.scrollHeight) + 40;
		temp.style.width = `${captureWidth}px`;
	  }

	  const canvas = await html2canvas(temp, {
		backgroundColor: "#ffffff",
		scale: window.devicePixelRatio > 1 ? 2 : 1,
		useCORS: true,
		windowWidth: captureWidth,
		windowHeight: captureHeight
	  });

	  document.body.removeChild(temp);

	  const safe = (filenameBase || "table")
		.replace(/[\/\\:]+/g, "-")
		.replace(/\s+/g, "_")
		.replace(/[^A-Za-z0-9_-]/g, "");

	  const filename = `${safe}.png`;

	  canvas.toBlob((blob) => {
		if (!blob) return;
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		URL.revokeObjectURL(a.href);
		a.remove();
	  }, "image/png");
	}



    function buildExampleData(teams, fixtures, results) {
      const perTeam = {};
      for (const t of teams) perTeam[t] = [];

      for (let i = 0; i < fixtures.length; i++) {
        const pair = fixtures[i];
        if (!pair) continue;
        const h = teams[pair[0]];
        const a = teams[pair[1]];
        const code = results[i];

        const homeResult = code === 0 ? "W" : code === 1 ? "D" : "L";
        const awayResult = code === 2 ? "W" : code === 1 ? "D" : "L";

        const homePoints = code === 0 ? 3 : code === 1 ? 1 : 0;
        const awayPoints = code === 2 ? 3 : code === 1 ? 1 : 0;

        perTeam[h].push({
          opponent: a,
          isHome: true,
          result: homeResult,
          points: homePoints,
          home: h,
          away: a,
          code,
        });
        perTeam[a].push({
          opponent: h,
          isHome: false,
          result: awayResult,
          points: awayPoints,
          home: h,
          away: a,
          code,
        });
      }

      return perTeam;
    }

    function createMatchRow(entry) {
      const row = document.createElement("div");
      row.className = "example-match";

      const homeLogo = getLogoUrl(entry.home);
      const awayLogo = getLogoUrl(entry.away);

      const homeImg = document.createElement("img");
      homeImg.className = "team-logo";
      homeImg.src = homeLogo;
      homeImg.alt = entry.home;
      homeImg.loading = "lazy";
      homeImg.setAttribute("crossorigin", "anonymous");
      homeImg.onerror = () => { homeImg.style.display = "none"; };

      const awayImg = document.createElement("img");
      awayImg.className = "team-logo";
      awayImg.src = awayLogo;
      awayImg.alt = entry.away;
      awayImg.loading = "lazy";
      awayImg.setAttribute("crossorigin", "anonymous");
      awayImg.onerror = () => { awayImg.style.display = "none"; };

      const result = document.createElement("div");
      result.className = "example-match__result";
      if (entry.result === "W") result.textContent = entry.isHome ? "Home Win" : "Away Win";
      else if (entry.result === "D") result.textContent = "Draw";
      else result.textContent = entry.isHome ? "Home Lose" : "Away Lose";

      const teamsRow = document.createElement("div");
      teamsRow.className = "example-match__teams";

      const homeWrap = document.createElement("div");
      homeWrap.className = "example-team";
      const homeName = document.createElement("div");
      homeName.className = "example-team-name";
      homeName.textContent = entry.home;
      homeWrap.appendChild(homeImg);
      homeWrap.appendChild(homeName);

      const awayWrap = document.createElement("div");
      awayWrap.className = "example-team example-team--away";
      const awayName = document.createElement("div");
      awayName.className = "example-team-name";
      awayName.textContent = entry.away;
      awayWrap.appendChild(awayName);
      awayWrap.appendChild(awayImg);

      const vs = document.createElement("div");
      vs.className = "example-vs";
      vs.textContent = "vs";

      teamsRow.appendChild(homeWrap);
      teamsRow.appendChild(vs);
      teamsRow.appendChild(awayWrap);

      row.appendChild(teamsRow);
      row.appendChild(result);

      return row;
    }

    function showExampleModal(divisionName, seasonStr, team, pos) {
      const key = `${seasonStr}|${divisionName}`;
      const teams = window.tableProbsTeams[key] || [];
      const fixtures = window.tableProbsFixtures[key] || [];
      const examples = window.tableProbsExamples[key] || {};
      let results = examples[team] ? examples[team][pos] : null;
      if (!results || results.length !== fixtures.length) {
        results = findExampleOnDemand(divisionName, seasonStr, team, pos);
        if (results) {
          if (!examples[team]) examples[team] = {};
          examples[team][pos] = results;
        }
      }

      const modal = document.getElementById("example-modal");
      const title = document.getElementById("example-modal-title");
      const body = document.getElementById("example-modal-body");
      if (!modal || !title || !body) return;

      title.textContent = `${team} finishing ${pos} in ${divisionName} (${seasonStr})`;
      body.innerHTML = "";

      if (!results || !fixtures.length || !teams.length) {
        const p = document.createElement("div");
        p.textContent = "No example outcome was found for this position after additional simulations.";
        body.appendChild(p);
      } else {
        const perTeam = buildExampleData(teams, fixtures, results);

        const selected = document.createElement("div");
        selected.className = "example-section";
        const selHeader = document.createElement("div");
        selHeader.className = "example-team-header";
        const selLogo = document.createElement("img");
        selLogo.className = "example-team-logo";
        selLogo.src = getLogoUrl(team);
        selLogo.alt = team;
        selLogo.loading = "lazy";
        selLogo.setAttribute("crossorigin", "anonymous");
        selLogo.onerror = () => { selLogo.style.display = "none"; };
        selHeader.appendChild(selLogo);

        const totalPts = (perTeam[team] || []).reduce((sum, e) => sum + (e.points || 0), 0);
        selHeader.appendChild(document.createTextNode(`${team} (${totalPts} pts)`));
        selected.appendChild(selHeader);

        for (const entry of perTeam[team] || []) {
          selected.appendChild(createMatchRow(entry));
        }
        body.appendChild(selected);

        const others = teams.filter(t => t !== team).sort();
        for (const t of others) {
          const section = document.createElement("div");
          section.className = "example-section";

          const header = document.createElement("div");
          header.className = "example-team-header";
          const logo = document.createElement("img");
          logo.className = "example-team-logo";
          logo.src = getLogoUrl(t);
          logo.alt = t;
          logo.loading = "lazy";
          logo.setAttribute("crossorigin", "anonymous");
          logo.onerror = () => { logo.style.display = "none"; };
          header.appendChild(logo);
          const totalPts = (perTeam[t] || []).reduce((sum, e) => sum + (e.points || 0), 0);
          header.appendChild(document.createTextNode(`${t} (${totalPts} pts)`));
          section.appendChild(header);

          for (const entry of perTeam[t] || []) {
            section.appendChild(createMatchRow(entry));
          }

          body.appendChild(section);
        }
      }

      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    }


    function simulateExample(teams, fixtures, basePoints, rng) {
      const N = teams.length;
      const pts = new Float64Array(N);
      for (let i = 0; i < N; i++) pts[i] = basePoints[i] || 0;

      const results = new Uint8Array(fixtures.length);
      for (let i = 0; i < fixtures.length; i++) {
        const f = fixtures[i];
        const r = rng();
        const pH = f[2], pD = f[3];
        if (r < pH) {
          pts[f[0]] += 3;
          results[i] = 0;
        } else if (r < pH + pD) {
          pts[f[0]] += 1;
          pts[f[1]] += 1;
          results[i] = 1;
        } else {
          pts[f[1]] += 3;
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

    function findExampleOnDemand(divisionName, seasonStr, team, pos) {
      const key = `${seasonStr}|${divisionName}`;
      const teams = window.tableProbsTeams[key] || [];
      const fixtures = window.tableProbsFixtures[key] || [];
      const basePoints = window.tableProbsBasePoints[key] || [];
      if (!teams.length || !fixtures.length) return null;

      const teamIndex = teams.indexOf(team);
      if (teamIndex < 0) return null;

      const seedKey = `${key}|${team}|${pos}|ondemand`;
      const seedFn = hashStringToSeed(seedKey);
      const rng = mulberry32(seedFn());

      const maxTries = 20000;
      for (let i = 0; i < maxTries; i++) {
        const sim = simulateExample(teams, fixtures, basePoints, rng);
        if (sim.indices[pos - 1] === teamIndex) return sim.results;
      }
      return null;
    }

    function setupExampleModal() {
      const modal = document.getElementById("example-modal");
      const closeBtn = document.getElementById("example-modal-close");
      if (!modal || !closeBtn) return;

      closeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("open");
          modal.setAttribute("aria-hidden", "true");
        }
      });
    }

    // ------------------------------------------------------------
    // Rendering: full matrix + mobile summary with toggle
    // ------------------------------------------------------------
    function renderTeamPositionMatrix(container, divisionName, seasonStr, teams, posProbs, impossibleByTeam) {
      const N = teams.length;

      const block = document.createElement("div");
      block.className = "tier-block";
      block.classList.add(isSmallScreen() ? "view-mobile" : "view-full");

      const h = document.createElement("h2");
      h.className = "tier-title";
      h.textContent = `${divisionName}`;
      block.appendChild(h);

      // Row ordering for both views: expected position
      const expectedPos = teams.map(t => {
        let ep = 0;
        for (let pos = 1; pos <= N; pos++) ep += pos * (posProbs[t][pos] || 0);
        return { team: t, ep };
      }).sort((a, b) => a.ep - b.ep);

      // ===== Full matrix wrap (created early so download can always target it) =====
      const fullMatrixWrap = document.createElement("div");
      fullMatrixWrap.className = "full-matrix-wrap";

      const fullBleed = document.createElement("div");
      fullBleed.className = "full-bleed";

      const fullScroll = document.createElement("div");
      fullScroll.className = "table-scroll";

      const fullTable = document.createElement("table");
      fullTable.className = "probTable";

      const thead = document.createElement("thead");
      const headCells = [];
      headCells.push(`<th class="posHead">POS</th>`);
      headCells.push(`<th class="teamHead">TEAM</th>`);
      for (let pos = 1; pos <= N; pos++) headCells.push(`<th>${pos}</th>`);
      thead.innerHTML = `<tr>${headCells.join("")}</tr>`;
      fullTable.appendChild(thead);

      const tbody = document.createElement("tbody");

      let rank = 1;
      for (const row of expectedPos) {
        const t = row.team;

        // max probability in row (before rounding)
        let maxP = 0;
        for (let pos = 1; pos <= N; pos++) {
          const p = (posProbs[t] && posProbs[t][pos]) ? posProbs[t][pos] : 0;
          if (p > maxP) maxP = p;
        }

        const tr = document.createElement("tr");

        const tdPos = document.createElement("td");
        tdPos.className = "pos-cell";
        tdPos.textContent = String(rank);
        tr.appendChild(tdPos);

        const tdTeam = document.createElement("td");
        tdTeam.className = "team-cell";

        const wrap = document.createElement("div");
        wrap.className = "team-wrap";

        const logoUrl = getLogoUrl(t);
        if (logoUrl) {
          const img = document.createElement("img");
          img.className = "team-logo";
          img.src = logoUrl;
          img.alt = t;
          img.loading = "lazy";
          img.setAttribute("crossorigin", "anonymous");
          img.onerror = () => { img.style.display = "none"; };
          wrap.appendChild(img);
        } else {
          const ph = document.createElement("div");
          ph.className = "team-logo";
          wrap.appendChild(ph);
        }

        const name = document.createElement("div");
        name.className = "team-name";
        name.textContent = getShortTeamName(t);
        wrap.appendChild(name);

        tdTeam.appendChild(wrap);
        tr.appendChild(tdTeam);

        for (let pos = 1; pos <= N; pos++) {
          const p = (posProbs[t] && posProbs[t][pos]) ? posProbs[t][pos] : 0;
          const impossible = Boolean(impossibleByTeam && impossibleByTeam[t] && impossibleByTeam[t][pos]);
          const td = document.createElement("td");
          td.textContent = formatPctCell(p, impossible);

          if (!impossible) {
            td.classList.add("clickable-cell");
            td.dataset.team = t;
            td.dataset.pos = String(pos);
            td.dataset.division = divisionName;
            td.dataset.season = seasonStr;

            td.addEventListener("click", () => {
              showExampleModal(divisionName, seasonStr, t, pos);
            });

            if (p === maxP && maxP > 0) {
              td.classList.add("max-cell");
            } else {
              applyRowHeat(td, p, maxP);
            }
          }

          tr.appendChild(td);
        }

        tbody.appendChild(tr);
        rank += 1;
      }

      fullTable.appendChild(tbody);
      fullScroll.appendChild(fullTable);
      fullBleed.appendChild(fullScroll);
      fullMatrixWrap.appendChild(fullBleed);

      // ===== Mobile summary wrap =====
      const mobileWrap = document.createElement("div");
      mobileWrap.className = "mobile-summary-wrap";

      const mobBleed = document.createElement("div");
      mobBleed.className = "full-bleed";

      const mobScroll = document.createElement("div");
      mobScroll.className = "table-scroll";

      const mobTable = document.createElement("table");
      mobTable.className = "probTable";

      mobTable.innerHTML = `
        <thead>
          <tr>
            <th class="teamHead">TEAM</th>
            <th>1st Place</th>
            <th>TOP 6</th>
            <th>BOTTOM 3</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

      const mobBody = mobTable.querySelector("tbody");
      const mobRows = buildMobileSummaryRows(teams, posProbs, impossibleByTeam);

      for (const r of mobRows) {
        const tr = document.createElement("tr");

        const tdTeam = document.createElement("td");
        tdTeam.className = "team-cell";

        const wrap = document.createElement("div");
        wrap.className = "team-wrap";

        const logoUrl = getLogoUrl(r.team);
        if (logoUrl) {
          const img = document.createElement("img");
          img.className = "team-logo";
          img.src = logoUrl;
          img.alt = r.team;
          img.loading = "lazy";
          img.setAttribute("crossorigin", "anonymous");
          img.onerror = () => { img.style.display = "none"; };
          wrap.appendChild(img);
        } else {
          const ph = document.createElement("div");
          ph.className = "team-logo";
          wrap.appendChild(ph);
        }

        const name = document.createElement("div");
        name.className = "team-name";
        name.textContent = getShortTeamName(r.team);
        wrap.appendChild(name);

        tdTeam.appendChild(wrap);

        const td1 = document.createElement("td");
        const imp1 = Boolean(impossibleByTeam && impossibleByTeam[r.team] && impossibleByTeam[r.team][1]);
        td1.textContent = formatPctCell(r.p1, imp1);

        const tdTop = document.createElement("td");
        tdTop.textContent = formatPctCell(r.top6, r.top6AllImpossible);

        const tdBot = document.createElement("td");
        tdBot.textContent = formatPctCell(r.bottom3, r.bottom3AllImpossible);

        tr.appendChild(tdTeam);
        tr.appendChild(td1);
        tr.appendChild(tdTop);
        tr.appendChild(tdBot);

        mobBody.appendChild(tr);
      }

      mobScroll.appendChild(mobTable);
      mobBleed.appendChild(mobScroll);
      mobileWrap.appendChild(mobBleed);

      // ===== Controls (download always uses fullMatrixWrap) =====
      const controls = document.createElement("div");
      controls.className = "controls-row";

      //const meta = document.createElement("div");
      //meta.className = "meta";
      //meta.textContent = `Season: ${seasonStr}`;
      //controls.appendChild(meta);

      const dlBtn = document.createElement("button");
      dlBtn.className = "btn";
      dlBtn.type = "button";
      dlBtn.textContent = "Download table as image";
      dlBtn.addEventListener("click", () => {
        const base = `position-odds-${seasonStr}-${divisionName}`;
        downloadElementAsImage(fullMatrixWrap, base);
      });
      controls.appendChild(dlBtn);

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn toggle-btn";
      toggleBtn.type = "button";

      function syncToggleText() {
        toggleBtn.textContent = block.classList.contains("view-mobile")
          ? "Show full table"
          : "Show mobile view";
      }
      syncToggleText();

      toggleBtn.addEventListener("click", () => {
        if (block.classList.contains("view-mobile")) {
          block.classList.remove("view-mobile");
          block.classList.add("view-full");
        } else {
          block.classList.remove("view-full");
          block.classList.add("view-mobile");
        }
        syncToggleText();
      });
      controls.appendChild(toggleBtn);

      block.appendChild(controls);

      // Append both views
      block.appendChild(fullMatrixWrap);
      block.appendChild(mobileWrap);

      const note = document.createElement("div");
      note.className = "smallnote";
      note.textContent = "";
      block.appendChild(note);

      container.appendChild(block);
    }


    function renderFromPrecomputed(data) {
      if (!data || !data.season || !Array.isArray(data.tiers)) return false;

      const tablesDiv = document.getElementById("tables");
      const asof = document.getElementById("asof-date");
      if (asof && data.last_result_date) {
        asof.textContent = `Table based on results up to and including ${formatAsOfDate(data.last_result_date)}.`;
      }

      for (const tierData of data.tiers) {
        const teams = Array.isArray(tierData.teams) ? tierData.teams : [];
        if (!teams.length) continue;

        const posProbs = {};
        for (const t of teams) {
          const arr = (tierData.posProbs && tierData.posProbs[t]) ? tierData.posProbs[t] : [];
          posProbs[t] = Float64Array.from(arr);
        }

        const divisionName = tierData.division || `Tier ${tierData.tier || ""}`.trim();
        const impossibleByTeam = tierData.impossible || {};
        const key = `${data.season}|${divisionName}`;
        window.tableProbsFixtures[key] = tierData.fixtures || [];
        window.tableProbsExamples[key] = tierData.examples || {};
        window.tableProbsTeams[key] = teams;
        window.tableProbsBasePoints[key] = tierData.basePoints || [];

        renderTeamPositionMatrix(tablesDiv, divisionName, data.season, teams, posProbs, impossibleByTeam);
      }

      return true;
    }

    // ------------------------------------------------------------
    // Main
    // ------------------------------------------------------------
    document.addEventListener("DOMContentLoaded", async () => {
      await loadTeamLogos();
      //logStatus(`Team logos loaded: ${Object.keys(window.teamLogos || {}).length}`);
	  
	  await loadTeamShortNames();

      //logStatus("Fetching point deductions/additions…");
      await loadPointDeductions();

      setupExampleModal();
      //logStatus(`Point adjustment seasons loaded: ${Object.keys(window.pointAdjustmentsBySeason || {}).length}`);
      //logStatus("");

      try {
        const res = await fetch(PRECOMPUTED_URL, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (renderFromPrecomputed(data)) return;
        }
      } catch (err) {
        // Fallback to live calculations
      }

      //logStatus("Fetching match CSV…");

      Papa.parse(CSV_URL, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data || [];
          if (!data.length) { logStatus("No rows loaded."); return; }
          //logStatus(`Loaded rows: ${data.length}`);

          // Latest season from last row
          const last = data[data.length - 1];
          const latestSeason = last.Season;
          const seasonStartYear = seasonStartYearFromSeasonStr(latestSeason);
          const asof = document.getElementById("asof-date");
          if (asof && last.Date) {
            asof.textContent = `Table based on results up to and including ${formatAsOfDate(last.Date)}.`;
          }
          //logStatus(`Latest season (last row): ${latestSeason}`);
          //logStatus(`Season start year: ${seasonStartYear}`);
          //logStatus("");

          const tablesDiv = document.getElementById("tables");

          for (const tier of TIERS) {
            //logStatus(`Tier ${tier}: filtering…`);

            const seasonTier = data.filter(r =>
              String(r.Season) === String(latestSeason) &&
              String(r.Tier) === String(tier)
            );

            if (!seasonTier.length) {
              logStatus(`Tier ${tier}: no rows found for ${latestSeason}.`);
              logStatus("");
              continue;
            }

            const divisionSet = new Set(seasonTier.map(r => r.Division).filter(Boolean));
            const divisionName = divisionSet.size ? Array.from(divisionSet)[0] : `Tier ${tier}`;

            const played = seasonTier.filter(r => r.Result === "H" || r.Result === "D" || r.Result === "A");
            //logStatus(`Tier ${tier}: played matches = ${played.length}`);

            const teamSet = new Set();
            for (const r of played) { teamSet.add(r.HomeTeam); teamSet.add(r.AwayTeam); }
            const teams = Array.from(teamSet).sort();
            const N = teams.length;
            //logStatus(`Tier ${tier}: teams = ${N}`);
            if (N < 2) { logStatus(`Tier ${tier}: not enough teams.`); logStatus(""); continue; }

            // points so far INCLUDING deductions/additions
            const pts = computePointsSoFar(played, latestSeason);

            const elos = latestElosByScanningBackwards(seasonTier, teams);

            const remaining = inferRemainingFixturesDoubleRoundRobin(played, teams);
            //logStatus(`Tier ${tier}: remaining inferred fixtures = ${remaining.length}`);

            const teamIndex = new Map();
            for (let i = 0; i < teams.length; i++) teamIndex.set(teams[i], i);

            const fixtures = [];
            for (const [h, a] of remaining) {
              const eH = elos[h], eA = elos[a];
              if (!Number.isFinite(eH) || !Number.isFinite(eA)) continue;

              const [pH, pD, pA] = matchProbabilities(eH, eA, seasonStartYear, 0.9);
              fixtures.push({ h: teamIndex.get(h), a: teamIndex.get(a), pH, pD, pA });
            }

            const basePoints = teams.map(t => pts[t] || 0);
            const SIMS = 20000;
            //logStatus(`Tier ${tier}: simulating ${SIMS} seasons…`);
            const seedKey = `${latestSeason}|${tier}|${teams.length}|${fixtures.length}`;
            const simResult = computePositionProbabilitiesMC(teams, basePoints, fixtures, SIMS, seedKey);
            const posProbs = simResult.posProbs;

            const remainingCounts = new Array(teams.length).fill(0);
            for (const f of fixtures) {
              remainingCounts[f.h] += 1;
              remainingCounts[f.a] += 1;
            }
            const impossibleByTeam = computeImpossiblePositions(teams, basePoints, remainingCounts);

            const fixturePairs = fixtures.map(f => [f.h, f.a, f.pH, f.pD, f.pA]);
            const key = `${latestSeason}|${divisionName}`;
            window.tableProbsFixtures[key] = fixturePairs;
            window.tableProbsExamples[key] = simResult.examples || {};
            window.tableProbsTeams[key] = teams;
            window.tableProbsBasePoints[key] = basePoints;

            renderTeamPositionMatrix(tablesDiv, divisionName, latestSeason, teams, posProbs, impossibleByTeam);

            //logStatus(`Tier ${tier}: done.`);
            //logStatus("");
          }

          //logStatus("Complete.");
        },
        error: (err) => {
          console.error(err);
          logStatus("Failed to load CSV. See console.");
        }
      });
    });
  </script>
</body>
</html>
