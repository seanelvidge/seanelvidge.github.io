---
layout: page
title: Football Statistics & Data
permalink: /football/
description: Explore English football results since 1888, historical league tables, head-to-head records, team ratings and statistical football analysis by Sean Elvidge.
nav: false
seo:
  type: CollectionPage
---

Football supplies an almost unlimited collection of questions that can be tested with data. Does home advantage change over time? Is 40 points enough to avoid relegation? And is a club's "bogey ground" really more than a memorable run of bad results?

This is the starting point for my football statistics: the underlying results database, tools for exploring it, and selected articles explaining what the numbers can, and cannot, tell us.

<div class="topic-callout" markdown="1">
## Start with the English football results database

My [English football league results dataset]({% post_url 2024-12-28-All_England_football_league_results %}) brings together league results from **1888 onwards**, in a downloadable CSV covering England's top four league tiers as they developed. It includes match dates, teams, scores, seasons and divisions; a separate version includes modelled team-strength ratings.

[Download the results CSV](https://raw.githubusercontent.com/seanelvidge/England-football-results/main/EnglandLeagueResults.csv) or [browse the source repository and supporting data](https://github.com/seanelvidge/England-football-results).

</div>

## Explore the data without writing code

- [Football head-to-head calculator]({{ '/h2h' | relative_url }}) — compare two clubs' league wins, draws, goals, biggest victories and match histories, with season and date filters.
- [Historical league-table generator]({{ '/leaguetable' | relative_url }}) — reconstruct standings for a tier or named division, for a season or a date range.
- [Team ratings over time]({{ '/teamRankings' | relative_url }}) — compare clubs' modelled strengths across history, including their highest and lowest ratings.
- [Match outcome probabilities]({{ '/matchProbs' | relative_url }}) — estimate home-win, draw and away-win chances from the latest ratings.
- [League-position probabilities]({{ '/tableProbs' | relative_url }}) — explore distributions of possible finishing positions.

These tools use **league matches**, not a complete record of domestic cups, European competitions or friendlies.

## Questions worth testing

- [How many points avoid Premier League relegation?]({% post_url 2025-11-08-40_points_to_avoid_relegation %}) — test the familiar 40-point benchmark against historical seasons.
- [Waning home advantage in English football]({% post_url 2025-01-13-Home_advantage_in_English_football %}) — follow home wins, draws and away wins across league history.
- [Football bogey grounds and statistical evidence]({% post_url 2025-12-12-Football_bogey_grounds %}) — distinguish persistent patterns from chance.
- [Why expected goals (xG) is useful]({% post_url 2024-01-02-An_argument_for_xG %}) — what a probability-based measure adds to the scoreline.
- [How long until a Premier League double hat-trick?]({% post_url 2026-09-05-How_long_until_a_double_hattrick %}) — modelling rare goalscoring performances.

## How the models work

Start with [Bayesian football team-strength ratings]({% post_url 2025-12-15-Football_team_rankings %}), then follow the step from individual matches to [league-position probabilities]({% post_url 2025-12-22-League_table_prediction_probabilities %}). For the underlying ideas, visit [mathematics and statistics]({{ '/mathematics/' | relative_url }}).

## Rivalries in the records

As an example use of some of the data on this site, the links below highlight results for some of the major rivalries in the English football league:

- [Manchester United vs Liverpool (The Northwest Derby): league head-to-head record]({{ '/football/manchester-united-vs-liverpool/' | relative_url }})
- [Arsenal vs Tottenham (North London Derby): league head-to-head record]({{ '/football/arsenal-vs-tottenham/' | relative_url }})
- [Manchester City vs Manchester United (Manchester Derby): league head-to-head record]({{ '/football/mancity-vs-manutd/' | relative_url }})
- [Liverpool vs Everton (Merseyside Derby): league head-to-head record]({{ '/football/liverpool-vs-everton/' | relative_url }})
- [Newcastle United vs Sunderland (Tyne-Wear Derby): league head-to-head record]({{ '/football/newcastle-vs-sunderland/' | relative_url }})
- [Coventry City vs Leicester City (M69 Derby): league head-to-head record]({{ '/football/coventry-vs-leicester/' | relative_url }})

(for a list of other [road name related derbies...]({% post_url 2024-01-15-The_M69_Derby %}))

[Browse every football article]({{ '/articles/tag/football/' | relative_url }}).
