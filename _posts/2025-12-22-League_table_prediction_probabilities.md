---
layout: post
title: How to Calculate League Position Probabilities
date: 2025-12-22 19:30:00
description: How the football league table predictor plays out the remaining fixtures, allows for uncertain team strengths, and estimates each club's possible finishing positions.
tags: football mathematics
related_posts: true
thumbnail: assets/img/position-odds-2025-2026-EFL_Championship.png
image_alt: Heatmap of predicted finishing-position probabilities for the 2025/26 EFL Championship teams.
last_modified_at: 2026-10-24
---

By mid-season, football fans instinctively start doing probability in their heads.

> If we win our next two, and they drop points away at… actually, hang on.

This usually ends with a napkin full of scribbles and a strong emotional commitment to a particular set of results. The [predicted league tables]({{ '/tableProbs' | relative_url }}) do the same exercise many times over, playing out the remaining fixtures to see where each team could finish.

The result is a table of probabilities: a chance for every team to finish in every position. This post explains where those numbers come from and how to read them.

## Estimating the remaining matches

The starting point is my [team-strength ratings]({% post_url 2025-12-15-Football_team_rankings %}). These learn from past results, including [the margin of victory]({% post_url 2026-10-24-Football_rankings_and_winning_margins %}), to estimate how strong each team is and how confident we should be in that estimate.

For each remaining fixture, the teams' strengths, home advantage and the division's tendency to produce draws give us three probabilities: a home win, a draw, or an away win. You can explore this part with the [match probability calculator]({{ '/matchProbs' | relative_url }}).

A favourite is more likely to win, but an upset remains possible. That is rather the point of football.

## Allowing for uncertainty

Imagine we have slightly underestimated a team. With thirty matches still to play, that small error has plenty of opportunities to matter. With three matches left, there is much less time for it to change the final table.

To allow for this, each simulated season begins by picking one plausible strength for every team, using both its rating and the uncertainty around it. We keep those strengths fixed for all the remaining matches in that run. Then we pick again for the next simulated season.

So a team drawn stronger than our central estimate is more competitive throughout that run. An error in our estimate would affect all its games together.

This gives early-season forecasts a wider spread, when there is still plenty of time for our estimates to prove slightly wrong. The real ratings continue to update as actual results arrive; holding them fixed is an assumption about each simulated future.

## Playing out the rest of the season

With those strengths chosen, we play each remaining fixture once, choosing a result according to its probabilities. A win gives three points to the winner and none to the loser; a draw gives one point to each. Both opponents share the same result.

Add those points to the current standings, including recorded points deductions, and we have one possible final league table. Repeat the exercise many times and count how often each team finishes first, second, third, and so on.

If a team finishes sixth in about 12 out of every 100 simulated seasons, its estimated chance of finishing sixth is about 12%.

Teams tied on points are put in a random order. Real leagues use goal difference and other rules, so this is an approximation, particularly when teams are closely matched. The displayed percentages are also rounded estimates from a finite number of simulations.

## Reading the table

Find your division, then read across your team's row. Each column is a possible finishing position.

- **12%** means an estimated 12% chance of finishing in that position.
- **<1%** marks a very small estimated chance, including rare finishes for which an example has been found.
- **&lt;&lt;1%** means the finish was not observed in the simulations and no example has yet been found. The calculation has not resolved how small its chance is.
- **–** means the position has been ruled out by the tool's checks on possible points totals.

The strongest probability in each row is highlighted, and other positions are shaded relative to it. Look at the spread across the row: the most likely single position can still have a fairly small chance if several neighbouring places are plausible.

Here is an example of the layout:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/position-odds-2025-2026-EFL_Championship.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Example table with Championship teams in rows and possible finishing positions in columns, shaded by probability." caption="An example of the table layout, from the 2025/26 Championship forecasts." %}
    </div>
</div>

On a mobile screen, a compact summary shows the chance of finishing first, in the top six, or in the bottom three. You can switch to the full table, and download it as an image for closer inspection. Selecting a position in the full table can also show an example set of results that would produce that finish, where one has been found.

The top-six and bottom-three figures describe finishing places. Promotion, play-offs and relegation depend on the rules of the particular division, so those labels do not always correspond directly to going up or down.

## What the forecast assumes

Recent results inform the ratings, but the forecast does not try to guess the next injury crisis, transfer window, managerial change or future points deduction. It asks:

> Given what we know right now, how wide is the space of possible final tables?

Sometimes that space is narrow. Sometimes it can be surprisingly large. A team can have the best chance of winning the league while still being more likely to finish somewhere else.

The [tables]({{ '/tableProbs' | relative_url }}) are refreshed as the [football database]({% post_url 2024-12-28-All_England_football_league_results %}) is updated. Check the season and update information shown on the page when reading a forecast.

## Does it give sensible probabilities?

We can test the approach by going back to past seasons and making forecasts using only what was known at the time. The checks cover 152 forecasts across the top four divisions from 2016/17 to 2025/26, made at the start and roughly one-quarter, one-half and three-quarters of each season. The incomplete 2019/20 League One and League Two seasons are excluded.

One useful check is the range of final points totals. An **80% range** should contain the eventual total about four times out of five. At the start of the historical seasons tested, the earlier forecast managed only **59.75%**: it was too confident. With ratings that use winning margins and uncertainty carried through each simulated season, that becomes **81.08%**.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="lazy" path="assets/img/football-league-uncertainty-validation.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Actual coverage of 80 percent final-points ranges is close to the intended 80 percent at all four forecast stages after sampling uncertain strengths. At the start of the season, coverage rises from 59.75 percent to 81.08 percent." caption="An 80% range should contain the eventual points total about 80% of the time. Grey uses results-only ratings; orange adds winning margins; green also allows for uncertainty in team strength. The largest improvement is at the start of the season." %}
    </div>
</div>

Across all four stages, the 80% ranges contain **81.16%** of the actual totals, and the 95% ranges contain **94.18%**. The combined changes also improve the score used to assess the full spread of finishing-position probabilities by about **5%**. Simply making every range wider would not guarantee a better score.

There is still room to improve: the early-season 95% ranges remain a little narrow. These seasons had already been examined in earlier reviews of the model, so future results will provide a cleaner test. The [ratings and validation article]({% post_url 2026-10-24-Football_rankings_and_winning_margins %}) has the statistical details for anyone who would like to go further.
