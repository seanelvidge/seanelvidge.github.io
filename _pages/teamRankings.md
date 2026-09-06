---
layout: page
permalink: /teamRankings
title: Football Team Rankings Over Time
description: Explore and compare English football teams’ ratings, from 1888 to today.
nav: false
tags: football
---

<link rel="stylesheet" href="{{ '/assets/css/team-rankings.css' | relative_url }}">

<div class="team-rankings" id="team-rankings">
  <form id="rankings-form" class="rankings-controls">
    <div class="rankings-search">
      <label for="rankings-team">Add a team</label>
      <input id="rankings-team" type="text" list="rankings-teams" placeholder="Start typing a team name…" autocomplete="off" aria-describedby="rankings-feedback" disabled>
      <datalist id="rankings-teams"></datalist>
    </div>
    <button type="submit" id="rankings-add" class="rankings-button rankings-button-primary" disabled>Add to plot</button>
    <button type="button" id="rankings-clear" class="rankings-button" disabled>Clear teams</button>
  </form>
  <p id="rankings-feedback" class="rankings-note" role="status" aria-live="polite">Loading match history (about 22 MB on the first visit)…</p>
  <button type="button" id="rankings-retry" class="rankings-button" hidden>Try again</button>
  <div id="rankings-selected" class="rankings-selected" aria-label="Selected teams"></div>

  <div class="rankings-chart-panel">
    <div class="rankings-toolbar" role="group" aria-label="Chart controls">
      <span id="rankings-period" class="rankings-note">Full history</span>
      <button type="button" id="rankings-touch" class="rankings-button" aria-pressed="false" disabled>Explore chart</button>
      <button type="button" id="rankings-zoom-in" class="rankings-button" aria-label="Zoom in on the time axis" disabled>Zoom in</button>
      <button type="button" id="rankings-zoom-out" class="rankings-button" aria-label="Zoom out on the time axis" disabled>Zoom out</button>
      <button type="button" id="rankings-reset" class="rankings-button" disabled>Full history</button>
    </div>
    <div class="rankings-canvas-wrap">
      <canvas id="rankings-chart" role="img" aria-label="Team ratings over time. Add a team to begin." aria-describedby="rankings-help rankings-records-note"></canvas>
      <div id="rankings-empty" class="rankings-empty">Add a team above to explore its history.</div>
    </div>
  </div>
  <p id="rankings-help" class="rankings-note">Hover or tap for a rating and date. On touch screens, swipe to scroll the page; choose “Explore chart” to pan and pinch, then “Scroll page” when finished. With a mouse, drag to pan or Ctrl + scroll to zoom. Click a team’s name to hide or show its line.</p>

  <section id="rankings-records" class="rankings-records" aria-labelledby="rankings-records-title" hidden>
    <h2 id="rankings-records-title">Highs &amp; lows</h2>
    <p id="rankings-records-note" class="rankings-note">All-time records, including matches outside the current view. Click a maximum or minimum to explore that date. For tied records, the first date is shown.</p>
    <div id="rankings-cards" class="rankings-cards"></div>
  </section>
  <p id="rankings-data-note" class="rankings-note"></p>
  <p class="rankings-note">Ratings are the scores recorded after each match (higher is stronger), rather than league positions. Lines stop at each team’s last recorded match, with breaks for gaps longer than a year. Data: <a href="https://github.com/seanelvidge/England-football-results/blob/main/EnglandLeagueResults_wRanks.csv">English league results and rankings</a>. Club colours: <a href="https://github.com/seanelvidge/England-football-results/blob/main/EnglishTeamLogos.csv">EnglishTeamLogos.csv</a>.</p>
  <noscript>This tool needs JavaScript to load the match data and draw the interactive chart.</noscript>
</div>

<script defer src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/luxon@3.5.0/build/global/luxon.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/chartjs-adapter-luxon@1.3.1/dist/chartjs-adapter-luxon.umd.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/hammerjs@2.0.8/hammer.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.2.0/dist/chartjs-plugin-zoom.min.js"></script>
<script defer src="{{ '/assets/js/team-rankings-data.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/team-rankings.js' | relative_url }}"></script>

<section class="tool-guide" markdown="1" aria-label="About this football tool">

## English football team-strength ratings since 1888
Compare the rise and fall of clubs using their modelled strength after each recorded league match. Add several teams by typing their names, inspect points on the chart, and use the highest/lowest-rating cards to jump to notable periods.

### A rating is not a league position
The vertical axis is a **strength rating**, where a higher value means a stronger estimated team. It is not first place, second place and so on. The ratings come from the [Bayesian Kalman football model]({% post_url 2025-12-15-Football_team_rankings %}), not a simple count of recent wins.

### Data coverage and interpretation
The chart reads the post-match home and away ratings in [EnglandLeagueResults_wRanks.csv](https://github.com/seanelvidge/England-football-results/blob/main/EnglandLeagueResults_wRanks.csv). The underlying [English league results database]({% post_url 2024-12-28-All_England_football_league_results %}) begins in 1888; individual clubs appear only where they have recorded ratings. Gaps between points can reflect periods outside the covered leagues and do not imply additional observations.

Use the [league-table generator]({{ '/leaguetable' | relative_url }}) for actual standings, or turn the latest strengths into [match outcome probabilities]({{ '/matchProbs' | relative_url }}). Comparisons over distant eras depend on the model and should not be interpreted as observed matches between those teams.

[Explore football statistics and data]({{ '/football/' | relative_url }}).

</section>
