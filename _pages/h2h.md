---
layout: page
permalink: /h2h
title: English Football Head-to-Head Statistics
description: Tool for finding the head-to-head statistics between any two teams in the English Football League
nav: false
---

<!-- Papa Parse for CSV reading -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>

<style>
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    margin: 20px;
    background: #fafafa;
  }
  h1 {
    text-align: center;
    margin-bottom: 1em;
  }
  form#h2hForm {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    min-width: 200px;
  }
  label {
    font-weight: bold;
    margin-bottom: 0.2em;
  }
  input[type="text"],
  input[type="date"],
  select {
    padding: 0.3em;
    font-size: 1em;
  }
  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin-top: auto;
  }
  button {
    padding: 0.6em 1em;
    font-size: 1em;
    cursor: pointer;
    border: none;
    background: #2b8a3e;
    color: white;
    border-radius: 4px;
    font-weight: bold;
    transition: background 0.3s ease;
    margin-top: auto;
  }
  button:hover {
    background: #236c31;
  }

  /* Head-to-head table styling */
  #h2hTable {
    width: 60%;
    margin: 0 auto;
    border-collapse: collapse;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    border-radius: 6px;
    overflow: hidden;
    font-size: 1.8em;
    /* Fix column widths by declared percentages */
    table-layout: fixed;
  }

  /* All header cells in the top row are black */
  #h2hTable th {
    background: #333;
    color: #fff;
    font-weight: 600;
    text-align: center;
    padding: 1.2em;
  }

  /* Control the widths of the top row’s 3 columns */
  #h2hTable thead th:first-child {
    width: 15%;  /* first column (empty label cell) */
  }
  #h2hTable thead th:nth-child(2),
  #h2hTable thead th:nth-child(3) {
    width: 42.5%;
  }

  /* The body cells */
  #h2hTable tbody td {
    padding: 1.2em;
    text-align: center;
	font-size: 0.75em;
  }

  /* Gray background for left column cells in the body only */
  #h2hTable tbody tr th {
    width: 15%;
    background: #f7f7f7;
    color: #333;
    text-align: right;
	font-size: 0.75em;
  }

  /* The other two columns in the body share the remaining 85% */
  #h2hTable tbody td:nth-child(2),
  #h2hTable tbody td:nth-child(3) {
    width: 42.5%;
  }

  /* Subtle row hover */
  #h2hTable tbody tr:hover {
    background: #f2f2f2;
  }

  /* Team name + logo in the header cells */
  .team-name {
    display: block;
    text-align: center;
    margin-bottom: 0.4em;
    font-weight: bold;
    font-size: 1.3em;
  }
  .team-logo {
    display: block;
    margin: 0 auto;
  }

  /* Ensure the "Drawn" cell text is centered (it spans two columns) */
  #numDraws {
    text-align: center;
  }
</style>



<h1>Head-to-Head Comparison</h1>

<form id="h2hForm">
  <div class="form-group">
    <label for="team1Input">Team #1</label>
    <input id="team1Input" list="teamsList" type="text" placeholder="Select or type Team #1" />
  </div>

  <div class="form-group">
    <label for="team2Input">Team #2</label>
    <input id="team2Input" list="teamsList" type="text" placeholder="Select or type Team #2" />
  </div>

  <datalist id="teamsList">
    <!-- Populated dynamically once CSV loads, sorted alphabetically -->
  </datalist>

  <div class="form-group">
    <label for="startDate">Start Date (optional)</label>
    <input id="startDate" type="date" />
  </div>

  <div class="form-group">
    <label for="endDate">End Date (optional)</label>
    <input id="endDate" type="date" />
  </div>

  <div class="form-group checkbox-group">
    <input id="plOnlyCheckbox" type="checkbox" />
    <label for="plOnlyCheckbox" style="margin:0;">Premier League Only?</label>
  </div>

  <div style="display:flex; gap:1rem; margin-top:auto;">
    <button type="button" id="compareButton">Compare</button>
    <button type="button" id="resetButton" style="background:#999;">Reset</button>
  </div>
</form>

