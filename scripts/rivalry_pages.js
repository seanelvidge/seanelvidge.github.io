// Rivalry pages are the single source of truth for the pairs to generate.
const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");
const PAGES_PATH = path.join(__dirname, "../_pages");

function readRivalryPages(pagesPath = PAGES_PATH) {
  const pairs = [];
  const slugs = new Map();
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(file);
        continue;
      }
      if (!entry.isFile() || !/\.(md|markdown|html|liquid)$/i.test(entry.name)) continue;
      const text = fs.readFileSync(file, "utf8");
      if (!/^\uFEFF?---[ \t]*\r?\n/.test(text)) continue;
      const frontmatter = text.match(/^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/);
      if (!frontmatter) throw new Error(`${file}: front matter is missing its closing delimiter.`);
      let data;
      try {
        data = YAML.parse(frontmatter[1], { version: "1.1" });
      } catch (error) {
        throw new Error(`${file}: invalid YAML front matter: ${error.message}`);
      }
      if (data?.layout !== "rivalry" || data.published === false) continue;
      const { rivalry: slug, teams, permalink } = data;
      if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new Error(`${file}: rivalry must be a lowercase, hyphen-separated ID.`);
      }
      if (
        !Array.isArray(teams) ||
        teams.length !== 2 ||
        teams.some((team) => typeof team !== "string" || !team.trim() || team !== team.trim()) ||
        teams[0] === teams[1]
      ) {
        throw new Error(`${file}: teams must contain exactly two different, non-empty CSV team names, e.g. teams: [Liverpool, Everton].`);
      }
      if (permalink !== `/football/${slug}/`) {
        throw new Error(`${file}: permalink must be /football/${slug}/ to match its rivalry ID.`);
      }
      if (slugs.has(slug)) throw new Error(`${file}: duplicate rivalry ID ${slug}, already defined in ${slugs.get(slug)}.`);
      slugs.set(slug, file);
      pairs.push({ slug, teams, source: file });
    }
  }
  visit(pagesPath);
  if (!pairs.length) throw new Error(`No published rivalry pages found in ${pagesPath}.`);
  return pairs.sort((a, b) => a.slug.localeCompare(b.slug));
}

module.exports = { readRivalryPages, PAGES_PATH };
