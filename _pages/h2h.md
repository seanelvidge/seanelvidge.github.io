---
layout: page
permalink: /h2h
title: English Football Head-to-Head Statistics
description: Tool for finding the head-to-head statistics between any two teams in the English Football League
nav: false
---

<script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    form {
      margin-bottom: 20px;
    }
    label {
      margin-right: 10px;
      font-weight: bold;
    }
    .team-logo {
      width: 120px;
      height: auto;
      display: block;
      margin: 0 auto;
    }
    .team-name {
      font-size: 1.2em;
      font-weight: bold;
      text-align: center;
      margin-top: 5px;
    }
    .teams-row {
      text-align: center;
      margin-bottom: 40px;
    }
    .vs-label {
      display: none; /* Hidden by default; will show after Compare */
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
    }
    svg {
      overflow: visible;
    }
    .chart-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    .bar-label {
      font-weight: bold;
    }
    /* Match list styling */
    .match-list {
      margin-top: 40px;
      text-align: center;
    }
    .match-item {
      margin: 20px 0;
    }
    .match-date {
      margin-bottom: 5px;
      /* If we want the date near the center, we can do something like: */
      margin-left: 35%; 
      text-align: left;
      font-style: italic;
    }
  </style>
</head>
<body>
  <h1>Head-to-Head Comparison</h1>
  <form id="compareForm">
    <label for="team1Input">Team #1:</label>
    <input type="text" id="team1Input" list="teams" />

    <label for="team2Input">Team #2:</label>
    <input type="text" id="team2Input" list="teams" />

    <datalist id="teams"></datalist>

    <br><br>

    <label for="startDate">Start Date:</label>
    <input type="date" id="startDate" />

    <label for="endDate">End Date:</label>
    <input type="date" id="endDate" />

    <label for="premierOnly">Premier League Era only?</label>
    <input type="checkbox" id="premierOnly" />

    <button type="submit">Compare</button>
    <button type="button" id="resetButton">Reset</button>
  </form>

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
  <div class="match-list" id="matchList"></div>

  <script>
    // Dictionary of known team logos:
    const teamLogos = {
  "Aberdare Athletic": "https://upload.wikimedia.org/wikipedia/en/a/a6/Aberdare_Athletic_FC_crest.png",
  "AFC Bournemouth": "https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg",
  "AFC Wimbledon": "https://upload.wikimedia.org/wikipedia/en/1/1b/AFC_Wimbledon_%282020%29_logo.svg",
  "Accrington F.C.": "https://upload.wikimedia.org/wikipedia/en/7/7b/Accrington_FC_crest.png",
  "Accrington Stanley": "https://upload.wikimedia.org/wikipedia/en/b/ba/Accrington_Stanley_F.C._logo.svg",
  "Aldershot": "https://upload.wikimedia.org/wikipedia/en/2/25/Aldershot_FC_crest.svg",
  "Arsenal": "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  "Ashington": "https://upload.wikimedia.org/wikipedia/en/6/61/Ashington_A.F.C._logo.png",
  "Aston Villa": "https://upload.wikimedia.org/wikipedia/en/9/9a/Aston_Villa_FC_new_crest.svg",
  "Barnet": "https://upload.wikimedia.org/wikipedia/en/a/a2/Barnet_FC.svg",
  "Barnsley": "https://upload.wikimedia.org/wikipedia/en/c/c9/Barnsley_FC.svg",
  "Barrow": "https://upload.wikimedia.org/wikipedia/en/2/28/Barrow_AFC_logo.svg",
  "Birmingham City": "https://upload.wikimedia.org/wikipedia/en/6/68/Birmingham_City_FC_logo.svg",
  "Blackburn Rovers": "https://upload.wikimedia.org/wikipedia/en/0/0f/Blackburn_Rovers.svg",
  "Blackpool": "https://upload.wikimedia.org/wikipedia/en/d/df/Blackpool_FC_logo.svg",
  "Bolton Wanderers": "https://upload.wikimedia.org/wikipedia/en/8/82/Bolton_Wanderers_FC_logo.svg",
  "Bootle": "https://upload.wikimedia.org/wikipedia/en/6/6c/Bootle_FC_logo.png",
  "Boston United": "https://upload.wikimedia.org/wikipedia/en/5/53/Boston_United_FC_logo.svg",
  "Bradford City": "https://upload.wikimedia.org/wikipedia/en/0/04/Bradford_City_AFC_crest.svg",
  "Bradford Park Avenue": "https://upload.wikimedia.org/wikipedia/en/6/62/Bradford_%28Park_Avenue%29_A.F.C._logo.png",
  "Brentford": "https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg",
  "Brighton & Hove Albion": "https://upload.wikimedia.org/wikipedia/en/d/d0/Brighton_and_Hove_Albion_FC_crest.svg",
  "Bristol City": "https://upload.wikimedia.org/wikipedia/en/f/f5/Bristol_City_crest.svg",
  "Bristol Rovers": "https://upload.wikimedia.org/wikipedia/en/4/47/Bristol_Rovers_F.C._logo.svg",
  "Bromley": "https://upload.wikimedia.org/wikipedia/en/3/35/Bromley_FC_crest.svg",
  "Burnley": "https://upload.wikimedia.org/wikipedia/en/6/6d/Burnley_FC_Logo.svg",
  "Burton Albion": "https://upload.wikimedia.org/wikipedia/en/5/53/Burton_Albion_FC_logo.svg",
  "Burton Swifts": "https://upload.wikimedia.org/wikipedia/en/d/d1/Burton_Swifts_FC_logo.png",
  "Burton United": "https://www.thesportsdb.com/images/media/team/badge/csfaiv1623622543.png",
  "Burton Wanderers": "https://www.thesportsdb.com/images/media/team/badge/1vnr3m1639601861.png",
  "Bury": "https://upload.wikimedia.org/wikipedia/en/6/65/Bury_FC_crest.svg",
  "Cambridge United": "https://upload.wikimedia.org/wikipedia/en/8/8f/Cambridge_United_FC.svg",
  "Cardiff City": "https://upload.wikimedia.org/wikipedia/en/3/3c/Cardiff_City_crest.svg",
  "Carlisle United": "https://upload.wikimedia.org/wikipedia/en/6/6c/Carlisle_United_FC_crest.svg",
  "Charlton Athletic": "https://upload.wikimedia.org/wikipedia/en/f/f5/Charlton_Athletic_FC_crest.svg",
  "Chelsea": "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
  "Cheltenham Town": "https://upload.wikimedia.org/wikipedia/en/c/c3/Cheltenham_Town_F.C._logo.svg",
  "Chester": "https://upload.wikimedia.org/wikipedia/en/c/cb/Chester-fc.svg",
  "Chesterfield": "https://upload.wikimedia.org/wikipedia/en/9/94/Chesterfield_FC_crest.svg",
  "Colchester United": "https://upload.wikimedia.org/wikipedia/en/9/9c/Colchester_United_FC_crest.svg",
  "Coventry City": "https://upload.wikimedia.org/wikipedia/en/7/7b/Coventry_City_FC_crest.svg",
  "Crawley Town": "https://upload.wikimedia.org/wikipedia/en/1/11/Crawley_Town_FC_crest.svg",
  "Crewe Alexandra": "https://upload.wikimedia.org/wikipedia/en/9/9d/Crewe_Alexandra.svg",
  "Crystal Palace": "https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo_%282022%29.svg",
  "Dagenham and Redbridge": "https://upload.wikimedia.org/wikipedia/en/e/e0/Dagenham_and_Redbridge_FC_crest.svg",
  "Darlington": "https://upload.wikimedia.org/wikipedia/en/a/ad/Darlington_FC_crest.svg",
  "Darwen": "https://upload.wikimedia.org/wikipedia/en/f/fe/Darwen_FC_crest.png",
  "Derby County": "https://upload.wikimedia.org/wikipedia/en/4/4a/Derby_County_crest.svg",
  "Doncaster Rovers": "https://upload.wikimedia.org/wikipedia/en/c/c5/Doncaster_Rovers_F.C._logo.svg",
  "Durham City": "https://upload.wikimedia.org/wikipedia/en/1/14/DurhamCityBadge.png",
  "Everton": "https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg",
  "Exeter City": "https://upload.wikimedia.org/wikipedia/en/7/71/Exeter_City_FC.svg",
  "Fleetwood Town": "https://upload.wikimedia.org/wikipedia/en/e/ed/Fleetwood_Town_F.C._logo.svg",
  "Forest Green Rovers": "https://upload.wikimedia.org/wikipedia/en/8/85/Forest_Green_Rovers_crest.svg",
  "Fulham": "https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg",
  "Gainsborough Trinity": "https://upload.wikimedia.org/wikipedia/en/f/f4/Gainsborough_Trinity_FC_crest.svg",
  "Gillingham": "https://upload.wikimedia.org/wikipedia/en/5/5e/FC_Gillingham_Logo.svg",
  "Glossop North End": "https://upload.wikimedia.org/wikipedia/en/5/5e/GNE_afc_badge.png",
  "Grimsby Town": "https://upload.wikimedia.org/wikipedia/en/d/db/Grimsby_Town_F.C._logo.svg",
  "Halifax Town": "https://upload.wikimedia.org/wikipedia/en/e/e5/FC_Halifax_Town_crest.svg",
  "Harrogate Town": "https://upload.wikimedia.org/wikipedia/en/4/40/Harrogate_Town_AFC.svg",
  "Hartlepool United": "https://upload.wikimedia.org/wikipedia/en/4/42/Hartlepool_United_FC_crest.svg",
  "Hereford United": "https://upload.wikimedia.org/wikipedia/en/7/75/Hereford_United_FC.svg",
  "Huddersfield Town": "https://upload.wikimedia.org/wikipedia/en/4/43/Huddersfield_Town_AFC_crest.svg",
  "Hull City": "https://upload.wikimedia.org/wikipedia/en/5/54/Hull_City_A.F.C._logo.svg",
  "Ipswich Town": "https://upload.wikimedia.org/wikipedia/en/4/43/Ipswich_Town.svg",
  "Kidderminster Harriers": "https://upload.wikimedia.org/wikipedia/en/6/6e/Kidderminster_Harriers_FC_crest.svg",
  "Leeds City": "https://upload.wikimedia.org/wikipedia/en/9/9b/Leeds_old_arms.png",
  "Leeds United": "https://upload.wikimedia.org/wikipedia/en/5/54/Leeds_United_F.C._logo.svg",
  "Leicester City": "https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg",
  "Leyton Orient": "https://upload.wikimedia.org/wikipedia/en/a/a8/Leyton_Orient_F.C._logo.svg",
  "Lincoln City": "https://upload.wikimedia.org/wikipedia/en/3/39/Lincoln_City_FC_2024_crest.svg",
  "Liverpool": "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
  "Loughborough": "https://upload.wikimedia.org/wikipedia/en/4/4d/Loughborough_FC_Crest.png",
  "Luton Town": "https://upload.wikimedia.org/wikipedia/en/9/9d/Luton_Town_logo.svg",
  "Macclesfield": "https://upload.wikimedia.org/wikipedia/en/7/75/Macclesfield_FC_crest.svg",
  "Maidstone United": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Maidstone_United_1897_logo.png",
  "Manchester City": "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  "Manchester United": "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
  "Mansfield Town": "https://upload.wikimedia.org/wikipedia/en/7/7d/Mansfield_Town_FC.svg",
  "Merthyr Town": "https://upload.wikimedia.org/wikipedia/en/4/42/Merthyr_Town_FC_crest.svg",
  "Middlesbrough": "https://upload.wikimedia.org/wikipedia/en/2/2c/Middlesbrough_FC_crest.svg",
  "Middlesbrough Ironopolis": "https://upload.wikimedia.org/wikipedia/en/5/5a/Middlesbrough_Ironopolis_FC_crest.png",
  "Millwall": "https://upload.wikimedia.org/wikipedia/en/9/98/Millwall_FC_crest.svg",
  "Milton Keynes Dons": "https://upload.wikimedia.org/wikipedia/en/b/b9/Milton_Keynes_Dons_FC_crest.svg",
  "Morecambe": "https://upload.wikimedia.org/wikipedia/en/e/ee/Morecambe_FC_crest.svg",
  "Nelson": "https://upload.wikimedia.org/wikipedia/en/9/94/Nelson_FC_Logo.png",
  "New Brighton": "https://upload.wikimedia.org/wikipedia/en/a/ac/New_Brighton_AFC_crest.jpg",
  "Newcastle United": "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
  "Newport County": "https://upload.wikimedia.org/wikipedia/en/4/44/Newport_County_AFC_crest.svg",
  "Northampton Town": "https://upload.wikimedia.org/wikipedia/en/2/2d/Northampton_Town_F.C._logo.svg",
  "Northwich Victoria": "https://upload.wikimedia.org/wikipedia/en/1/15/Northwich.png",
  "Norwich City": "https://upload.wikimedia.org/wikipedia/en/1/17/Norwich_City_FC_logo.svg",
  "Nottingham Forest": "https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg",
  "Notts County": "https://upload.wikimedia.org/wikipedia/en/2/2e/Notts_County_Logo.svg",
  "Oldham Athletic": "https://upload.wikimedia.org/wikipedia/en/a/a2/Oldham_Athletic_AFC_%28emblem%29.svg",
  "Oxford United": "https://upload.wikimedia.org/wikipedia/en/3/3e/Oxford_United_FC_logo.svg",
  "Peterborough United": "https://upload.wikimedia.org/wikipedia/en/d/d4/Peterborough_United.svg",
  "Plymouth Argyle": "https://upload.wikimedia.org/wikipedia/en/a/a8/Plymouth_Argyle_F.C._logo.svg",
  "Port Vale": "https://upload.wikimedia.org/wikipedia/en/5/5f/Port_Vale_logo.svg",
  "Portsmouth": "https://upload.wikimedia.org/wikipedia/en/3/38/Portsmouth_FC_logo.svg",
  "Preston North End": "https://upload.wikimedia.org/wikipedia/en/8/82/Preston_North_End_FC.svg",
  "Queens Park Rangers": "https://upload.wikimedia.org/wikipedia/en/3/31/Queens_Park_Rangers_crest.svg",
  "Reading": "https://upload.wikimedia.org/wikipedia/en/1/11/Reading_FC.svg",
  "Rochdale": "https://upload.wikimedia.org/wikipedia/en/b/bb/Rochdale_AFC_crest.svg",
  "Rotherham County": "https://upload.wikimedia.org/wikipedia/en/1/14/Rotherham_County_FC_crest.png",
  "Rotherham Town": "https://upload.wikimedia.org/wikipedia/en/b/be/Rotherham_Town_FC_crest.png",
  "Rotherham United": "https://upload.wikimedia.org/wikipedia/en/c/c0/Rotherham_United_FC.svg",
  "Rushden & Diamonds": "https://upload.wikimedia.org/wikipedia/en/e/e3/AFC_Rushden_and_Diamonds_logo.png",
  "Salford City": "https://upload.wikimedia.org/wikipedia/en/e/e7/Salford_City_FC_crest.svg",
  "Scarborough": "https://upload.wikimedia.org/wikipedia/en/9/9a/Scarborough_FC_crest.svg",
  "Scunthorpe United": "https://upload.wikimedia.org/wikipedia/commons/4/40/Scunthorpe_United_Crest_-125_years-.png",
  "Sheffield United": "https://upload.wikimedia.org/wikipedia/en/9/9c/Sheffield_United_FC_logo.svg",
  "Sheffield Wednesday": "https://upload.wikimedia.org/wikipedia/en/8/88/Sheffield_Wednesday_badge.svg",
  "Shrewsbury Town": "https://upload.wikimedia.org/wikipedia/en/1/1b/Shrewsbury_Town_F.C._logo.svg",
  "South Shields": "https://upload.wikimedia.org/wikipedia/en/8/81/South_Shields_F.C._New_Crest.png",
  "Southend United": "https://upload.wikimedia.org/wikipedia/en/7/79/Southend_United.svg",
  "Southampton": "https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg",
  "Southport": "https://upload.wikimedia.org/wikipedia/en/3/35/Southport_FC_crest.svg",
  "Stalybridge Celtic": "https://upload.wikimedia.org/wikipedia/en/c/c7/StalybridgeCeltic.png",
  "Stevenage": "https://upload.wikimedia.org/wikipedia/en/4/49/Stevenage_FC_crest.svg",
  "Stockport County": "https://upload.wikimedia.org/wikipedia/en/4/43/Stockport_County_FC_logo_2020.svg",
  "Stoke City": "https://upload.wikimedia.org/wikipedia/en/2/29/Stoke_City_FC.svg",
  "Sunderland": "https://upload.wikimedia.org/wikipedia/en/7/77/Logo_Sunderland.svg",
  "Sutton United": "https://upload.wikimedia.org/wikipedia/en/e/eb/Sutton_United_FC_crest.svg",
  "Swansea City": "https://upload.wikimedia.org/wikipedia/en/f/f9/Swansea_City_AFC_logo.svg",
  "Swindon Town": "https://upload.wikimedia.org/wikipedia/en/a/a3/Swindon_Town_FC.svg",
  "Thames": "https://www.thesportsdb.com/images/media/team/badge/68ob3g1623622459.png",
  "Torquay United": "https://upload.wikimedia.org/wikipedia/commons/b/b9/TUFC_125.png",
  "Tottenham Hotspur": "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
  "Tranmere Rovers": "https://upload.wikimedia.org/wikipedia/en/5/55/Tranmere_Rovers_FC_crest.svg",
  "Walsall": "https://upload.wikimedia.org/wikipedia/en/e/ef/Walsall_FC.svg",
  "Watford": "https://upload.wikimedia.org/wikipedia/en/e/e2/Watford.svg",
  "West Bromwich Albion": "https://upload.wikimedia.org/wikipedia/en/8/8b/West_Bromwich_Albion.svg",
  "West Ham United": "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg",
  "Wigan Athletic": "https://upload.wikimedia.org/wikipedia/en/4/43/Wigan_Athletic.svg",
  "Wigan Borough": "https://upload.wikimedia.org/wikipedia/en/5/52/Wigan_Borough_FC_crest.png",
  "Wimbledon": "https://upload.wikimedia.org/wikipedia/en/b/b3/Wimbledon_FC_crest.svg",
  "Wolverhampton Wanderers": "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg",
  "Workington": "https://upload.wikimedia.org/wikipedia/en/f/fe/Workington_AFC_crest.svg",
  "Wrexham": "https://upload.wikimedia.org/wikipedia/en/0/0d/Wrexham_A.F.C._Logo.svg",
  "Wycombe Wanderers": "https://upload.wikimedia.org/wikipedia/en/f/fb/Wycombe_Wanderers_FC_logo.svg",
  "Yeovil Town": "https://upload.wikimedia.org/wikipedia/commons/1/18/Yeovil_Town_Football_Club.png",
  "York City": "https://upload.wikimedia.org/wikipedia/en/7/71/York_City_FC.svg"
};

    // CSV data source:
    const csvUrl = "https://raw.githubusercontent.com/seanelvidge/England-football-results/main/EnglandLeagueResults.csv";

    let allMatches = [];
    let allTeams = [];

    // Parse URL parameters:
    // e.g. ?team1=Coventry&team2=Arse
    function getURLParameter(name) {
      const params = new URLSearchParams(window.location.search);
      return params.get(name) || "";
    }

    // Approximate string distance for "closest match":
    // Simple Levenshtein or other approach can be used. 
    // For brevity, here's a quick method.
    function editDistance(a, b) {
      a = a.toLowerCase();
      b = b.toLowerCase();
      const costs = [];
      for (let i = 0; i <= a.length; i++) {
        let lastVal = i;
        costs[i] = [i];
      }
      for (let j = 0; j <= b.length; j++) {
        costs[0][j] = j;
      }
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          if (a.charAt(i - 1) === b.charAt(j - 1)) {
            costs[i][j] = costs[i - 1][j - 1];
          } else {
            costs[i][j] = 1 + Math.min(
              costs[i - 1][j],    // deletion
              costs[i][j - 1],    // insertion
              costs[i - 1][j - 1] // substitution
            );
          }
        }
      }
      return costs[a.length][b.length];
    }

    // Find the best match from the known list of teams
    function getClosestTeamName(inputStr, teamList) {
      if (!inputStr) return "";
      let bestTeam = "";
      let bestDistance = Infinity;
      teamList.forEach(team => {
        const dist = editDistance(team, inputStr);
        if (dist < bestDistance) {
          bestDistance = dist;
          bestTeam = team;
        }
      });
      return bestTeam;
    }

    // Load data
    d3.csv(csvUrl).then(data => {
      allMatches = data;
      const uniqueTeams = new Set();
      data.forEach(d => {
        uniqueTeams.add(d.HomeTeam);
        uniqueTeams.add(d.AwayTeam);
      });
      allTeams = Array.from(uniqueTeams).sort();

      // Populate datalist
      const teamDataList = document.getElementById("teams");
      allTeams.forEach(t => {
        const option = document.createElement("option");
        option.value = t;
        teamDataList.appendChild(option);
      });

      // Check if we have URL params for team1 or team2
      const urlTeam1 = getURLParameter("team1");
      const urlTeam2 = getURLParameter("team2");
      if (urlTeam1) {
        document.getElementById("team1Input").value = getClosestTeamName(urlTeam1, allTeams);
      }
      if (urlTeam2) {
        document.getElementById("team2Input").value = getClosestTeamName(urlTeam2, allTeams);
      }
    });

    // Form submit handler
    document.getElementById("compareForm").addEventListener("submit", e => {
      e.preventDefault();
      const t1 = document.getElementById("team1Input").value;
      const t2 = document.getElementById("team2Input").value;
      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;
      const premierOnly = document.getElementById("premierOnly").checked;

      if (!t1 || !t2) return;

      // Display logos & names
      document.getElementById("team1Logo").src = teamLogos[t1] || "";
      document.getElementById("team2Logo").src = teamLogos[t2] || "";
      document.getElementById("team1Name").textContent = t1;
      document.getElementById("team2Name").textContent = t2;

      // Show vs label if both teams are valid
      const vsLabel = document.getElementById("vsLabel");
      vsLabel.style.display = t1 && t2 ? "inline-block" : "none";

      // Filter & compute stats
      const filtered = filterMatches(allMatches, t1, t2, startDate, endDate, premierOnly);
      const stats = calculateStats(filtered, t1, t2);

      // Render
      renderComparisonChart(stats);
      renderMatchesList(filtered);
    });

    // Reset button
    document.getElementById("resetButton").addEventListener("click", () => {
      window.location.search = "";  // Clear URL params
      window.location.reload();
    });

    function filterMatches(data, team1, team2, start, end, premierOnly) {
      return data.filter(d => {
        const home = d.HomeTeam;
        const away = d.AwayTeam;
        if (!((home === team1 && away === team2) || (home === team2 && away === team1))) {
          return false;
        }
        const matchDate = new Date(d.Date);
        if (start) {
          const s = new Date(start);
          if (matchDate < s) return false;
        }
        if (end) {
          const e = new Date(end);
          if (matchDate > e) return false;
        }
        if (premierOnly) {
          const plStart = new Date("1992-08-01");
          if (matchDate < plStart) return false;
        }
        return true;
      });
    }

    function calculateStats(matches, team1, team2) {
      let t1Wins = 0, t2Wins = 0, draws = 0;
      let t1Goals = 0, t2Goals = 0;

      // Biggest margin
      let biggestWinMarginT1 = 0;
      let biggestWinDateT1 = "";
      let biggestWinScoreT1 = "";

      let biggestWinMarginT2 = 0;
      let biggestWinDateT2 = "";
      let biggestWinScoreT2 = "";

      matches.forEach(m => {
        const hTeam = m.HomeTeam;
        const aTeam = m.AwayTeam;
        const hGoals = +m.hGoal;
        const aGoals = +m.aGoal;

        // Track goals
        if (hTeam === team1) {
          t1Goals += hGoals;
          t2Goals += aGoals;
        } else if (hTeam === team2) {
          t2Goals += hGoals;
          t1Goals += aGoals;
        }

        // Determine winner
        if (hGoals > aGoals) {
          if (hTeam === team1) {
            t1Wins++;
            const margin = hGoals - aGoals;
            if (margin > biggestWinMarginT1) {
              biggestWinMarginT1 = margin;
              biggestWinDateT1 = m.Date;
              biggestWinScoreT1 = m.Score;
            }
          } else {
            t2Wins++;
            const margin = hGoals - aGoals;
            if (margin > biggestWinMarginT2) {
              biggestWinMarginT2 = margin;
              biggestWinDateT2 = m.Date;
              biggestWinScoreT2 = m.Score;
            }
          }
        } else if (aGoals > hGoals) {
          if (aTeam === team1) {
            t1Wins++;
            const margin = aGoals - hGoals;
            if (margin > biggestWinMarginT1) {
              biggestWinMarginT1 = margin;
              biggestWinDateT1 = m.Date;
              biggestWinScoreT1 = m.Score;
            }
          } else {
            t2Wins++;
            const margin = aGoals - hGoals;
            if (margin > biggestWinMarginT2) {
              biggestWinMarginT2 = margin;
              biggestWinDateT2 = m.Date;
              biggestWinScoreT2 = m.Score;
            }
          }
        } else {
          draws++;
        }
      });

      return {
        team1Wins: t1Wins,
        team2Wins: t2Wins,
        draws: draws,
        team1Goals: t1Goals,
        team2Goals: t2Goals,
        biggestWinMarginT1,
        biggestWinDateT1,
        biggestWinScoreT1,
        biggestWinMarginT2,
        biggestWinDateT2,
        biggestWinScoreT2
      };
    }

    function renderComparisonChart(stats) {
      // Data for first three rows
      const chartData = [
        { label: "Wins", team1Value: stats.team1Wins, team2Value: stats.team2Wins },
        { label: "Draws", team1Value: stats.draws, team2Value: stats.draws },
        { label: "Goals Against", team1Value: stats.team2Goals, team2Value: stats.team1Goals }
      ];

      // Biggest margin
      const marginData = {
        label: "Biggest Win",
        team1Value: stats.biggestWinMarginT1,
        team2Value: stats.biggestWinMarginT2
      };

      // Clear old chart
      d3.select("#chart").selectAll("*").remove();

      // Dimensions
      const margin = { top: 20, right: 30, bottom: 20, left: 50 };
      const totalWidth = 800;
      const totalHeight = 300;
      const width = totalWidth - margin.left - margin.right;
      const height = totalHeight - margin.top - margin.bottom;

      // Each bar’s height & row gap
      const barHeight = 25;
      const rowGap = 15;
      const totalRows = 4; // 3 normal + 1 biggest margin
      // centerGap defines how wide the “gap” is between left and right
      const centerGap = 120;

      // Create SVG
      const svg = d3.select("#chart")
        .append("svg")
        .attr("width", totalWidth)
        .attr("height", totalHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // x scales for the first 3 rows
      const maxVal = d3.max(chartData, d => Math.max(d.team1Value, d.team2Value));
      const halfWidth = (width - centerGap) / 2;

      // The left bars scale from 0..maxVal, mapped to 0..halfWidth
      const xLeft = d3.scaleLinear()
        .domain([0, maxVal])
        .range([0, halfWidth]);

      // The right bars scale from 0..maxVal, mapped to 0..halfWidth
      const xRight = d3.scaleLinear()
        .domain([0, maxVal])
        .range([0, halfWidth]);

      // gapLeft is the x-position where the gap starts.
      // i.e. if halfWidth is 300, gapLeft = 300 => that means the left bars 
      // extend from x=0..300, then we have a gap from 300..(300+centerGap).
      const gapLeft = halfWidth; 
      const gapCenter = gapLeft + (centerGap / 2); // For the text labels

      // Render the first 3 rows
      chartData.forEach((d, i) => {
        const yPos = i * (barHeight + rowGap);

        // Left bar (Team1), drawn from gapLeft leftward
        const barWidthLeft = xLeft(d.team1Value);
        svg.append("rect")
          .attr("x", gapLeft - barWidthLeft)
          .attr("y", yPos)
          .attr("width", barWidthLeft)
          .attr("height", barHeight)
          .attr("fill", "#599ad3");

        // Team1 value text
        svg.append("text")
          .attr("x", gapLeft - barWidthLeft - 5)
          .attr("y", yPos + barHeight / 1.5)
          .attr("text-anchor", "end")
          .text(d.team1Value);

        // Center label
        svg.append("text")
          .attr("x", gapCenter)
          .attr("y", yPos + barHeight / 1.5)
          .attr("text-anchor", "middle")
          .attr("class", "bar-label")
          .text(d.label);

        // Right bar (Team2), starting after the center gap
        const barWidthRight = xRight(d.team2Value);
        const rightBarX = gapLeft + centerGap; // position
        svg.append("rect")
          .attr("x", rightBarX)
          .attr("y", yPos)
          .attr("width", barWidthRight)
          .attr("height", barHeight)
          .attr("fill", "#d3635a");

        // Team2 value text
        svg.append("text")
          .attr("x", rightBarX + barWidthRight + 5)
          .attr("y", yPos + barHeight / 1.5)
          .text(d.team2Value);
      });

      // Now handle the biggest margin row
      const maxMargin = d3.max([marginData.team1Value, marginData.team2Value]);
      const xLeftMargin = d3.scaleLinear()
        .domain([0, maxMargin])
        .range([0, halfWidth]);
      const xRightMargin = d3.scaleLinear()
        .domain([0, maxMargin])
        .range([0, halfWidth]);

      const yPosMargin = 3 * (barHeight + rowGap);

      // Team1 margin
      const leftBarWidth = xLeftMargin(marginData.team1Value);
      svg.append("rect")
        .attr("x", gapLeft - leftBarWidth)
        .attr("y", yPosMargin)
        .attr("width", leftBarWidth)
        .attr("height", barHeight)
        .attr("fill", "#599ad3");

      let team1Label = marginData.team1Value;
      if (marginData.team1Value > 0) {
        team1Label = `${stats.biggestWinScoreT1} on ${stats.biggestWinDateT1}`;
      }
      svg.append("text")
        .attr("x", gapLeft - leftBarWidth - 5)
        .attr("y", yPosMargin + barHeight / 1.5)
        .attr("text-anchor", "end")
        .text(team1Label);

      // Center label
      svg.append("text")
        .attr("x", gapCenter)
        .attr("y", yPosMargin + barHeight / 1.5)
        .attr("text-anchor", "middle")
        .attr("class", "bar-label")
        .text(marginData.label);

      // Team2 margin
      const rightBarWidth = xRightMargin(marginData.team2Value);
      const rightBarX = gapLeft + centerGap;
      svg.append("rect")
        .attr("x", rightBarX)
        .attr("y", yPosMargin)
        .attr("width", rightBarWidth)
        .attr("height", barHeight)
        .attr("fill", "#d3635a");

      let team2Label = marginData.team2Value;
      if (marginData.team2Value > 0) {
        team2Label = `${stats.biggestWinScoreT2} on ${stats.biggestWinDateT2}`;
      }
      svg.append("text")
        .attr("x", rightBarX + rightBarWidth + 5)
        .attr("y", yPosMargin + barHeight / 1.5)
        .text(team2Label);
    }

    function renderMatchesList(matches) {
      const listDiv = document.getElementById("matchList");
      listDiv.innerHTML = "";

      const sorted = matches.slice().sort((a, b) => new Date(b.Date) - new Date(a.Date));

      const heading = document.createElement("h2");
      heading.textContent = "Head-to-Head Results";
      listDiv.appendChild(heading);

      sorted.forEach(m => {
        const item = document.createElement("div");
        item.className = "match-item";

        // Date on its own line (slightly offset to the left)
        const dateLine = document.createElement("div");
        dateLine.className = "match-date";
        dateLine.textContent = m.Date;
        item.appendChild(dateLine);

        // Centered line for the match
        const homeGoals = parseInt(m.hGoal, 10);
        const awayGoals = parseInt(m.aGoal, 10);
        let homeTeam = m.HomeTeam;
        let awayTeam = m.AwayTeam;

        // Bold the winning team
        if (homeGoals > awayGoals) {
          homeTeam = "<b>" + homeTeam + "</b>";
        } else if (awayGoals > homeGoals) {
          awayTeam = "<b>" + awayTeam + "</b>";
        }

        const matchLine = document.createElement("div");
        matchLine.innerHTML = `${homeTeam} vs ${awayTeam} (${m.Score})`;
        // Center this line
        matchLine.style.textAlign = "center";

        item.appendChild(matchLine);
        listDiv.appendChild(item);
      });
    }
  </script>
