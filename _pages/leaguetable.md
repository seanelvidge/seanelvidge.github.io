---
layout: page
permalink: /leaguetable
title: English Football League Table Generator
description: Explore English league tables by season, date range, tier, or league.
nav: false
tags: football
---

<link rel="stylesheet" href="{{ '/assets/css/team-rankings.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/football-tools.css' | relative_url }}">

<div class="team-rankings football-tool" id="league-tool">
  <form id="league-form" class="football-panel">
    <fieldset id="league-controls" disabled>
      <div class="football-filter-grid">
        <div>
          <h2 class="football-label">Choose a period</h2>
          <div class="football-segments">
            <label><input type="radio" name="period" value="season" checked><span>Season</span></label>
            <label><input type="radio" name="period" value="dates"><span>Date range</span></label>
          </div>
          <div data-period="season" class="football-field">
            <label for="league-season">Season</label>
            <input id="league-season" type="text" list="league-seasons" placeholder="e.g. 2023/2024" autocomplete="off">
            <datalist id="league-seasons"></datalist>
          </div>
          <div data-period="dates" hidden>
            <div class="football-date-fields">
              <div class="football-field"><label for="league-start">From</label><input id="league-start" type="date" min="1888-09-08"></div>
              <div class="football-field"><label for="league-end">To</label><input id="league-end" type="date" min="1888-09-08"></div>
            </div>
            <p class="rankings-note">Dates are inclusive. Leave “To” blank for today, or “From” blank to start at the beginning of the end date’s season (1 July).</p>
          </div>
        </div>
        <div>
          <h2 class="football-label">Choose a competition</h2>
          <div class="football-segments">
            <label><input type="radio" name="competition" value="tier" checked><span>Tier</span></label>
            <label><input type="radio" name="competition" value="division"><span>League name</span></label>
          </div>
          <div data-competition="tier" class="football-field">
            <label for="league-tier">Football tier</label>
            <select id="league-tier"><option value="1">Tier 1</option></select>
            <p class="rankings-note">Tier 1 is the top division. Follow a tier through changes to league names.</p>
          </div>
          <div data-competition="division" class="football-field" hidden>
            <label for="league-division">League name</label>
            <input id="league-division" type="text" list="league-divisions" placeholder="Start typing a league name…" autocomplete="off">
            <datalist id="league-divisions"></datalist>
            <p class="rankings-note">Suggestions reflect the selected period, including historical and regional divisions.</p>
          </div>
        </div>
      </div>
      <div class="football-actions">
        <button type="submit" class="rankings-button rankings-button-primary">Generate table</button>
        <button type="button" id="league-reset" class="rankings-button">Reset</button>
      </div>
    </fieldset>
  </form>
  <p id="league-status" class="rankings-note" role="status" aria-live="polite">Loading league results…</p>
  <button id="league-retry" type="button" class="rankings-button" hidden>Try again</button>
  <section id="league-output" hidden aria-labelledby="league-title">
    <div class="rankings-toolbar football-output-heading">
      <div><h2 id="league-title"></h2><p id="league-summary" class="rankings-note"></p></div>
      <div class="football-actions">
        <button id="league-details" type="button" class="rankings-button football-mobile-only" aria-pressed="false">All columns</button>
        <button id="league-download" type="button" class="rankings-button">Download image</button>
        <button id="league-share" type="button" class="rankings-button">Copy link</button>
      </div>
    </div>
    <div class="football-panel football-table-panel" id="league-table-panel">
      <div class="football-table-scroll" tabindex="0" role="region" aria-label="League table. Scroll horizontally to see all columns when expanded.">
        <table id="league-table" class="football-table"></table>
      </div>
      <p id="league-rules" class="rankings-note"></p>
      <p id="league-adjustments" class="rankings-note" hidden></p>
    </div>
    <p class="rankings-note">Click a column heading to sort; “Pos” restores the standings. On small screens, choose “All columns” for the full statistics.</p>
  </section>
  <p id="league-data-note" class="rankings-note"></p>
  <p class="rankings-note">Tables are reconstructed from <a href="https://github.com/seanelvidge/England-football-results">English league results</a>, with recorded <a href="https://github.com/seanelvidge/England-football-results/blob/main/EnglishTeamPointDeductions.csv">points adjustments</a>. Custom date ranges show only matches and points adjustments within that period.</p>
  <noscript>Enable JavaScript to generate a league table.</noscript>
</div>

<script defer src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script defer src="{{ '/assets/js/team-rankings-data.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/football-results-data.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/football-tools.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/league-table.js' | relative_url }}"></script>

<section class="tool-guide" markdown="1" aria-label="About this football tool">

## Historical English football league tables

Reconstruct a league table from recorded match results for a season or an inclusive date range. Select a **tier** to follow a level of the pyramid through changes in competition names, or a **named division** to focus on that competition. Seasons use the full form, such as 2023/2024.

### What does the table calculate?

The tool aggregates played, won, drawn and lost matches, goals for and against, and points. It accounts for historical two- or three-point wins, supported tie-breaking rules and the separate points-adjustment file. Relevant exceptions, including points-per-game standings, are explained alongside the output. A partial date range is a table of matches in that selection, not automatically an official end-of-season table.

### Coverage and example uses

The [English league results dataset]({% post_url 2024-12-28-All_England_football_league_results %}) begins in 1888 and covers England's top four league tiers as they developed; the modern Premier League begins in 1992. Cup matches are not included. Corrections or missing administrative information can make a reconstruction differ from a published official table.

Try [the 2023/2024 top-tier table]({{ '/leaguetable' | relative_url }}?season=2023%2F2024&amp;tier=1), compare home rivals with the [head-to-head tool]({{ '/h2h' | relative_url }}), or investigate [how many points have been needed to avoid relegation]({% post_url 2025-11-08-40_points_to_avoid_relegation %}). For forecasts rather than historical standings, use [league-position probabilities]({{ '/tableProbs' | relative_url }}).

[More football statistics and data]({{ '/football/' | relative_url }}).

</section>
