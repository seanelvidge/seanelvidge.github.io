# Run after a Jekyll build: bundle exec ruby scripts/seo_check.rb /path/to/site [pre-change-site]
require "nokogiri"
require "json"
require "uri"
require "set"

root = File.expand_path(ARGV.fetch(0))
baseline = ARGV[1] && File.expand_path(ARGV[1])
errors = []
check = ->(condition, message) { errors << message unless condition }
documents = Dir.glob("#{root}/**/*.html").to_h do |file|
  [file.delete_prefix(root), Nokogiri::HTML(File.read(file))]
end
pages = documents.select { |path, doc| !path.start_with?("/assets/") && doc.at_css('meta[name="generator"][content^="Jekyll"]') }
check.call(!pages.empty?, "No Jekyll SEO pages found")
json = ->(doc) { doc.css('script[type="application/ld+json"]').map { |s| JSON.parse(s.text) } }
pages.each do |path, doc|
  %w[title meta[name="description"] link[rel="canonical"] meta[property="og:title"] meta[property="og:type"]].each do |selector|
    check.call(doc.css(selector).length == 1, "#{path}: expected one #{selector}, got #{doc.css(selector).length}")
  end
  check.call(!doc.at_css('meta[name="description"]')&.[]("content").to_s.strip.empty?, "#{path}: blank description")
  canonical = doc.at_css('link[rel="canonical"]')&.[]("href").to_s
  check.call(!canonical.include?("seanelvidge.github.io"), "#{path}: old canonical domain")
  noindex = doc.at_css('meta[name="robots"]')&.[]("content").to_s.include?("noindex")
  check.call(canonical.start_with?("https://seanelvidge.com/") || noindex, "#{path}: incorrect canonical")
  begin
    entities = json.call(doc)
    check.call(entities.count { |e| e["@type"] != "Person" } == 1, "#{path}: duplicate/missing page structured data")
    if path.match?(%r{\A/articles/\d{4}/[^/]+/index.html\z}) && !noindex
      check.call(entities.any? { |e| e["@type"] == "BlogPosting" }, "#{path}: article schema missing")
    end
    entities.each do |entity|
      next unless entity["@type"] == "BlogPosting"
      check.call(path.match?(%r{\A/articles/\d{4}/[^/]+/index.html\z}), "#{path}: non-post labelled BlogPosting")
      check.call(entity.dig("author", "name") == "Sean Elvidge" && entity.dig("author", "url") == "https://seanelvidge.com/about/", "#{path}: missing author identity")
      %w[headline datePublished dateModified].each { |key| check.call(!entity[key].to_s.empty?, "#{path}: missing #{key}") }
      check.call(entity.dig("image", "@type") == "ImageObject", "#{path}: invalid image type") if entity["image"].is_a?(Hash)
    end
  rescue JSON::ParserError => e
    errors << "#{path}: invalid JSON-LD: #{e.message}"
  end
end

# Social-image URLs must be absolute and refer to an existing image when local.
pages.each do |path, doc|
  doc.css('meta[property="og:image"]').each do |meta|
    url = URI.parse(meta["content"])
    check.call(%w[http https].include?(url.scheme), "#{path}: social image is not absolute")
    if url.host == "seanelvidge.com"
      check.call(File.file?(File.join(root, URI::DEFAULT_PARSER.unescape(url.path))), "#{path}: social image does not exist")
    end
  end
end

home = pages.fetch("/index.html")
check.call(home.at_css("title").text == "Sean Elvidge | Football Statistics, Mathematics & Space Weather", "Homepage SEO title")
check.call(home.at_css("h1").text.strip == "Sean Elvidge", "Homepage H1")
check.call(home.css(".post-list > li").length == 10, "Homepage article list/pagination")
check.call(home.css('.topic-links a').length >= 3, "Homepage topic links")
home_nav = home.css('#navbarNav a.nav-link').select { |a| ["/", "/index.html"].include?(a["href"]) }
check.call(home_nav.length == 1 && home_nav.first.text.strip.start_with?("articles"), "Homepage navigation label/link duplicated or empty")
check.call(home.css(".post-list img").all? { |img| img.key?("alt") && img["alt"] != "image" }, "Homepage thumbnail alt text")
%w[/index.html /about/index.html].each do |path|
  person = json.call(pages.fetch(path)).find { |e| e["@type"] == "Person" }
  check.call(person && person.dig("worksFor", "name") == "University of Birmingham" && person["sameAs"].any? { |url| url.include?("orcid.org") }, "#{path}: professional Person schema")
