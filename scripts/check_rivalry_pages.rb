# Validate the published HTML against the CSV-derived JSON used for this build.
# bundle exec ruby scripts/check_rivalry_pages.rb _site [path/to/football_rivalries.json]
require "nokogiri"
require "json"
require "date"
require "uri"

root = File.expand_path(ARGV.fetch(0))
snapshot = JSON.parse(File.read(ARGV[1] || File.expand_path("../_data/football_rivalries.json", __dir__)))
errors = []
check = ->(condition, message) { errors << message unless condition }
sitemap = Nokogiri::XML(File.read(File.join(root, "sitemap.xml")))
snapshot.fetch("rivalries").each do |slug, record|
  route = "/football/#{slug}/"
  doc = Nokogiri::HTML(File.read(File.join(root, route, "index.html")))
  intro = doc.at_css(".rivalry-intro")
  check.call(intro && intro.text.include?(record.fetch("played").to_s), "#{slug}: generated intro missing")
  check.call(intro && intro.css("time").map { |time| time["datetime"] } == [record.dig("first", "date"), record.dig("latest", "date")], "#{slug}: meeting range is stale")
  dates = doc.css(".rivalry-data-date time").map { |time| time["datetime"] }
  check.call(dates == [snapshot.fetch("as_of"), snapshot.fetch("database_through")], "#{slug}: data dates are stale")
  check.call(!doc.text.include?("most watched") && !doc.text.include?("dated reference"), "#{slug}: old editorial/snapshot copy remains")
  check.call(doc.css("h1").length == 1, "#{slug}: missing/duplicate page title")
  check.call(doc.css("h2").none? { |heading| heading.text == "Data and method" }, "#{slug}: removed Data and method section remains")
  check.call(doc.at_css("#rivalry-history")&.[]("aria-label")&.include?(record["played"].to_s), "#{slug}: accessible chart missing")
  chart = JSON.parse(doc.at_css("#rivalry-chart-data")&.text || "{}")
  check.call(chart["teams"] == record["teams"] && chart["rows"] == record["win_history"], "#{slug}: chart data differs from CSV record")
  check.call(chart["rows"]&.length == record["played"] && chart["rows"]&.last&.last(2) == record["wins"], "#{slug}: chart totals differ from table")
  check.call(doc.css("script[src]").any? { |script| script["src"].include?("football-win-history.js") }, "#{slug}: shared chart script missing")

  tables = doc.css(".rivalry-table")
  check.call(tables.length == 3, "#{slug}: record tables missing")
  totals = tables[0]&.css("tbody tr")&.map { |row| row.css("td").map { |cell| cell.text.to_i } }
  check.call(totals == [record.fetch("wins"), record.fetch("goals")], "#{slug}: displayed totals differ from CSV data")
  venues = tables[1]&.css("tbody tr")&.map { |row| row.css("td").map { |cell| cell.text.to_i } }
  expected_venues = record.fetch("venue").map { |venue| [venue["played"], venue["wins"][0], venue["draws"], venue["wins"][1]] }
  check.call(venues == expected_venues, "#{slug}: home/away records differ from CSV data")
  recent = tables[2]&.css("tbody tr")&.map do |row|
    cells = row.css("td")
    [cells[0].at_css("time")["datetime"], *cells.drop(1).map { |cell| cell.text.strip }]
  end
  expected_recent = record.fetch("recent").map { |match| [match["date"], match["home"], "#{match['home_goals']}–#{match['away_goals']}", match["away"]] }
  check.call(recent == expected_recent, "#{slug}: recent results differ from CSV data")
  record.fetch("biggest").each do |biggest|
    biggest.fetch("matches").each do |match|
      expected = "#{match['home']} #{match['home_goals']}–#{match['away_goals']} #{match['away']}, #{Date.iso8601(match['date']).strftime('%-d %B %Y')}"
      check.call(doc.text.gsub(/\s+/, " ").include?(expected), "#{slug}: record win missing")
    end
  end

  meta = doc.at_css('meta[name="description"]')&.[]("content")
  check.call(meta && meta.include?(record["played"].to_s) && record["teams"].all? { |team| meta.include?(team) }, "#{slug}: description is not data-derived")
  check.call(doc.at_css(".post-description")&.text == meta, "#{slug}: visible and SEO descriptions differ")
  schema = doc.css('script[type="application/ld+json"]').map { |s| JSON.parse(s.text) }.find { |entry| entry["url"]&.end_with?(route) }
  check.call(schema && schema["dateModified"]&.start_with?(snapshot["as_of"]), "#{slug}: structured-data modified date is stale")
  sitemap_entry = sitemap.xpath('//*[local-name()="url"]').find { |entry| entry.at_xpath('./*[local-name()="loc"]')&.text&.end_with?(route) }
  check.call(sitemap_entry&.at_xpath('./*[local-name()="lastmod"]')&.text&.start_with?(snapshot["as_of"]), "#{slug}: sitemap modified date is stale")
  links = doc.css('a[href^="/h2h?"]')
  check.call(links.any? { |a| URI.decode_www_form(URI.parse(a["href"]).query).to_h.values_at("team1", "team2") == record["teams"] }, "#{slug}: H2H deep link is incorrect")
end
abort errors.join("\n") unless errors.empty?
puts "CSV-derived rivalry pages passed: summaries, dates, totals, results, metadata, sitemap and H2H links."
