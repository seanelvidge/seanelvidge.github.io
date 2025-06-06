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
  const teamLogos = {
      "Aberdare Athletic":
        "https://r2.thesportsdb.com/images/media/team/badge/jmcjrh1639005987.png",
      "AFC Bournemouth":
        "https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg",
      "AFC Wimbledon":
        "https://upload.wikimedia.org/wikipedia/en/1/1b/AFC_Wimbledon_%282020%29_logo.svg",
      "Accrington F.C.":
        "https://r2.thesportsdb.com/images/media/team/badge/pdks3s1639600928.png",
      "Accrington Stanley":
        "https://upload.wikimedia.org/wikipedia/en/b/ba/Accrington_Stanley_F.C._logo.svg",
      Aldershot:
        "https://upload.wikimedia.org/wikipedia/en/2/25/Aldershot_FC_crest.svg",
      Arsenal:
        "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
      Ashington:
        "https://upload.wikimedia.org/wikipedia/en/6/61/Ashington_A.F.C._logo.png",
      "Aston Villa":
        "https://upload.wikimedia.org/wikipedia/en/9/9a/Aston_Villa_FC_new_crest.svg",
      Barnet:
        "https://upload.wikimedia.org/wikipedia/en/a/a2/Barnet_FC.svg",
      Barnsley:
        "https://upload.wikimedia.org/wikipedia/en/c/c9/Barnsley_FC.svg",
      Barrow:
        "https://upload.wikimedia.org/wikipedia/en/2/28/Barrow_AFC_logo.svg",
      "Birmingham City":
        "https://upload.wikimedia.org/wikipedia/en/6/68/Birmingham_City_FC_logo.svg",
      "Blackburn Rovers":
        "https://upload.wikimedia.org/wikipedia/en/0/0f/Blackburn_Rovers.svg",
      Blackpool:
        "https://upload.wikimedia.org/wikipedia/en/d/df/Blackpool_FC_logo.svg",
      "Bolton Wanderers":
        "https://upload.wikimedia.org/wikipedia/en/8/82/Bolton_Wanderers_FC_logo.svg",
      Bootle:
        "https://upload.wikimedia.org/wikipedia/en/6/6c/Bootle_FC_logo.png",
      "Boston United":
        "https://upload.wikimedia.org/wikipedia/en/5/53/Boston_United_FC_logo.svg",
      "Bradford City":
        "https://upload.wikimedia.org/wikipedia/en/0/04/Bradford_City_AFC_crest.svg",
      "Bradford Park Avenue":
        "https://upload.wikimedia.org/wikipedia/en/6/62/Bradford_%28Park_Avenue%29_A.F.C._logo.png",
      Brentford:
        "https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg",
      "Brighton & Hove Albion":
        "https://upload.wikimedia.org/wikipedia/en/d/d0/Brighton_and_Hove_Albion_FC_crest.svg",
      "Bristol City":
        "https://upload.wikimedia.org/wikipedia/en/f/f5/Bristol_City_crest.svg",
      "Bristol Rovers":
        "https://upload.wikimedia.org/wikipedia/en/4/47/Bristol_Rovers_F.C._logo.svg",
      Bromley:
        "https://upload.wikimedia.org/wikipedia/en/3/35/Bromley_FC_crest.svg",
      Burnley:
        "https://upload.wikimedia.org/wikipedia/en/6/6d/Burnley_FC_Logo.svg",
      "Burton Albion":
        "https://upload.wikimedia.org/wikipedia/en/5/53/Burton_Albion_FC_logo.svg",
      "Burton Swifts":
        "https://r2.thesportsdb.com/images/media/team/badge/c7ydqi1626283781.png",
      "Burton United":
        "https://r2.thesportsdb.com/images/media/team/badge/csfaiv1623622543.png",
      "Burton Wanderers":
        "https://r2.thesportsdb.com/images/media/team/badge/1vnr3m1639601861.png",
      Bury:
        "https://upload.wikimedia.org/wikipedia/en/6/65/Bury_FC_crest.svg",
      "Cambridge United":
        "https://upload.wikimedia.org/wikipedia/en/8/8f/Cambridge_United_FC.svg",
      "Cardiff City":
        "https://upload.wikimedia.org/wikipedia/en/3/3c/Cardiff_City_crest.svg",
      "Carlisle United":
        "https://upload.wikimedia.org/wikipedia/en/6/6c/Carlisle_United_FC_crest.svg",
      "Charlton Athletic":
        "https://upload.wikimedia.org/wikipedia/en/f/f5/Charlton_Athletic_FC_crest.svg",
      Chelsea:
        "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
      "Cheltenham Town":
        "https://upload.wikimedia.org/wikipedia/en/c/c3/Cheltenham_Town_F.C._logo.svg",
      Chester:
        "https://upload.wikimedia.org/wikipedia/en/c/cb/Chester-fc.svg",
      Chesterfield:
        "https://upload.wikimedia.org/wikipedia/en/9/94/Chesterfield_FC_crest.svg",
      "Colchester United":
        "https://upload.wikimedia.org/wikipedia/en/9/9c/Colchester_United_FC_crest.svg",
      "Coventry City":
        "https://upload.wikimedia.org/wikipedia/en/7/7b/Coventry_City_FC_crest.svg",
      "Crawley Town":
        "https://upload.wikimedia.org/wikipedia/en/1/11/Crawley_Town_FC_crest.svg",
      "Crewe Alexandra":
        "https://upload.wikimedia.org/wikipedia/en/9/9d/Crewe_Alexandra.svg",
      "Crystal Palace":
        "https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo_%282022%29.svg",
      "Dagenham and Redbridge":
        "https://upload.wikimedia.org/wikipedia/en/e/e0/Dagenham_and_Redbridge_FC_crest.svg",
      Darlington:
        "https://upload.wikimedia.org/wikipedia/en/a/ad/Darlington_FC_crest.svg",
      Darwen:
        "https://upload.wikimedia.org/wikipedia/en/f/fe/Darwen_FC_crest.png",
      "Derby County":
        "https://upload.wikimedia.org/wikipedia/en/4/4a/Derby_County_crest.svg",
      "Doncaster Rovers":
        "https://upload.wikimedia.org/wikipedia/en/c/c5/Doncaster_Rovers_F.C._logo.svg",
      "Durham City":
        "https://upload.wikimedia.org/wikipedia/en/1/14/DurhamCityBadge.png",
      Everton:
        "https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg",
      "Exeter City":
        "https://upload.wikimedia.org/wikipedia/en/7/71/Exeter_City_FC.svg",
      "Fleetwood Town":
        "https://upload.wikimedia.org/wikipedia/en/e/ed/Fleetwood_Town_F.C._logo.svg",
      "Forest Green Rovers":
        "https://upload.wikimedia.org/wikipedia/en/8/85/Forest_Green_Rovers_crest.svg",
      Fulham:
        "https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg",
      "Gainsborough Trinity":
        "https://upload.wikimedia.org/wikipedia/en/f/f4/Gainsborough_Trinity_FC_crest.svg",
      Gillingham:
        "https://upload.wikimedia.org/wikipedia/en/5/5e/FC_Gillingham_Logo.svg",
      "Glossop North End":
        "https://upload.wikimedia.org/wikipedia/en/5/5e/GNE_afc_badge.png",
      "Grimsby Town":
        "https://upload.wikimedia.org/wikipedia/en/d/db/Grimsby_Town_F.C._logo.svg",
      "Halifax Town":
        "https://upload.wikimedia.org/wikipedia/en/e/e5/FC_Halifax_Town_crest.svg",
      "Harrogate Town":
        "https://upload.wikimedia.org/wikipedia/en/4/40/Harrogate_Town_AFC.svg",
      "Hartlepool United":
        "https://upload.wikimedia.org/wikipedia/en/4/42/Hartlepool_United_FC_crest.svg",
      "Hereford United":
        "https://upload.wikimedia.org/wikipedia/en/7/75/Hereford_United_FC.svg",
      "Huddersfield Town":
        "https://upload.wikimedia.org/wikipedia/en/4/43/Huddersfield_Town_AFC_crest.svg",
      "Hull City":
        "https://upload.wikimedia.org/wikipedia/en/5/54/Hull_City_A.F.C._logo.svg",
      "Ipswich Town":
        "https://upload.wikimedia.org/wikipedia/en/4/43/Ipswich_Town.svg",
      "Kidderminster Harriers":
        "https://upload.wikimedia.org/wikipedia/en/6/6e/Kidderminster_Harriers_FC_crest.svg",
      "Leeds City":
        "https://upload.wikimedia.org/wikipedia/en/9/9b/Leeds_old_arms.png",
      "Leeds United":
        "https://upload.wikimedia.org/wikipedia/en/5/54/Leeds_United_F.C._logo.svg",
      "Leicester City":
        "https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg",
      "Leyton Orient":
        "https://upload.wikimedia.org/wikipedia/en/a/a8/Leyton_Orient_F.C._logo.svg",
      "Lincoln City":
        "https://upload.wikimedia.org/wikipedia/en/3/39/Lincoln_City_FC_2024_crest.svg",
      Liverpool:
        "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
      Loughborough:
        "https://r2.thesportsdb.com/images/media/team/badge/77rjz71639602384.png",
      "Luton Town":
        "https://upload.wikimedia.org/wikipedia/en/9/9d/Luton_Town_logo.svg",
      Macclesfield:
        "https://upload.wikimedia.org/wikipedia/en/7/75/Macclesfield_FC_crest.svg",
      "Maidstone United":
        "https://upload.wikimedia.org/wikipedia/en/b/b8/Maidstone_United_FC_crest.svg",
      "Manchester City":
        "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
      "Manchester United":
        "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
      "Mansfield Town":
        "https://upload.wikimedia.org/wikipedia/en/7/7d/Mansfield_Town_FC.svg",
      "Merthyr Town":
        "https://upload.wikimedia.org/wikipedia/en/4/42/Merthyr_Town_FC_crest.svg",
      Middlesbrough:
        "https://upload.wikimedia.org/wikipedia/en/2/2c/Middlesbrough_FC_crest.svg",
      "Middlesbrough Ironopolis":
        "https://r2.thesportsdb.com/images/media/team/badge/vibcqw1639600004.png",
      Millwall:
        "https://upload.wikimedia.org/wikipedia/en/9/98/Millwall_FC_crest.svg",
      "Milton Keynes Dons":
        "https://upload.wikimedia.org/wikipedia/en/b/b9/Milton_Keynes_Dons_FC_crest.svg",
      Morecambe:
        "https://upload.wikimedia.org/wikipedia/en/e/ee/Morecambe_FC_crest.svg",
      Nelson:
        "https://upload.wikimedia.org/wikipedia/en/9/94/Nelson_FC_Logo.png",
      "New Brighton":
        "https://upload.wikimedia.org/wikipedia/en/a/ac/New_Brighton_AFC_crest.jpg",
      "Newcastle United":
        "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
      "Newport County":
        "https://upload.wikimedia.org/wikipedia/en/4/44/Newport_County_AFC_crest.svg",
      "Northampton Town":
        "https://upload.wikimedia.org/wikipedia/en/2/2d/Northampton_Town_F.C._logo.svg",
      "Northwich Victoria":
        "https://upload.wikimedia.org/wikipedia/en/1/15/Northwich.png",
      "Norwich City":
        "https://upload.wikimedia.org/wikipedia/en/1/17/Norwich_City_FC_logo.svg",
      "Nottingham Forest":
        "https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg",
      "Notts County":
        "https://upload.wikimedia.org/wikipedia/en/2/2e/Notts_County_Logo.svg",
      "Oldham Athletic":
        "https://upload.wikimedia.org/wikipedia/en/a/a2/Oldham_Athletic_AFC_%28emblem%29.svg",
      "Oxford United":
        "https://upload.wikimedia.org/wikipedia/en/3/3e/Oxford_United_FC_logo.svg",
      "Peterborough United":
        "https://upload.wikimedia.org/wikipedia/en/d/d4/Peterborough_United.svg",
      "Plymouth Argyle":
        "https://upload.wikimedia.org/wikipedia/en/a/a8/Plymouth_Argyle_F.C._logo.svg",
      "Port Vale":
        "https://upload.wikimedia.org/wikipedia/en/5/5f/Port_Vale_logo.svg",
      Portsmouth:
        "https://upload.wikimedia.org/wikipedia/en/3/38/Portsmouth_FC_logo.svg",
      "Preston North End":
        "https://upload.wikimedia.org/wikipedia/en/8/82/Preston_North_End_FC.svg",
      "Queens Park Rangers":
        "https://upload.wikimedia.org/wikipedia/en/3/31/Queens_Park_Rangers_crest.svg",
      Reading:
        "https://upload.wikimedia.org/wikipedia/en/1/11/Reading_FC.svg",
      Rochdale:
        "https://upload.wikimedia.org/wikipedia/en/b/bb/Rochdale_AFC_crest.svg",
      "Rotherham County":
        "https://upload.wikimedia.org/wikipedia/en/1/14/Rotherham_County_FC_crest.png",
      "Rotherham Town":
        "https://upload.wikimedia.org/wikipedia/en/b/be/Rotherham_Town_FC_crest.png",
      "Rotherham United":
        "https://upload.wikimedia.org/wikipedia/en/c/c0/Rotherham_United_FC.svg",
      "Rushden & Diamonds":
        "https://upload.wikimedia.org/wikipedia/en/e/e3/AFC_Rushden_and_Diamonds_logo.png",
      "Salford City":
        "https://upload.wikimedia.org/wikipedia/en/e/e7/Salford_City_FC_crest.svg",
      Scarborough:
        "https://upload.wikimedia.org/wikipedia/en/9/9a/Scarborough_FC_crest.svg",
      "Scunthorpe United":
        "https://upload.wikimedia.org/wikipedia/en/c/c1/Scunthorpe_United_FC_125_crest.svg",
      "Sheffield United":
        "https://upload.wikimedia.org/wikipedia/en/9/9c/Sheffield_United_FC_logo.svg",
      "Sheffield Wednesday":
        "https://upload.wikimedia.org/wikipedia/en/8/88/Sheffield_Wednesday_badge.svg",
      "Shrewsbury Town":
        "https://upload.wikimedia.org/wikipedia/en/1/1b/Shrewsbury_Town_F.C._logo.svg",
      "South Shields":
        "https://upload.wikimedia.org/wikipedia/en/8/81/South_Shields_F.C._New_Crest.png",
      "Southend United":
        "https://upload.wikimedia.org/wikipedia/en/7/79/Southend_United.svg",
      Southampton:
        "https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg",
      Southport:
        "https://upload.wikimedia.org/wikipedia/en/3/35/Southport_FC_crest.svg",
      "Stalybridge Celtic":
        "https://upload.wikimedia.org/wikipedia/en/c/c7/StalybridgeCeltic.png",
      Stevenage:
        "https://upload.wikimedia.org/wikipedia/en/4/49/Stevenage_FC_crest.svg",
      "Stockport County":
        "https://upload.wikimedia.org/wikipedia/en/4/43/Stockport_County_FC_logo_2020.svg",
      "Stoke City":
        "https://upload.wikimedia.org/wikipedia/en/2/29/Stoke_City_FC.svg",
      Sunderland:
        "https://upload.wikimedia.org/wikipedia/en/7/77/Logo_Sunderland.svg",
      "Sutton United":
        "https://upload.wikimedia.org/wikipedia/en/e/eb/Sutton_United_FC_crest.svg",
      "Swansea City":
        "https://upload.wikimedia.org/wikipedia/en/f/f9/Swansea_City_AFC_logo.svg",
      "Swindon Town":
        "https://upload.wikimedia.org/wikipedia/en/a/a3/Swindon_Town_FC.svg",
      Thames:
        "https://r2.thesportsdb.com/images/media/team/badge/68ob3g1623622459.png",
      "Torquay United":
        "https://upload.wikimedia.org/wikipedia/commons/b/b9/TUFC_125.png",
      "Tottenham Hotspur":
        "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
      "Tranmere Rovers":
        "https://upload.wikimedia.org/wikipedia/en/5/55/Tranmere_Rovers_FC_crest.svg",
      Walsall:
        "https://upload.wikimedia.org/wikipedia/en/e/ef/Walsall_FC.svg",
      Watford:
        "https://upload.wikimedia.org/wikipedia/en/e/e2/Watford.svg",
      "West Bromwich Albion":
        "https://upload.wikimedia.org/wikipedia/en/8/8b/West_Bromwich_Albion.svg",
      "West Ham United":
        "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg",
      "Wigan Athletic":
        "https://upload.wikimedia.org/wikipedia/en/4/43/Wigan_Athletic.svg",
      "Wigan Borough":
        "https://upload.wikimedia.org/wikipedia/en/5/52/Wigan_Borough_FC_crest.png",
      Wimbledon:
        "https://upload.wikimedia.org/wikipedia/en/b/b3/Wimbledon_FC_crest.svg",
      "Wolverhampton Wanderers":
        "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg",
      Workington:
        "https://upload.wikimedia.org/wikipedia/en/f/fe/Workington_AFC_crest.svg",
      Wrexham:
        "https://upload.wikimedia.org/wikipedia/en/0/0d/Wrexham_A.F.C._Logo.svg",
      "Wycombe Wanderers":
        "https://upload.wikimedia.org/wikipedia/en/f/fb/Wycombe_Wanderers_FC_logo.svg",
      "Yeovil Town":
        "https://upload.wikimedia.org/wikipedia/en/5/5c/Yeovil_Town_FC_crest.svg",
      "York City":
        "https://upload.wikimedia.org/wikipedia/en/7/71/York_City_FC.svg",
    },
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
