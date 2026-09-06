# SEO maintenance

The canonical origin is `https://seanelvidge.com`. Existing post, tool, archive and pagination URLs are preserved. The three curated hubs are `/football/`, `/mathematics/` and `/space-weather/`.

## Metadata ownership

`_includes/metadata.liquid` calls `{% seo %}` once. Jekyll SEO Tag owns the title, description, canonical, Open Graph, Twitter card and page/article JSON-LD. Do not re-enable a second hand-written renderer. The old `serve_og_meta` and `serve_schema_org` switches are no longer needed: those outputs are enabled by the SEO tag.

`_plugins/seo-metadata.rb` adapts existing front matter: real posts are BlogPosting, archives are CollectionPage, redirect stubs are non-indexable WebPage signposts, and thumbnails become social images. It also corrects Jekyll SEO Tag 2.8's `imageObject` casing and connects the About ProfilePage to the separate Person entity. The Person include appears only on the homepage and About and contains the verified professional profiles. Review the small compatibility adapter when upgrading the SEO plugin.

The homepage uses `title: Sean Elvidge` plus the site tagline for its full SEO title; `nav_title: articles` keeps navigation short. Other pages can also use a separate `nav_title`.

For an article, use front matter such as:

```yaml
description: A concise, specific summary of what readers will learn.
thumbnail: assets/img/a-relevant-chart.png
image_alt: What the chart shows, including the comparison or trend that matters.
# Set only when making a meaningful content update, not on every site build:
last_modified_at: 2026-09-06
```

For a decorative thumbnail, use `image_decorative: true` instead of descriptive alt text. The article list falls back to the post title for legacy thumbnails without `image_alt`; give informative images a proper description when editing those posts. A figure using the same thumbnail reuses `image_alt`. Other informative figures should explicitly pass `alt="..."` to `figure.liquid`; explicitly use `alt=""` for decorative figures. Captions can explain detailed results beyond concise alt text.

Ordinary external citations use `rel="external noopener"`. Affiliate links explicitly use `rel="sponsored noopener"`; reserve `ugc` for user-generated links and `nofollow` for links you do not want to endorse. Existing explicit `rel` attributes are preserved.

## Curated content and internal links

The hubs are editorial selections, not replacements for tag/year archives. Add descriptive contextual links to the relevant dataset, tool or explainer when updating an article. Prefer `{% post_url YYYY-MM-DD-filename %}` for articles and `relative_url` for fixed pages; Jekyll catches missing post references during the build. Do not rename existing posts for keywords.

Static tool guides must describe the actual implementation. In particular, the league-position tool now uses Monte Carlo simulations while its original article describes an analytical method; a dated note distinguishes them. Top-six/bottom-three summaries are finishing-position groups, not a complete model of promotion or relegation rules.

## Refreshing the two rivalry records

The Manchester United–Liverpool and Arsenal–Tottenham pages are deliberately limited editorial examples, not a claim about measured search volumes. All records are **league-only**, not all competitions. Their tables, recent results and biggest wins are rendered by Jekyll and readable without JavaScript.

`_data/football_rivalries.json` is a dated snapshot, not a live feed. To refresh it:

1. Download and inspect the current `EnglandLeagueResults.csv` from the linked source repository.
2. Run `node scripts/generate_rivalry_snapshots.js /path/to/EnglandLeagueResults.csv YYYY-MM-DD` with an explicit as-of date. The script only prints JSON and uses the shared head-to-head calculations; it makes no network requests or writes.
3. Review the totals, scope, newest results and changes against the source before saving stdout to `_data/football_rivalries.json`. Keep the source checksum for provenance.
4. Update `last_modified_at` on the two rivalry pages to match the reviewed update. The visible snapshot date comes from the JSON.
5. Run the tests and rebuild. These pages do not automatically refresh when the upstream CSV changes.

## Validation

```sh
node --test scripts/*.test.js
bundle exec jekyll build --destination /path/to/test-site
bundle exec ruby scripts/seo_check.rb /path/to/test-site
```

An optional second directory argument to `seo_check.rb` compares the pre-change site's routes and distinguishes pre-existing broken internal links. The check validates generated HTML and JSON-LD locally; it does not contact Google or check external URLs.

For the local Ruby setup that cannot load `mini_racer`, use the existing `Gemfile.local` and Node runtime:

```sh
BUNDLE_GEMFILE=Gemfile.local EXECJS_RUNTIME=Node bundle exec jekyll build --destination /path/to/test-site
BUNDLE_GEMFILE=Gemfile.local bundle exec ruby scripts/seo_check.rb /path/to/test-site
```

After deployment, submit `https://seanelvidge.com/sitemap.xml` in Search Console, inspect the homepage/hubs and a representative article with URL Inspection, and check an article/About with Google's structured-data tools. Confirm the deployed site's canonical host and HTTPS redirects. These changes do not configure DNS, publish the site, submit Search Console requests or guarantee search rankings.

References: [Jekyll SEO Tag options](https://jekyll.github.io/jekyll-seo-tag/advanced-usage/), [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article), [Google's external-link qualifications](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links).
