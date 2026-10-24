# Generate one static page per CSV club, plus a small reusable standings cache.
require "json"

module FootballTeamPages
  class Generator < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      snapshot = site.data["football_teams"]
      unless snapshot && snapshot["schema_version"] == 1 && snapshot["clubs"].is_a?(Array) && !snapshot["clubs"].empty?
        raise Jekyll::Errors::FatalException, "Missing football team data. Run node scripts/generate_team_pages.js --data-dir /path/to/England-football-results."
      end

      routes = site.pages.map(&:url)
      snapshot.fetch("clubs").each do |club|
        route = club.fetch("url")
        raise Jekyll::Errors::FatalException, "Duplicate football team page: #{route}" if routes.include?(route)
        routes << route
        page = Jekyll::PageWithoutAFile.new(site, site.source, "teams/#{club.fetch('slug')}", "index.html")
        page.content = ""
        page.data = {
          "layout" => "football-team", "permalink" => route, "football_team" => true,
          "title" => "#{club.fetch('name')}: ratings, results and league records",
          "description" => "#{club.fetch('name')} league results, latest team rating, all-time highs and lows, biggest wins and defeats, and years in the English football league.",
          "team" => club, "last_modified_at" => snapshot.fetch("as_of"),
          "seo" => { "type" => "WebPage" },
          "image" => { "path" => club.fetch("logo"), "alt" => "#{club.fetch('name')} crest" }
        }
        site.pages << page
      end

      directory = site.pages.find { |page| page.url == "/teams/" }
      directory.data["last_modified_at"] = snapshot.fetch("as_of") if directory

      cache = Jekyll::PageWithoutAFile.new(site, site.source, "assets/data", "currentLeagueTables.json")
      cache.data = { "layout" => nil, "sitemap" => false, "render_with_liquid" => false }
      cache.content = JSON.generate(snapshot.select { |key, _| %w[schema_version as_of database_through season source source_commit source_hashes leagues].include?(key) })
      site.pages << cache
      Jekyll.logger.info "Football teams:", "#{snapshot.fetch('clubs').size} pages; results through #{snapshot.fetch('database_through')}"
    end
  end
end
