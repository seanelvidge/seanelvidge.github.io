---
layout: page
permalink: /tableProbs
title: Title & Position Odds
description: Exact (non-Monte-Carlo) position odds for the latest season in each tier.
nav: false
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>

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

    .table-scroll {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: 10px;
      border: 1px solid #e6e6e6;
      background: #f0f0f0;
      padding: 10px;
    }

    /* Use separate borders + spacing to create a gap between all cells */
    .probTable {
      width: 100%;
      border-collapse: separate !important;
      border-spacing: 6px 6px;     /* <-- cell gaps */
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
      border-radius: 8px;          /* header pills */
    }

    /* Column widths */
    .probTable thead th.posHead { width: 60px; }
    .probTable thead th.teamHead { text-align: left; width: 170px; }

    .probTable tbody td {
      background: #ffffff;
      border: none !important;
      padding: 6px 8px;
      line-height: 1.2;
      color: #000;
      font-size: 12px;
      text-align: center;
      white-space: nowrap;
      border-radius: 8px;          /* cell pills */
    }

    /* Position column (leftmost) */
    .pos-cell {
      background-color: #b2182b;
      color: #fff !important;
      font-weight: 800;
      text-align: center !important;
    }

    /* Team cell: red chip, includes logo + name */
    .team-cell {
      background-color: #b2182b;
      color: #fff !important;
      font-weight: 800;
      text-align: left !important;
      width: 170px;
    }

    .team-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
    }

    .team-logo {
      width: 18px;
      height: 18px;
      flex: 0 0 auto;
      border-radius: 3px;
      background: rgba(255,255,255,0.18);
    }

    .team-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Max cell should always be full red with white text */
    .max-cell {
      background-color: #b2182b !important;
      color: #fff !important;
      font-weight: 800;
    }

    .smallnote { color: #666; font-size: 0.9em; margin-top: 6px; }
  </style>
</head>

<body>
  <h1>Title & Position Odds (Exact)</h1>
  <div class="meta">
    Exact (non-Monte-Carlo) position probabilities for the latest season in your database (latest season is determined by the last row in the CSV).
    Remaining fixtures are inferred as all unplayed home/away pairings (double round-robin completion).
  </div>

  <div id="status" class="status">Loading…</div>
  <div id="tables"></div>

  <script>
    // ------------------------------------------------------------
    // Config
    // ------------------------------------------------------------
    const CSV_URL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglandLeagueResults_wRanks.csv";
    const TIERS = [1, 2, 3, 4];

    // If you already have logo URLs used in leagueTable.md, put that mapping here.
    // Fallback is a harmless placeholder square.
    // You can extend this over time without touching the rest of the code.
    const TEAM_LOGO = {
      // "Arsenal": "/assets/team-logos/Arsenal.png",
      // "Aston Villa": "/assets/team-logos/Aston%20Villa.png",
    };

    // ------------------------------------------------------------
    // Status logging
    // ------------------------------------------------------------
    function logStatus(msg) {
      const el = document.getElementById("status");
      el.textContent += (el.textContent.endsWith("\n") || el.textContent === "" ? "" : "\n") + msg;
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
    // Points so far
    // ------------------------------------------------------------
    function computePointsSoFar(playedRows) {
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

        for (let i = 0; i < pmf.length; i++) next[i] += pmf[i] * pL;            // +0
        for (let i = 0; i < pmf.length - 1; i++) next[i + 1] += pmf[i] * pD;    // +1
        for (let i = 0; i < pmf.length - 3; i++) next[i + 3] += pmf[i] * pW;    // +3

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
    // Formatting + heat shading
    // ------------------------------------------------------------
    function formatPctCell(p) {
      if (!Number.isFinite(p) || p <= 0) return "0%";
      const pct = Math.round(100 * p);
      if (pct === 0) return "<1%";
      return `${pct}%`;
    }

    function getLogoUrl(teamName) {
      if (TEAM_LOGO[teamName]) return TEAM_LOGO[teamName];

      // If you have a consistent naming convention in your site assets,
      // uncomment this line and ensure files exist:
      // return `/assets/team-logos/${encodeURIComponent(teamName)}.png`;

      return null;
    }

    function applyRowHeat(td, p, maxP) {
      // For <1% (or maxP==0) keep white.
      if (!Number.isFinite(p) || p <= 0 || !Number.isFinite(maxP) || maxP <= 0) return;

      // If it rounds to 0% but non-zero, user wants it white (leave as is)
      if (Math.round(100 * p) === 0) return;

      // Shade relative to max probability in row.
      // ratio in (0,1], map to alpha range.
      const ratio = clamp(p / maxP, 0, 1);

      // Keep strong red for max (handled by class), otherwise transparent red tint.
      // Use a gentle floor so visible but not overpowering.
      const alpha = 0.10 + 0.90 * ratio; // 0.10 .. 1.00
      td.style.backgroundColor = `rgba(178, 24, 43, ${alpha})`; // #b2182b
      td.style.color = (alpha > 0.55) ? "#fff" : "#000";
      td.style.fontWeight = (ratio > 0.80) ? "800" : "600";
    }

    // ------------------------------------------------------------
    // Rendering: Position + Team + matrix (with logos + heat shading)
    // ------------------------------------------------------------
    function renderTeamPositionMatrix(container, divisionName, seasonStr, teams, posProbs) {
      const N = teams.length;

      const block = document.createElement("div");
      block.className = "tier-block";

      const h = document.createElement("h2");
      h.className = "tier-title";
      h.textContent = `${divisionName}`;
      block.appendChild(h);

      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = `Season: ${seasonStr}`;
      block.appendChild(meta);

      // Order rows by expected finishing position (lower better)
      const expectedPos = teams.map(t => {
        let ep = 0;
        for (let pos = 1; pos <= N; pos++) ep += pos * (posProbs[t][pos] || 0);
        return { team: t, ep };
      }).sort((a, b) => a.ep - b.ep);

      const scroll = document.createElement("div");
      scroll.className = "table-scroll";

      const table = document.createElement("table");
      table.className = "probTable";

      const thead = document.createElement("thead");
      const headCells = [];
      headCells.push(`<th class="posHead">POS</th>`);
      headCells.push(`<th class="teamHead">TEAM</th>`);
      for (let pos = 1; pos <= N; pos++) headCells.push(`<th>${pos}</th>`);
      thead.innerHTML = `<tr>${headCells.join("")}</tr>`;
      table.appendChild(thead);

      const tbody = document.createElement("tbody");

      let rank = 1;
      for (const row of expectedPos) {
        const t = row.team;

        // Find max probability in the row BEFORE rounding (as requested)
        let maxP = 0;
        for (let pos = 1; pos <= N; pos++) {
          const p = (posProbs[t] && posProbs[t][pos]) ? posProbs[t][pos] : 0;
          if (p > maxP) maxP = p;
        }

        const tr = document.createElement("tr");

        // Position chip
        const tdPos = document.createElement("td");
        tdPos.className = "pos-cell";
        tdPos.textContent = String(rank);
        tr.appendChild(tdPos);

        // Team chip with logo
        const tdTeam = document.createElement("td");
        tdTeam.className = "team-cell";

        const wrap = document.createElement("div");
        wrap.className = "team-wrap";

        const logoUrl = getLogoUrl(t);
        if (logoUrl) {
          const img = document.createElement("img");
          img.className = "team-logo";
          img.src = logoUrl;
          img.alt = `${t} logo`;
          img.loading = "lazy";
          img.onerror = () => { img.style.display = "none"; };
          wrap.appendChild(img);
        } else {
          // placeholder square to keep alignment consistent
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

        // Probability cells with heat shading
        for (let pos = 1; pos <= N; pos++) {
          const p = (posProbs[t] && posProbs[t][pos]) ? posProbs[t][pos] : 0;

          const td = document.createElement("td");
          td.textContent = formatPctCell(p);

          // Max cell: force full red via class
          if (p === maxP && maxP > 0) {
            td.classList.add("max-cell");
          } else {
            // Apply red tint proportional to p/maxP (leave <1% fully white)
            applyRowHeat(td, p, maxP);
          }

          tr.appendChild(td);
        }

        tbody.appendChild(tr);
        rank += 1;
      }

      table.appendChild(tbody);
      scroll.appendChild(table);
      block.appendChild(scroll);

      const note = document.createElement("div");
      note.className = "smallnote";
      note.textContent =
        "Cells show the probability of finishing in each position (rounded to whole %; values that round to 0 but are non-zero show as <1%). " +
        "The largest probability in each team row is highlighted in red; other cells are shaded relative to that maximum.";
      block.appendChild(note);

      container.appendChild(block);
    }

    // ------------------------------------------------------------
    // Main
    // ------------------------------------------------------------
    document.addEventListener("DOMContentLoaded", () => {
      document.getElementById("status").textContent = "";
      logStatus("Fetching CSV…");

      Papa.parse(CSV_URL, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data || [];
          if (!data.length) { logStatus("No rows loaded."); return; }
          logStatus(`Loaded rows: ${data.length}`);

          // Latest season from last row
          const last = data[data.length - 1];
          const latestSeason = last.Season;
          const seasonStartYear = seasonStartYearFromSeasonStr(latestSeason);
          logStatus(`Latest season (last row): ${latestSeason}`);
          logStatus(`Season start year: ${seasonStartYear}`);
          logStatus("");

          const tablesDiv = document.getElementById("tables");

          for (const tier of TIERS) {
            logStatus(`Tier ${tier}: filtering…`);

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
            logStatus(`Tier ${tier}: played matches = ${played.length}`);

            const teamSet = new Set();
            for (const r of played) { teamSet.add(r.HomeTeam); teamSet.add(r.AwayTeam); }
            const teams = Array.from(teamSet).sort();
            const N = teams.length;
            logStatus(`Tier ${tier}: teams = ${N}`);
            if (N < 2) { logStatus(`Tier ${tier}: not enough teams.`); logStatus(""); continue; }

            const pts = computePointsSoFar(played);
            const elos = latestElosByScanningBackwards(seasonTier, teams);

            const remaining = inferRemainingFixturesDoubleRoundRobin(played, teams);
            logStatus(`Tier ${tier}: remaining inferred fixtures = ${remaining.length}`);

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

            logStatus(`Tier ${tier}: computing position probabilities…`);
            const posProbs = computePositionProbabilities(finalPMFByTeam);

            renderTeamPositionMatrix(tablesDiv, divisionName, latestSeason, teams, posProbs);

            logStatus(`Tier ${tier}: done.`);
            logStatus("");
          }

          logStatus("Complete.");
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