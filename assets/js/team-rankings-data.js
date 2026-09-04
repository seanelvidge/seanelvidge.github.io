/* Shared, DOM-free data helpers; also used by the Node regression checks. */
(function (root) {
  "use strict";

  const DAY = 86400000;
  const REQUIRED_COLUMNS = ["Date", "HomeTeam", "AwayTeam", "HomeRank_after", "AwayRank_after"];

  function parseDate(value) {
    const text = String(value || "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return NaN;
    const timestamp = Date.parse(`${text}T00:00:00Z`);
    return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === text ? timestamp : NaN;
  }

  function addRows(histories, rows, now = Date.now()) {
    for (const row of rows) {
      const x = parseDate(row.Date);
      if (!Number.isFinite(x) || x > now) continue;
      for (const side of ["Home", "Away"]) {
        const team = String(row[`${side}Team`] || "").trim();
        const raw = String(row[`${side}Rank_after`] ?? "").trim();
        const y = raw === "" ? NaN : Number(raw);
        if (!team || !Number.isFinite(y)) continue;
        if (!histories.has(team)) histories.set(team, []);
        histories.get(team).push({ x, y });
      }
    }
  }

  function summarise(histories) {
    const records = new Map();
    let start = Infinity;
    let end = -Infinity;
    for (const [team, points] of histories) {
      points.sort((a, b) => a.x - b.x);
      let min = points[0];
      let max = points[0];
      let minCount = 0;
      let maxCount = 0;
      for (const point of points) {
        if (point.y < min.y) {
          min = point;
          minCount = 0;
        }
        if (point.y > max.y) {
          max = point;
          maxCount = 0;
        }
        if (point.y === min.y) minCount++;
        if (point.y === max.y) maxCount++;
      }
      const latest = points[points.length - 1];
      records.set(team, { min, max, minCount, maxCount, latest, count: points.length });
      start = Math.min(start, points[0].x);
      end = Math.max(end, latest.x);
    }
    return { records, start, end };
  }

  function normaliseColour(value) {
    const colour = String(value || "").trim();
    if (/^#[0-9a-f]{6}$/i.test(colour)) return colour.toUpperCase();
    if (/^#[0-9a-f]{3}$/i.test(colour)) return `#${[...colour.slice(1)].map((c) => c + c).join("")}`.toUpperCase();
    return null;
  }

  // Treat nearby shades (e.g. two clubs' reds) as a clash, not only identical hex codes.
  function colourDistance(first, second) {
    const rgb = (colour) => [1, 3, 5].map((offset) => parseInt(colour.slice(offset, offset + 2), 16));
    const a = rgb(first),
      b = rgb(second);
    return Math.hypot(...a.map((channel, index) => channel - b[index]));
  }

  function chooseStyle(metadata = {}, selected = []) {
    const primary = normaliseColour(metadata.PriColour);
    const secondary = normaliseColour(metadata.SecColour);
    const clashes = (colour) => selected.some((style) => colourDistance(colour, style.colour) < 95);
    const palette = ["#3266AD", "#D1495B", "#23856D", "#9A5BB5", "#C57B13", "#008C9E", "#687080"];
    let colour = primary && !clashes(primary) ? primary : secondary || primary;
    if (!colour) colour = palette.find((candidate) => !clashes(candidate)) || palette[selected.length % palette.length];
    const dashPatterns = [
      [8, 4],
      [2, 4],
      [10, 4, 2, 4],
    ];
    const similar = selected.filter((style) => colourDistance(colour, style.colour) < 95).length;
    return { colour, dash: similar ? dashPatterns[(similar - 1) % dashPatterns.length] : [] };
  }

  const api = { DAY, REQUIRED_COLUMNS, parseDate, addRows, summarise, normaliseColour, colourDistance, chooseStyle };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.FootballRankingsData = api;
})(globalThis);
