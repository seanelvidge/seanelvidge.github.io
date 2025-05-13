---
layout: post
title: Waning Home Advantage in English League Football
date: 2025-01-13 09:00:00
description: An investigation in the trend of home advantage in English football
tags: football
thumbnail: assets/img/home_advantage_trend_fallback.png
related_posts: true
giscus_comments: true
---

For generations, "home advantage" has been a tenet of sports. The roar of the crowd, the familiarity of the pitch, the comfort of the home dressing room – all give the home team an edge. This is particularly true in English football. However, a look at the data spanning over a century of English football reveals an interesting trend: the home advantage is shrinking.

Using my database of all English league results since 1888 (available [here](https://github.com/seanelvidge/England-football-results), and described [here](https://seanelvidge.com/articles/2024/All_England_football_league_results/)) we can track the Home Win %, Draw %, and Away Win % from 1888 to the present day (at the time of writing, that is halfway through the 2024/2025 season, but the charts in this post should automatically update). The results are pretty clear:

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
<style>
    .chart-container {
        position: relative;
        width: 100%;
        min-height: 250px;
        height: 50vh;   /* Always 50% of the viewport height */
        max-height: 80vh;
    }
</style>
</html>

In the late 19th and early 20th centuries, home teams were dominant, boasting win percentages well above 60%. Away wins were a relative rarity, hovering around 20%. But as the decades have progressed, the lines have converged. Home win percentages have steadily declined, dipping towards 40% in recent years, while away wins have climbed, now consistently above 30% and with a clear upwards trajectory.

It would be easy to assume that this trend is confined to the top tier of English football, where the largest investments in training facilities, player recruitment, and tactical analysis occur. However, if we look at the home win percentages across all four tiers of English football (where "Tier 1" is the highest tier, currently the Premier League and "Tier 4" is the lowest, EFL League Two) we can see that this is a league-wide phenomenon.

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

If we look to extrapolate the trends in the data we can try and estimate what will happen in the future, fitting lines of best fit to the data we can estimate that home advantage will stick around for quite a while yet!

<div class="chart-container">
  <canvas id="finalTrendChart"></canvas>
</div>

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
    skipEmptyLines: true,
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
      const division = row.Tier;
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
    createFinalTrendChart(overallChartData);
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

      // const hPercent = (results.H / total) * 100;
      // const dPercent = (results.D / total) * 100;
      // const aPercent = (results.A / total) * 100;
      const hPercent = parseFloat((results.H / total * 100).toFixed(2));
      const dPercent = parseFloat((results.D / total * 100).toFixed(2));
      const aPercent = parseFloat((results.A / total * 100).toFixed(2));

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
          // errorBars: homeWinErrors,
        },
        {
          label: 'Draw %',
          data: draws,
          borderColor: 'green',
          backgroundColor: 'transparent',
          // errorBars: drawErrors,
        },
        {
          label: 'Away Win %',
          data: awayWins,
          borderColor: 'red',
          backgroundColor: 'transparent',
          // errorBars: awayWinErrors,
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

          // const hPercent = (results.H / total) * 100;
          // const dPercent = (results.D / total) * 100;
          // const aPercent = (results.A / total) * 100;
          const hPercent = parseFloat((results.H / total * 100).toFixed(2));
          const dPercent = parseFloat((results.D / total * 100).toFixed(2));
          const aPercent = parseFloat((results.A / total * 100).toFixed(2));

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
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              // pointStyle: 'circle', // (optional) specify a different shape if needed
            },
          },
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
                label += Number(context.parsed.y).toFixed(1) + "%";
                return label;
              },
              footer: function(context) {
                const dataset = context[0.0].dataset;
                // const error = dataset.errorBars[context[0.0].dataIndex];
                // return `±${error.toFixed(2)}%`;
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
    const ctx = document.getElementById("divisionChart").getContext("2d");
    divisionChart = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
          zoom: {
            zoom: {
              wheel: { enabled: false },
              pinch: { enabled: true },
              mode: "xy",
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                label += Number(context.parsed.y).toFixed(1) + "%";
                return label;
              },
              footer: function (context) {
                const dataset = context[0].dataset;
                const error = dataset.errorBars[context[0].dataIndex];
                return `±${error.toFixed(2)}%`;
              },
            },
          },
          // Put the title here with the rest of the plugins:
          title: {
            display: true,
            text: "% Home Wins per Division",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Percentage",
              font: { size: 16 },
            },
            ticks: {
              font: { size: 14 },
            },
          },
          x: {
            ticks: {
              callback: function (value) {
                const year = this.getLabelForValue(value);
                if (year.endsWith("5") || year.endsWith("0")) {
                  return year.substring(0, 4);
                }
              },
              font: { size: 14 },
            },
            title: {
              display: true,
              text: "Season",
              font: { size: 16 },
            },
          },
        },
      },
    });
  }

  function updateChartTheme(isDark) {
    // Decide on colors for dark vs. light
    const chartBgColor = isDark ? "#242424" : "#FFFFFF";
    const textColor = isDark ? "#FFFFFF" : "#000000";

    // Example: update your main chart's background
    resultsChart.options.plugins.legend.labels.color = textColor;
    resultsChart.options.scales.x.title.color = textColor;
    resultsChart.options.scales.x.ticks.color = textColor;
    resultsChart.options.scales.y.title.color = textColor;
    resultsChart.options.scales.y.ticks.color = textColor;

    // If you want the canvas background to be distinct from page background:
    // (Alternatively, you could just let the page background show through.)
    resultsChart.options.backgroundColor = chartBgColor;

    // Then re-render the chart
    resultsChart.update();

    // Example: update your main chart's background
    divisionChart.options.plugins.legend.labels.color = textColor;
    divisionChart.options.scales.x.title.color = textColor;
    divisionChart.options.scales.x.ticks.color = textColor;
    divisionChart.options.scales.y.title.color = textColor;
    divisionChart.options.scales.y.ticks.color = textColor;

    // If you want the canvas background to be distinct from page background:
    // (Alternatively, you could just let the page background show through.)
    divisionChart.options.backgroundColor = chartBgColor;

    // Then re-render the chart
    divisionChart.update();
  }
