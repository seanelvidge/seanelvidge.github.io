---
layout: post
title: How long until a double hat-trick in the Premier League?
date: 2026-09-04 22:00:00
description: No player has scored six goals in a single Premier League match - how surprising is that?
tags: football mathematics
related_posts: true
thumbnail: assets/img/topScorers.png
image_decorative: true
---

Five players have scored five goals in a single Premier League match.

Andrew Cole did it for Manchester United against Ipswich in 1995. Alan Shearer followed for Newcastle against Sheffield Wednesday in 1999. Jermain Defoe, Dimitar Berbatov and Sergio Agüero later joined them.

But nobody has ever scored six.

A hat-trick is sufficiently common that we normally see several every season. Four goals in a match is unusual, but hardly unprecedented. Five is exceptional. Six — the _double hat-trick_ — has still never happened in the Premier League.

That raises an obvious question:

**Is the Premier League overdue one?**

Or, put another way, after more than three decades of Premier League football, should we actually be surprised that nobody has managed it?

## How rare are big goal hauls?

From the start of the Premier League in 1992–93 through to 2025–26, there have been 30,561 occasions on which a player has scored at least one goal in a match, excluding own goals.

They break down like this:

| Goals by one player | Number of times |
| ------------------: | --------------: |
|                   1 |          27,285 |
|                   2 |           2,871 |
|                   3 |             363 |
|                   4 |              37 |
|                   5 |               5 |
|           6 or more |           **0** |

There is already quite a striking pattern here.

Roughly speaking, moving from one scoring level to the next happens about one time in ten:

- about 10.5% as many braces as single-goal performances;
- about 12.6% as many hat-tricks as braces;
- about 10.2% as many four-goal performances as hat-tricks;
- and about 13.5% as many five-goal performances as four-goal performances.

That does not mean that somebody who has already scored five has a 10–13% chance of immediately scoring a sixth. These are frequencies across complete player performances, not probabilities during an individual match.

But it does suggest something useful: the number of extreme scoring performances falls away rapidly, while the fall-off is reasonably regular.

If that pattern continues, six goals should be very rare — but perhaps not impossibly rare.

## A statistical model for goal hauls

The obvious starting point for modelling goals is the [Poisson distribution](https://en.wikipedia.org/wiki/Poisson_distribution). It is widely used for counts of relatively rare events and often provides a reasonable first approximation to football scores.

There is a problem here though.

A Poisson model in its simplest form assumes a single underlying scoring rate. But clearly not every player in every match has the same chance of scoring.

A centre-back playing for a relegation-threatened team does not have the same scoring prospects as Erling Haaland playing up front for Manchester City. The same player can have very different prospects from one match to another depending on the opposition, minutes played, penalties, red cards, tactics and simply how the match develops.

So rather than assuming a single scoring rate, we can imagine lots of different scoring rates mixed together.

Mathematically, doing this in a particular natural way leads to something called a [negative binomial distribution](https://en.wikipedia.org/wiki/Negative_binomial_distribution).

The name is much less important than the idea. We are saying:

> goals might behave roughly like rare random events within a particular player-match, but the underlying chance of those goals occurring varies enormously between player-matches.

That variation creates a slightly "fatter tail" than a simple Poisson model: very large scoring performances occur more often than we would expect if everyone had the same underlying scoring rate.

And that turns out to describe the Premier League data remarkably well.

## What does the model predict?

Fitting the model to the observed one-, two-, three-, four- and five-goal performances gives the following expected numbers over Premier League history:

| Goals | Actually observed | Model expectation |
| ----: | ----------------: | ----------------: |
|     1 |            27,285 |            27,280 |
|     2 |             2,871 |             2,889 |
|     3 |               363 |               342 |
|     4 |                37 |                43 |
|     5 |                 5 |               5.5 |
|    6+ |             **0** |          **0.83** |

The agreement is perhaps better than I would have expected.

Most importantly, the model predicts that by now we should have seen about 0.83 performances with six or more goals.

At first sight that might sound as though we are overdue one. After all, 0.83 is getting fairly close to 1.

But expected values do not work quite like that.

If an event occurs randomly with an expected count of 0.83 over some period, the probability of seeing _none at all_ is approximately

$$
P(0)=e^{-0.83}\approx0.44.
$$

So there is about a **44% probability that the Premier League would still have had no double hat-trick by now**.

That is the result I find most interesting.

The fact that nobody has scored six Premier League goals in a match is not particularly surprising.

There was almost a fifty-fifty chance that we would still be waiting.

At the same time, six goals is no longer so extreme that seeing it would be statistically extraordinary. The model says it is rare, but entirely plausible.

## So when might it happen?

The fitted model gives a probability of approximately

$$
2.7\times10^{-5}
$$

that a Premier League scoring performance contains six or more goals.

That is about one in every 36,900 occasions on which a player scores in a match.

A modern 380-match Premier League season produces roughly 880 scoring player-performances. That translates into about a

**2.4% chance of at least one double hat-trick in any particular season.**

Another way of expressing that is an average waiting time of roughly **42 seasons**.

Again, that does not mean we should expect one exactly every 42 years. Rare events do not arrive according to a timetable. We might get one next weekend, or wait another century.

It is more useful to look at the cumulative probability:

|   From now | Chance of at least one six-goal performance |
| ---------: | ------------------------------------------: |
|   1 season |                                        2.4% |
|  5 seasons |                                         11% |
| 10 seasons |                                         21% |
| 20 seasons |                                         38% |
| 30 seasons |                                     **51%** |
| 40 seasons |                                         62% |

On this model, therefore, there is roughly a one-in-two chance that somebody scores six or more goals in a Premier League match within the next 30 seasons.

There is, of course, considerable uncertainty in that number. We are trying to estimate the frequency of something that has never actually happened, using only five five-goal performances and 37 four-goal performances to tell us about the very far end of the distribution.

A reasonable uncertainty range puts the average rate at somewhere between approximately one every 27 seasons and one every 75 seasons.

But the qualitative conclusion does not really change.

## Not overdue — but not unimaginable

This is a useful example of the distinction between an event being unobserved and an event being surprisingly absent.

Nobody has ever scored six in a Premier League match. That makes it historically exceptional, but it does not mean something statistically peculiar has happened.

Based on the pattern of every scoring performance since 1992, we would have expected about 0.83 double hat-tricks by now. There is still around a 44% chance that the correct number would be zero.

So the Premier League is not overdue a double hat-trick.

But nor would the first one be some wildly improbable statistical freak.

When somebody eventually scores six, the headlines will quite reasonably describe it as unprecedented.

The mathematics will say something slightly different:

**unprecedented, yes; unexpected, no.**

## Acknowledgements

The data in this post is derived from data provided in the [https://github.com/schochastics/football-data](https://github.com/schochastics/football-data) repository by David Schoch, used under the Open Data Commons Attribution License (ODC-By) v1.0.
