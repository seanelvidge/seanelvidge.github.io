---
layout: post
title: Waning Home Advantage in English Football
date: 2025-01-13 09:00:00
description: An investigation in the trend of home advantage in English football
tags: football
thumbnail: assets/img/home_advantage_trend_fallback.png
related_posts: true
---

For generations, "home advantage" has been a tenet of sports. The roar of the crowd, the familiarity of the pitch, the comfort of the home dressing room – all give the home team a significant edge. This is particularly true in English football with passionate fans and unique stadium atmospheres. However, a look at the data spanning over a century of English football reveals an interesting trend: the home advantage is shrinking.

Using my database of all English league results since 1888 (available here, and described here) we can track the Home Win %, Draw %, and Away Win % from 1888 to the present day (at the time of writing, that is halfway through the 2024/2025 season, but the charts in this post should automatically update). The results are pretty clear:

<html>
<div class="chart-container">
    <canvas id="resultsChart"></canvas>
  </div>
<img 
  id="fallbackImage1" 
  src="assets/img/home_advantage_trend_fallback.png" 
  alt="Fallback image for home, draw, away % win" 
  style="display: none; max-width: 100%;"
/>
</html>

In the late 19th and early 20th centuries, home teams were dominant, boasting win percentages well above 60%. Away wins were a relative rarity, hovering around 20%. But as the decades have progressed, the lines have converged. Home win percentages have steadily declined, dipping towards 40% in recent years, while away wins have climbed, now consistently above 30% and with a clear upwards trajectory.

It would be easy to assume that this trend is confined to the top flight, where the largest investments in training facilities, player recruitment, and tactical analysis occur. However, if we look at the home win percentages across all four divisions (where "Division 1" is the highest division, currently the Premier League and "Division 4" is the lowest, League 2) we can see that this is a league-wide phenomenon.

<html>
<div class="chart-container">
    <canvas id="divisionChart"></canvas>
  </div>
<img 
  id="fallbackImage2" 
  src="assets/img/home_advantage_trend_fallback_by_division.png" 
  alt="Fallback image for home win % by division" 
  style="display: none; max-width: 100%;"
/>
</html>

As you can see, the decline in home win percentages is remarkably consistent across all levels of professional English football. While there are some minor variations between divisions, the overall trajectory is the same: downwards. This suggests that the factors driving the change are not unique to the top tier but are systemic throughout the entire football pyramid. Each division shows high home win % at the start of the time series (above 50%), but each division ends up closer to 40% by the end of the series.

So, what's driving this shift away from home dominance? Several factors are likely at play:

- Standardization of Playing Conditions: In the early days, pitch conditions varied wildly. Home teams were intimately familiar with their own, often quirky, pitches, giving them a distinct advantage. Over time, regulations and advancements in groundskeeping have led to more standardized, high-quality pitches across the league, leveling the playing field. This impact would be felt across all divisions.
- Improved Travel and Accommodation: Early football often involved arduous journeys for away teams, leaving them fatigued and less prepared. Modern transportation and improved accommodations have minimized the physical toll of travel, allowing away teams to arrive rested and ready to compete. Again, this is relevant to all levels of the game.
- Tactical Advancements and Analysis: The modern game is far more tactically sophisticated. Managers and analysts have access to vast amounts of data and video footage, allowing them to dissect opponents' strengths and weaknesses, regardless of location. Away teams can now better prepare for the specific challenges posed by their opponents and their home stadiums. While the resources may be greater at the top, these advancements have filtered down through the divisions.
- Professionalization and Fitness: Players today are fitter, faster, and more technically skilled than ever before. This overall increase in athleticism can help away teams better cope with the pressures of playing in hostile environments, a trend seen across the footballing spectrum.

## The Future of Home Advantage

Whilst home advantage may not be what it once was, it hasn't disappeared entirely. The support of the home crowd can still provide a boost, and familiarity with the surroundings can offer a slight edge. However, the trend is undeniable. The gap between home and away performance is narrowing, and the English Football League, across all its divisions, is becoming increasingly competitive on all fronts.

<html>
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.3.0/papaparse.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom"></script>

