---
layout: post
title: 40 points to avoid relegation?
date: 2025-11-08 23:04:00
description: 40 points is the classic benchmark to avoid relegation from the Premier League, is this the right value?
tags: football mathematics
related_posts: true
thumbnail: assets/img/pts_avoid_relegation.png
---

The number has become part of Premier League folk law. Forty points. Reach 40 and you can relax, the trapdoor to the Championship won't open.

At the start of the 2015/16 season (the season Leicester City won the League!) their manager Claudio Ranieri set them the target of reaching 40 points to avoid relegation. When they hit the target:

> "We have 40 points which was the goal. It's champagne for my players!"

> Claudio Ranieri, 2 Jan, 2016.

But where did this number come from, and it is the right target?

Many people have noted that the 40 point mark is a "myth" (e.g. [The Premier League](https://www.premierleague.com/en/news/3932287), [BBC](https://www.bbc.co.uk/sport/football/43049564), [The Athletic](https://www.nytimes.com/athletic/6126560/2025/02/12/leicester-city-fixtures-premier-league-relegation/)). But those articles are really just saying that, on average, you need less than 40 points to survive (and the number of points you need seems to be decreasing).

<html>
<figure>
  <canvas id="pointsChart"></canvas>
  <figcaption></figcaption>
</figure>
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

The plot above shows the number of points required to stay in the top division of English football (since 3 points for a win was introduced in 1985; this includes before the Premier League started in 1992). Note that during that time there have been a varying number of teams in the top division (between 20 and 22) which obviously impacts the points required. We have normalized this to a 38-game season for comparison.

A few things are immediatly obvious:

1. Most of the time you do not need 40 points to avoid relegation (34/44; 77%),
2. The average number of points needed to avoid relegation over the last 40 years is 37 (in the Premier League era, it is 36 points),
3. There is a clear decreasing trend of the number of points required.

So where does the idea that you need 40 points come from? There is no obvious origin of the phrase. My best guess is that in the mid 90s, after Southampton survied (just, on goal difference) with 38 points in 1995/96, followed by Coventry City with 41 the following year, then Everton with 40 and then Southampton (again) with 41 points in 1998/99, that that run of four was enough for the (rough) number to stick.

But despite the previous analysis (by me and many others) I think 40 is still the correct, pre-season, target. Moving to (for example) a 37 point target would only give you slightly better than a 50-50 chance of staying up (54.5%). Perhaps you would like a little more certainty...

One way to look at this is to calculate the cumulative distribution function (CDF). The CDF is a function that shows the probability that a random variable is less than or equal to a specific value. It "accumulates" or "adds up" the probabilities for all outcomes up to a certain point.

<figure>
  <canvas id="cdfChart"></canvas>
  <figcaption></figcaption>
</figure>

The above figure shows two, slightly different, CDFs, in blue across the whole dataset (since 1985) and in red just in the Premier League era. To read the plot look at the number of points on the x-axis and then read off the corresponding probability of avoiding relegation on the y-axis for that number of points.

Now the 40 point value makes a lot more sense, as it gives a team over an 80% chance of staying in the division, now I prefer those odds!

So, whilst there are plenty of posts online telling you that the 40 point target is a myth, I think, as pre-season target for teams, it is still a good one.

<!-- Load Chart.js once -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>

<canvas id="pointsChart"></canvas>

<script>
  // Your data (unchanged)
  const chartData = {
    datasets: [
      {
        label: '(Normalized) Points Needed to Avoid Relegation',
        data: [
          { x: '1982', y: 38.9 }, { x: '1983', y: 43.4 }, { x: '1984', y: 44.3 },
          { x: '1985', y: 45.2 }, { x: '1986', y: 38.0 }, { x: '1987', y: 38.9 },
          { x: '1988', y: 34.2 }, { x: '1989', y: 40.0 }, { x: '1990', y: 44.0 },
          { x: '1991', y: 38.0 }, { x: '1992', y: 38.9 }, { x: '1993', y: 45.2 },
          { x: '1994', y: 38.9 }, { x: '1995', y: 39.8 }, { x: '1996', y: 39.0 },
          { x: '1997', y: 41.0 }, { x: '1998', y: 41.0 }, { x: '1999', y: 37.0 },
          { x: '2000', y: 34.0 }, { x: '2001', y: 35.0 }, { x: '2002', y: 37.0 },
          { x: '2003', y: 43.0 }, { x: '2004', y: 34.0 }, { x: '2005', y: 34.0 },
          { x: '2006', y: 35.0 }, { x: '2007', y: 39.0 }, { x: '2008', y: 37.0 },
          { x: '2009', y: 35.0 }, { x: '2010', y: 31.0 }, { x: '2011', y: 40.0 },
          { x: '2012', y: 37.0 }, { x: '2013', y: 37.0 }, { x: '2014', y: 34.0 },
          { x: '2015', y: 36.0 }, { x: '2016', y: 38.0 }, { x: '2017', y: 35.0 },
          { x: '2018', y: 34.0 }, { x: '2019', y: 35.0 }, { x: '2020', y: 35.0 },
          { x: '2021', y: 29.0 }, { x: '2022', y: 36.0 }, { x: '2023', y: 35.0 },
          { x: '2024', y: 27.0 }, { x: '2025', y: 26.0 }
        ],
        // keeping errorBars in case you add them later; not used in this plot
        errorBars: { '(Normalized) Points Needed to Avoid Relegation': [] }
      }
    ]
  };

  // Helpers
  const years   = chartData.datasets[0].data.map(p => p.x);
  const yPoints = chartData.datasets[0].data.map(p => p.y);
  const xNums   = years.map(y => parseInt(y, 10));

  function formatSeason(yearStr) {
    const y = parseInt(yearStr, 10);
    const prev = y - 1;
    const next2 = String(y).slice(-2).padStart(2, '0');
    return `${prev}/${next2}`;
  }

  // Linear regression (least squares) on (xNums, yPoints)
  function linearFit(xs, ys) {
    const n = xs.length;
    const sumX = xs.reduce((a,b)=>a+b, 0);
    const sumY = ys.reduce((a,b)=>a+b, 0);
    const sumXY = xs.reduce((a,xi,i)=>a + xi*ys[i], 0);
    const sumXX = xs.reduce((a,xi)=>a + xi*xi, 0);
    const denom = n*sumXX - sumX*sumX;
    const m = (n*sumXY - sumX*sumY) / denom;
    const c = (sumY - m*sumX) / n;
    return { m, c };
  }

  const { m, c } = linearFit(xNums, yPoints);
  const fitY = xNums.map(x => m*x + c);

  // Build datasets
  const primaryDataset = {
    label: '(Normalized) Points Needed to Avoid Relegation',
    data: yPoints,
	borderColor: 'darkblue',
    borderWidth: 2,
    pointRadius: 2,
    tension: 0
  };

  const fortyLine = {
    label: '40-point benchmark',
    data: years.map(() => 40),
    borderColor: 'red',
    borderWidth: 2,
    pointRadius: 0,
    tension: 0,
    fill: false,
    order: 0 // draw beneath the main series
  };

  const fitLine = {
    label: 'Linear fit',
    data: fitY,
    borderColor: 'grey',
    borderWidth: 2,
    borderDash: [6, 4],
    pointRadius: 0,
    tension: 0,
    fill: false,
    order: 2 // draw on top
  };
  
  const vertical1993 = {
    label: 'Start of Premier League',
    data: [
      { x: '1993', y: 25 },   
      { x: '1993', y: 50 }  
    ],
    borderColor: 'purple',
    borderWidth: 0.5,
    pointRadius: 0,
    tension: 0,
    fill: false,
    borderDash: [10, 10],
    order: 3 // draw on top
  };


  const ctx = document.getElementById('pointsChart').getContext('2d');

  // We’ll feed labels as the years; datasets are arrays aligned by index.
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [fortyLine, primaryDataset, fitLine, vertical1993]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            title: (items) => {
              // Show the season format in tooltip title
              const year = items[0].label;
              return formatSeason(year);
            }
          }
        }
      },
      scales: {
        x: {
          type: 'category',
          title: { display: true, text: 'Season' },
          ticks: {
            // Show every 5th year only, formatted as season
            callback: function(value, index) {
              const yearStr = this.getLabelForValue(value);
              const y = parseInt(yearStr, 10);
              return (y % 5 === 0) ? formatSeason(yearStr) : '';
            },
            maxRotation: 0,
            autoSkip: false
          }
        },
        y: {
          title: { display: true, text: 'Points' },
          beginAtZero: false
        }
      },
      interaction: { mode: 'nearest', intersect: false }
    }
  });