end
archive = pages.fetch("/articles/2025/index.html")
check.call(archive.at_css("h1").text.strip == "2025", "Year archive heading changed")
check.call(archive.at_css('meta[property="og:type"]')["content"] == "website", "Year archive is not an article")
check.call(json.call(archive).first["@type"] == "CollectionPage", "Archive schema type")
check.call(!json.call(archive).first.key?("datePublished"), "Archive has spurious publication date")
pages.select { |path, _| path.match?(%r{\A/page/\d+/index.html\z}) }.each do |path, doc|
  check.call(doc.at_css('link[rel="canonical"]')["href"] == "https://seanelvidge.com#{path.delete_suffix('index.html')}", "#{path}: pagination canonical")
end
%w[h2h leaguetable matchProbs teamRankings tableProbs].each do |tool|
  doc = documents["/#{tool}.html"] || documents.fetch("/#{tool}/index.html")
  guide = doc.at_css(".tool-guide")
  check.call(guide && guide.css("h2").length == 1 && guide.text.split.length > 100, "#{tool}: crawlable guide missing")
end
%w[football mathematics space-weather football/manchester-united-vs-liverpool football/arsenal-vs-tottenham].each do |route|
  doc = pages.fetch("/#{route}/index.html")
  check.call(doc.css("h1").length == 1, "#{route}: expected one H1")
end

sitemap = Nokogiri::XML(File.read("#{root}/sitemap.xml"))
locations = sitemap.xpath('//*[local-name()="loc"]').map(&:text)
check.call(locations.all? { |url| url.start_with?("https://seanelvidge.com/") }, "Sitemap domain")
%w[football mathematics space-weather football/manchester-united-vs-liverpool football/arsenal-vs-tottenham].each do |route|
  check.call(locations.include?("https://seanelvidge.com/#{route}/"), "#{route}: missing from sitemap")
end
pages.each do |path, doc|
  next unless doc.at_css('meta[name="robots"]')&.[]("content").to_s.include?("noindex")
  own_url = "https://seanelvidge.com#{path.sub(%r{/index.html\z}, '/')}"
  check.call(!locations.include?(own_url), "#{path}: noindex redirect included in sitemap")
end
check.call(File.read("#{root}/robots.txt").include?("Sitemap: https://seanelvidge.com/sitemap.xml"), "Robots sitemap")
check.call(!File.exist?("#{root}/scripts/seo_check.rb"), "Maintenance scripts should not be published")
citations = pages.fetch("/about/index.html").css('a[href^="https://www.birmingham.ac.uk/"]')
check.call(citations.any? && citations.none? { |a| a["rel"].to_s.split.include?("nofollow") }, "Ordinary citations should not be nofollow")
affiliates = documents.fetch("/brewcoffee.html").css('a[href^="https://amzn.to/"]')
check.call(affiliates.any? && affiliates.all? { |a| a["rel"].to_s.split.include?("sponsored") }, "Affiliate qualification missing")

# Detect missing internal destinations without making external HTTP requests.
# Report existing broken links separately when a pre-change build is supplied.
broken_links = lambda do |site_root, docs|
  missing = Set.new
  docs.each do |path, doc|
    next if path.start_with?("/assets/")
    doc.css("a[href]").each do |link|
      href = link["href"]
      next if href.start_with?("#", "mailto:", "tel:", "javascript:")
      begin
        uri = URI.join("https://seanelvidge.com#{path}", href.gsub(" ", "%20"))
        next unless %w[seanelvidge.com seanelvidge.github.io www.seanelvidge.com].include?(uri.host)
        target = URI::DEFAULT_PARSER.unescape(uri.path)
        file = File.join(site_root, target)
        next if File.file?(file) || File.file?("#{file}.html") || File.file?(File.join(file, "index.html"))
        missing << [path, target]
      rescue URI::Error
        missing << [path, href]
      end
    end
  end
  missing
end
current_broken = broken_links.call(root, documents)
if baseline
  old_docs = Dir.glob("#{baseline}/**/*.html").to_h { |file| [file.delete_prefix(baseline), Nokogiri::HTML(File.read(file))] }
  # Library fixtures and explicitly excluded build documentation are not public site routes.
  old_routes = old_docs.keys.reject { |path| path.start_with?("/assets/", "/docs/", "/scripts/") }
  (old_routes - documents.keys).each { |path| errors << "Existing page removed: #{path}" }
  old_broken = broken_links.call(baseline, old_docs)
  introduced = current_broken - old_broken
  puts "Existing broken internal links remaining: #{(current_broken & old_broken).length}"
else
  introduced = current_broken
end
introduced.each { |path, target| errors << "#{path}: missing internal destination #{target}" }

if errors.empty?
  puts "SEO checks passed for #{pages.length} pages; titles, descriptions, canonicals, schema, guides, sitemap and links verified."
else
  warn errors.join("\n")
  abort "#{errors.length} SEO check(s) failed"
end