<script>
        const resultsUrl = "https://raw.githubusercontent.com/seanelvidge/England-football-results/main/EnglandLeagueResults.csv";

        // Create chart variables in the global scope
        let resultsChart, divisionChart;

        Papa.parse(resultsUrl, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                // 1) Check if we received valid data
          if (!results || !results.data || results.data.length === 0) {
              console.warn("No valid data returned. Showing fallback images.");
              showFallbackImages();
              return;
          }

          // 2) If there is an `errors` array with parse errors, handle that too
          if (results.errors && results.errors.length > 0) {
              console.warn("Papa Parse encountered errors. Showing fallback images:", results.errors);
              showFallbackImages();
              return;
          }

          // 3) Otherwise, data is good — proceed to create the charts
          const data = results.data;
          processData(data);
            },
			
			error: function(err) {
          // Papa Parse couldn't load the file at all
          console.error("Error loading remote data", err);
          showFallbackImages();
      }
        });
		
		function showFallbackImages() {
      // Hide both canvases
      document.getElementById("resultsChart").style.display = "none";
      document.getElementById("divisionChart").style.display = "none";

      // Show both fallback images
      document.getElementById("fallbackImage1").style.display = "block";
      document.getElementById("fallbackImage2").style.display = "block";
  }

        function processData(data) {
            const resultsBySeason = {};
            const resultsBySeasonAndDivision = {};

            data.forEach(row => {
				// Skip this row if Season or Result is missing
				if (!row.Season || !row.Result) {
					return;
				}
                const season = row.Season;
                const division = row.Division;
                const result = row.Result;

                // Overall Results by Season
                if (!resultsBySeason[season]) {
                    resultsBySeason[season] = { H: 0, D: 0, A: 0, total: 0 };
                }
                resultsBySeason[season][result]++;
                resultsBySeason[season].total++;

                // Results by Season and Division
                if (!resultsBySeasonAndDivision[season]) {
                    resultsBySeasonAndDivision[season] = {};
                }
                if (division && !resultsBySeasonAndDivision[season][division]) { // Check for undefined division
                    resultsBySeasonAndDivision[season][division] = { H: 0, D: 0, A: 0, total: 0 };
                }
                if (division) {
                    resultsBySeasonAndDivision[season][division][result]++;
                    resultsBySeasonAndDivision[season][division].total++;
                }
            });

            // Get the current season from the data
            const currentSeason = Object.keys(resultsBySeason).sort().pop();

            // Calculate Percentages and Standard Deviations
            const overallChartData = calculatePercentages(resultsBySeason, currentSeason);
            const divisionChartData = calculateDivisionPercentages(resultsBySeasonAndDivision);
            
            // Create Charts
            createResultsChart(overallChartData);
            createDivisionChart(divisionChartData);
        }

        function calculatePercentages(resultsBySeason, currentSeason) {
            const seasons = Object.keys(resultsBySeason).sort();
            const homeWins = [];
            const draws = [];
            const awayWins = [];
            const homeWinErrors = [];
            const drawErrors = [];
            const awayWinErrors = [];
            const filteredSeasons = []; // Array for keeping track of valid seasons

            seasons.forEach(season => {
                const results = resultsBySeason[season];
                const total = results.total;
        
                const hPercent = (results.H / total) * 100;
                const dPercent = (results.D / total) * 100;
                const aPercent = (results.A / total) * 100;
        
                // Calculate standard deviation (error bars)
                const hError = calculateStandardDeviation(results.H, total);
                const dError = calculateStandardDeviation(results.D, total);
                const aError = calculateStandardDeviation(results.A, total);
        
                if (season && season <= currentSeason) {
                    // Add valid season to the filtered array
                    filteredSeasons.push(season);
        
                    homeWins.push(hPercent);
                    draws.push(dPercent);
                    awayWins.push(aPercent);
            
                    homeWinErrors.push(hError);
                    drawErrors.push(dError);
                    awayWinErrors.push(aError);
                }
            });
            
            return {
                labels: filteredSeasons, // Use the filtered seasons for labels
                datasets: [
                    {
                        label: 'Home Win %',
                        data: homeWins,
                        borderColor: 'blue',
                        backgroundColor: 'transparent',
                        errorBars: homeWinErrors,
                    },
                    {
                        label: 'Draw %',
                        data: draws,
                        borderColor: 'green',
                        backgroundColor: 'transparent',
                        errorBars: drawErrors,
                    },
                    {
                        label: 'Away Win %',
                        data: awayWins,
                        borderColor: 'red',
                        backgroundColor: 'transparent',
                        errorBars: awayWinErrors,
                    }
                ]
            };
        }

        function calculateDivisionPercentages(resultsBySeasonAndDivision) {
            const seasons = Object.keys(resultsBySeasonAndDivision).sort();
            const datasets = {};
        
            seasons.forEach(season => {
                const divisions = Object.keys(resultsBySeasonAndDivision[season]);
                divisions.forEach(division => {
                    if (division && !datasets[division]) { // Check for undefined division
                        // Assign specific colors to each division
                        let color;
                        if (division === '1') {
                            color = 'red';
                        } else if (division === '2') {
                            color = 'blue';
                        } else if (division === '3') {
                            color = 'green';
                        } else if (division === '4') {
                            color = 'purple';
                        } else {
                            color = getRandomColor(); // Fallback to a random color
                        }

                        datasets[division] = {
                            label: `Division ${division}`,
                            data: [],
                            borderColor: color,
                            backgroundColor: 'transparent',
                            errorBars: [],
                        };
                    }
        
                    if (division) {
                        const results = resultsBySeasonAndDivision[season][division];
                        const total = results.total;
            
                        const hPercent = (results.H / total) * 100;
                        const dPercent = (results.D / total) * 100;
                        const aPercent = (results.A / total) * 100;
            
                        // Here we'll just use Home Win % for simplicity, but you can add others
                        datasets[division].data.push({x: season, y: hPercent});
                        datasets[division].errorBars.push(calculateStandardDeviation(results.H, total));
                    }
                });
            });
        
            return {
                labels: seasons,
                datasets: Object.values(datasets)
            };
        }
        
        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        function calculateStandardDeviation(count, total) {
            const p = count / total;
            const stdDev = Math.sqrt((p * (1 - p)) / total) * 100; // Convert to percentage
            return stdDev;
        }

        function createResultsChart(chartData) {
            const ctx = document.getElementById('resultsChart').getContext('2d');
            resultsChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    plugins: {
                        zoom: {
                            zoom: {
                                wheel: {
                                    enabled: false,
                                },
                                pinch: {
                                    enabled: true
                                },
                                mode: 'xy',
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += context.parsed.y.toFixed(2) + '%';
                                    return label;
                                },
                                footer: function(context) {
                                    const dataset = context[0.0].dataset;
                                    const error = dataset.errorBars[context[0.0].dataIndex];
                                    return `±${error.toFixed(2)}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Percentage',
                                // Larger font size for axis title
                                font: {
                                    size: 16
                                }
                            },
                            // Larger font size for axis ticks
                            ticks: {
                                font: {
                                    size: 14
                                }
                            }
                        },
                        x: {
                            ticks: {
                                // Only show ticks for every 5 years
                                callback: function(value, index, values) {
                                    const year = this.getLabelForValue(value);
                                    if (year.endsWith('5') || year.endsWith('0')) {
                                        return year.substring(0, 4); // return EEOC format
                                    }
                                },
                                // Larger font size for axis ticks
                                font: {
                                    size: 14
                                }
                            },
                            title: {
                                display: true,
                                text: 'Season',
                                // Larger font size for axis title
                                font: {
                                    size: 16
                                }
                            }
                        }
                    }
                }
            });
        }

        function createDivisionChart(chartData) {
            const ctx = document.getElementById('divisionChart').getContext('2d');
            divisionChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    plugins: {
                        zoom: {
                            zoom: {
                                wheel: {
                                    enabled: false,
                                },
                                pinch: {
                                    enabled: true
                                },
                                mode: 'xy',
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += context.parsed.y.toFixed(2) + '%';
                                    return label;
                                },
                                footer: function(context) {
                                    const dataset = context[0.0].dataset;
                                    const error = dataset.errorBars[context[0.0].dataIndex];
                                    return `±${error.toFixed(2)}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Percentage',
                                // Larger font size for axis title
                                font: {
                                    size: 16
                                }
                            },
                            // Larger font size for axis ticks
                            ticks: {
                                font: {
                                    size: 14
                                }
                            }
                        },
                        x: {
                            ticks: {
                                // Only show ticks for every 5 years
                                callback: function(value, index, values) {
                                    const year = this.getLabelForValue(value);
                                    if (year.endsWith('5') || year.endsWith('0')) {
                                        return year.substring(0, 4); // return EEOC format
                                    }
                                },
                                // Larger font size for axis ticks
                                font: {
                                    size: 14
                                }
                            },
                            title: {
                                display: true,
                                text: 'Season',
                                // Larger font size for axis title
                                font: {
                                    size: 16
                                }
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: '% Home Wins per Division'
                        }
                    }
                }
            });
        }
    </script>
</html>
