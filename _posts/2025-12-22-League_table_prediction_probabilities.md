---
layout: post
title: From Fixtures to Futures, how we calculate league position probabilities
date: 2025-12-22 19:30:00
description: The methodology behind how we calculate the probabilities of where the different teams in the English football league will end up.
tags: football mathematics
related_posts: true
thumbnail: assets/img/position-odds-2025-2026-EFL_Championship.png
---

By mid-season, football fans instinctively start doing probability in their heads.

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
