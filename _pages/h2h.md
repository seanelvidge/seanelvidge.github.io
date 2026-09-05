---
layout: page
permalink: /h2h
title: English Football Head-to-Head Statistics
description: Compare two teams’ league results, from their first meeting to the present day.
nav: false
tags: football
---

<link rel="stylesheet" href="{{ '/assets/css/team-rankings.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/football-tools.css' | relative_url }}">

<div class="team-rankings football-tool" id="h2h-tool">
  <form id="h2h-form" class="football-panel">
    <fieldset id="h2h-controls" disabled>
      <div class="football-team-inputs">
        <div class="football-field"><label for="h2h-team1">First team</label><input id="h2h-team1" type="text" list="h2h-teams" placeholder="Start typing a team name…" autocomplete="off"></div>
        <button id="h2h-swap" class="rankings-button" type="button" aria-label="Swap the two teams">⇄</button>
        <div class="football-field"><label for="h2h-team2">Second team</label><input id="h2h-team2" type="text" list="h2h-teams" placeholder="Start typing a team name…" autocomplete="off"></div>
        <datalist id="h2h-teams"></datalist>
      </div>
      <div class="football-period-block">
        <h2 class="football-label">Choose a period</h2>
        <div class="football-segments">
          <label><input type="radio" name="period" value="all" checked><span>All history</span></label>
          <label><input type="radio" name="period" value="season"><span>Season</span></label>
          <label><input type="radio" name="period" value="dates"><span>Date range</span></label>
        </div>
        <div data-period="season" class="football-field" hidden>
          <label for="h2h-season">Season</label>
          <input id="h2h-season" type="text" list="h2h-seasons" placeholder="e.g. 2023/2024" autocomplete="off">
          <datalist id="h2h-seasons"></datalist>
        </div>
        <div data-period="dates" hidden>
          <div class="football-date-fields">
            <div class="football-field"><label for="h2h-start">From</label><input id="h2h-start" type="date" min="1888-09-08"></div>
            <div class="football-field"><label for="h2h-end">To</label><input id="h2h-end" type="date" min="1888-09-08"></div>
          </div>
          <p class="rankings-note">Dates are inclusive. Leave a date blank to include all earlier or later meetings.</p>
        </div>
        <label class="football-checkbox"><input id="h2h-premier" type="checkbox"> Premier League era only <span class="rankings-note">(all divisions, from 1 August 1992)</span></label>
      </div>
      <div class="football-actions">
        <button type="submit" class="rankings-button rankings-button-primary">Compare teams</button>
        <button id="h2h-reset" type="button" class="rankings-button">Reset</button>
      </div>
    </fieldset>
  </form>
  <p id="h2h-status" class="rankings-note" role="status" aria-live="polite">Loading league results…</p>
  <button id="h2h-retry" type="button" class="rankings-button" hidden>Try again</button>
  <section id="h2h-output" aria-label="Head-to-head comparison" hidden>
    <div class="football-matchup" id="h2h-matchup"></div>
    <div class="rankings-toolbar football-output-heading">
      <p id="h2h-summary" class="rankings-note"></p>
      <button id="h2h-share" class="rankings-button" type="button">Copy link</button>
    </div>
    <div id="h2h-empty" class="football-panel" hidden>No recorded league meetings in this period. Try a wider date range.</div>
    <div id="h2h-statistics">
      <div id="h2h-scorecards" class="football-scorecards"></div>
      <div class="football-chart-grid">
        <section class="football-panel">
          <h2>Results</h2>
          <p class="rankings-note">Wins and draws across the selected meetings.</p>
          <div class="football-outcomes-chart"><canvas id="h2h-outcomes" role="img" aria-label="Head-to-head wins and draws"></canvas></div>
          <div id="h2h-goals"></div>
        </section>
        <section class="football-panel">
          <h2>Wins over time</h2>
          <p class="rankings-note">Cumulative wins in this selection. Hover or tap to see a match.</p>
          <div class="football-history-chart"><canvas id="h2h-history" role="img" aria-label="Cumulative wins over time"></canvas></div>
        </section>
      </div>
      <section class="football-record-section">
        <h2>Biggest wins</h2>
        <div id="h2h-records" class="football-record-grid"></div>
      </section>
      <section class="football-panel" aria-labelledby="h2h-results-title">
        <div class="rankings-toolbar football-output-heading">
          <div><h2 id="h2h-results-title">Match results</h2><p id="h2h-results-count" class="rankings-note"></p></div>
          <div class="football-field"><label for="h2h-order">Order</label><select id="h2h-order"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></div>
        </div>
        <div id="h2h-matches"></div>
        <button id="h2h-more" type="button" class="rankings-button">Show more matches</button>
      </section>
    </div>
  </section>
  <p id="h2h-data-note" class="rankings-note"></p>
  <p class="rankings-note">League matches only, using the <a href="https://github.com/seanelvidge/England-football-results">English football results database</a>. Cup matches are not included. Club colours and crests come from <a href="https://github.com/seanelvidge/England-football-results/blob/main/EnglishTeamLogos.csv">EnglishTeamLogos.csv</a>.</p>
  <noscript>Enable JavaScript to compare teams.</noscript>
</div>

<script defer src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/luxon@3.5.0/build/global/luxon.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/chartjs-adapter-luxon@1.3.1/dist/chartjs-adapter-luxon.umd.min.js"></script>
<script defer src="{{ '/assets/js/team-rankings-data.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/football-results-data.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/football-tools.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/football-h2h.js' | relative_url }}"></script>
