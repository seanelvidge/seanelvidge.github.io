# Automatically updated rivalry pages

The only data source is `EnglandLeagueResults.csv` from Sean's England-football-results repository. There is no scraping or additional results feed. Two selected team pairs are configured in `generate_rivalry_snapshots.js`; all statistics use the shared head-to-head calculations.

The site deployment workflow downloads and validates the CSV before running Jekyll. This includes deployments following the existing daily “Generate table probabilities” workflow (scheduled for 01:00 UTC). It also refreshes the records on ordinary site deployments, regardless of whether the table-probabilities freshness check found new results. Corrections to older scores are picked up too.

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

Checks:

```sh
node --test scripts/rivalry_snapshots.test.js
bundle exec ruby scripts/check_rivalry_pages.rb _site
```

On the existing local Ruby setup, prefix Jekyll commands with `BUNDLE_GEMFILE=Gemfile.local EXECJS_RUNTIME=Node` and the Ruby check with `BUNDLE_GEMFILE=Gemfile.local`.
