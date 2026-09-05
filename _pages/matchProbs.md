---
layout: page
permalink: /matchProbs
title: Match Outcome Probabilities Calculator
description: Compare the latest team ratings to estimate home-win, draw and away-win probabilities.
nav: false
tags: football
---

<link rel="stylesheet" href="{{ '/assets/css/team-rankings.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/football-tools.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/match-probabilities.css' | relative_url }}">

<div class="team-rankings football-tool" id="match-tool">
  <form id="match-form" class="football-panel">
    <fieldset id="match-controls" disabled>
      <div class="football-team-inputs">
        <div class="football-field"><label for="match-home">Home team</label><input id="match-home" type="text" list="match-teams" placeholder="Start typing a team name…" autocomplete="off" required></div>
        <button id="match-swap" class="rankings-button" type="button" aria-label="Swap home and away teams">⇄</button>
        <div class="football-field"><label for="match-away">Away team</label><input id="match-away" type="text" list="match-teams" placeholder="Start typing a team name…" autocomplete="off" required></div>
        <datalist id="match-teams"></datalist>
      </div>
      <p class="rankings-note">Home advantage matters. Swap the teams to see the effect of changing the venue.</p>
      <div class="football-actions">
        <button type="submit" class="rankings-button rankings-button-primary">Calculate probabilities</button>
        <button id="match-reset" type="button" class="rankings-button">Reset</button>
      </div>
    </fieldset>
  </form>
  <p id="match-status" class="rankings-note" role="status" aria-live="polite">Loading team ratings…</p>
  <button id="match-retry" type="button" class="rankings-button" hidden>Try again</button>
  <section id="match-output" aria-label="Match probabilities" hidden>
    <div id="match-matchup" class="football-matchup"></div>
    <div class="rankings-toolbar football-output-heading">
      <p id="match-summary" class="rankings-note"></p>
      <button id="match-share" class="rankings-button" type="button">Copy link</button>
    </div>
    <div id="match-scorecards" class="football-scorecards"></div>
    <section class="football-panel">
      <h2>Chance of each result</h2>
      <p class="rankings-note">Hover or tap a bar for the estimate. You can scroll the page normally on mobile.</p>
      <div class="match-probability-chart"><canvas id="match-chart" role="img" aria-label="Estimated home-win, draw and away-win probabilities; values also shown above"></canvas></div>
    </section>
    <p class="rankings-note">These are model estimates, not guarantees. They use each club’s latest recorded rating and the current year’s home-advantage adjustment, without accounting for line-ups or injuries. Historical or inactive clubs use their last recorded rating.</p>
  </section>
  <p id="match-data-note" class="rankings-note"></p>
  <p class="rankings-note">Ratings from the <a href="https://github.com/seanelvidge/England-football-results/blob/main/EnglandLeagueResults_wRanks.csv">English football results database</a>. Explore <a href="{{ '/teamRankings' | relative_url }}">ratings over time</a> or <a href="{{ '/h2h' | relative_url }}">head-to-head results</a>.</p>
  <noscript>Enable JavaScript to calculate match probabilities.</noscript>
</div>

<script defer src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js"></script>
<script defer src="{{ '/assets/js/team-rankings-data.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/football-tools.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/match-probabilities-data.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/match-probabilities.js' | relative_url }}"></script>