<!-- The Head-to-Head table, hidden by default -->
<table id="h2hTable" style="display:none;">
  <thead>
    <tr>
      <th></th>
      <th>
        <!-- Team 1 Name and Logo -->
        <div id="h2h-team1-col" class="team-name">Team #1</div>
        <img id="team1Logo" class="team-logo" src="" alt="" width="60" height="60" />
      </th>
      <th>
        <!-- Team 2 Name and Logo -->
        <div id="h2h-team2-col" class="team-name">Team #2</div>
        <img id="team2Logo" class="team-logo" src="" alt="" width="60" height="60" />
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Won</th>
      <td id="team1Wins"></td>
      <td id="team2Wins"></td>
    </tr>
    <tr>
      <th>Drawn</th>
      <td colspan="2" id="numDraws"></td>
    </tr>
    <tr>
      <th>Goals For</th>
      <td id="team1Goals"></td>
      <td id="team2Goals"></td>
    </tr>
    <tr>
      <th>Biggest Win</th>
      <td id="team1BiggestWin"></td>
      <td id="team2BiggestWin"></td>
    </tr>
  </tbody>
</table>

<script>
// Dictionary from team name to a direct image URL.
const TEAM_LOGOS = {
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

// If missing, use this fallback:
const MISSING_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://raw.githubusercontent.com/seanelvidge/England-football-results/main/EnglandLeagueResults.csv")
    .then(resp => resp.text())
    .then(csv => {
      const parsed = Papa.parse(csv, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });
      window.matchData = parsed.data || [];

      // Collect unique teams
      const teamSet = new Set();
      for (const row of window.matchData) {
        if (row.HomeTeam) teamSet.add(row.HomeTeam.trim());
        if (row.AwayTeam) teamSet.add(row.AwayTeam.trim());
      }
      // Sort them alphabetically
      const sortedTeams = [...teamSet].sort((a, b) => a.localeCompare(b));

      // Populate the datalist
      const teamsList = document.getElementById("teamsList");
      sortedTeams.forEach(team => {
        const opt = document.createElement("option");
        opt.value = team;
        teamsList.appendChild(opt);
      });

      // Check if URL has team1 & team2
      const params = new URLSearchParams(window.location.search);
      const paramT1 = params.get("team1");
      const paramT2 = params.get("team2");
      const paramStart = params.get("startDate"); 
      const paramEnd   = params.get("endDate");
      const paramPL    = params.get("plOnly"); // 'yes', 'true', etc.

      if (paramT1 && paramT2) {
        document.getElementById("team1Input").value = paramT1;
        document.getElementById("team2Input").value = paramT2;
      }
      if (paramStart) {
        document.getElementById("startDate").value = paramStart;
      }
      if (paramEnd) {
        document.getElementById("endDate").value = paramEnd;
      }
      if (paramPL && (paramPL.toLowerCase() === "yes" || paramPL.toLowerCase() === "true")) {
        document.getElementById("plOnlyCheckbox").checked = true;
      }

      // If both teams arrived in URL, generate
      if (paramT1 && paramT2) {
        generateH2H();
      }
    })
    .catch(err => {
      console.error("CSV load error:", err);
      alert("Failed to load CSV data. Check console for details.");
    });

  // Attach event handlers
  document.getElementById("compareButton").addEventListener("click", generateH2H);
  document.getElementById("resetButton").addEventListener("click", resetForm);
});