</script>

<script>
  // Create a new chart variable
  let finalTrendChart;

  function linearRegression(xArr, yArr) {
    const n = xArr.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += xArr[i];
      sumY += yArr[i];
      sumXY += xArr[i] * yArr[i];
      sumX2 += xArr[i] * xArr[i];
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
  }

  // Once your data is processed (within processData), call createFinalTrendChart
  // passing the same overallChartData used in createResultsChart:
 function createFinalTrendChart(chartData) {
    // Step 1) Convert season labels into a numeric index (e.g. [0, 1, 2, ...]) for regression
    //         This is simpler than parsing "1888-1889" as numeric years.
    const originalLabels = chartData.labels; // e.g. ["1888-1889","1889-1890", ...]
    const xIndex = originalLabels.map((_, i) => i);

    // We'll do separate arrays for the 3 series
    const homeData = chartData.datasets[0].data; // home percentages
    const drawData = chartData.datasets[1].data; // draw percentages
    const awayData = chartData.datasets[2].data; // away percentages

    // Step 2) Regress each set (home, draw, away)
    const homeLR = linearRegression(xIndex, homeData);
    const drawLR = linearRegression(xIndex, drawData);
    const awayLR = linearRegression(xIndex, awayData);

    // Step 3) Generate a new x range that extends 10 “years” beyond your last data point
    //         If your last index is N-1, go out to N-1+10 => N+9
    const lastIndex = xIndex[xIndex.length - 1]; // this should be xIndex.length - 1
    const extendedX = [];
    // For example, if you have data from i=0..136, then i=137..146 extends 10 more points
    for (let i = 0; i <= lastIndex + 50; i++) {
      extendedX.push(i);
    }

    // Step 4) Construct new string labels for the extended portion
    //         If your original label is "1888-1889", "1889-1890", we can guess future
    //         seasons by taking the first year and adding i. A simpler approach is
    //         just to label them 1..N, but here's an example parse:
    function nextSeasonLabel(baseLabel, increment) {
      // If format is "YYYY-YYYY", parse the first 4 digits:
      const baseYear = parseInt(baseLabel.substring(0, 4), 10);
      const nextStart = baseYear + increment;
      return `${nextStart}-${nextStart + 1}`; // e.g. "2025-2026"
    }

    // Build the extended label array
    const extendedLabels = extendedX.map((val) => {
      // If val <= lastIndex, just use the original label
      if (val <= lastIndex) {
        return originalLabels[val];
      } else {
        // val - lastIndex = how many seasons beyond the last real one
        const increment = val - lastIndex;
        // parse the last real label
        const lastRealLabel = originalLabels[lastIndex];
        return nextSeasonLabel(lastRealLabel, increment);
      }
    });

    // Step 5) Compute predicted values for home, draw, away, then normalize
    //         so they sum to 100 at each point.
    const homeTrend = [];
    const drawTrend = [];
    const awayTrend = [];

    for (let i = 0; i < extendedX.length; i++) {
      const xVal = extendedX[i];
      // raw predictions from linear model
      const hRaw = homeLR.slope * xVal + homeLR.intercept;
      const dRaw = drawLR.slope * xVal + drawLR.intercept;
      const aRaw = awayLR.slope * xVal + awayLR.intercept;
      // sum them
      const total = hRaw + dRaw + aRaw;
      // normalize to 100
      const hNorm = (hRaw / total) * 100;
      const dNorm = (dRaw / total) * 100;
      const aNorm = (aRaw / total) * 100;
      homeTrend.push(hNorm);
      drawTrend.push(dNorm);
      awayTrend.push(aNorm);
    }

    // Step 6) Build the final chart data
    const finalData = {
      labels: extendedLabels,
      datasets: [
        {
          label: "Home Win %",
          data: chartData.datasets[0].data
            // keep original data up to lastIndex,
            // but fill 'undefined' or null for the extended part
            // so the line doesn't incorrectly continue from actual data
            .concat(Array(extendedX.length - xIndex.length).fill(null)),
          borderColor: "blue",
          backgroundColor: "transparent",
        },
        {
          label: "Draw %",
          data: chartData.datasets[1].data
            .concat(Array(extendedX.length - xIndex.length).fill(null)),
          borderColor: "green",
          backgroundColor: "transparent",
        },
        {
          label: "Away Win %",
          data: chartData.datasets[2].data
            .concat(Array(extendedX.length - xIndex.length).fill(null)),
          borderColor: "red",
          backgroundColor: "transparent",
        },
        // Normalized trend lines (dashed)
        {
          label: "Home Trend (Normalized)",
          data: homeTrend,
          borderColor: "blue",
          backgroundColor: "transparent",
          borderDash: [5, 5],
          pointRadius: 0,
        },
        {
          label: "Draw Trend (Normalized)",
          data: drawTrend,
          borderColor: "green",
          backgroundColor: "transparent",
          borderDash: [5, 5],
          pointRadius: 0,
        },
        {
          label: "Away Trend (Normalized)",
          data: awayTrend,
          borderColor: "red",
          backgroundColor: "transparent",
          borderDash: [5, 5],
          pointRadius: 0,
        },
      ],
    };

    // Step 7) Create the chart
    const ctx = document.getElementById("finalTrendChart").getContext("2d");
    finalTrendChart = new Chart(ctx, {
      type: "line",
      data: finalData,
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Percentage",
              font: { size: 16 },
            },
            ticks: {
              font: { size: 14 },
            },
          },
          x: {
            ticks: {
              font: { size: 14 },
              // If you want to reduce clutter, show label every 5 or 10
              callback: function(value, index) {
                return index % 5 === 0 ? this.getLabelForValue(value) : "";
              },
            },
            title: {
              display: true,
              text: "Season",
              font: { size: 16 },
            },
          },
        },
        plugins: {
          title: {
            display: false,
            text: "Home/Draw/Away % with Normalized Trend to 100%",
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                label += Number(context.parsed.y).toFixed(1) + "%";
                return label;
              },
            },
          },
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
          zoom: {
            zoom: {
              wheel: { enabled: false },
              pinch: { enabled: true },
              mode: "xy",
            },
          },
        },
      },
    });
  }
  </script>

</html>
