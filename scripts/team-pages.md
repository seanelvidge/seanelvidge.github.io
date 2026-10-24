# Football club pages

The `/teams/` directory links to a static page for every club in `EnglishTeamActivePeriods.csv`. Each page contains its statistics in the HTML. Visitors do not have to download the full results database or wait for a league table to be calculated.

## Refreshing the data

From the website repository:

```sh
npm ci
node scripts/generate_team_pages.js --data-dir ../England-football-results
node --test scripts/team_pages.test.js
bundle exec jekyll build
bundle exec ruby scripts/check_team_pages.rb _site
```

The generator reads four files from the same database checkout:

- `EnglishTeamActivePeriods.csv`: club names, short names and membership periods.
- `EnglishTeamLogos.csv`: crests and primary/secondary colours.
- `EnglandLeagueResults_wRanks.csv`: scores, divisions and ratings after each match.
- `EnglishTeamPointDeductions.csv`: dated points adjustments.

It writes `_data/football_teams.json`. Commit this initial snapshot so local builds also work without a database checkout or network connection. To reproduce a snapshot, pass `--as-of YYYY-MM-DD`; `--output FILE` allows a separate output for analysis. Matches and adjustments after that date are excluded. The snapshot records the database commit and SHA-256 hash of each input CSV.

`_plugins/football-team-pages.rb` turns that snapshot into the club pages and publishes the four current tables at `/assets/data/currentLeagueTables.json`. The public cache includes the season, data dates, source information, positions, results totals, goals, points, adjustments and club-page links. It can be reused by other tools without scanning the historical CSV.

Both **Deploy site** and **Nightly LSI Deploy** check out the latest football database into `.football-source`, regenerate the snapshot and validate the rendered pages before deployment. The normal deployment also runs after the daily table-probability workflow; the nightly deployment refreshes independently at 03:00 UTC. No change to the database's ranking workflow is needed. The regenerated build input does not need a daily commit to the website source branch. A failed refresh stops that deployment instead of silently using old data; the previously deployed site remains available.

## Addresses and club identities

Ordinary addresses use `ShortName` with spaces replaced by underscores, preserving case and punctuation: `/teams/Arsenal/`, `/teams/Aston_Villa/`, `/teams/L'boro/`. Jekyll serves directory indexes, so the corresponding address without the final slash also works through the host's usual redirect.

Some distinct database clubs share a `ShortName`. The current club, or otherwise the one with the most recent membership, gets the short address. Older clubs use their full database name, dropping any final full stop that Jekyll would remove from the URL; if that still collides, their first membership year is appended. For example, AFC Wimbledon uses `/teams/Wimbledon/` and the original Wimbledon uses `/teams/Wimbledon_1977/`. Each page links to the other clubs sharing its short name. Histories are never combined merely because the short names match.

## Definitions

- **Current season and division:** the latest season with completed results in the database. Standings are calculated once per refresh using the shared `FootballResultsData.leagueTable` rules, with points adjustments effective by the snapshot date. Teams level on points, goal difference and goals scored share a position on these pages. During the summer the last recorded season remains visible until the new one has results; the season is always labelled.
- **Former clubs:** a club absent from the latest season's tables shows its last recorded division, form and rating, with an explicit historical label. The database cannot supply its current non-league division. A club whose membership includes the latest season but has no results yet is labelled as awaiting results, with no invented standing.
- **Rating:** the integer rating after the club's latest recorded match. The strength rank compares these latest ratings among clubs appearing in the current tables; equal ratings share a rank. Former clubs do not get a current strength rank. Rating highs/lows consider all post-match ratings and show the first date of a tie plus its occurrence count.
- **Recent form:** the last five recorded league matches, including the preceding season if necessary. The form strip runs oldest to newest; the results table runs newest first. Scores always put the featured club's goals first, with home/away stated explicitly.
- **Biggest results:** the largest winning or losing goal margin in recorded league matches. All tied matches are retained, with the earliest shown first and the rest available in an expandable list. Cups and friendlies are outside the dataset.
- **Membership years:** inclusive season starting years in `ActivePeriods`, capped at the latest recorded season. Adjacent periods form one continuous spell. These are membership years, so wartime suspensions remain included, as does the current season. Former clubs show their last continuous spell, not a current one.
- **Appearance:** colours and crests come from the logo CSV. Black or white text is selected for contrast against each club colour. Invalid colours and unavailable crests have local fallbacks; the layout supports light/dark themes and narrow screens.

The refresh rejects malformed CSVs, missing match clubs, duplicate appearances, invalid dates, scores or ratings. It also refuses to overwrite the saved snapshot if its latest result goes backwards or it loses more than 5% of its match history. Intentional historical rebuilds can be reviewed using a separate `--output` path.

## Checks

`team_pages.test.js` exercises score perspective, tied records and rankings, season selection, dated deductions/credits, membership spells, name collisions, missing results and failed refreshes. It also checks the complete committed snapshot for consistent totals and links.

`check_team_pages.rb` checks every rendered club page against the snapshot, including statistics, form order, all tied record results, crest/colours, links, canonical URLs, structured data and sitemap dates. It also verifies the directory and public league-table cache. Both deployment workflows run these checks.
