---
layout: post
title: All England football league results
date: 2022-12-29 10:09:00
description: A plain text set of all England football (soccer) league results from 1888 to present.
tags: misc
thumbnail: assets/img/calculator.png
related_posts: true
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>League Table Generator</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/papaparse/5.3.2/papaparse.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css">
</head>
<body>
    <h1>League Table Generator</h1>
    <form id="leagueForm">
        <label for="season">Season:</label>
        <input type="text" id="season" placeholder="e.g., 2024/2025"><br><br>

        <label for="start_year">Start Year:</label>
        <input type="number" id="start_year" placeholder="e.g., 2024"><br><br>

        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate">

        <label for="endDate">End Date:</label>
        <input type="date" id="endDate"><br><br>

        <label for="division">Division:</label>
        <input type="number" id="division" placeholder="Enter division number"><br><br>

        <button type="button" onclick="handleSubmit()">Generate Table</button>
    </form>

    <h2>League Table</h2>
    <table id="leagueTable" class="display"></table>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            // URL of the CSV file on GitHub
            const csvUrl = "https://raw.githubusercontent.com/seanelvidge/England-football-results/main/EnglandLeagueResults.csv";

            // Fetch and parse the CSV file
            fetch(csvUrl)
                .then(response => response.text())
                .then(csvText => {
                    // Parse CSV text to JSON format
                    const csvData = Papa.parse(csvText, {
                        header: true, // Use the first row as headers
                        dynamicTyping: true, // Automatically typecast numeric fields
                        skipEmptyLines: true // Skip empty rows
                    }).data;

                    // Save data to a global variable
                    window.matchData = csvData;
                })
                .catch(error => {
                    console.error("Failed to load CSV data:", error);
                });
        });

        function handleSubmit() {
            // Get form values
            const season = document.getElementById("season").value;
            const startYear = document.getElementById("start_year").value;
            const startDate = new Date(document.getElementById("startDate").value);
            const endDate = new Date(document.getElementById("endDate").value);
            const division = document.getElementById("division").value;

            // Generate filters based on input
            const filters = {
                season: season ? season.trim() : null,
                startYear: startYear ? parseInt(startYear, 10) : null,
                dateRange: (!isNaN(startDate) && !isNaN(endDate)) ? [startDate, endDate] : null,
                division: division ? parseInt(division, 10) : null
            };

            // Pass filtered data to the league table generator
            generateLeagueTable(window.matchData, filters);
        }

        function generateLeagueTable(data, filters) {
            let filteredData = data;

            // Apply filters
            if (filters.division !== null) {
                filteredData = filteredData.filter(match => match.Division === filters.division);
            }
            if (filters.season) {
                filteredData = filteredData.filter(match => match.Season === filters.season);
            }
            if (filters.startYear) {
                const seasonStr = `${filters.startYear}/${filters.startYear + 1}`;
                filteredData = filteredData.filter(match => match.Season === seasonStr);
            }
            if (filters.dateRange) {
                const [startDate, endDate] = filters.dateRange;
                filteredData = filteredData.filter(match => {
                    const matchDate = new Date(match.Date);
                    return matchDate >= startDate && matchDate <= endDate;
                });
            }

            // Generate league table logic (same as before)
            const teams = {};
            for (const match of filteredData) {
                const { HomeTeam, AwayTeam, hGoal, aGoal } = match;

                if (!teams[HomeTeam]) teams[HomeTeam] = { Played: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0, Points: 0 };
                if (!teams[AwayTeam]) teams[AwayTeam] = { Played: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0, Points: 0 };

                teams[HomeTeam].Played++;
                teams[AwayTeam].Played++;
                teams[HomeTeam].GF += hGoal;
                teams[AwayTeam].GF += aGoal;
                teams[HomeTeam].GA += aGoal;
                teams[AwayTeam].GA += hGoal;

                if (hGoal > aGoal) {
                    teams[HomeTeam].Won++;
                    teams[HomeTeam].Points += 3;
                    teams[AwayTeam].Lost++;
                } else if (hGoal < aGoal) {
                    teams[AwayTeam].Won++;
                    teams[AwayTeam].Points += 3;
                    teams[HomeTeam].Lost++;
                } else {
                    teams[HomeTeam].Drawn++;
                    teams[AwayTeam].Drawn++;
                    teams[HomeTeam].Points++;
                    teams[AwayTeam].Points++;
                }

                teams[HomeTeam].GD = teams[HomeTeam].GF - teams[HomeTeam].GA;
                teams[AwayTeam].GD = teams[AwayTeam].GF - teams[AwayTeam].GA;
            }

            const leagueTable = Object.keys(teams).map(team => ({ Team: team, ...teams[team] }));
            leagueTable.sort((a, b) => b.Points - a.Points || b.GD - a.GD || b.GF - a.GF);

            // Display table using DataTables
            const table = document.getElementById("leagueTable");
            $(table).DataTable({
                destroy: true,
                data: leagueTable,
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
    </script>
</body>
</html>