function generateH2H() {
  const team1 = document.getElementById("team1Input").value.trim();
  const team2 = document.getElementById("team2Input").value.trim();
  const startDateVal = document.getElementById("startDate").value.trim();
  const endDateVal   = document.getElementById("endDate").value.trim();
  const plOnly       = document.getElementById("plOnlyCheckbox").checked;

  if (!team1 || !team2 || !window.matchData) {
    alert("Please enter two different teams (and ensure CSV is loaded).");
    return;
  }
  if (team1.toLowerCase() === team2.toLowerCase()) {
    alert("Cannot compare a team to itself.");
    return;
  }

  // Show the team names in the table
  document.getElementById("h2h-team1-col").textContent = team1;
  document.getElementById("h2h-team2-col").textContent = team2;

  // Determine the correct logos (or missing)
  const t1Logo = TEAM_LOGOS[team1] || MISSING_IMAGE_URL;
  const t2Logo = TEAM_LOGOS[team2] || MISSING_IMAGE_URL;
  document.getElementById("team1Logo").src = t1Logo;
  document.getElementById("team1Logo").alt = team1;
  document.getElementById("team2Logo").src = t2Logo;
  document.getElementById("team2Logo").alt = team2;

  // Filter matches that involve exactly these two teams
  let relevant = window.matchData.filter(m => {
    const home = (m.HomeTeam || "").trim().toLowerCase();
    const away = (m.AwayTeam || "").trim().toLowerCase();
    const t1lower = team1.toLowerCase();
    const t2lower = team2.toLowerCase();
    return (
      (home === t1lower && away === t2lower) ||
      (home === t2lower && away === t1lower)
    );
  });

  // Filter by date range if provided
  if (startDateVal || endDateVal) {
    const startDateObj = startDateVal ? new Date(startDateVal) : null;
    const endDateObj   = endDateVal   ? new Date(endDateVal)   : null;
    relevant = relevant.filter(m => {
      const d = new Date(m.Date);
      if (startDateObj && d < startDateObj) return false;
      if (endDateObj && d > endDateObj)     return false;
      return true;
    });
  }

  // "Premier League only?" => on or after 1992-08-01
  if (plOnly) {
    const plStart = new Date("1992-08-01");
    relevant = relevant.filter(m => {
      const d = new Date(m.Date);
      return d >= plStart;
    });
  }

  // Compute stats
  let team1Wins = 0, team2Wins = 0, draws = 0;
  let team1Goals = 0, team2Goals = 0;
  // Store the actual score for biggest margin
  let bestMargin1 = 0, bestMargin2 = 0;
  let bestHome1 = 0, bestAway1 = 0, bestDate1 = "";
  let bestHome2 = 0, bestAway2 = 0, bestDate2 = "";

  relevant.forEach(match => {
    if (typeof match.hGoal !== "number" || typeof match.aGoal !== "number") return;

    const homeT = (match.HomeTeam || "").trim().toLowerCase();
    const awayT = (match.AwayTeam || "").trim().toLowerCase();
    const hGoals = match.hGoal;
    const aGoals = match.aGoal;
    const margin = Math.abs(hGoals - aGoals);
    const dateStr = match.Date; // raw date text from the CSV

    // Determine which side is "team1" or "team2"
    if (homeT === team1.toLowerCase()) {
      team1Goals += hGoals;
      team2Goals += aGoals;
      if (hGoals > aGoals) {
        team1Wins++;
        if (margin > bestMargin1) {
          bestMargin1 = margin;
          bestHome1 = hGoals;
          bestAway1 = aGoals;
          bestDate1 = dateStr;
        }
      } else if (aGoals > hGoals) {
        team2Wins++;
        if (margin > bestMargin2) {
          bestMargin2 = margin;
          bestHome2 = aGoals;
          bestAway2 = hGoals;
          bestDate2 = dateStr;
        }
      } else {
        draws++;
      }
    } else {
      // Then team2 is at home
      team2Goals += hGoals;
      team1Goals += aGoals;
      if (hGoals > aGoals) {
        team2Wins++;
        if (margin > bestMargin2) {
          bestMargin2 = margin;
          bestHome2 = hGoals;
          bestAway2 = aGoals;
          bestDate2 = dateStr;
        }
      } else if (aGoals > hGoals) {
        team1Wins++;
        if (margin > bestMargin1) {
          bestMargin1 = margin;
          bestHome1 = aGoals;
          bestAway1 = hGoals;
          bestDate1 = dateStr;
        }
      } else {
        draws++;
      }
    }
  });

  // Fill the table cells
  document.getElementById("team1Wins").textContent  = team1Wins;
  document.getElementById("team2Wins").textContent  = team2Wins;
  document.getElementById("numDraws").textContent   = draws;
  document.getElementById("team1Goals").textContent = team1Goals;
  document.getElementById("team2Goals").textContent = team2Goals;

  // Biggest win lines: e.g. "6-0 on 2022-05-01"
  if (bestMargin1 > 0) {
    document.getElementById("team1BiggestWin").textContent =
      `${bestHome1}-${bestAway1} on ${bestDate1}`;
  } else {
    document.getElementById("team1BiggestWin").textContent = "None";
  }
  if (bestMargin2 > 0) {
    document.getElementById("team2BiggestWin").textContent =
      `${bestHome2}-${bestAway2} on ${bestDate2}`;
  } else {
    document.getElementById("team2BiggestWin").textContent = "None";
  }

  // Show the table
  document.getElementById("h2hTable").style.display = "table";
}

function resetForm() {
  document.getElementById("team1Input").value = "";
  document.getElementById("team2Input").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value   = "";
  document.getElementById("plOnlyCheckbox").checked = false;

  document.getElementById("h2hTable").style.display = "none";
}
</script>
