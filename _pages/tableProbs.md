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
    .mobile-summary-wrap .probTable { min-width: 520px; table-layout: auto; }
    .mobile-summary-wrap .probTable thead th.teamHead { width: 60px; }
  </style>
</head>

<body>
Position probabilities for the season. Remaining fixtures are inferred, assuming team strenghts remain constant.

  <div id="status" class="status">Loading…</div>
  <div id="tables"></div>

  <script>
    // ------------------------------------------------------------
    // Config
    // ------------------------------------------------------------
    const CSV_URL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglandLeagueResults_wRanks.csv";
    const LOGO_CSV_URL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglishTeamLogos.csv";
    const DEDUCT_CSV_URL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglishTeamPointDeductions.csv";
    const TIERS = [1, 2, 3, 4];

    // ------------------------------------------------------------
    // Status logging
    // ------------------------------------------------------------
    function logStatus(msg) {
      const el = document.getElementById("status");
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

    function safeProbs(arr, floor = 1e-3) {
      const p = arr.map(v => clamp(+v, floor, 1 - floor));
      const s = p.reduce((a, b) => a + b, 0);
      return p.map(v => v / s);
    }

    // Table cell formatting:
    // - true zero => "-"
    // - non-zero but rounds to 0 => "<1%"
    function formatPctCell(p) {
      if (!Number.isFinite(p) || p <= 0) return "-";
      const pct = Math.round(100 * p);
      if (pct === 0) return "<1%";
      if (pct === 100) return ">99%";
      return `${pct}%`;
    }

    // Same formatting for mobile summary cells
    function pctIntOrTinyOrDash(p) {
      return formatPctCell(p);
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
    // DP: team added-points distribution (sum of {0,1,3})
    // ------------------------------------------------------------
    function teamAddedPointsPMF(fixtures) {
      const Pmax = 3 * fixtures.length;
      let pmf = new Float64Array(Pmax + 1);
      pmf[0] = 1.0;

      for (const f of fixtures) {
        const pW = f[0], pD = f[1], pL = f[2];
        const next = new Float64Array(Pmax + 1);

        for (let i = 0; i < pmf.length; i++) next[i] += pmf[i] * pL;
        for (let i = 0; i < pmf.length - 1; i++) next[i + 1] += pmf[i] * pD;
        for (let i = 0; i < pmf.length - 3; i++) next[i + 3] += pmf[i] * pW;

        pmf = next;
      }

      let s = 0;
      for (let i = 0; i < pmf.length; i++) s += pmf[i];
      if (s > 0) for (let i = 0; i < pmf.length; i++) pmf[i] /= s;

      return pmf;
    }

    function shiftPMF(pmfAdded, bankPoints, PfinalMax) {
      const out = new Float64Array(PfinalMax + 1);
      const start = bankPoints;
      const end = Math.min(PfinalMax + 1, bankPoints + pmfAdded.length);
      for (let i = start; i < end; i++) out[i] = pmfAdded[i - start];
      return out;
    }

    // ------------------------------------------------------------
    // Position probabilities (random tie-break on points)
    // ------------------------------------------------------------
    function computePositionProbabilities(finalPMFByTeam) {
      const teams = Object.keys(finalPMFByTeam);
      const N = teams.length;
      const Pmax = Math.max(...teams.map(t => finalPMFByTeam[t].length)) - 1;

      const pmf = {};
      const cdf = {};
      for (const t of teams) {
        const p = finalPMFByTeam[t];
        const padded = new Float64Array(Pmax + 1);
        padded.set(p);
        pmf[t] = padded;

        const c = new Float64Array(Pmax + 1);
        let s = 0;
        for (let i = 0; i <= Pmax; i++) { s += padded[i]; c[i] = s; }
        cdf[t] = c;
      }

      const out = {};
      for (const t of teams) out[t] = new Float64Array(N + 1);

      for (const t of teams) {
        const others = teams.filter(u => u !== t);

        for (let x = 0; x <= Pmax; x++) {
          const pi = pmf[t][x];
          if (pi === 0) continue;

          const a = new Float64Array(N - 1);
          const b = new Float64Array(N - 1);
          const c = new Float64Array(N - 1);

          for (let j = 0; j < others.length; j++) {
            const u = others[j];
            a[j] = 1.0 - cdf[u][x];
            b[j] = pmf[u][x];
            c[j] = cdf[u][x] - pmf[u][x];
          }

          const dim = N;
          let dp = new Float64Array(dim * dim);
          dp[0] = 1.0;

          for (let j = 0; j < others.length; j++) {
            const ndp = new Float64Array(dim * dim);
            const pgt = a[j], peq = b[j], plt = c[j];

            for (let g = 0; g <= j; g++) {
              for (let e = 0; e <= j - g; e++) {
                const v = dp[g * dim + e];
                if (v === 0) continue;
                ndp[g * dim + e]       += v * plt;
                ndp[(g + 1) * dim + e] += v * pgt;
                ndp[g * dim + (e + 1)] += v * peq;
              }
            }
            dp = ndp;
          }

          for (let g = 0; g < N; g++) {
            for (let e = 0; e < N - g; e++) {
              const v = dp[g * dim + e];
              if (v === 0) continue;

              const mass = pi * v;
              const tieSize = e + 1;
              const share = mass / tieSize;
              const startPos = g + 1;
              const endPos = g + e + 1;
              for (let pos = startPos; pos <= endPos; pos++) out[t][pos] += share;
            }
          }
        }

        let s = 0;
        for (let pos = 1; pos <= N; pos++) s += out[t][pos];
        if (s > 0) for (let pos = 1; pos <= N; pos++) out[t][pos] /= s;
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
    function buildMobileSummaryRows(teams, posProbs) {
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

        let top6 = 0;
        for (let pos = 1; pos <= topK; pos++) top6 += (posProbs[t][pos] || 0);

        let bottom3 = 0;
        for (let pos = N - bottomK + 1; pos <= N; pos++) bottom3 += (posProbs[t][pos] || 0);

        return { team: t, p1, top6, bottom3 };
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


    // ------------------------------------------------------------
    // Rendering: full matrix + mobile summary with toggle
    // ------------------------------------------------------------
    function renderTeamPositionMatrix(container, divisionName, seasonStr, teams, posProbs) {
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
        name.textContent = t;
        wrap.appendChild(name);

        tdTeam.appendChild(wrap);
        tr.appendChild(tdTeam);

        for (let pos = 1; pos <= N; pos++) {
          const p = (posProbs[t] && posProbs[t][pos]) ? posProbs[t][pos] : 0;
          const td = document.createElement("td");
          td.textContent = formatPctCell(p);

          if (p === maxP && maxP > 0) {
            td.classList.add("max-cell");
          } else {
            applyRowHeat(td, p, maxP);
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
      const mobRows = buildMobileSummaryRows(teams, posProbs);

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
        name.textContent = r.team;
        wrap.appendChild(name);

        tdTeam.appendChild(wrap);

        const td1 = document.createElement("td");
        td1.textContent = pctIntOrTinyOrDash(r.p1);

        const tdTop = document.createElement("td");
        tdTop.textContent = pctIntOrTinyOrDash(r.top6);

        const tdBot = document.createElement("td");
        tdBot.textContent = pctIntOrTinyOrDash(r.bottom3);

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

    // ------------------------------------------------------------
    // Main
    // ------------------------------------------------------------
    document.addEventListener("DOMContentLoaded", async () => {
      document.getElementById("status").textContent = "";

      logStatus("Calculating tables...");
      await loadTeamLogos();
      //logStatus(`Team logos loaded: ${Object.keys(window.teamLogos || {}).length}`);

      //logStatus("Fetching point deductions/additions…");
      await loadPointDeductions();
      //logStatus(`Point adjustment seasons loaded: ${Object.keys(window.pointAdjustmentsBySeason || {}).length}`);
      //logStatus("");

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

            const fixturesForTeam = {};
            for (const t of teams) fixturesForTeam[t] = [];

            for (const [h, a] of remaining) {
              const eH = elos[h], eA = elos[a];
              if (!Number.isFinite(eH) || !Number.isFinite(eA)) continue;

              const [pH, pD, pA] = matchProbabilities(eH, eA, seasonStartYear, 0.9);
              fixturesForTeam[h].push([pH, pD, pA]);
              fixturesForTeam[a].push([pA, pD, pH]);
            }

            let maxRem = 0;
            for (const t of teams) maxRem = Math.max(maxRem, fixturesForTeam[t].length);

            const maxPtsSoFar = Math.max(...teams.map(t => pts[t] || 0));
            const PfinalMax = maxPtsSoFar + 3 * maxRem;

            const finalPMFByTeam = {};
            for (const t of teams) {
              const added = teamAddedPointsPMF(fixturesForTeam[t]);
              finalPMFByTeam[t] = shiftPMF(added, pts[t] || 0, PfinalMax);
            }

            //logStatus(`Tier ${tier}: computing position probabilities…`);
            const posProbs = computePositionProbabilities(finalPMFByTeam);

            renderTeamPositionMatrix(tablesDiv, divisionName, latestSeason, teams, posProbs);

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
