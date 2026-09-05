(function () {
  "use strict";
  const base = "https://raw.githubusercontent.com/seanelvidge/England-football-results/main/";
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const date = (value) =>
    new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
      typeof value === "number" ? value : FootballRankingsData.parseDate(value)
    );

  async function csv(file, columns, large = false, normalise = large) {
    if (!window.Papa) throw new Error("The data reader could not load. Check your connection and reload the page.");
    const response = await fetch(base + file, { signal: AbortSignal.timeout(90000) });
    if (!response.ok) throw new Error(`Could not load ${file} (${response.status}). Please try again.`);
    const text = await response.text();
    return new Promise((resolve, reject) => {
      const rows = [];
      Papa.parse(text, {
        header: true,
        skipEmptyLines: "greedy",
        worker: large && Papa.WORKERS_SUPPORTED,
        chunkSize: 2 * 1024 * 1024,
        chunk(result, parser) {
          if (!columns.every((column) => result.meta.fields?.includes(column)) || result.errors.length) {
            reject(new Error(`The data in ${file} could not be read completely.`));
            parser.abort();
            return;
          }
          const chunk = normalise ? FootballResultsData.normaliseMatches(result.data) : result.data;
          for (const row of chunk) rows.push(row);
        },
        complete: () => resolve(normalise ? rows.sort((a, b) => a.timestamp - b.timestamp) : rows),
        error: reject,
      });
    });
  }

  async function load(withDeductions) {
    const [matches, clubs, deductions] = await Promise.all([
      csv("EnglandLeagueResults.csv", ["Date", "Season", "HomeTeam", "AwayTeam", "hGoal", "aGoal", "Tier", "Division"], true),
      csv("EnglishTeamLogos.csv", ["Team", "LogoURL", "PriColour"]).catch(() => null),
      withDeductions ? csv("EnglishTeamPointDeductions.csv", ["Season", "Date", "Team", "Pts_deducted"]) : [],
    ]);
    if (!matches.length) throw new Error("No completed matches were found in the results file.");
    return {
      matches,
      clubs: new Map((clubs || []).map((row) => [row.Team.trim(), row])),
      deductions,
      seasons: [...new Set(matches.map((m) => m.Season))].sort().reverse(),
      teams: [...new Set(matches.flatMap((m) => [m.HomeTeam, m.AwayTeam]))].sort((a, b) => a.localeCompare(b, "en")),
      colourWarning: clubs ? "" : " Club colours and crests are unavailable; alternative colours are used.",
    };
  }

  function options(list, values) {
    list.replaceChildren(
      ...values.map((value) => {
        const option = element("option");
        option.value = value;
        return option;
      })
    );
  }
  function matchName(value, values, label = "team") {
    const query = value.trim().toLowerCase();
    const exact = values.find((name) => name.toLowerCase() === query);
    if (exact) return exact;
    const matches = query ? values.filter((name) => name.toLowerCase().includes(query)) : [];
    if (matches.length === 1) return matches[0];
    throw new Error(matches.length ? `Several ${label}s match. Choose a full name from the suggestions.` : `Choose a ${label} from the suggestions.`);
  }
  function radio(form, name) {
    return form.querySelector(`input[name="${name}"]:checked`).value;
  }
  function chooseRadio(form, name, value) {
    const input = [...form.querySelectorAll(`input[name="${name}"]`)].find((input) => input.value === value);
    if (input) input.checked = true;
    panels(form, name);
  }
  function panels(form, name) {
    const value = radio(form, name);
    for (const panel of form.querySelectorAll(`[data-${name}]`)) {
      panel.hidden = panel.dataset[name] !== value;
      for (const input of panel.querySelectorAll("input, select")) input.disabled = panel.hidden;
    }
  }
  function initPeriod(prefix, data, league = false) {
    const form = document.getElementById(`${prefix}-form`);
    options(document.getElementById(`${prefix}-seasons`), data.seasons);
    document.getElementById(`${prefix}-season`).value = data.seasons[0];
    for (const end of ["start", "end"]) document.getElementById(`${prefix}-${end}`).max = new Date().toISOString().slice(0, 10);
    form.querySelectorAll('input[name="period"]').forEach((input) => input.addEventListener("change", () => panels(form, "period")));
    panels(form, "period");
    return () =>
      FootballResultsData.resolvePeriod(
        {
          mode: radio(form, "period"),
          season: document.getElementById(`${prefix}-season`).value.trim(),
          start: document.getElementById(`${prefix}-start`).value,
          end: document.getElementById(`${prefix}-end`).value,
        },
        data.seasons,
        league
      );
  }
  function periodLabel(period) {
    return period.season || (period.start ? `${date(period.start)} – ${date(period.end)}` : "All history");
  }
  function url(values) {
    const next = new URL(window.location.href);
    next.search = "";
    for (const [key, value] of Object.entries(values))
      if (value !== undefined && value !== null && value !== "" && value !== false) next.searchParams.set(key, value);
    history.replaceState(null, "", next);
  }
  function periodParams(period) {
    return period.season ? { season: period.season } : period.start ? { startDate: period.start, endDate: period.end } : {};
  }
  async function share(status) {
    try {
      await navigator.clipboard.writeText(window.location.href);
      status.textContent = "Link copied. It includes your teams, competition and period selections.";
    } catch {
      status.textContent = `Copy the page address to share this selection: ${window.location.href}`;
    }
  }
  function crest(team, clubs) {
    const source = clubs.get(team)?.LogoURL;
    if (!source || !/^https:\/\//.test(source)) return null;
    const img = element("img");
    img.alt = "";
    img.loading = "lazy";
    img.src = source;
    img.addEventListener("error", () => img.remove(), { once: true });
    return img;
  }
  function theme(root) {
    const css = getComputedStyle(root);
    return {
      text: css.getPropertyValue("--rankings-text").trim(),
      muted: css.getPropertyValue("--rankings-muted").trim(),
      border: css.getPropertyValue("--rankings-border").trim(),
    };
  }
  window.FootballTools = {
    element,
    date,
    csv,
    load,
    options,
    matchName,
    radio,
    chooseRadio,
    panels,
    initPeriod,
    periodLabel,
    periodParams,
    url,
    share,
    crest,
    theme,
  };
})();
