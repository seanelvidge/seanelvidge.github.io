# Automatically updated rivalry pages

The only data source is `EnglandLeagueResults.csv` from Sean's England-football-results repository. There is no scraping or additional results feed. Team pairs are discovered from the front matter of published `layout: rivalry` pages under `_pages/` (including subdirectories); all statistics use the shared head-to-head calculations. There is no separate list of pairs to edit in JavaScript.

## Adding a rivalry

Create a Markdown page under `_pages/` using this front matter:

```yaml
---
layout: rivalry
title: "Liverpool vs Everton: League Head-to-Head Record"
permalink: /football/liverpool-vs-everton/
rivalry: liverpool-vs-everton
teams: [Liverpool, Everton]
nav: false
---
```

Choose a unique, lowercase, hyphen-separated `rivalry` ID and use `/football/<rivalry>/` as its permalink. `teams` must contain exactly two different names **as written in the CSV**, in the desired display order (for example, `Coventry City`, `Leicester City`, `Newcastle United`, or `Tottenham Hotspur`). The title and URL can use shorter names. Both inline YAML lists and multiline lists work. No body copy, match counts, chart data or generator edits are needed. Add a link on the Football hub if you want to feature the new page there.

The next deployment automatically generates the new pair. For a local preview, refresh the JSON before building or running the checks below. Pages with `published: false` are ignored. Missing/invalid team definitions, duplicate IDs and mismatched permalinks stop the refresh with the affected file name; names with no completed league meetings in the CSV also fail clearly. Jekyll gives a refresh instruction if its saved records are missing or refer to different teams.

## Refreshing and checking

The site deployment workflow downloads and validates the CSV, then runs the rivalry tests before running Jekyll. This order lets a newly added page work without manually updating the committed JSON first, while checking that every published rivalry has matching records. This includes deployments following the existing daily “Generate table probabilities” workflow (scheduled for 01:00 UTC). It also refreshes the records on ordinary site deployments, regardless of whether the table-probabilities freshness check found new results. Corrections to older scores are picked up too.

The generated JSON is a build input, not a file that needs daily manual edits or commits. The committed copy allows offline local previews. To refresh a local preview:

```sh
npm ci
node scripts/generate_rivalry_snapshots.js --refresh
bundle exec jekyll build
bundle exec ruby scripts/check_rivalry_pages.rb _site
```

For a reproducible, network-free JSON preview from a downloaded CSV:

```sh
node scripts/generate_rivalry_snapshots.js /path/to/EnglandLeagueResults.csv 2026-09-06
```

The live refresh only accepts the hard-coded first-party CSV URL and rejects redirects. HTTP errors, malformed data, missing rivalries, backwards coverage dates, or losing more than 5% of a rivalry's recorded meetings cause an error. Ordinary score corrections and small record corrections are allowed. A validated file replaces the local snapshot atomically; failures leave it untouched. A deployment error prevents publication, leaving the previously deployed site intact. If a large loss of historical records is intentional, investigate and review it before replacing the committed baseline.

`_layouts/rivalry.liquid` generates the introduction and all records. The page files retain their URLs and titles, but no hand-written football claims, counts or update dates. `_plugins/seo-metadata.rb` derives each description and modified date from the same data used by the page. The displayed generation date is separate from the date of the latest result in the full database and the latest meeting between the two clubs.

These are automatically regenerated league records, not live scores or all-competition records. The preselected H2H links remain available for interactive exploration.

The “Wins over time” chart shares its Chart.js configuration with the H2H tool. Its compact `win_history` rows (date, home-team index, home goals, away goals, first-team wins, second-team wins) are generated from the same CSV and embedded in the HTML, keeping the chart and tables in sync without a browser-side CSV download. It uses contrasting fallback colours so no additional club-data source is required. Hover/tap shows each score; legend clicks toggle a line, and vertical touch scrolling remains available. If scripts cannot load, the page's records remain readable.

Checks:

```sh
node --test scripts/rivalry_snapshots.test.js
node --test scripts/football_win_history.test.js
bundle exec ruby scripts/check_rivalry_pages.rb _site
```

On the existing local Ruby setup, prefix Jekyll commands with `BUNDLE_GEMFILE=Gemfile.local EXECJS_RUNTIME=Node` and the Ruby check with `BUNDLE_GEMFILE=Gemfile.local`.
