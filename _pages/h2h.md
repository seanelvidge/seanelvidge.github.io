---
layout: page
permalink: /h2h
title: English Football Head-to-Head Statistics
description: Tool for finding the head-to-head statistics between any two teams in the English Football League.
nav: false
tags: football
---

This page can be directly linked to by passing team names into the url, e.g. to get the head-to-head statistics of Arsenal v Chelsea visit: [https://seanelvidge.com/h2h?team1=Arsenal&team2=Chelsea](https://seanelvidge.com/h2h?team1=Arsenal&team2=Chelsea)

(This page looks best on a larger screen / landscape mobile phone screen)

<html lang="en">
<!-- Papa Parse for CSV reading -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script src="https://d3js.org/d3.v7.min.js"></script>

<style>
    /* Buttons styling */
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
    .btn:hover {
        background-color: #007ba1; /* slightly darker on hover */
    }
    /* Light/dark for buttons */
    body.dark-mode .btn {
        background-color: #444;
        color: #eee;
    }
    body.dark-mode .btn:hover {
        background-color: #666;
    }
    form {
        margin-bottom: 20px;
    }
    label {
        margin-right: 10px;
        font-weight: bold;
    }
    input[type="date"],
    input[type="text"],
    select {
        padding: 4px 6px;
        font-size: 14px;
        margin-right: 8px;
    }
    /* Warning message for unknown teams */
    .warning {
        color: #c00;
        font-weight: bold;
        margin: 10px auto;
        max-width: 300px;
    }
    /* Suggestion lists for the custom auto-complete approach */
    .suggestion-list {
        position: absolute;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 3px;
        margin-top: 2px;
        z-index: 999;
        width: 200px; /* match input width if desired */
        max-height: 150px;
        overflow-y: auto;
    }
    .suggestion-list li {
        padding: 4px;
        cursor: pointer;
    }
    .suggestion-list li:hover {
        background: #eee;
    }
    .team-logo {
        width: auto;
        max-width: 120px;
        height: 120px;
        display: block;
        margin: 0 auto;
    }
    .team-name {
        font-size: 1.2em;
        font-weight: bold;
        text-align: center;
        margin-top: 5px;
    }
    .button-row {
        margin-top: 10px;
    }
    .teams-row {
        text-align: center;
        margin-bottom: 40px;
        flex-wrap: wrap;
    }
    .vs-label {
        display: none;
        margin: 0 5px;
        font-size: 2em;
        font-weight: bold;
        vertical-align: middle;
    }
    .team-container {
        display: inline-block;
        width: 20%;
        text-align: center;
        vertical-align: middle;
        min-width: 150px;
    }
    svg {
        overflow: visible;
    }
    .chart-container {
        display: flex;
        justify-content: center;
        max-width: 900px;
        margin: 0 auto 2px auto;
    }
    .chart-container svg text {
        fill: currentColor; /* uses the inherited color from the container (which is from body) */
    }
    .chart-container svg {
        width: 100%;
        height: auto;
        display: block;
    }
    .bar-label {
        font-weight: bold;
    }
    .match-list {
        margin-top: 5px;
        text-align: center;
    }
    .match-item {
        margin: 20px 0;
    }
    .match-date {
        margin-bottom: 5px;
        margin-left: 35%;
        text-align: left;
        font-style: italic;
    }

    @media (max-width: 600px) {
        /* Possibly stack team logos vertically, reduce chart container, etc. */
        .team-logo {
            max-width: 60px;
        }
        .teams-row {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center; /* optional */
        }
        .team-container {
            width: 100%;
            margin-bottom: 10px; /* space between the team block and vs */
        }
        .vs-label {
            margin-bottom: 10px; /* small gap below 'vs' */
        }
        .match-date {
            margin-left: 15%; /* bring date closer to center on narrow devices */
        }
        /* Make the form inputs appear one per line */
        form#compareForm {
            display: flex;
            flex-direction: column;
            align-items: flex-start; /* left-align the labels/inputs */
        }
        form#compareForm .form-row,
        form#compareForm br {
            display: none; /* Hide existing line breaks if you'd like a cleaner layout */
        }

        /* Space out each label+input nicely */
        form#compareForm label,
        form#compareForm input[type="text"],
        form#compareForm input[type="date"],
        form#compareForm select {
            display: block; /* Each on its own line */
            margin: 8px 0;
        }

        /* The button row can stay together horizontally, centered */
        .button-row {
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 100%;
            margin-top: 10px;
        }
    }
