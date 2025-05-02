---
layout: page
permalink: /leaguetable
title: English Football League Table Generator
description: Tool for constructing any English football league table
nav: false
---

<html lang="en">
<!-- Papa Parse for CSV reading -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
      <style>
        table.dataTable td,
        table.dataTable th {
          padding: 15px;
        }
      </style>

      <h1>League Table Generator</h1>
      <form id="leagueForm">
    	  <label for="season">Season:</label>
    	  <input type="text" id="season" placeholder="e.g., 2024/2025" list="seasonOptions"><br>
    	  <datalist id="seasonOptions"></datalist>

    	  <h3>or</h3>

    	  <label for="start_year">Year:</label>
    	  <input type="text" id="start_year" placeholder="e.g., 2024" list="yearOptions"><br>
    	  (where '2024' would mean the season 2023/2024)
    	  <datalist id="yearOptions"></datalist>

    	  <br>

    	  <h3>or</h3>

    	  <label for="startDate">Start Date:</label>
    	  <input type="date" id="startDate" min="1888-09-08"><br>

    	  <label for="endDate">End Date:</label>
    	  <input type="date" id="endDate" min="1888-09-08"><br>
    	  (if only providing a start date it will assume an end date of today, if only providing an end date it will assume the start date is the beginning of that season)

    	  <h3>and</h3>

    	  <label for="division">Division:</label>
    	  <input type="text" id="division" value="1" list="divOptions"><br>
    	  (1,2,3 or 4 where 1 means the 'first' division [currently the Premier League])
    	  <datalist id="divOptions"></datalist>
    	  <br><br>

    	  <button type="button">Generate Table</button>
    	  <button type="button" id="resetTableBtn">Reset Form</button>

        <hr>

    	  <script>
    		// Constants for start year and current date
    		const startYear = 1888;
    		const currentDate = new Date();
    		const currentYear = currentDate.getFullYear();
    		const currentMonth = currentDate.getMonth(); // 0-indexed (0 = January, 11 = December)
    		const finalYear = currentMonth >= 6 ? currentYear + 1 : currentYear; // Final year logic

    		// Generate options for "Season" datalist
    		const seasonList = document.getElementById('seasonOptions');
    		for (let year = startYear; year < finalYear; year++) {
    		  const option = document.createElement('option');
    		  option.value = `${year}/${year + 1}`;
    		  seasonList.appendChild(option);
    		}

    		// Generate options for "Year" datalist
    		const yearList = document.getElementById('yearOptions');
    		for (let year = startYear; year <= finalYear; year++) {
    		  const option = document.createElement('option');
    		  option.value = year;
    		  yearList.appendChild(option);
    		}

    		// Generate options for "Division" datalist
    		const divList = document.getElementById('divOptions');
    		for (let division = 1; division <= 4; division++) {
    		  const option = document.createElement('option');
    		  option.value = division;
    		  divList.appendChild(option);
    		}

    		// Event listener for the "Reset Table" button
    		const resetButton = document.getElementById('resetTableBtn');
    			resetButton.addEventListener('click', () => {
    			  document.getElementById('season').value = '';
    			  document.getElementById('start_year').value = '';
    			  document.getElementById('startDate').value = '';
    			  document.getElementById('endDate').value = '';
    			  document.getElementById('division').value = 1;
    			});
    	  </script>
      </form>

      <h2 id="tableHeading" style="display:none;">League Table</h2>
      <table
        id="leagueTable"
        class="table table-striped table-bordered"
        style="display:none;"
      ></table>

      <script>
        function handleSubmit() {
          if (!window.matchData || !Array.isArray(window.matchData)) {
            alert("Match data is not loaded. Please wait for the data to load or reload the page.");
            console.error("Match data is undefined or invalid.");
            return;
          }
          const seasonValue = document.getElementById("season").value.trim();
          const startYearValue = document.getElementById("start_year").value.trim();
          let startDateValue = document.getElementById("startDate").value.trim();
          let endDateValue = document.getElementById("endDate").value.trim();

          if (!startDateValue && endDateValue) {
            const dateObj = new Date(endDateValue);
            let year = dateObj.getFullYear();
            if (dateObj.getMonth() < 6) {
              year -= 1;
            }
            startDateValue = `${year}-07-01`;
          }

          if (startDateValue && !endDateValue) {
            endDateValue = currentDate;
          }

          if ([seasonValue, startYearValue, startDateValue && endDateValue].filter(Boolean).length > 1) {
            alert("Please fill only one of Season, Start Year, or Start/End Date.");
            return;
          }

          const divisionValue = document.getElementById("division").value;
          const config = {
            season: seasonValue || null,
            startYear: startYearValue ? parseInt(startYearValue, 10) : null,
            dateRange: null,
            division: divisionValue ? parseInt(divisionValue, 10) : null
          };

          if (startDateValue && endDateValue) {
            config.dateRange = [new Date(startDateValue), new Date(endDateValue)];
          }

          generateLeagueTable(window.matchData, config);
        }

        function generateLeagueTable(data, config) {
          let filteredData = data;

          if (config.division !== null) {
            filteredData = filteredData.filter(item => item.Division === config.division);
          }
          if (config.season) {
            filteredData = filteredData.filter(item => item.Season === config.season);
          }
          if (config.startYear) {
            const yearString = `${config.startYear - 1}/${config.startYear}`;
            filteredData = filteredData.filter(item => item.Season === yearString);
          }
          if (config.dateRange) {
            const [start, end] = config.dateRange;
            filteredData = filteredData.filter(item => {
              const matchDate = new Date(item.Date);
              return matchDate >= start && matchDate <= end;
            });
          }

          // figure out the season string here
            const seasonStr = config.season
              || (config.startYear ? `${config.startYear-1}/${config.startYear}` : null);

            // a) 1931/32, Div “3N”: drop all Wigan Borough matches
            if (seasonStr==='1931/1932' && config.division==='3N') {
              filteredData = filteredData.filter(m =>
                m.HomeTeam!=='Wigan Borough' && m.AwayTeam!=='Wigan Borough'
              );
            }

            // b) 1961/62, Div “4”: drop all Accrington Stanley matches
            if (seasonStr==='1961/1962' && config.division==='4') {
              filteredData = filteredData.filter(m =>
                m.HomeTeam!=='Accrington Stanley' && m.AwayTeam!=='Accrington Stanley'
              );
            }

          const teamStats = {};
          for (const match of filteredData) {
            const {
              HomeTeam,
              AwayTeam,
              hGoal,
              aGoal
            } = match;
            const dateYear = new Date(match.Date).getFullYear() < 1981 ? 2 : 3;

            if (!teamStats[HomeTeam]) {
              teamStats[HomeTeam] = {
                Played: 0,
                Won: 0,
                Drawn: 0,
                Lost: 0,
                GF: 0,
                GA: 0,
                GD: 0,
                Points: 0
              };
            }
            if (!teamStats[AwayTeam]) {
              teamStats[AwayTeam] = {
                Played: 0,
                Won: 0,
                Drawn: 0,
                Lost: 0,
                GF: 0,
                GA: 0,
                GD: 0,
                Points: 0
              };
            }

            teamStats[HomeTeam].Played++;
            teamStats[AwayTeam].Played++;
            teamStats[HomeTeam].GF += hGoal;
            teamStats[AwayTeam].GF += aGoal;
            teamStats[HomeTeam].GA += aGoal;
            teamStats[AwayTeam].GA += hGoal;

            if (hGoal > aGoal) {
              teamStats[HomeTeam].Won++;
              teamStats[HomeTeam].Points += dateYear;
              teamStats[AwayTeam].Lost++;
            } else if (hGoal < aGoal) {
              teamStats[AwayTeam].Won++;
              teamStats[AwayTeam].Points += dateYear;
              teamStats[HomeTeam].Lost++;
            } else {
              teamStats[HomeTeam].Drawn++;
              teamStats[AwayTeam].Drawn++;
              teamStats[HomeTeam].Points++;
              teamStats[AwayTeam].Points++;
            }

            teamStats[HomeTeam].GD = teamStats[HomeTeam].GF - teamStats[HomeTeam].GA;
            teamStats[AwayTeam].GD = teamStats[AwayTeam].GF - teamStats[AwayTeam].GA;
          }

          // c) 1919/20, Div “2”: merge Leeds City + Port Vale
            if (seasonStr==='1919/1920' && config.division==='2') {
              const L = teamStats['Leeds City']  || {Played:0,Won:0,Drawn:0,Lost:0,GF:0,GA:0,GD:0,Points:0};
              const P = teamStats['Port Vale']   || {Played:0,Won:0,Drawn:0,Lost:0,GF:0,GA:0,GD:0,Points:0};
              teamStats['Leeds City & Port Vale'] = {
                Played: L.Played + P.Played,
                Won:    L.Won    + P.Won,
                Drawn:  L.Drawn  + P.Drawn,
                Lost:   L.Lost   + P.Lost,
                GF:     L.GF     + P.GF,
                GA:     L.GA     + P.GA,
                GD:    (L.GF+P.GF)-(L.GA+P.GA),
                Points: L.Points + P.Points
              };
              delete teamStats['Leeds City'];
              delete teamStats['Port Vale'];
            }

            // apply external point deductions
            if (window.pointDeductions) {
              // determine the single‐year key in your CSV
              const dedYear = seasonStr ? parseInt(seasonStr.split('/')[1],10).toString() : null;
              window.pointDeductions
                .filter(d => d.Season===dedYear)
                .forEach(d => {
                  const t = d.Team;
                  if (teamStats[t]) {
                    teamStats[t].Points = Math.max(0, teamStats[t].Points - d.Pts_deducted);
                  }
                });
            }

          const teamsArray = Object.keys(teamStats).map(team => ({
            Team: team,
            ...teamStats[team]
          }));

          teamsArray.sort((a, b) => (
            b.Points - a.Points ||
            b.GD - a.GD ||
            b.GF - a.GF
          ));

    	  // Assign position based on their sorted index
    	  teamsArray.forEach((row, idx) => {
    		row.Pos = idx + 1;  // e.g., 1, 2, 3, ...
    	  });

          document.getElementById("tableHeading").style.display = "block";
          document.getElementById("leagueTable").style.display = "table";
          const leagueTable = document.getElementById("leagueTable");

          $(leagueTable).DataTable({
            destroy: true,
            paging: false,
            info: false,
            searching: false,
            order: [[9, "desc"]],
            data: teamsArray,
            columns: [
    		  { title: "Pos", data: "Pos" },
              { title: "Team", data: "Team" },
              { title: "Played", data: "Played" },
              { title: "Won", data: "Won" },
              { title: "Drawn", data: "Drawn" },
              { title: "Lost", data: "Lost" },
              { title: "GF", data: "GF" },
              { title: "GA", data: "GA" },
              { title: "GD", data: "GD" },
              { title: "Points", data: "Points" }
            ]
          });
        }

        document.addEventListener("DOMContentLoaded", () => {
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentDate = now.toISOString().split("T")[0];

          document.getElementById("start_year").max = currentYear;
          document.getElementById("startDate").max = currentDate;
          document.getElementById("endDate").max = currentDate;

          fetch("https://raw.githubusercontent.com/seanelvidge/England-football-results/main/EnglandLeagueResults.csv")
            .then(response => response.text())
            .then(csvData => {
              const parsedData = Papa.parse(csvData, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true
              }).data;
              window.matchData = parsedData;
          fetch('https://raw.githubusercontent.com/seanelvidge/England-football-results/main/EnglandLeaguePointDeductions.csv')
              .then(res => res.text())
              .then(text => {
                window.pointDeductions = Papa.parse(text, {
                  header: true,
                  dynamicTyping: true,
                  skipEmptyLines: true
                }).data;
              })
              .catch(err => console.error('Failed to load point deductions:', err));
    		  // Grab URL parameters
    		  const urlParams = new URLSearchParams(window.location.search);
    		  const paramSeason = urlParams.get("season");
    		  let paramStartYear = urlParams.get("start_year") || urlParams.get("year");
    		  let paramStartDate = urlParams.get("startDate");
    		  let paramEndDate = urlParams.get("endDate");
    		  // Optional division param
    		  const paramDivision = urlParams.get("division");

    		  // If only an endDate was passed, set startDate to previous July 1
    		  if (!paramStartDate && paramEndDate) {
    			const d = new Date(paramEndDate);
    			let startYearForDate = d.getFullYear();
    			// If month is January(0) through June(5), subtract one from the year
    			if (d.getMonth() < 6) {
    			  startYearForDate -= 1;
    			}
    			paramStartDate = `${startYearForDate}-07-01`;
    		  }

    		  // Figure out how many "modes" are being used (season, start_year, or startDate+endDate)
    		  const modesUsed = [paramSeason, paramStartYear, paramStartDate && paramEndDate].filter(Boolean).length;
    		  if (modesUsed > 1) {
    			// If more than one mode is present, we can either ignore them or show a warning
    			console.warn("Multiple parameters found; ignoring URL parameters for season/start_year/dates.");
    			return;
    		  }

    		  // If exactly one mode is provided, fill the relevant fields
    		  if (modesUsed === 1) {
    			if (paramSeason) {
    			  document.getElementById("season").value = paramSeason;
    			}
    			if (paramStartYear) {
    			  document.getElementById("start_year").value = paramStartYear;
    			}
    			if (paramStartDate && paramEndDate) {
    			  document.getElementById("startDate").value = paramStartDate;
    			  document.getElementById("endDate").value = paramEndDate;
    			}
    		  }

    		  // If a division was passed in, fill that too (independent of the "modes")
    		  if (paramDivision) {
    			document.getElementById("division").value = paramDivision;
    		  }

    		  // If at least one mode is valid, generate the table automatically
    		  if (modesUsed === 1) {
    			handleSubmit();
    		  }            })
            .catch(error => {
              console.error("Failed to load CSV data:", error);
              alert("Failed to load CSV data. Please check the console for more details.");
            });
        });

        window.addEventListener("load", function () {
          if (typeof window.jQuery === "undefined") {
            console.log("jQuery not yet defined when window.load fired.");
            return;
          }
          const script = document.createElement("script");
          script.src = "https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js";
          script.onload = function () {
            console.log("DataTables script loaded.");
            document
              .getElementById("leagueForm")
              .querySelector("button")
              .addEventListener("click", handleSubmit);
          };
          document.body.appendChild(script);
        });
      </script>

      <script>
        // (1) helper: determine which divisions existed in a given season-start year
        function getDivisionsForYear(startYear) {
          if (startYear >= 1959)    return ['1','2','3','4'];
          if (startYear >= 1921)    return ['1','2','3N','3S'];
          if (startYear >= 1920)    return ['1','2','3'];
          if (startYear >= 1892)    return ['1','2'];
          if (startYear >= 1888)    return ['1'];
          return [];
        }

        // (2) helper: extract the “start year” from whichever control has a value
        function extractStartYear() {
          const s = document.getElementById('season').value.trim();
          if (s.match(/^\d{4}\/\d{4}$/)) {
            return parseInt(s.split('/')[0],10);
          }
          const y = parseInt(document.getElementById('start_year').value,10);
          if (!isNaN(y)) {
            return y - 1;
          }
          const sd = document.getElementById('startDate').value;
          if (sd) {
            return new Date(sd).getFullYear();
          }
          return null;
        }

        // (3) repopulate the datalist
        function updateDivisionOptions() {
          const year = extractStartYear();
          const list = document.getElementById('divOptions');
          list.innerHTML = '';
          const divs = year ? getDivisionsForYear(year) : ['1','2','3N','3S','4'];
          divs.forEach(code => {
            const opt = document.createElement('option');
            opt.value = code;
            list.appendChild(opt);
          });
        }

        // (4) wire up listeners
        ['season','start_year','startDate','endDate'].forEach(id => {
          document.getElementById(id)
            .addEventListener('input', updateDivisionOptions);
        });

        // (5) initialize on load
        document.addEventListener('DOMContentLoaded', updateDivisionOptions);
      </script>

</html>
