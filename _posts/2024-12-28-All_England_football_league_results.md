---
layout: post
title: All England football league results
date: 2024-12-28 10:09:00
description: A plain text set of all England football (soccer) league results from 1888 to present.
tags: misc
thumbnail: assets/img/england_league_results.png
related_posts: true
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>League Table Generator</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css">
</head>
<body>
    <h1>League Table Generator</h1>
    <form id="leagueForm">
        <label for="season">Season:</label>
        <input type="text" id="season" placeholder="e.g., 2024/2025"><br>

        <h3>or</h3>

        <label for="start_year">Start Year:</label>
        <input type="number" id="start_year" placeholder="e.g., 2024" min="1888" max=""><br>

        <h3>or</h3>

        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" min="1888-09-08" max="">

        <label for="endDate">End Date:</label>
        <input type="date" id="endDate" min="1888-09-08" max=""><br>

        <h3>and</h3>

        <label for="division">Division:</label>
        <input type="number" id="division" value="1" min="1" max="4" step="1"><br><br>

        <button type="button" onclick="handleSubmit()">Generate Table</button>
    </form>

    <h2>League Table</h2>
    <table id="leagueTable" class="display"></table>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const formattedDate = currentDate.toISOString().split('T')[0];

            // Set default and maximum values for date and year fields
            document.getElementById("start_year").max = currentYear;
            document.getElementById("startDate").max = formattedDate;
            document.getElementById("endDate").max = formattedDate;

            // Define CSV URL
            const csvUrl = "https://raw.githubusercontent.com/seanelvidge/England-football-results/main/EnglandLeagueResults.csv";

            // Fetch and parse CSV data
            fetch(csvUrl)
                .then(response => response.text())
                .then(csvText => {
                    // console.log("CSV Text Loaded"); // Debugging
                    const csvData = Papa.parse(csvText, {
                        header: true,
                        dynamicTyping: true,
                        skipEmptyLines: true
                    }).data;

                    // console.log("Parsed CSV Data:", csvData); // Debugging
                    window.matchData = csvData;
                })
                .catch(error => {
                    console.error("Failed to load CSV data:", error);
                    alert("Failed to load CSV data. Please check the console for more details.");
                });
        });

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

            // Ensure only one of Season, Start Year, or Date Range is set
            const filtersSet = [season, startYear, (startDate && endDate)].filter(Boolean).length;
            if (filtersSet > 1) {
                alert("Please fill only one of Season, Start Year, or Start/End Date.");
                return;
            }

            const division = document.getElementById("division").value;

            const filters = {
                season: season || null,
                startYear: startYear ? parseInt(startYear, 10) : null,
                dateRange: (startDate && endDate) ? [new Date(startDate), new Date(endDate)] : null,
                division: division ? parseInt(division, 10) : null
            };

            // console.log("Filters:", filters); // Debugging
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

            // console.log("Filtered Data:", filteredData); // Debugging

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

            // console.log("League Table:", leagueTable); // Debugging

            const table = document.getElementById("leagueTable");
            $(table).DataTable({
                destroy: true,
                paging: false,
                info: false, // Disable the "Showing X to Y of Z entries" text
                order: [[8, "desc"]], // Default sorting by "Points" (index 8)
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