</style>

<br /><br /><h2>Head-to-Head Statistics</h2><br />

<form id="compareForm">
  <label for="team1Input">Team #1:</label>
  <input type="text" id="team1Input" list ="teams"/>

<label for="team2Input">Team #2:</label>
<input type="text" id="team2Input" list="teams" />

<datalist id="teams"></datalist>
<br /><br />

<label for="startDate">Start Date:</label>
<input type="date" id="startDate" />

<label for="endDate">End Date:</label>
<input type="date" id="endDate" />

<label for="premierOnly">Premier League Era only?</label>
<input type="checkbox" id="premierOnly" />

  <div class="button-row">
    <button type="submit" class="btn">Compare</button>
    <button type="button" id="resetButton" class="btn">Reset</button>
  </div>
</form>

<div id="warningMessage" class="warning" style="display:none;">Unknown team name!</div>
<div id="shareLink" style="display:none; margin: 10px 0; font-weight: bold;"></div>

<div class="teams-row">
  <div class="team-container" id="team1Container">
    <img class="team-logo" id="team1Logo" />
    <div class="team-name" id="team1Name"></div>
  </div>
  <div class="vs-label" id="vsLabel">vs</div>
  <div class="team-container" id="team2Container">
    <img class="team-logo" id="team2Logo" />
    <div class="team-name" id="team2Name"></div>
  </div>
</div>

<div class="chart-container" id="chart"></div>
<div id="shareLink" style="display:none; margin: 10px 0; font-weight: bold;"></div>
<div class="match-list" id="matchList"></div>