</script>

<script>
  // First CDF (full historical)
  const cdfPercents = [
    0.00, 0.00, 0.00, 0.00, 0.00,
    0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2.27, 4.55, 4.55, 6.82,
    6.82, 9.09, 9.09, 9.09, 20.45, 38.64, 43.18, 54.55, 61.36, 75.00,
    81.82, 86.36, 86.36, 88.64, 93.18, 95.45, 100.00, 100.00, 100.00, 100.00,
    100.00, 100.00, 100.00, 100.00, 100.00, 100.00
  ];

  // Second CDF (Premier League Era)
  const cdfPremier = [
    0.00, 0.00, 0.00, 0.00, 0.00,
    0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 3.03, 6.06, 6.06, 9.09,
    9.09, 12.12, 12.12, 12.12, 27.27, 48.48, 54.55, 69.70, 72.73, 81.82,
    87.88, 93.94, 93.94, 96.97, 96.97, 96.97, 100.00, 100.00, 100.00, 100.00,
    100.00, 100.00, 100.00, 100.00, 100.00, 100.00
  ];

  // Build points for x = 15..(15 + length - 1)
  const cdfData1 = cdfPercents.map((p, i) => ({ x: i+15, y: p }));
  const cdfData2 = cdfPremier.map((p, i) => ({ x: i+15, y: p }));

  const cdfCtx = document.getElementById('cdfChart').getContext('2d');
  new Chart(cdfCtx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Historical CDF',
          data: cdfData1,
          stepped: true,
          borderWidth: 2,
          pointRadius: 0
        },
        {
          label: 'Premier League Era CDF',
          data: cdfData2,
          stepped: true,
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0
        }
      ]
    },
    options: {
      parsing: false,
      scales: {
        x: {
          type: 'linear',
          min: 15,
          max: 55,
          ticks: { stepSize: 5 },
          title: { display: true, text: 'Points' }
        },
        y: {
          min: 0,
          max: 100,
          ticks: { callback: v => v + '%' },
          title: { display: true, text: 'Cumulative probability (%)' }
        }
      },
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: ctx => `P(X ≤ ${ctx.parsed.x}) = ${ctx.parsed.y.toFixed(2)}%`
          }
        }
      },
      elements: {
        line: { tension: 0 }
      }
    }
  });
</script>
