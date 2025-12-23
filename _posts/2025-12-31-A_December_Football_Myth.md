---
layout: post
title: When Good Ideas Don't Survive Contact With Data - A December Football Myth Tested
date: 2025-12-31 19:30:00
description: Every so often I come up with what feels like a good idea for a blog post. But they don't always work out, this is the story of my investigations into the congested English football December schedule and whether it gives certain teams an advantage.
tags: football mathematics
related_posts: true
thumbnail: assets/img/ppm_dec_nonDec.png
---

Every so often I come up with what feels like a great idea for a blog post. A clever angle, an interesting hypothesis, something that surely must be hiding in the data just waiting to be revealed. And then, after hours of analysis, the result is... nothing. Completely flat. No effect.

This is one of those stories.

I wanted to look at whether the famously congested English football December schedule gives an advantage to teams (either weaker or stronger teams). With matches every few days, tired legs, rotation, winter weather, and general chaos, it seemed plausible that perhaps squad rotation from the stronger sides might be key, or perhaps stronger sides might stumble more than usual and that underdogs might pick up a few unexpected points.

It's a nice idea. Unfortunately, as we'll see, a nice idea does not guarantee a nice result.

## Why December Might Matter

Consider what happens in December in English football:

- Fixture congestion increases dramatically.
- Elite teams face multiple competitions and may rotate heavily.
- Injuries accumulate and squad depth becomes critical.
- Weather worsens, pitches soften, and match conditions become less predictable.

Perhaps if stronger teams depend more on structure and precision, and weaker teams rely more on disruption and variance, you can build a reasonable argument that December's chaos environment might narrow the gap.

In other words, if $$S$$ is team strength and $$\epsilon$$ is "football randomness", maybe the effective strength looks more like:

$$
S_{\text{effective}} = S + \epsilon,
$$

and perhaps December has a larger $$\epsilon$$.

If so, underdogs might perform better than expected.

## How to Measure "Underdog Performance"?

To test this we need a [very large dataset of football results](https://seanelvidge.com/articles/2024/All_England_football_league_results/) and a way to [quantify which team was stronger _before_ the match](https://seanelvidge.com/articles/2025/Football_team_rankings/) was played.

In the team strength database a higher values means a stronger team.

Thus:

- The stronger team is whichever side has the higher rank.
- The weaker team (the "underdog") is the side with the lower rank.

And for each match, we compute:

- Underdog points
- Underdog goal difference
- Whether the match took place in December

Everything you'd need to test whether December helps the weaker (or stronger) team.

## December vs Non-December: The Raw Numbers

Aggregating across every division, every season, and every match where a clear favourite exists, we get:

- Outside December, underdogs earn: **1.178 points per match**
- In December, underdogs earn: **1.181 points per match**

The difference, **0.0026 points**, is essentially zero.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/ppm_dec_nonDec.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>

The underlying distribution of goal differences tells the same story.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/Underdog_Goal_Differences.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>

I will admit, this was mildly disappointing. But maybe aggregate data hides the truth? Perhaps the Premier League behaves differently? Or lower leagues, with smaller squads, show something?

Nope.

However you slice the dataset, Tier 1, Tier 2, Tier 3, Tier 4, the same conclusion emerges:

- The difference between underdog performance in December vs other months is tiny.
- In every tier, the effect is statistically insignificant.
- Some tiers lean slightly positive, others slightly negative, all within noise.

So weaker teams, as a group, do **not** seem to benefit from the December schedule.

You might reasonably ask whether the **favourites** show any seasonal change. If weaker teams don't improve, perhaps stronger teams deteriorate?

I ran the same comparison for the stronger side in each match.

The result? Exactly the same story.

Stronger teams’ points and goal differences in December are statistically indistinguishable from the rest of the season. No noticeable dip, no seasonal weakness, no hidden December curse.

In short:

> Neither underdogs nor favourites show any meaningful change in performance during December.

## A More Formal Statistical Model

To be thorough, I fitted a regression model of underdog points:

$$
\text{pts} = \beta_0
+ \beta_1\,\text{December}
+ \beta_2\,\text{Home}
+ C(\text{Tier})
+ C(\text{Season})
+ \varepsilon .
$$

This controls for:

- Home advantage
- League tier
- Season-by-season variation

The coefficient for the December effect came out as:

$$
\beta_1 = -0.0018 \pm 0.013,
$$

which is, again, indistinguishable from zero.

## When a Good Hypothesis Fails

This leads to what I think is the most important lesson from the whole exercise.

In science many ideas do not survive contact with real data. They're plausible, they're elegant, and they would make for a great story, but the universe simply refuses to cooperate.

That does not make the work wasted.

It makes it honest.

## The Academic Problem With Negative Results

In academia, "negative" or null results are notoriously hard to publish. Journals often prefer dramatic or surprising findings, which unintentionally encourages selective reporting:

- Effects that **don't** exist are quietly forgotten.
- Effects that **appear by chance** get published.
- The literature accumulates exciting stories but not necessarily accurate ones.

This December analysis is a textbook example: an interesting idea, diligently tested, clearly unsupported.

Yet these non-effects matter. They give us a clearer picture of reality, and they remind us that the absence of a pattern is itself information, and sometimes, important information.