<script>
  function getURLParameter(e) {
    return new URLSearchParams(window.location.search).get(e) || "";
  }
  function editDistance(e, i) {
    e = e.toLowerCase();
    i = i.toLowerCase();
    const t = [];
    for (let i2 = 0; i2 <= e.length; i2++) {
      t[i2] = [i2];
    }
    for (let e2 = 0; e2 <= i.length; e2++) {
      t[0][e2] = e2;
    }
    for (let a = 1; a <= e.length; a++) {
      for (let o = 1; o <= i.length; o++) {
        if (e.charAt(a - 1) === i.charAt(o - 1)) {
          t[a][o] = t[a - 1][o - 1];
        } else {
          t[a][o] =
            1 +
            Math.min(
              t[a - 1][o],
              t[a][o - 1],
              t[a - 1][o - 1]
            );
        }
      }
    }
    return t[e.length][i.length];
  }
  function getClosestTeamName(e, i) {

    if (!e) return "";

// Convert input to lowercase once
    const lowerInput = e.toLowerCase();

// 1) Check for exact match
    const exact = i.find(team => team.toLowerCase() === lowerInput);
    if (exact) {
      return exact;
    }

// 2) Gather partial matches first
    const partials = i.filter(team => team.toLowerCase().includes(lowerInput));
    const candidateList = partials.length ? partials : i;

    let bestTeam = "";
    let bestDistance = Infinity;

    candidateList.forEach(team => {
      const dist = editDistance(team, e);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestTeam = team;
      }
    });

    return bestTeam;
  }

  function filterMatches(e, i, t, a, o, d) {
    return e.filter((n) => {
      const r = n.HomeTeam,
        s = n.AwayTeam;
      if (!(r === i && s === t) && !(r === t && s === i)) return false;
      const dateObj = new Date(n.Date);
      if (a) {
        if (dateObj < new Date(a)) return false;
      }
      if (o) {
        if (dateObj > new Date(o)) return false;
      }
      if (d) {
        if (dateObj < new Date("1992-08-01")) return false;
      }
      return true;
    });
  }
  function calculateStats(e, i, t) {
    let a = 0,  // team1Wins
      o = 0,  // team2Wins
      d = 0,  // draws
      n = 0,  // team1Goals
      r = 0,  // team2Goals
      s = 0,  // biggestWinMarginT1
      biggestWinOccurrencesT1 = [],
      g = 0,  // biggestWinMarginT2
      biggestWinOccurrencesT2 = [];

    e.forEach((h) => {
      const _ = h.HomeTeam,
        u = h.AwayTeam,
        k = +h.hGoal,
        S = +h.aGoal;

      // Tally goals
      if (_ === i) {
        n += k;
        r += S;
      } else if (_ === t) {
        r += k;
        n += S;
      }

      // Determine winner
      if (k > S) {
        const margin = k - S;
        if (_ === i) {
          a++;
          if (margin > s) {
            s = margin;
            biggestWinOccurrencesT1 = [{ date: h.Date, score: h.Score }];
          } else if (margin === s) {
            biggestWinOccurrencesT1.push({ date: h.Date, score: h.Score });
          }
        } else {
          o++;
          if (margin > g) {
            g = margin;
            biggestWinOccurrencesT2 = [{ date: h.Date, score: h.Score }];
          } else if (margin === g) {
            biggestWinOccurrencesT2.push({ date: h.Date, score: h.Score });
          }
        }
      } else if (S > k) {
        const margin = S - k;
        if (u === i) {
          a++;
          if (margin > s) {
            s = margin;
            biggestWinOccurrencesT1 = [{ date: h.Date, score: h.Score }];
          } else if (margin === s) {
            biggestWinOccurrencesT1.push({ date: h.Date, score: h.Score });
          }
        } else {
          o++;
          if (margin > g) {
            g = margin;
            biggestWinOccurrencesT2 = [{ date: h.Date, score: h.Score }];
          } else if (margin === g) {
            biggestWinOccurrencesT2.push({ date: h.Date, score: h.Score });
          }
        }
      } else {
        d++;
      }
    });

    return {
      team1Wins: a,
      team2Wins: o,
      draws: d,
      team1Goals: n,
      team2Goals: r,
      biggestWinMarginT1: s,
      biggestWinOccurrencesT1,
      biggestWinMarginT2: g,
      biggestWinOccurrencesT2
    };
  }
  function renderComparisonChart(stats) {
    // Data for the first three rows
    const chartData = [
      { label: "Wins", team1Value: stats.team1Wins, team2Value: stats.team2Wins },
      { label: "Draws", team1Value: stats.draws, team2Value: stats.draws },
      { label: "Goals For", team1Value: stats.team1Goals, team2Value: stats.team2Goals }
    ];

    const marginData = {
      label: "Biggest Win",
      team1Value: stats.biggestWinMarginT1,
      team2Value: stats.biggestWinMarginT2
    };

    // Remove old chart
    d3.select("#chart").selectAll("*").remove();

    // We'll define a "virtual" width/height for the chart,
    // then scale it to fit the container via viewBox.
    const margin = { top: 20, right: 30, bottom: 20, left: 50 };
    const chartWidth = 800; // internal coordinate space
    const chartHeight = 250;
    const contentWidth = chartWidth - margin.left - margin.right;
    const contentHeight = chartHeight - margin.top - margin.bottom;

    // Rows
    const barHeight = 25;
    const rowGap = 15;
    const totalRows = 4;
    const centerGap = 120;

    // Create an SVG that uses a responsive viewBox
    const svg = d3.select("#chart")
      .append("svg")
      .attr("viewBox", `0 0 ${chartWidth} ${chartHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
    // ensures scaling keeps aspect ratio,
    // "meet" keeps entire chart visible.

    // We'll place a group inside, offset by our margins
    const chartG = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const halfWidth = (contentWidth - centerGap) / 2;
    const gapLeft = halfWidth;
    const gapCenter = gapLeft + centerGap / 2;

    // Scale for the first 3 rows
    const maxVal = d3.max(chartData, d => Math.max(d.team1Value, d.team2Value));
    const xLeft = d3.scaleLinear().domain([0, maxVal]).range([0, halfWidth]);
    const xRight = d3.scaleLinear().domain([0, maxVal]).range([0, halfWidth]);

    // Render the first 3 rows
    chartData.forEach((d, i) => {
      const yPos = i * (barHeight + rowGap);

      // Left bar
      const wLeft = xLeft(d.team1Value);
      chartG.append("rect")
        .attr("x", gapLeft - wLeft)
        .attr("y", yPos)
        .attr("width", wLeft)
        .attr("height", barHeight)
        .attr("fill", "#599ad3");

      // Left text
      chartG.append("text")
        .attr("x", gapLeft - wLeft - 5)
        .attr("y", yPos + barHeight / 1.5)
        .attr("text-anchor", "end")
        .text(d.team1Value);

      // Center label
      chartG.append("text")
        .attr("x", gapCenter)
        .attr("y", yPos + barHeight / 1.5)
        .attr("text-anchor", "middle")
        .attr("class", "bar-label")
        .text(d.label);

      // Right bar
      const rightX = gapLeft + centerGap;
      const wRight = xRight(d.team2Value);
      chartG.append("rect")
        .attr("x", rightX)
        .attr("y", yPos)
        .attr("width", wRight)
        .attr("height", barHeight)
        .attr("fill", "#d3635a");

      // Right text
      chartG.append("text")
        .attr("x", rightX + wRight + 5)
        .attr("y", yPos + barHeight / 1.5)
        .text(d.team2Value);
    });

    // Biggest Win row
    const maxMargin = 10 //d3.max([marginData.team1Value, marginData.team2Value]);
    const xLeftMargin = d3.scaleLinear().domain([0, maxMargin]).range([0, halfWidth]);
    const xRightMargin = d3.scaleLinear().domain([0, maxMargin]).range([0, halfWidth]);
    const yPosMargin = 3 * (barHeight + rowGap);

    // Team1
    const leftBarWidth = xLeftMargin(marginData.team1Value);
    chartG.append("rect")
      .attr("x", gapLeft - leftBarWidth)
      .attr("y", yPosMargin)
      .attr("width", leftBarWidth)
      .attr("height", barHeight)
      .attr("fill", "#599ad3");

    let team1Label = "";
    if (stats.biggestWinOccurrencesT1 && stats.biggestWinOccurrencesT1.length > 0) {
      // Build a combined string of all date/score pairs
      team1Label = stats.biggestWinOccurrencesT1
        .map(o => `${o.score} on ${o.date}`)
        .join("; ");
    }
    chartG.append("text")
      .attr("x", gapLeft - leftBarWidth - 5)
      .attr("y", yPosMargin + barHeight / 1.5)
      .attr("text-anchor", "end")
      .text(team1Label);

    // Center label
    chartG.append("text")
      .attr("x", gapCenter)
      .attr("y", yPosMargin + barHeight / 1.5)
      .attr("text-anchor", "middle")
      .attr("class", "bar-label")
      .text(marginData.label);

    // Team2
    const rightX = gapLeft + centerGap;
    const rightBarWidth = xRightMargin(marginData.team2Value);
    chartG.append("rect")
      .attr("x", rightX)
      .attr("y", yPosMargin)
      .attr("width", rightBarWidth)
      .attr("height", barHeight)
      .attr("fill", "#d3635a");

    let team2Label = "";
    if (stats.biggestWinOccurrencesT2 && stats.biggestWinOccurrencesT2.length > 0) {
      team2Label = stats.biggestWinOccurrencesT2
        .map(o => `${o.score} on ${o.date}`)
        .join("; ");
    }
    chartG.append("text")
      .attr("x", rightX + rightBarWidth + 5)
      .attr("y", yPosMargin + barHeight / 1.5)
      .text(team2Label);
  }
  function renderMatchesList(e) {
    const i = document.getElementById("matchList");
    i.innerHTML = "";
    const t = e
        .slice()
        .sort((a, b) => new Date(b.Date) - new Date(a.Date)),
      a = document.createElement("h2");
    a.textContent = "Head-to-Head Results";
    i.appendChild(a);
    t.forEach((o) => {
      const d = document.createElement("div");
      d.className = "match-item";
      const n = document.createElement("div");
      n.className = "match-date";
      n.textContent = o.Date;
      d.appendChild(n);
      const r = parseInt(o.hGoal, 10),
        s = parseInt(o.aGoal, 10);
      let h = o.HomeTeam,
        _ = o.AwayTeam;
      if (r > s) {
        h = "<b>" + h + "</b>";
      } else if (s > r) {
        _ = "<b>" + _ + "</b>";
      }
      const u = document.createElement("div");
      u.innerHTML = `${h} vs ${_} (${o.Score})`;
      u.style.textAlign = "center";
      d.appendChild(u);
      i.appendChild(d);
    });
  }

  fetch('https://raw.githubusercontent.com/seanelvidge/England-football-results/refs/heads/main/EnglandLeagueTeamLogos.csv')
    .then(res => res.text())
    .then(text => {
      const rows = Papa.parse(text, {
        header: true,
        skipEmptyLines: true
      }).data;
    // Convert array of objects into a dictionary
    const dict = {};
    rows.forEach(row => {
      if (row.Team && row.LogoURL) {
        dict[row.Team.trim()] = row.LogoURL.trim();
      }
    });

    // Assign to global (or scoped) variable
    window.teamLogos = dict;

    csvUrl =
      "https://raw.githubusercontent.com/seanelvidge/England-football-results/main/EnglandLeagueResults.csv";
  let allMatches = [],
    allTeams = [];
  d3.csv(csvUrl).then((e2) => {
    allMatches = e2;
    const i = new Set();
    e2.forEach((n) => {
      i.add(n.HomeTeam);
      i.add(n.AwayTeam);
    });
    allTeams = Array.from(i).sort();
    const t = document.getElementById("teams");
    allTeams.forEach((n) => {
      const r = document.createElement("option");
      r.value = n;
      t.appendChild(r);
    });
    const a = getURLParameter("team1"),
      o = getURLParameter("team2"),
      start = getURLParameter("startDate"),
      end = getURLParameter("endDate"),
      ple = getURLParameter("PLEra");
    if (a) {
      document.getElementById("team1Input").value = getClosestTeamName(
        a,
        allTeams
      );
    }
    if (o) {
      document.getElementById("team2Input").value = getClosestTeamName(
        o,
        allTeams
      );
    }
    if (start) {
      document.getElementById("startDate").value = start;
    }
    if (end) {
      document.getElementById("endDate").value = end;
    }
    if (ple && ple === "true") { // Checkbox should match "true" (case-sensitive)
      document.getElementById("premierOnly").checked = true;
    }
    if (a || o) {
      document.querySelector('#compareForm button[type="submit"]').click();
    }
  });
  document
    .getElementById("compareForm")
    .addEventListener("submit", (e2) => {
      e2.preventDefault();
      const iRaw = document.getElementById("team1Input").value.trim(),
        tRaw = document.getElementById("team2Input").value.trim(),
        a = document.getElementById("startDate").value,
        o = document.getElementById("endDate").value,
        d = document.getElementById("premierOnly").checked;

      // Attempt to match team1 input
      let i = allTeams.includes(iRaw) ? iRaw : getClosestTeamName(iRaw, allTeams);
      // Attempt to match team2 input
      let t = allTeams.includes(tRaw) ? tRaw : getClosestTeamName(tRaw, allTeams);

      // If either is empty after trying, show warning & stop
      const warnDiv = document.getElementById("warningMessage");
      warnDiv.style.display = "none";
      if (!i) {
        warnDiv.textContent = "Unknown team name: " + iRaw;
        warnDiv.style.display = "block";
        return;
      }
      if (!t) {
        warnDiv.textContent = "Unknown team name: " + tRaw;
        warnDiv.style.display = "block";
        return;
      }

      // Now we have valid i & t
      document.getElementById("team1Logo").src = teamLogos[i] || "";
      document.getElementById("team2Logo").src = teamLogos[t] || "";
      document.getElementById("team1Name").textContent = i;
      document.getElementById("team2Name").textContent = t;
      document.getElementById("vsLabel").style.display = i && t ? "inline-block" : "none";

      const n = filterMatches(allMatches, i, t, a, o, d),
        r = calculateStats(n, i, t);
      renderComparisonChart(r);
      renderMatchesList(n);

      // Build a new shareable URL with the final, matched names:
      const baseUrl = "https://seanelvidge.com/h2h";
      const shareUrl = `${baseUrl}?team1=${encodeURIComponent(i)}&team2=${encodeURIComponent(t)}${a ? `&startDate=${encodeURIComponent(a)}` : ""}${o ? `&endDate=${encodeURIComponent(o)}` : ""}${d ? `&PLEra=true` : ""}`;

      // Insert a link in the #shareLink div:
      const shareDiv = document.getElementById("shareLink");
      shareDiv.style.display = "block";
      shareDiv.innerHTML = `
    <a href="${shareUrl}" target="_blank" rel="noopener">URL link for this head-to-head</a><br><br>
    `;
    });
  document
    .getElementById("resetButton")
    .addEventListener("click", () => {
      window.location.search = "";
      window.location.reload();
    });
</script>

</html>
