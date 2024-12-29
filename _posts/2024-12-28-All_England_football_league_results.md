---
layout: post
title: All England football league results
date: 2024-12-28 10:09:00
description: A plain text set of all England football (soccer) league results from 1888 to present.
tags: football
thumbnail: assets/img/england_league_results.png
related_posts: true
---

This article describes a plain text database of all England football (soccer) league results from 1888 to the present day (covering over 209,000 matches).

You can access the latest database on its dedicated github page: [England-football-results](https://github.com/seanelvidge/England-football-results/tree/main)

The database is updated roughly every two days (although I am looking for approaches to speed this up) for the top four divisions in England: Premier League, Championship, League 1 and League 2. The motivation for making the database is that I do a lot of statistical analysis on various bits and pieces in football (you can see some [here](https://seanelvidge.com/blog/tag/football/)), and not having an easy to read database really slows me down.

The [database](https://github.com/seanelvidge/England-football-results/tree/main) is a comma (",") delimited csv file with the following columns:

| Column   | Details                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date     | the day of the match (string; format "YYYY-MM-DD")                                                                                                      |
| Season   | the season the match took place in (string; format "YYYY/YYYY")                                                                                         |
| HomeTeam | the home team name (string)                                                                                                                             |
| AwayTeam | the away team name (string)                                                                                                                             |
| Score    | the final score (string; format "X-Z")                                                                                                                  |
| hGoal    | number of goals scored by the home team (integer; "X" from the "Score" column)                                                                          |
| aGoal    | number of goals scored by the away team (integer; "Z" from the "Score" column)                                                                          |
| Division | numerical representation of the division which the match was from: 1, 2, 3 or 4, where "1" is the top division (currently the Premier League) (integer) |
| Result   | the result "H" (home win), "A" (away win), "D" (draw) (string)                                                                                          |

The data from 1888 to 2016 is based on that from:
James P. Curley (2016). engsoccerdata: English Soccer Data 1871-2016. http://dx.doi.org/10.5281/zenodo.13158

Between 1921 and 1958 there was a Third Division North and South, in the database we give both the numerical representation "3". 

Such a long database of results leads to some confusion around team names, the answer to the most common set of questions I have received in terms of team names:

- [Accrington F.C.](https://en.wikipedia.org/wiki/Accrington_F.C.) is a different team to [Accrington Stanley](https://en.wikipedia.org/wiki/Accrington_Stanley_F.C.). Acrrington F.C. were one of the founder members of the Football League, but unfortunately were dissolved in 1896.
- [Brighton & Hove Albion](https://en.wikipedia.org/wiki/Brighton_%26_Hove_Albion_F.C.), [New Brighton Tower](https://en.wikipedia.org/wiki/New_Brighton_Tower_F.C.) and [New Brighton](https://en.wikipedia.org/wiki/New_Brighton_A.F.C.) are all different clubs. New Brighton Tower were in existence from 1896-1901 and whilst Brighton & Hove Albion were formed in 1901, the "spiritual" successor to New Brighton Tower, was New Brighton (1921-1983 and 1993-2012; originally formed by the relocation of [South Liverpool](https://en.wikipedia.org/wiki/South_Liverpool_F.C._(1890s)))
- Burton [Swifts](https://en.wikipedia.org/wiki/Burton_Swifts_F.C.), [Wanderers](https://en.wikipedia.org/wiki/Burton_Wanderers_F.C.), [United](https://en.wikipedia.org/wiki/Burton_United_F.C.), [Town](https://en.wikipedia.org/wiki/Burton_Town_F.C.) and [Albion](https://en.wikipedia.org/wiki/Burton_Albion_F.C.) are all different teams. Burton Swifts joined with Wanderers to form Burton United in 1901, which in 1924 merged with Burton Town and in 1950 merged with the newly formed Burton Albion.
- Whilst [Leeds Unitd](https://en.wikipedia.org/wiki/Leeds_United_F.C.) were formed following/replacing [Leeds City](https://en.wikipedia.org/wiki/Leeds_City_F.C.) (and played in the same ground). No players or management from Leeds City moved to Leeds United so we treat them as separate football clubs.
- [Middlesbrough Ironopolis](https://en.wikipedia.org/wiki/Middlesbrough_Ironopolis_F.C.) (1889-1894) is separate team from [Middlesbrough](https://en.wikipedia.org/wiki/Middlesbrough_F.C.) (1876-).
- [Rotherham County](https://en.wikipedia.org/wiki/Rotherham_County_F.C.) merged with [Rotherham Town](https://en.wikipedia.org/wiki/Rotherham_Town_F.C._(1899)) in 1925 to form [Rotherham United](https://en.wikipedia.org/wiki/Rotherham_United_F.C.).
- [Wigan Athletic](https://en.wikipedia.org/wiki/Wigan_Athletic_F.C.) were formed (1932) a year after [Wigan Borough](https://en.wikipedia.org/wiki/Wigan_Borough_F.C.) were wound up (1931) and we treat them separately. Wigan Athletic was the sixth attempt to create a stable football club in Wigan following the dissolving of Wigan A.F.C., [County](https://en.wikipedia.org/wiki/Wigan_County_F.C.) (1897-1900), [United](https://en.wikipedia.org/wiki/Wigan_United_A.F.C.) (1896-1914), [Town](https://en.wikipedia.org/wiki/Wigan_Town_A.F.C.) (1905-1908) and [Borough](https://en.wikipedia.org/wiki/Wigan_Borough_F.C.) (1920-1931).

Hopefully there are lots of fun things you can do with this, please let me know about any of them! As a simple example, you can use the form below to work out a league table for any given season and division or for any arbitrary date range, from 1888 to present (remembering before 1981 there was only [2 points for a win](https://en.wikipedia.org/wiki/Three_points_for_a_win) in English football).

<html lang="en">
<!-- Papa Parse for CSV reading -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<!-- (Remove the inline DataTables script here; we’ll load it dynamically) -->

<h1>League Table Generator</h1>
<form id="leagueForm">
  <label for="season">Season:</label>
  <input type="text" id="season" placeholder="e.g., 2024/2025"><br>
  
  <h3>or</h3>
  <label for="start_year">Start Year:</label>
  <input type="number" id="start_year" placeholder="e.g., 2024" min="1888"><br>
  
  <h3>or</h3>
  <label for="startDate">Start Date:</label>
  <input type="date" id="startDate" min="1888-09-08"><br>
  <label for="endDate">End Date:</label>
  <input type="date" id="endDate" min="1888-09-08"><br>
  
  <h3>and</h3>
  <label for="division">Division:</label>
  <input type="number" id="division" value="1" min="1" max="4" step="1"><br><br>
  
  <!-- Clicking this will eventually call handleSubmit(), after DataTables is loaded -->
  <button type="button">Generate Table</button>
</form>

<h2>League Table</h2>
<table id="leagueTable" class="display"></table>

<script>
// Core logic for generating the table
function handleSubmit() {
  if (!window.matchData || !Array.isArray(window.matchData)) {
    alert("Match data is not loaded. Please wait for the data to load or reload the page.");
    console.error("Match data is undefined or invalid.");
    return;
  }
  const season = document.getElementById("season").value.trim();
  const startYear = document.getElementById("start_year").value.trim();
  const startDate = document.getElementById("startDate").value.trim();
  const endDate = document.getElementById("endDate").value.trim();
  
  // Only one of the three sets (season, startYear, dateRange) should be used
  if ([season, startYear, startDate && endDate].filter(Boolean).length > 1) {
    alert("Please fill only one of Season, Start Year, or Start/End Date.");
    return;
  }

  const division = document.getElementById("division").value;
  const filters = {
    season: season || null,
    startYear: startYear ? parseInt(startYear, 10) : null,
    dateRange: startDate && endDate ? [new Date(startDate), new Date(endDate)] : null,
    division: division ? parseInt(division, 10) : null,
  };
  
  generateLeagueTable(window.matchData, filters);
}

function generateLeagueTable(matchData, filters) {
  let filteredData = matchData;
  
  if (filters.division !== null) {
    filteredData = filteredData.filter(match => match.Division === filters.division);
  }
  if (filters.season) {
    filteredData = filteredData.filter(match => match.Season === filters.season);
  }
  if (filters.startYear) {
    const seasonString = `${filters.startYear}/${filters.startYear + 1}`;
    filteredData = filteredData.filter(match => match.Season === seasonString);
  }
  if (filters.dateRange) {
    const [start, end] = filters.dateRange;
    filteredData = filteredData.filter(match => {
      const matchDate = new Date(match.Date);
      return matchDate >= start && matchDate <= end;
    });
  }

  const tableData = {};
  for (const match of filteredData) {
    const { HomeTeam, AwayTeam, hGoal, aGoal } = match;

    if (!tableData[HomeTeam]) {
      tableData[HomeTeam] = { Played: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0, Points: 0 };
    }
    if (!tableData[AwayTeam]) {
      tableData[AwayTeam] = { Played: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0, Points: 0 };
    }

    tableData[HomeTeam].Played++;
    tableData[AwayTeam].Played++;
    tableData[HomeTeam].GF += hGoal;
    tableData[AwayTeam].GF += aGoal;
    tableData[HomeTeam].GA += aGoal;
    tableData[AwayTeam].GA += hGoal;

    if (hGoal > aGoal) {
      tableData[HomeTeam].Won++;
      tableData[HomeTeam].Points += 3;
      tableData[AwayTeam].Lost++;
    } else if (hGoal < aGoal) {
      tableData[AwayTeam].Won++;
      tableData[AwayTeam].Points += 3;
      tableData[HomeTeam].Lost++;
    } else {
      tableData[HomeTeam].Drawn++;
      tableData[AwayTeam].Drawn++;
      tableData[HomeTeam].Points++;
      tableData[AwayTeam].Points++;
    }

    tableData[HomeTeam].GD = tableData[HomeTeam].GF - tableData[HomeTeam].GA;
    tableData[AwayTeam].GD = tableData[AwayTeam].GF - tableData[AwayTeam].GA;
  }

  const tableRows = Object.keys(tableData).map(team => ({
    Team: team,
    ...tableData[team],
  }));
  tableRows.sort((a, b) => b.Points - a.Points || b.GD - a.GD || b.GF - a.GF);

  const leagueTable = document.getElementById("leagueTable");
  // By the time this is called, DataTables should be loaded.
  // No event listeners are attached until DataTables is loaded.
  $(leagueTable).DataTable({
    destroy: true,
    paging: false,
    info: false,
    order: [[8, "desc"]],
    data: tableRows,
    columns: [
      { title: "Team", data: "Team" },
      { title: "Played", data: "Played" },
      { title: "Won", data: "Won" },
      { title: "Drawn", data: "Drawn" },
      { title: "Lost", data: "Lost" },
      { title: "GF", data: "GF" },
      { title: "GA", data: "GA" },
      { title: "GD", data: "GD" },
      { title: "Points", data: "Points" },
    ],
  });
}

// Load CSV data once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const year = today.getFullYear();
  const maxDate = today.toISOString().split("T")[0];
  document.getElementById("start_year").max = year;
  document.getElementById("startDate").max = maxDate;
  document.getElementById("endDate").max = maxDate;

  fetch("https://raw.githubusercontent.com/seanelvidge/England-football-results/main/EnglandLeagueResults.csv")
    .then(response => response.text())
    .then(data => {
      const parsedData = Papa.parse(data, { header: true, dynamicTyping: true, skipEmptyLines: true }).data;
      window.matchData = parsedData;
    })
    .catch(error => {
      console.error("Failed to load CSV data:", error);
      alert("Failed to load CSV data. Please check the console for more details.");
    });
});

// Dynamically load DataTables AFTER the bottom jQuery script
window.addEventListener("load", function() {
  if (typeof window.jQuery === "undefined") {
    console.log("jQuery not yet defined when window.load fired.");
    return;
  }
  const dtScript = document.createElement("script");
  dtScript.src = "https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js";
  dtScript.onload = function() {
    console.log("DataTables script loaded.");
    // Now that DataTables is ready, attach the button’s click event
    const button = document.getElementById("leagueForm").querySelector("button");
    button.addEventListener("click", handleSubmit);
  };
  document.body.appendChild(dtScript);
});
</script>
</html>
