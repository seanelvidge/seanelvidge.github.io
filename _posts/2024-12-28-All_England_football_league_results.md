---
layout: post
title: All England football league results
date: 2024-12-28 10:09:00
description: A plain text set of all England football (soccer) league results from 1888 to present.
tags: football
thumbnail: assets/img/england_league_results.png
related_posts: true
---

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

</body>
</html>
