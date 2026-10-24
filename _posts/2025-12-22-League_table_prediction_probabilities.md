---
layout: post
title: How to Calculate League Position Probabilities
date: 2025-12-22 19:30:00
description: How football team-strength ratings become league-position probabilities, explaining the original analytical approach and the current simulation-based tool.
tags: football mathematics
related_posts: true
thumbnail: assets/img/position-odds-2025-2026-EFL_Championship.png
image_alt: Heatmap of predicted finishing-position probabilities for the 2025/26 EFL Championship teams.
last_modified_at: 2026-10-24
---

By mid-season, football fans instinctively start doing probability in their heads.

> **Update, 6 September 2026:** This article describes the original analytical approach. The [current league-position tool]({{ '/tableProbs' | relative_url }}) now uses seeded Monte Carlo simulations of the remaining fixtures, with strengths held fixed within each simulated season and random tie-breaks on points. Its estimates therefore have sampling uncertainty; the original discussion of exact probabilities below should not be read as a description of the current implementation.

> **Update, 24 October 2026:** The forecast now allows for uncertainty about each team's strength, while keeping that strength fixed within each simulated season. This matters most early on, when there is still plenty of football left to play. The [new ratings article]({% post_url 2026-10-24-Football_rankings_and_winning_margins %}) explains the accompanying winning-margin update and the historical checks behind both changes.

## More season left, more room for uncertainty

Imagine we have slightly underestimated a team. With thirty matches still to play, that small error has plenty of opportunities to matter. With three matches left, there is much less time for it to change the final table.

Keeping a team's strength fixed does not mean we know exactly what that strength is. The current simulator draws one plausible strength for each team from its rating distribution, then uses it for every remaining fixture. In the next simulated season, it draws again. Each fixture is played once, with the result awarding points to both opponents.

So a team drawn stronger than its estimated mean is more competitive throughout that simulated run. We keep that draw across all its games because an error in our estimate would affect those games together. Redrawing strength independently for every match would lose much of this effect.

This gives early-season forecasts a wider spread. No predictions about the next manager, transfer window or injury crisis are required; we are allowing for uncertainty in what we know now.

We can check whether that spread is sensible. An 80% range for final points should contain the eventual total about 80% of the time. At the start of the historical seasons tested, the old forecasts managed **59.75%**. With the new margin-based ratings and shared uncertainty, that becomes **81.08%**:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="lazy" path="assets/img/football-league-uncertainty-validation.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Coverage of 80 percent final-points intervals is close to the intended 80 percent at all four forecast stages after sampling uncertain strengths. The largest improvement is at the start of the season." caption="Historical checks at the start and roughly one-quarter, one-half and three-quarters of each season. The orange line changes the ratings alone; the green line also carries rating uncertainty through the remaining fixtures." %}
    </div>
</div>

Across all four stages, 80% intervals cover **81.16%** of outcomes and 95% intervals cover **94.18%**. The combined changes also improve the finishing-position probability score by about **5%**, so the benefit is more than simply making every range wider. These checks cover 152 forecast cutoffs in the completed 2016/17–2025/26 division-seasons; the incomplete 2019/20 League One and League Two seasons are excluded.

I also tested an extra allowance for future changes in form, but it made the points distributions too wide without improving the position score over using the existing rating uncertainty. The current forecast therefore uses the rating model's own variance, with no extra inflation. Its early-season 95% ranges remain a little narrow, and random tie-breaks on points are still an approximation. The [new article]({% post_url 2026-10-24-Football_rankings_and_winning_margins %}) gives the statistical details and the limits of this retrospective comparison.

## The original analytical approach

The discussion below is retained as the background to the original version. The current tool simulates complete seasons, preserving the relationship between opponents' points and the shared uncertainty described above; the original combination of independent team totals does not give exact joint league-position probabilities.

> If we win our next two, and they drop points away at… actually, hang on.

This usually ends with a napkin full of scribbles and a strong emotional commitment to a particular set of results. What follows in this post an attempt to do the same thing — but with statistics.

On the [predicted league tables](https://seanelvidge.com/tableProbs) page of this site you'll find the probabilities for every team finishing in every possible league position. Not via vast simulations. Not using "expected points" (xPts). Not vibes. Actual probabilities.

This post explains how those tables are built, what assumptions sit underneath them, and, importantly, what they don't claim to do.

## Estimating the future

For each remaining fixture, we estimate the probability of:

- a home win,
- a draw,
- an away win.

These probabilities come from my [rating model](https://seanelvidge.com/articles/2025/Football_team_rankings/) that combines:

- team strength,
- home advantage,
- historical era-dependent draw rates,

(you can try the [match probability calculator](https://seanelvidge.com/matchProbs) yourself).

For these forecasts we assume that team strength remains constant for the rest of the season. This is not because teams don't change, obviously they do, but because this assumption lets us ask a very precise question:

"Given what we know right now, what does the future look like?"

No form, no momentum, no injuries, no managerial bounce. Just the present frozen in amber.

## Turning matches into points

Once we know the probability that a team finishes on, say, 64 points, we can ask the next question:

"What position will that correspond to?"

For each possible final points total:

- we calculate the probability that other teams finish above that total,
- the probability they finish below it,
- and the probability they finish on exactly the same points.

When teams are tied on points, we assume a random tie-break between them. This is not how the real leagues work, goal difference matters, but it is a deliberately neutral assumption that avoids injecting additional modelling choices.

By aggregating over all possible point totals, we obtain the probability that a given team finishes in position 1, 2, 3, ..., N.

That's what fills the table.

For example:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/position-odds-2025-2026-EFL_Championship.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>

## Why this isn't a simulation

Many league predictors simulate the rest of the season thousands or millions of times (e.g. [Opta](https://theanalyst.com/articles/opta-football-predictions)). Those approaches can be flexible and intuitive. However this approach is different.

Here every probability is computed exactly so the results are fully reproducible and even small probabilities (like a 0.3% chance of winning the league) are real, not artefacts of random noise. However the cost of this precision is a stronger set of assumptions, here we assume:

- match outcomes are independent,
- team strengths do not change,
- tie-breaks are random.

## Reading the table

Each row shows a team; each column shows a finishing position.

- A cell marked “12%” means exactly that: a 12% chance of finishing in that position.
- "<1%" means possible, but very unlikely.
- "–" means impossible — the team cannot mathematically finish there.

The strongest probability in each row is highlighted, and other positions are shaded relative to it. This gives a quick visual sense of where a team’s likely finishing range lies.

This can be hard to see on a mobile scream, so the full table is replaced by a compact summary:

- chance of finishing 1st,
- chance of finishing Top 6,
- chance of finishing in the Bottom 3.

The full table is always available via a toggle, and the entire table can be downloaded as an image for closer inspection.

## What this doesn't say

These tables do not say:

- who will win the league,
- that form and injuries don’t matter.

They say something subtler, and, I think, more interesting:

"If the football world stays roughly as it is today, how wide is the space of possible futures?"

Sometimes that space is narrow. Sometimes it can be surprisingly large.

Check out the [predicted league tables](https://seanelvidge.com/tableProbs) for yourself. Updated everytime the [football database](https://seanelvidge.com/articles/2024/All_England_football_league_results/) is updated.
