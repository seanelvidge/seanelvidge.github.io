# Check every generated club page against the data used for this build.
# bundle exec ruby scripts/check_team_pages.rb _site [path/to/football_teams.json]
require "nokogiri"
require "json"
require "uri"

root = File.expand_path(ARGV.fetch(0))
snapshot = JSON.parse(File.read(ARGV[1] || File.expand_path("../_data/football_teams.json", __dir__)))
errors = []
check = ->(condition, message) { errors << message unless condition }
tidy = ->(text) { text.to_s.gsub(/\s+/, " ").strip }
unescape = ->(url) { URI::DEFAULT_PARSER.unescape(url.to_s) }
sitemap = Nokogiri::XML(File.read(File.join(root, "sitemap.xml")))
sitemap_entries = sitemap.xpath('//*[local-name()="url"]').to_h do |entry|
  [unescape.call(entry.at_xpath('./*[local-name()="loc"]')&.text), entry.at_xpath('./*[local-name()="lastmod"]')&.text]
end

snapshot.fetch("clubs").each do |club|
  route = club.fetch("url")
  file = File.join(root, route, "index.html")
  unless File.file?(file)
    errors << "#{route}: page missing"
    next
  end
  doc = Nokogiri::HTML(File.read(file))
  article = doc.at_css("article.football-team")
  unless article
    errors << "#{route}: club layout missing"
    next
  end
  check.call(doc.css("h1").length == 1 && tidy.call(doc.at_css("h1").text) == club["name"], "#{route}: incorrect club heading")
  check.call(article["style"].include?(club["primary"]) && article["style"].include?(club["secondary"]), "#{route}: club colours missing")
  check.call(doc.at_css(".team-crest img")&.[]("src") == club["logo"], "#{route}: incorrect crest")
  check.call(doc.at_css('link[href*="football-teams.css"]'), "#{route}: stylesheet missing")
  dates = doc.css(".team-data-date time").map { |time| time["datetime"] }
  check.call(dates == [snapshot["as_of"], snapshot["database_through"]], "#{route}: stale data dates")
  if club["current"]
    position = tidy.call(doc.at_css(".team-standing .team-stat-value")&.text)
    expected = "#{club.dig('standing', 'joint') ? 'Joint ' : ''}#{club.dig('standing', 'position')} / #{club.dig('standing', 'club_count')}"
    check.call(position == expected, "#{route}: incorrect league position")
    check.call(doc.at_css(".team-standing")&.text&.include?("#{club.dig('standing', 'points')} points from #{club.dig('standing', 'played')} games"), "#{route}: incorrect points or games")
    check.call(doc.at_css(".team-rating")&.text&.include?("rank #{club.dig('rating', 'rank')} of #{club.dig('rating', 'out_of')}"), "#{route}: incorrect strength rank")
  else
    check.call(doc.at_css(".team-status-note"), "#{route}: historical/awaiting-results label missing")
    check.call(!doc.at_css(".team-rating")&.text&.include?("Current team rating"), "#{route}: historical rating labelled current")
  end
  if club["rating"]
    check.call(doc.at_css(".team-rating .team-stat-value")&.text&.to_i == club.dig("rating", "value"), "#{route}: incorrect latest rating")
    check.call(doc.at_css(".team-rating time")&.[]("datetime") == club.dig("rating", "date"), "#{route}: incorrect latest rating date")
  end
  %w[highest lowest].zip(%w[high low]).each do |key, css|
    record = club["#{key}_rating"]
    next unless record
    check.call(doc.at_css(".team-rating-#{css} .team-stat-value")&.text&.to_i == record["value"], "#{route}: incorrect #{key} rating")
    check.call(doc.at_css(".team-rating-#{css} time")&.[]("datetime") == record["date"], "#{route}: incorrect #{key} rating date")
  end
  results = doc.css(".team-results-table tbody tr").map do |row|
    cells = row.css("td")
    [cells[0].at_css("time")["datetime"], *cells.drop(1).map { |cell| tidy.call(cell.text) }]
  end
  expected = club.fetch("recent").map do |match|
    [match["date"], match["opponent"], match["venue"] == "H" ? "Home" : "Away", "#{match['goals_for']}–#{match['goals_against']}", { "W" => "Win", "D" => "Draw", "L" => "Loss" }[match["result"]]]
  end
  check.call(results == expected, "#{route}: incorrect recent results")
  form = doc.css('.team-form-strip li > span[aria-hidden="true"]').map(&:text)
  check.call(form == club.fetch("recent").reverse.map { |match| match["result"] }, "#{route}: form strip is reversed or incorrect")

  ["biggest_win", "biggest_defeat"].each_with_index do |key, i|
    record = club[key]
    next unless record
    block = doc.css(".team-record")[i]
    check.call(block.css("time").map { |time| time["datetime"] } == record["matches"].map { |match| match["date"] }, "#{route}: missing #{key} records or ties")
    record["matches"].each do |match|
      check.call(tidy.call(block.text).include?("#{match['goals_for']}–#{match['goals_against']} against #{match['opponent']}"), "#{route}: incorrect #{key} score or opponent")
    end
  end
  check.call(doc.at_css(".team-membership-total .team-stat-value")&.text&.to_i == club.dig("membership", "total_years"), "#{route}: incorrect membership total")
  check.call(doc.at_css(".team-membership-spell .team-stat-value")&.text&.to_i == club.dig("membership", "latest_spell_years"), "#{route}: incorrect continuous membership")
  doc.css('a[href^="/teams/"]').each do |link|
    check.call(File.file?(File.join(root, unescape.call(link["href"]), "index.html")), "#{route}: broken club link #{link['href']}")
  end
  if club["rating"]
    rating_link = doc.at_css('.team-rating a[href*="teamRankings?"]')
    check.call(rating_link && URI.decode_www_form(URI.parse(rating_link["href"]).query).to_h["team"] == club["name"], "#{route}: incorrect ratings tool link")
  end
  canonical = unescape.call(doc.at_css('link[rel="canonical"]')&.[]("href"))
  check.call(canonical.end_with?(route), "#{route}: incorrect canonical URL")
  check.call(sitemap_entries[canonical]&.start_with?(snapshot["as_of"]), "#{route}: missing or stale sitemap entry")
  schema = doc.css('script[type="application/ld+json"]').map { |script| JSON.parse(script.text) }.find { |entry| unescape.call(entry["url"]).end_with?(route) }
  check.call(schema && schema["dateModified"]&.start_with?(snapshot["as_of"]), "#{route}: stale structured data")
