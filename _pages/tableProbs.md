---
layout: page
permalink: /tableProbs
title: League Table Position Odds
description: League table position odds for each tier.
nav: false
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>

  <style>
    /* Reuse the “pill row” look from leagueTable.md, adapted to a simple table */

    .tier-block { margin: 18px 0 34px 0; }
    .tier-title { margin: 6px 0 10px 0; }

    .probTable {
      width: 100%;
      border-collapse: separate !important;
      border-spacing: 0 8px;      /* row gap */
      background: #f0f0f0;        /* gap colour */
    }

    .probTable thead th {
      background-color: #3b5fd0;
      color: #fff;
      text-transform: uppercase;
      text-align: left;
      font-weight: 700;
      padding: 6px 8px;
    }

    .probTable tbody tr { background: transparent; }
    .probTable tbody td {
      background: #ffffff;
      border: none !important;
      padding: 6px 8px;
      line-height: 1.2;
      color: #000;
    }

    /* Round ends */
    .probTable tbody td:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
    .probTable tbody td:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    /* POS column — red chip */
    .probTable tbody td.pos-column {
      background-color: #b2182b;
      color: #fff;
      font-weight: 700;
      text-align: center;
      width: 55px;
    }

    /* TEAM column */
    .probTable tbody td.team-column {
      font-weight: 600;
      color: #333;
      width: auto;
    }

    /* PROB column */
    .probTable tbody td.prob-column {
      text-align: right;
      width: 90px;
      font-weight: 700;
    }

    .meta {
      color: #444;
      font-size: 0.95em;
      margin: 4px 0 10px 0;
    }

    .status {
      padding: 10px 12px;
      background: #f6f6f6;
      border-radius: 10px;
      border: 1px solid #e6e6e6;
      margin: 12px 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 12px;
      white-space: pre-wrap;
    }

    .smallnote { color: #666; font-size: 0.9em; margin-top: 6px; }
  </style>
</head>

<body>
  <h1>Title & Position Odds (Exact)</h1>
  <div class="meta">
    Exact position probabilities for the latest season in your database, computed from current points + remaining fixtures inferred from unplayed home/away pairings.
  </div>

  <div id="status" class="status">Loading…</div>

  <div id="tables"></div>

  <script>
    // ------------------------------------------------------------
    // Config
    // ------------------------------------------------------------
    const CSV_URL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglandLeagueResults_wRanks.csv";
    const TIERS = [1,2,3,4];

    // ------------------------------------------------------------
    // Utilities
    // ------------------------------------------------------------
    function logStatus(msg) {
      const el = document.getElementById("status");
      el.textContent += (el.textContent.endsWith("\n") || el.textContent === "" ? "" : "\n") + msg;
    }

    function seasonStartYearFromSeasonStr(seasonStr) {
      // "2025/2026" -> 2025
      const m = String(seasonStr || "").match(/^(\d{4})\s*\/\s*(\d{4})$/);
      if (m) return parseInt(m[1], 10);
      const m2 = String(seasonStr || "").match(/(\d{4})/);
      return m2 ? parseInt(m2[1],10) : (new Date()).getFullYear();
    }

    function toInt(x, fallback=0) {
      const v = parseInt(x, 10);
      return Number.isFinite(v) ? v : fallback;
    }

    function toFloat(x, fallback=NaN) {
      const v = parseFloat(x);
      return Number.isFinite(v) ? v : fallback;
    }

    function clamp(x, lo, hi) {
      return Math.max(lo, Math.min(hi, x));
    }

    function safeProbs(arr, floor=1e-3) {
      const p = arr.map(v => clamp(+v, floor, 1 - floor));
      const s = p.reduce((a,b) => a+b, 0);
      return p.map(v => v / s);
    }

    // ------------------------------------------------------------
    // Match probabilities: port of your JS logic (matchProbs.md)
    // ------------------------------------------------------------
    const ELO_PER_NAT_LOGIT = 400.0 / Math.log(10.0);

    function eloToSkill(elo, beta=0.9, base=1000.0, mult=2.0, offset=0.0) {
      const S = ELO_PER_NAT_LOGIT * beta * mult;
      return (elo - base) / S + offset;
    }

    function eraProbsFromYear(year) {
      // percentages -> normalized probabilities
      const h = (year - 1888) * (-0.141579) + 60.5636;
      const a = (year - 1888) * ( 0.075714) + 19.4769;
      const d = (year - 1888) * ( 0.065851) + 19.9608;
      let pH = Math.max(h, 0.001);
      let pD = Math.max(d, 0.001);
      let pA = Math.max(a, 0.001);
      const s = pH + pD + pA;
      return [pH/s, pD/s, pA/s];
    }

    function deltaBaseAndKappa(year) {
      const [pH,pD,pA] = eraProbsFromYear(year);
      const DeltaBase = 0.5 * Math.log(pH / pA);
      const kappa = (pD / (1 - pD)) * 2.0 * Math.cosh(DeltaBase);
      return [DeltaBase, kappa];
    }

    function predictProbs(sH, sA, year, beta=1.0) {
      const [DeltaBase, kappa] = deltaBaseAndKappa(year);
      const DeltaStar = beta * (sH - sA) + DeltaBase;
      const u = Math.exp(DeltaStar);
      const v = Math.exp(-DeltaStar);
      const Den = u + v + kappa;
      const pH = u / Den;
      const pA = v / Den;
      const pD = kappa / Den;
      return [pH, pD, pA]; // [Home, Draw, Away]
    }

    function matchProbabilities(homeElo, awayElo, seasonStartYear, beta=0.9) {
      const sH = eloToSkill(homeElo, beta);
      const sA = eloToSkill(awayElo, beta);
      const rho = 0.997;
      const xH = rho * sH + (1 - rho);
      const xA = rho * sA + (1 - rho);
      const p = predictProbs(xH, xA, seasonStartYear, beta);
      return safeProbs(p, 1e-3); // [pHomeWin, pDraw, pAwayWin]
    }

    // ------------------------------------------------------------
    // League extraction + points so far
    // ------------------------------------------------------------
    function computePointsSoFar(playedRows) {
      const teams = new Set();
      for (const r of playedRows) {
        teams.add(r.HomeTeam);
        teams.add(r.AwayTeam);
      }

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

    function latestElosByScanningBackwards(seasonTierRows, teams) {
      // Scan in reverse; use HomeRank_after/AwayRank_after according to side.
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

    function inferRemainingFixturesDoubleRoundRobin(playedRows, teams) {
      const playedPairs = new Set();
      for (const r of playedRows) playedPairs.add(r.HomeTeam + "|||"+ r.AwayTeam);

      const rem = [];
      for (const h of teams) {
        for (const a of teams) {
          if (h === a) continue;
          const key = h + "|||"+ a;
          if (!playedPairs.has(key)) rem.push([h,a]);
        }
      }
      return rem;
    }

    // ------------------------------------------------------------
    // DP: points distribution for one team (sum of {0,1,3})
    // ------------------------------------------------------------
    function teamAddedPointsPMF(fixtures) {
      // fixtures: array of [pW,pD,pL] from team's perspective
      const Pmax = 3 * fixtures.length;
      let pmf = new Float64Array(Pmax + 1);
      pmf[0] = 1.0;

      for (const f of fixtures) {
        const pW = f[0], pD = f[1], pL = f[2];
        const next = new Float64Array(Pmax + 1);
        // +0
        for (let i=0;i<pmf.length;i++) next[i] += pmf[i] * pL;
        // +1
        for (let i=0;i<pmf.length-1;i++) next[i+1] += pmf[i] * pD;
        // +3
        for (let i=0;i<pmf.length-3;i++) next[i+3] += pmf[i] * pW;

        pmf = next;
      }

      // normalise
      let s = 0;
      for (let i=0;i<pmf.length;i++) s += pmf[i];
      if (s > 0) for (let i=0;i<pmf.length;i++) pmf[i] /= s;

      return pmf;
    }

    function shiftPMF(pmfAdded, bankPoints, PfinalMax) {
      const out = new Float64Array(PfinalMax + 1);
      const start = bankPoints;
      const end = Math.min(PfinalMax + 1, bankPoints + pmfAdded.length);
      for (let i=start;i<end;i++) out[i] = pmfAdded[i - start];
      return out;
    }

    // ------------------------------------------------------------
    // Position probabilities under random tie-break on points
    //
    // For each team t and each points x:
    //  - treat other teams independently as being <x, =x, >x
    //  - DP over counts (g,e) of >x and =x among others
    //  - if t has x, its positions are g+1 .. g+e+1 uniformly
    // ------------------------------------------------------------
    function computePositionProbabilities(finalPMFByTeam) {
      const teams = Object.keys(finalPMFByTeam);
      const N = teams.length;
      const Pmax = Math.max(...teams.map(t => finalPMFByTeam[t].length)) - 1;

      // pad PMFs + build CDFs
      const pmf = {};
      const cdf = {};
      for (const t of teams) {
        const p = finalPMFByTeam[t];
        const padded = new Float64Array(Pmax + 1);
        padded.set(p);
        pmf[t] = padded;

        const c = new Float64Array(Pmax + 1);
        let s = 0;
        for (let i=0;i<=Pmax;i++) { s += padded[i]; c[i] = s; }
        cdf[t] = c;
      }

      // out[t] is Float64Array positions 1..N (index 1 used)
      const out = {};
      for (const t of teams) out[t] = new Float64Array(N + 1);

      for (const t of teams) {
        const others = teams.filter(u => u !== t);

        for (let x=0; x<=Pmax; x++) {
          const pi = pmf[t][x];
          if (pi === 0) continue;

          // build category probs for others
          const a = new Float64Array(N-1); // >x
          const b = new Float64Array(N-1); // =x
          const c = new Float64Array(N-1); // <x

          for (let j=0;j<others.length;j++) {
            const u = others[j];
            a[j] = 1.0 - cdf[u][x];
            b[j] = pmf[u][x];
            c[j] = cdf[u][x] - pmf[u][x];
          }

          // dp[g*(N)+e] in a flat array for speed
          const dim = N;
          let dp = new Float64Array(dim * dim);
          dp[0*dim + 0] = 1.0;

          for (let j=0; j<others.length; j++) {
            const ndp = new Float64Array(dim * dim);
            const pgt = a[j], peq = b[j], plt = c[j];

            // g ranges 0..j; e ranges 0..(j-g)
            for (let g=0; g<=j; g++) {
              for (let e=0; e<=j-g; e++) {
                const v = dp[g*dim + e];
                if (v === 0) continue;

                ndp[g*dim + e]     += v * plt;
                ndp[(g+1)*dim + e] += v * pgt;
                ndp[g*dim + (e+1)] += v * peq;
              }
            }
            dp = ndp;
          }

          // allocate mass across positions
          for (let g=0; g<N; g++) {
            for (let e=0; e<N-g; e++) {
              const v = dp[g*dim + e];
              if (v === 0) continue;

              const mass = pi * v;
              const tieSize = e + 1;
              const share = mass / tieSize;
              const startPos = g + 1;
              const endPos = g + e + 1;
              for (let pos=startPos; pos<=endPos; pos++) out[t][pos] += share;
            }
          }
        }

        // renormalise numeric drift
        let s = 0;
        for (let pos=1; pos<=N; pos++) s += out[t][pos];
        if (s > 0) for (let pos=1; pos<=N; pos++) out[t][pos] /= s;
      }

      return out;
    }

    // ------------------------------------------------------------
    // Build “most likely team per position” table
    // ------------------------------------------------------------
    function mostLikelyTeamPerPosition(posProbs) {
      const teams = Object.keys(posProbs);
      const N = teams.length;

      const rows = [];
      for (let pos=1; pos<=N; pos++) {
        let bestTeam = null;
        let bestP = -1;
        for (const t of teams) {
          const p = posProbs[t][pos];
          if (p > bestP) { bestP = p; bestTeam = t; }
        }
        rows.push({ Pos: pos, Team: bestTeam, Prob: bestP });
      }
      return rows;
    }

    function renderTierTable(container, tier, divisionName, seasonStr, rows) {
      const block = document.createElement("div");
      block.className = "tier-block";

      const h = document.createElement("h2");
      h.className = "tier-title";
      h.textContent = `Tier ${tier}: ${divisionName}`;
      block.appendChild(h);

      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = `Season: ${seasonStr}`;
      block.appendChild(meta);

      const table = document.createElement("table");
      table.className = "probTable";
      table.id = `probTableTier${tier}`;

      const thead = document.createElement("thead");
      thead.innerHTML = `
        <tr>
          <th style="width:55px; text-align:center;">POS</th>
          <th>TEAM</th>
          <th style="width:90px; text-align:right;">PROB</th>
        </tr>
      `;
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      for (const r of rows) {
        const tr = document.createElement("tr");
        const probPct = (100 * r.Prob);
        tr.innerHTML = `
          <td class="pos-column">${r.Pos}</td>
          <td class="team-column">${r.Team || ""}</td>
          <td class="prob-column">${probPct.toFixed(1)}%</td>
        `;
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);

      block.appendChild(table);

      const note = document.createElement("div");
      note.className = "smallnote";
      note.textContent = "Probabilities are exact under the model assumptions (independent team totals; random tie-break on points; remaining fixtures inferred from unplayed home/away pairings).";
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
          if (!data.length) {
            logStatus("No rows loaded.");
            return;
          }
          logStatus(`Loaded rows: ${data.length}`);

          // Latest season from last row (as requested)
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

            // played matches
            const played = seasonTier.filter(r => r.Result === "H" || r.Result === "D" || r.Result === "A");
            logStatus(`Tier ${tier}: played matches = ${played.length}`);

            // teams
            const teamSet = new Set();
            for (const r of played) { teamSet.add(r.HomeTeam); teamSet.add(r.AwayTeam); }
            const teams = Array.from(teamSet).sort();
            logStatus(`Tier ${tier}: teams = ${teams.length}`);

            // points so far
            const pts = computePointsSoFar(played);

            // latest elos
            const elos = latestElosByScanningBackwards(seasonTier, teams);

            // remaining fixtures inferred
            const remaining = inferRemainingFixturesDoubleRoundRobin(played, teams);
            logStatus(`Tier ${tier}: remaining inferred fixtures = ${remaining.length}`);

            // build per-team fixture probs (team perspective)
            const fixturesForTeam = {};
            for (const t of teams) fixturesForTeam[t] = [];

            for (const [h,a] of remaining) {
              const eH = elos[h], eA = elos[a];
              if (!Number.isFinite(eH) || !Number.isFinite(eA)) continue;

              const [pH,pD,pA] = matchProbabilities(eH, eA, seasonStartYear, 0.9);
              fixturesForTeam[h].push([pH, pD, pA]);
              fixturesForTeam[a].push([pA, pD, pH]);
            }

            // final PMFs
            let maxRem = 0;
            for (const t of teams) maxRem = Math.max(maxRem, fixturesForTeam[t].length);

            const maxPtsSoFar = Math.max(...teams.map(t => pts[t] || 0));
            const PfinalMax = maxPtsSoFar + 3 * maxRem;

            const finalPMFByTeam = {};
            for (const t of teams) {
              const pmfAdded = teamAddedPointsPMF(fixturesForTeam[t]);
              finalPMFByTeam[t] = shiftPMF(pmfAdded, pts[t] || 0, PfinalMax);
            }

            // position probabilities
            logStatus(`Tier ${tier}: computing position probabilities…`);
            const posProbs = computePositionProbabilities(finalPMFByTeam);

            // build “most likely team per position” table rows
            const ml = mostLikelyTeamPerPosition(posProbs);

            // render
            renderTierTable(tablesDiv, tier, divisionName, latestSeason, ml);
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
