---
layout: page
permalink: /leaguetable/
title: English Football League Table Generator
description: Tool for constructing any English football league table
nav: false
---

<html lang="en">
<!-- Papa Parse for CSV reading -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<!-- Dynamically loading DataTables later -->

<style>
/* Increase padding for DataTables cells */
table.dataTable td,
table.dataTable th {
  padding: 15px; /* adjust as you like */
}
</style>

<h1>League Table Generator</h1>
<form id="leagueForm">
  <label for="season">Season:</label>
  <input type="text" id="season" placeholder="e.g., 2024/2025"><br>
  
  <h3>or</h3>
  <label for="start_year">Year:</label>
  <input type="number" id="start_year" placeholder="e.g., 2024" min="1888"><br>
  (where '2024' would mean the season 2023/2024)<br>
  
  <h3>or</h3>
  <label for="startDate">Start Date:</label>
  <input type="date" id="startDate" min="1888-09-08"><br>
  <label for="endDate">End Date:</label>
  <input type="date" id="endDate" min="1888-09-08"><br>
  (if only providing an end date it will assume the start date is the beginning of that season)
  
  <h3>and</h3>
  <label for="division">Division:</label>
  <input type="number" id="division" value="1" min="1" max="4" step="1"><br>
  (where 1 means the 'first' division [currently the Premier League])
  <br><br>
  
  <button type="button">Generate Table</button>
</form>

<h2 id="tableHeading" style="display:none;">League Table</h2>
<table id="leagueTable" class="table table-striped table-bordered" style="display:none;"></table>

<script>
// Adjust or define the handleSubmit and generateLeagueTable with the new features

function handleSubmit() {
  if (!window.matchData || !Array.isArray(window.matchData)) {
    alert("Match data is not loaded. Please wait for the data to load or reload the page.");
    console.error("Match data is undefined or invalid.");
    return;
  }
  
  const season = document.getElementById("season").value.trim();
  const startYear = document.getElementById("start_year").value.trim();
  let startDate = document.getElementById("startDate").value.trim();
  let endDate = document.getElementById("endDate").value.trim();
  
  // If there's only an end date, set the start date to previous July 1
  // "Previous" meaning: If the end date is in Jan–Jun, subtract 1 from year; else keep that year.
  if (!startDate && endDate) {
    const d = new Date(endDate);
    let startYearForDate = d.getFullYear();
    // If month is January(0) through June(5), subtract one from the year
    if (d.getMonth() < 6) {
      startYearForDate -= 1;
    }
    startDate = `${startYearForDate}-07-01`;
  }

  // Only one of the three sets (season, startYear, dateRange) should be used
  if ([season, startYear, startDate && endDate].filter(Boolean).length > 1) {
    alert("Please fill only one of Season, Start Year, or Start/End Date.");
    return;
  }

  const division = document.getElementById("division").value;
  const filters = {
    season: season || null,
    startYear: startYear ? parseInt(startYear, 10) : null,
    dateRange: null,
    division: division ? parseInt(division, 10) : null,
  };

  // Build dateRange if we have both startDate and endDate
  if (startDate && endDate) {
    filters.dateRange = [new Date(startDate), new Date(endDate)];
  }
  
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
    const seasonString = `${filters.startYear - 1}/${filters.startYear}`;
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

    // Determine how many points a win is worth for this match date
    const matchDate = new Date(match.Date);
    const matchYear = matchDate.getFullYear();
    const pointsForWin = matchYear < 1981 ? 2 : 3;

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
      tableData[HomeTeam].Points += pointsForWin;
      tableData[AwayTeam].Lost++;
    } else if (hGoal < aGoal) {
      tableData[AwayTeam].Won++;
      tableData[AwayTeam].Points += pointsForWin;
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
  
  // Show them once the data is ready
  document.getElementById("tableHeading").style.display = "block";
  document.getElementById("leagueTable").style.display = "table";

  const leagueTable = document.getElementById("leagueTable");
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
    // Hook up the "Generate Table" button
    const button = document.getElementById("leagueForm").querySelector("button");
    button.addEventListener("click", handleSubmit);
  };
  document.body.appendChild(dtScript);
});
</script>
</html>
