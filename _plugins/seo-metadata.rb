# Keep content metadata in front matter; let jekyll-seo-tag do the rendering.
require "jekyll-seo-tag"
require "jekyll-archives"

# Populate generated metadata before Liquid drops, the sitemap or SEO tag can
# cache the page data. A per-page pre_render hook is too late for new fields.
Jekyll::Hooks.register :site, :post_read do |site|
  site.pages.each do |item|
    data = item.data
    next unless data["layout"] == "rivalry"
    snapshot = site.data["football_rivalries"]
    record = snapshot&.dig("rivalries", data["rivalry"])
    unless record && record["teams"] == data["teams"]
      raise Jekyll::Errors::FatalException, "Missing or outdated rivalry data for #{item.path}. " \
        "Set teams: to two CSV team names in its front matter, then run npm ci && node scripts/generate_rivalry_snapshots.js --refresh."
    end
    first_team, second_team = record.fetch("teams")
    # Keep the visible page description, social metadata and sitemap date in sync
    # with the CSV-derived record; no hand-maintained counts or update dates.
    data["description"] = "#{first_team} vs #{second_team}: #{record.fetch('played')} recorded league meetings, " \
      "#{record.fetch('wins')[0]} #{first_team} wins, #{record.fetch('draws')} draws and #{record.fetch('wins')[1]} #{second_team} wins."
    data["last_modified_at"] = snapshot.fetch("as_of")
  end
end

Jekyll::Hooks.register [:pages, :documents], :pre_render do |item|
  data = item.data
  post = item.is_a?(Jekyll::Document) && item.collection.label == "posts"
  archive = data["layout"].to_s.start_with?("archive-")
  if archive
    # An archive's date labels its contents; it is not a publication date.
    # Preserve the year heading while keeping the SEO tag's article detection
    # and dates reserved for actual dated content.
    if item.is_a?(Jekyll::Archives::Archive) && item.date
      data["archive_date"] = item.date
      data["title"] = "Articles from #{item.date.year}"
      item.define_singleton_method(:date) { nil }
      item.define_singleton_method(:title) { data["title"] }
    end
    data["seo"] = (data["seo"] || {}).merge("type" => "CollectionPage")
    data["description"] = "Browse Sean Elvidge’s articles in this archive." if data["description"].to_s.strip.empty?
  elsif post && !data["redirect"]
    data["seo"] = { "type" => "BlogPosting" }.merge(data["seo"] || {})
  end

  # A redirect is a signpost, not a second copy of an article or a tool.
  if data["redirect"]
    data["sitemap"] = false
    data["seo"] = (data["seo"] || {}).merge("type" => "WebPage")
    target = data["redirect"]
    if target.is_a?(String)
      data["canonical_url"] ||= target.start_with?("http") ? target : "#{item.site.config["url"]}#{item.site.config["baseurl"]}#{target}"
    end
  end

  # Reuse article thumbnails for social cards without forcing a generic image
  # onto articles that have no relevant illustration.
  image = data["image"]
  image = { "path" => image } if image.is_a?(String)
  image ||= { "path" => data["thumbnail"] || data["og_image"] } if data["thumbnail"] || data["og_image"]
  if image.is_a?(Hash)
    image = image.dup
    image["alt"] ||= data["image_alt"] unless data["image_decorative"]
    data["image"] = image
  end
end

# jekyll-seo-tag 2.8 emits lowercase "imageObject". Keep the stock renderer,
# correcting only that type and mapping social-image alt text to schema caption.
module SeoImageObject
  def mainEntity
    { "@id" => "#{page_drop.canonical_url}#person" } if type == "ProfilePage"
  end

  def image
    result = super
    return result unless result.is_a?(Hash)
    result["@type"] = "ImageObject"
    result["caption"] = result.delete("alt") if result.key?("alt")
    result
  end
end
Jekyll::SeoTag::JSONLDDrop.prepend(SeoImageObject)