end

directory = Nokogiri::HTML(File.read(File.join(root, "teams/index.html")))
links = directory.css(".team-directory-link").map { |link| unescape.call(link["href"]) }
check.call(links.sort == snapshot.fetch("clubs").map { |club| club["url"] }.sort, "Directory does not link to every club exactly once")
aliases = snapshot.fetch("aliases")
aliases.fetch("redirects").each do |slug, target|
  route = "/teams/#{slug}/"
  file = File.join(root, route, "index.html")
  unless File.file?(file)
    errors << "#{route}: alias page missing"
    next
  end
  doc = Nokogiri::HTML(File.read(file))
  check.call(doc.at_css('meta[http-equiv="refresh"]')&.[]("content") == "0; url=#{target}", "#{route}: incorrect alias redirect")
  check.call(unescape.call(doc.at_css('link[rel="canonical"]')&.[]("href")).end_with?(target), "#{route}: incorrect alias canonical URL")
  check.call(doc.at_css('meta[name="robots"]')&.[]("content") == "noindex", "#{route}: alias must not be indexed")
  check.call(sitemap_entries.keys.none? { |url| url.end_with?(route) }, "#{route}: alias appears in sitemap")
  check.call(doc.at_css('script[data-team-redirect]')&.[]("data-team-redirect") == target, "#{route}: incorrect browser redirect")
  check.call(File.file?(File.join(root, target, "index.html")), "#{route}: missing redirect destination")
end
not_found = Nokogiri::HTML(File.read(File.join(root, "404.html")))
route_config = JSON.parse(not_found.at_css("#football-team-route-data")&.text || "{}")
check.call(route_config["aliases"] == aliases["lookup"] && route_config["teamsRoot"] == "/teams/", "404 team routing data is missing or stale")
check.call(not_found.at_css('script[src*="football-team-routes.js"]'), "404 team routing script is missing")
check.call(not_found.css('meta[http-equiv="refresh"]').empty?, "A generic 404 meta redirect would compete with team routing")
cache = JSON.parse(File.read(File.join(root, "assets/data/currentLeagueTables.json")))
%w[schema_version as_of database_through season source source_commit source_hashes leagues].each do |key|
  check.call(cache[key] == snapshot[key], "Public standings cache: #{key} differs from this build's data")
end
abort errors.join("\n") unless errors.empty?
puts "#{snapshot.fetch('clubs').size} club pages and #{aliases.fetch('redirects').size} aliases passed: statistics, links, metadata, sitemap, 404 routing and cached standings."
