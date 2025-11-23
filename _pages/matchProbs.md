---
layout: page
permalink: /matchProbs
title: Experimental Match Outcome Probabilities Calculator
description: Experimental tool for calculating football match outcome probabilities.
nav: false
tags: football
---

<html lang="en">
<head>
  <!-- Papa Parse for CSV reading -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
  <script src="https://d3js.org/d3.v7.min.js"></script>

  <style>
  /* Let chart text inherit the page text color */
	.chart-container {
	  color: inherit; /* inherits from body / layout */
	}

	/* Make ALL SVG text follow that inherited color */
	.chart-container svg text {
	  fill: currentColor;
	}

	/* (optional) make center labels bold like h2h */
	.chart-container svg text.bar-label {
	  font-weight: bold;
	}

    .btn {
      display: inline-block;
      margin: 6px 8px 0 0;
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      background-color: #008cba;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
    }
    .btn:hover { background-color: #007ba1; }
    form { margin-bottom: 20px; }
    label { margin-right: 10px; font-weight: bold; }
    input[type="text"], input[type="number"], select {
      padding: 4px 6px; font-size: 14px; margin-right: 8px;
    }
    .warning {
      color: #c00; font-weight: bold; margin: 10px auto; max-width: 600px;
    }
    .teams-row {
      text-align: center; margin-bottom: 20px; flex-wrap: wrap;
    }
    .team-container {
      display: inline-block; width: 20%; text-align: center;
      vertical-align: middle; min-width: 150px;
    }
    .team-name { font-size: 1.2em; font-weight: bold; text-align: center; margin-top: 5px; }
    .team-rank { font-size: 1em; text-align: center; margin-top: 2px; opacity: 0.9; }
    .vs-label {
      display: none; margin: 0 5px; font-size: 2em; font-weight: bold; vertical-align: middle;
    }
    .chart-container {
      display: flex; justify-content: center; max-width: 900px; margin: 0 auto 2px auto;
    }
    .chart-container svg { width: 100%; height: auto; display: block; overflow: visible; }
    .bar-label { font-weight: bold; }

    @media (max-width: 600px) {
      form#probForm { display: flex; flex-direction: column; align-items: flex-start; }
      form#probForm label, form#probForm input, form#probForm select {
        display: block; margin: 8px 0;
      }
      .button-row { display: flex; flex-direction: row; justify-content: center; width: 100%; margin-top: 10px; }
      .teams-row { display: flex; flex-direction: column; align-items: center; }
      .team-container { width: 100%; margin-bottom: 10px; }
      .vs-label { margin-bottom: 10px; }
    }
  </style>
</head>
<body>

<form id="probForm">
  <label for="team1Input">Team #1 (Home):</label>
  <input type="text" id="team1Input" list="teams" />

<label for="team2Input">Team #2 (Away):</label>
<input type="text" id="team2Input" list="teams" />

<datalist id="teams"></datalist>
<br /><br />
  
  <div class="button-row">
    <button type="submit" class="btn">Compute</button>
    <button type="button" id="resetButton" class="btn">Reset</button>
  </div>
</form>

<div id="warningMessage" class="warning" style="display:none;"></div>
<div id="shareLink" style="display:none; margin: 10px 0; font-weight: bold;"></div>

<div class="teams-row">
  <div class="team-container" id="team1Container">
    <div class="team-name" id="team1Name"></div>
    <div class="team-rank" id="team1Rank"></div>
  </div>
  <div class="vs-label" id="vsLabel">vs</div>
  <div class="team-container" id="team2Container">
    <div class="team-name" id="team2Name"></div>
    <div class="team-rank" id="team2Rank"></div>
  </div>
</div>

<div class="chart-container" id="chart"></div>

<script>
  // ---------------- URL helpers (same spirit as h2h.html) ----------------
  function getURLParameter(k) {
    return new URLSearchParams(window.location.search).get(k) || "";
  }

  // ---------------- Closest team matching (copied/adapted) ---------------
  function editDistance(a, b) {
    a = a.toLowerCase(); b = b.toLowerCase();
    const dp = [];
    for (let i = 0; i <= a.length; i++) dp[i] = [i];
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a.charAt(i - 1) === b.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
        else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[a.length][b.length];
  }

  function getClosestTeamName(input, teams) {
    if (!input) return "";
    const lowerInput = input.toLowerCase();
    const exact = teams.find(t => t.toLowerCase() === lowerInput);
    if (exact) return exact;

    const partials = teams.filter(t => t.toLowerCase().includes(lowerInput));
    const candidateList = partials.length ? partials : teams;

    let bestTeam = "";
    let bestDistance = Infinity;
    candidateList.forEach(team => {
      const dist = editDistance(team, input);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestTeam = team;
      }
    });
    return bestTeam;
  }

  // ---------------- Probability model bits (JS ports) ----------------

  // Typical Elo-per-natural-logit scaling (400 / ln(10)).
  const ELO_PER_NAT_LOGIT = 400 / Math.log(10); // ~173.7178

  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }

  function safe_probs(p, floor = 1e-3) {
    let pc = p.map(v => clamp(v, floor, 1.0 - floor));
    const s = pc.reduce((a,b) => a+b, 0);
    return pc.map(v => v / s);
  }

  function elo_to_skill(elo, beta=0.9, base=1000.0, mult=2.0, offset=0.0) {
    const S = ELO_PER_NAT_LOGIT * beta * mult;
    const s = (elo - base) / S + offset;
    return s;
  }
  
  function era_probs_from_year(year) {
    // Percentages -> probabilities, clipped and normalized
    const h = (year - 1888) * (-0.141579) + 60.5636;
    const a = (year - 1888) * ( 0.075714) + 19.4769;
    const d = (year - 1888) * ( 0.065851) + 19.9608;

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


  function probabilities(t1elo, t2elo, year, beta=0.9) {
    // const mu_tier = {1: +1.5, 2: +0.3, 3: -0.3, 4: -0.6};

    const sH = elo_to_skill(t1elo, beta);
    const sA = elo_to_skill(t2elo, beta);

    const rho = 0.997;
    const x_minus = [
      rho * sH + (1 - rho), //* mu_tier[tier],
      rho * sA + (1 - rho) //* mu_tier[tier]
    ];

    let p = predict_probs(x_minus[0], x_minus[1], year, beta);
    p = safe_probs(p, 1e-3);
    return p; // [home win, draw, away win]
  }

  // ------------------- Rendering horizontal prob chart -------------------

  function renderProbChart(p) {
    const data = [
      { label: "Home Win", value: p[0] },
      { label: "Draw", value: p[1] },
      { label: "Away Win", value: p[2] }
    ];

    d3.select("#chart").selectAll("*").remove();

    const margin = { top: 10, right: 30, bottom: 10, left: 90 };
    const chartWidth = 800, chartHeight = 160;
    const contentWidth = chartWidth - margin.left - margin.right;
    const barHeight = 26, gap = 18;

    const svg = d3.select("#chart")
      .append("svg")
      .attr("viewBox", `0 0 ${chartWidth} ${chartHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear().domain([0, 1]).range([0, contentWidth]);

    data.forEach((d, i) => {
      const y = i * (barHeight + gap);

      g.append("text")
        .attr("x", -10)
        .attr("y", y + barHeight/1.6)
        .attr("text-anchor", "end")
        .attr("class", "bar-label")
        .text(d.label);
		
	  //g.append("text")
	  //  .attr("x", x(d.value) + 6)
	  //.attr("y", y + barHeight/1.6)
	  //.attr("class", "bar-percent")
	  //.text((100*d.value).toFixed(1) + "%");


      g.append("rect")
        .attr("x", 0)
        .attr("y", y)
        .attr("width", x(d.value))
        .attr("height", barHeight)
        .attr("fill", i===0 ? "#599ad3" : (i===1 ? "#9e9e9e" : "#d3635a"));

      g.append("text")
        .attr("x", x(d.value) + 6)
        .attr("y", y + barHeight/1.6)
        .text((100*d.value).toFixed(1) + "%");
    });
  }

  // ------------------- Data loading & latest rank lookup -------------------

  const csvUrl = "https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/experimental/EnglandLeagueResults_wRanks.csv";

  let allMatches = [];
  let allTeams = [];
  let latestRanks = {}; // team -> {date: Date, elo: number}

  function toDateSafe(ds) {
    const d = new Date(ds);
    return isNaN(d.getTime()) ? new Date(0) : d;
  }

  function buildLatestRanks(rows) {
    const ranks = {};
    rows.forEach(r => {
      const dateObj = toDateSafe(r.Date);
      const hTeam = r.HomeTeam;
      const aTeam = r.AwayTeam;

      const hElo = parseFloat(r.HomeRank_after);
      const aElo = parseFloat(r.AwayRank_after);

      if (hTeam && !isNaN(hElo)) {
        if (!ranks[hTeam] || dateObj >= ranks[hTeam].date) {
          ranks[hTeam] = { date: dateObj, elo: hElo };
        }
      }
      if (aTeam && !isNaN(aElo)) {
        if (!ranks[aTeam] || dateObj >= ranks[aTeam].date) {
          ranks[aTeam] = { date: dateObj, elo: aElo };
        }
      }
    });
    return ranks;
  }

  d3.csv(csvUrl).then(rows => {
    allMatches = rows;

    const teamSet = new Set();
    rows.forEach(r => { teamSet.add(r.HomeTeam); teamSet.add(r.AwayTeam); });
    allTeams = Array.from(teamSet).filter(Boolean).sort();

    const dl = document.getElementById("teams");
    allTeams.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      dl.appendChild(opt);
    });

    latestRanks = buildLatestRanks(rows);

    // preload URL params if present
    const t1 = getURLParameter("team1");
    const t2 = getURLParameter("team2");

    if (t1) document.getElementById("team1Input").value = getClosestTeamName(t1, allTeams);
    if (t2) document.getElementById("team2Input").value = getClosestTeamName(t2, allTeams);

    if (t1 || t2) {
      document.querySelector('#probForm button[type="submit"]').click();
    }
  });

  // ------------------- Form handler -------------------

  document.getElementById("probForm").addEventListener("submit", e => {
    e.preventDefault();

    const t1Raw = document.getElementById("team1Input").value.trim();
    const t2Raw = document.getElementById("team2Input").value.trim();
    const year = new Date().getFullYear();


    const warnDiv = document.getElementById("warningMessage");
    warnDiv.style.display = "none";
    warnDiv.textContent = "";

    let team1 = allTeams.includes(t1Raw) ? t1Raw : getClosestTeamName(t1Raw, allTeams);
    let team2 = allTeams.includes(t2Raw) ? t2Raw : getClosestTeamName(t2Raw, allTeams);

    if (!team1) {
      warnDiv.textContent = "Unknown team name: " + t1Raw;
      warnDiv.style.display = "block";
      return;
    }
    if (!team2) {
      warnDiv.textContent = "Unknown team name: " + t2Raw;
      warnDiv.style.display = "block";
      return;
    }
    if (!year || isNaN(year)) {
      warnDiv.textContent = "Please enter a valid year.";
      warnDiv.style.display = "block";
      return;
    }

    const r1 = latestRanks[team1]?.elo;
    const r2 = latestRanks[team2]?.elo;

    if (r1 == null) {
      warnDiv.textContent = "No ranking found for " + team1;
      warnDiv.style.display = "block";
      return;
    }
    if (r2 == null) {
      warnDiv.textContent = "No ranking found for " + team2;
      warnDiv.style.display = "block";
      return;
    }

    // show names + ranks
    document.getElementById("team1Name").textContent = team1;
    document.getElementById("team2Name").textContent = team2;
    document.getElementById("team1Rank").textContent = "Latest rating: " + r1.toFixed(0);
    document.getElementById("team2Rank").textContent = "Latest rating: " + r2.toFixed(0);
    document.getElementById("vsLabel").style.display = "inline-block";

    const p = probabilities(r1, r2, year);

    renderProbChart(p);

    // shareable URL (same idea as h2h)
    const baseUrl = "https://seanelvidge.com/matchProbs";
    const shareUrl = `${baseUrl}?team1=${encodeURIComponent(team1)}&team2=${encodeURIComponent(team2)}`;

    const shareDiv = document.getElementById("shareLink");
    shareDiv.style.display = "block";
    shareDiv.innerHTML = `<a href="${shareUrl}" target="_blank" rel="noopener">URL link for this probability query</a><br><br>`;
  });

  document.getElementById("resetButton").addEventListener("click", () => {
    window.location.search = "";
    window.location.reload();
  });
</script>

</body>
</html>
