(function () {
  "use strict";

  const baseURL = "https://raw.githubusercontent.com/seanelvidge/England-football-results/main/";
  const byId = (id) => document.getElementById(`rankings-${id}`);
  const feedback = byId("feedback");
  const input = byId("team");
  const formatDate = (timestamp) =>
    new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(timestamp);
  const formatRating = (rating) => rating.toLocaleString("en-GB", { maximumFractionDigits: 2 });
  const histories = new Map();
  const selected = new Map();
  let metadata = new Map();
  let records, fullStart, fullEnd, chart, focus;
  let colourWarning = "";
  let teams = [];

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  async function fetchCSV(filename) {
    const response = await fetch(baseURL + filename, { signal: AbortSignal.timeout(90000) });
    if (!response.ok) throw new Error(`Data request failed (${response.status}).`);
    return response.text();
  }

  async function loadColours() {
    try {
      const csv = await fetchCSV("EnglishTeamLogos.csv");
      const result = Papa.parse(csv, { header: true, skipEmptyLines: "greedy" });
      if (!result.meta.fields?.includes("Team") || !result.meta.fields?.includes("PriColour")) throw new Error("Missing colour columns.");
      metadata = new Map(result.data.filter((row) => row.Team).map((row) => [row.Team.trim(), row]));
    } catch (error) {
      console.warn("Club colours could not be loaded:", error);
      colourWarning = " Club colours are unavailable; alternative colours are being used.";
    }
  }

  function parseHistory(csv) {
    return new Promise((resolve, reject) => {
      let checkedHeader = false;
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: "greedy",
        worker: Papa.WORKERS_SUPPORTED,
        chunkSize: 2 * 1024 * 1024,
        chunk(result, parser) {
          if (!checkedHeader) {
            checkedHeader = true;
            if (!FootballRankingsData.REQUIRED_COLUMNS.every((column) => result.meta.fields?.includes(column))) {
              reject(new Error("The results file is missing its date, team or rating columns."));
              parser.abort();
              return;
            }
          }
          if (result.errors.length) {
            reject(new Error("The results file could not be read completely. Please try again later."));
            parser.abort();
            return;
          }
          FootballRankingsData.addRows(histories, result.data);
        },
        complete: resolve,
        error: reject,
      });
    });
  }

  function theme() {
    const css = getComputedStyle(document.getElementById("team-rankings"));
    return { text: css.getPropertyValue("--rankings-text").trim(), border: css.getPropertyValue("--rankings-border").trim() };
  }

  function updateTheme() {
    if (!chart) return;
    const colours = theme();
    for (const axis of Object.values(chart.options.scales)) {
      axis.ticks.color = colours.text;
      axis.title.color = colours.text;
      axis.grid.color = colours.border;
      axis.border.color = colours.border;
    }
    chart.update("none");
  }

  // A subtle contrasting halo keeps white/black club colours readable in both themes.
  const lineHalo = {
    id: "rankingsLineHalo",
    beforeDatasetDraw(chart) {
      chart.ctx.save();
      chart.ctx.shadowColor = theme().text;
      chart.ctx.shadowBlur = 2;
    },
    afterDatasetDraw(chart) {
      chart.ctx.restore();
    },
    afterDatasetsDraw(chart) {
      if (!focus || !selected.get(focus.team)?.visible) return;
      const x = chart.scales.x.getPixelForValue(focus.point.x);
      const y = chart.scales.y.getPixelForValue(focus.point.y);
      const area = chart.chartArea;
      if (x < area.left || x > area.right || y < area.top || y > area.bottom) return;
      const ctx = chart.ctx;
      ctx.save();
      ctx.strokeStyle = theme().text;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x, area.top);
      ctx.lineTo(x, area.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = selected.get(focus.team).colour;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    },
  };

  function createChart() {
    chart = new Chart(byId("chart"), {
      type: "line",
      data: { datasets: [] },
      plugins: [lineHalo],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        parsing: false,
        onResize(instance, size) {
          instance.options.scales.x.ticks.maxTicksLimit = Math.max(3, Math.floor(size.width / 100));
        },
        interaction: { mode: "nearest", axis: "xy", intersect: false },
        elements: { point: { radius: 0, hitRadius: 8, hoverRadius: 5 }, line: { borderWidth: 2, tension: 0 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => (items.length ? formatDate(items[0].parsed.x) : ""),
              label: (context) => `${context.dataset.label}: ${formatRating(context.parsed.y)}`,
            },
          },
          zoom: {
            limits: { x: { min: fullStart, max: fullEnd, minRange: 30 * FootballRankingsData.DAY } },
            pan: { enabled: true, mode: "x", onPanComplete: fitView },
            zoom: {
              mode: "x",
              wheel: { enabled: true, modifierKey: "ctrl" },
              pinch: { enabled: true },
              onZoomComplete: fitView,
            },
          },
        },
        scales: {
          x: {
            type: "time",
            min: fullStart,
            max: fullEnd,
            adapters: { date: { zone: "utc" } },
            time: { minUnit: "day", displayFormats: { year: "yyyy", month: "MMM yyyy", day: "d MMM yyyy" } },
            title: { display: true, text: "Year" },
            ticks: { maxRotation: 0, maxTicksLimit: 12, autoSkipPadding: 16 },
            grid: {},
            border: {},
          },
          y: { title: { display: true, text: "Team rating (higher is stronger)" }, ticks: { display: false }, grid: {}, border: {} },
        },
      },
    });
    updateTheme();
  }

  function fitView() {
    if (!chart) return;
    const { min: start, max: end } = chart.scales.x;
    let low = Infinity,
      high = -Infinity;
    for (const [team, style] of selected) {
      if (!style.visible) continue;
      const points = histories.get(team);
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (point.x >= start && point.x <= end) {
          low = Math.min(low, point.y);
          high = Math.max(high, point.y);
        }
        // Include boundary interpolation when a line crosses the visible window.
        const next = points[i + 1];
        if (!next || next.x === point.x || next.x - point.x > 370 * FootballRankingsData.DAY) continue;
        for (const boundary of [start, end]) {
          if (point.x < boundary && next.x > boundary) {
            const rating = point.y + ((next.y - point.y) * (boundary - point.x)) / (next.x - point.x);
            low = Math.min(low, rating);
            high = Math.max(high, rating);
          }
        }
      }
    }
    const hasData = Number.isFinite(low);
    const padding = hasData ? Math.max(10, (high - low) * 0.08) : 0;
    chart.options.scales.y.min = hasData ? low - padding : 0;
    chart.options.scales.y.max = hasData ? high + padding : 1;
    chart.options.scales.y.ticks.display = hasData;
    byId("empty").hidden = hasData;
    byId("empty").textContent = !selected.size
      ? "Add a team above to explore its history."
      : "No visible ratings in this period. Show a team or return to full history.";
    byId("period").textContent = `${formatDate(start)} – ${formatDate(end)}`;
    chart.update("none");
  }

  function syncURL() {
    const url = new URL(window.location.href);
    url.searchParams.delete("team");
    for (const team of selected.keys()) url.searchParams.append("team", team);
    window.history.replaceState(null, "", url);
  }

  function focusRecord(team, kind) {
    const record = records.get(team)[kind];
    selected.get(team).visible = true;
    focus = { team, point: record };
    render();
    const radius = 2 * 365.25 * FootballRankingsData.DAY;
    chart.zoomScale("x", { min: Math.max(fullStart, record.x - radius), max: Math.min(fullEnd, record.x + radius) }, "none");
    fitView();
    feedback.textContent = `${team}: ${kind === "max" ? "maximum" : "minimum"} rating ${formatRating(record.y)} on ${formatDate(
      record.x
    )}. Highlighted on the chart.`;
    byId("chart").scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function render() {
    byId("selected").replaceChildren();
    byId("cards").replaceChildren();
    const datasets = [];
    for (const [team, style] of selected) {
      const chip = element("div", "rankings-chip");
      chip.style.setProperty("--team-colour", style.colour);
      const toggle = element("button", "", team);
      toggle.type = "button";
      toggle.setAttribute("aria-pressed", String(style.visible));
      toggle.setAttribute("aria-label", `${style.visible ? "Hide" : "Show"} ${team}`);
      const swatch = element("span", "rankings-swatch");
      swatch.style.borderTopStyle = style.dash.length ? "dashed" : "solid";
      toggle.prepend(swatch);
      toggle.addEventListener("click", () => {
        style.visible = !style.visible;
        render();
        byId("selected").querySelectorAll(".rankings-chip > button:first-child")[[...selected.keys()].indexOf(team)].focus();
      });
      const remove = element("button", "", "×");
      remove.type = "button";
      remove.setAttribute("aria-label", `Remove ${team}`);
      remove.addEventListener("click", () => {
        selected.delete(team);
        if (focus?.team === team) focus = null;
        render();
        input.focus();
      });
      chip.append(toggle, remove);
      byId("selected").append(chip);

      datasets.push({
        label: team,
        data: histories.get(team),
        borderColor: style.colour,
        backgroundColor: style.colour,
        borderDash: style.dash,
        hidden: !style.visible,
        spanGaps: 370 * FootballRankingsData.DAY,
      });

      const record = records.get(team);
      const card = element("article", "rankings-card");
      card.style.setProperty("--team-colour", style.colour);
      card.append(element("h3", "", team));
      card.append(element("p", "rankings-note", `Last recorded: ${formatRating(record.latest.y)} · ${formatDate(record.latest.x)}`));
      const buttons = element("div", "rankings-card-records");
      for (const [kind, label] of [
        ["max", "Maximum"],
        ["min", "Minimum"],
      ]) {
        const point = record[kind];
        const button = element("button", "rankings-button rankings-record");
        button.type = "button";
        const count = record[`${kind}Count`];
        button.setAttribute("aria-label", `${team}, ${label.toLowerCase()} rating ${formatRating(point.y)}, ${formatDate(point.x)}. Show on chart.`);
        button.append(element("span", "", label), element("strong", "", formatRating(point.y)), element("span", "", formatDate(point.x)));
        if (count > 1) button.append(element("span", "", `First of ${count.toLocaleString("en-GB")} tied records`));
        button.addEventListener("click", () => focusRecord(team, kind));
        buttons.append(button);
      }
      card.append(buttons);
      byId("cards").append(card);
    }
    chart.data.datasets = datasets;
    chart.update("none");
    fitView();
    byId("clear").disabled = selected.size === 0;
    byId("records").hidden = selected.size === 0;
    byId("chart").setAttribute(
      "aria-label",
      `Ratings over time for ${
        [...selected]
          .filter(([, style]) => style.visible)
          .map(([team]) => team)
          .join(", ") || "no selected teams"
      }. All-time records are provided below.`
    );
    const options = teams
      .filter((team) => !selected.has(team))
      .map((team) => {
        const option = document.createElement("option");
        option.value = team;
        return option;
      });
    byId("teams").replaceChildren(...options);
    syncURL();
  }

  byId("form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!chart) return;
    const query = input.value.trim().toLowerCase();
    const exact = teams.find((team) => team.toLowerCase() === query);
    const matches = query ? teams.filter((team) => team.toLowerCase().includes(query)) : [];
    const team = exact || (matches.length === 1 ? matches[0] : null);
    if (!team) {
      feedback.textContent =
        matches.length > 1
          ? "Several teams match. Choose a full team name from the suggestions."
          : "Choose a team from the suggestions to add it to the plot.";
      input.setAttribute("aria-invalid", "true");
      return;
    }
    if (selected.has(team)) {
      feedback.textContent = `${team} is already on the plot.`;
      return;
    }
    selected.set(team, { ...FootballRankingsData.chooseStyle(metadata.get(team), [...selected.values()]), visible: true });
    focus = null;
    input.value = "";
    input.removeAttribute("aria-invalid");
    render();
    feedback.textContent = `${team} added. Add another team to compare; the page address saves your selection.`;
    input.focus();
  });

  byId("clear").addEventListener("click", () => {
    selected.clear();
    focus = null;
    chart.resetZoom("none");
    render();
    feedback.textContent = "All teams cleared. Add a team to start again.";
    input.focus();
  });
  byId("reset").addEventListener("click", () => {
    focus = null;
    chart.resetZoom("none");
    fitView();
    feedback.textContent = "Full history shown. Add another team or click a high or low to explore.";
  });
  byId("zoom-in").addEventListener("click", () => {
    chart.zoom(1.5, "none");
    fitView();
  });
  byId("zoom-out").addEventListener("click", () => {
    chart.zoom(0.67, "none");
    fitView();
  });
  new MutationObserver(updateTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  async function load() {
    byId("retry").hidden = true;
    feedback.textContent = "Loading match history (about 22 MB on the first visit)…";
    histories.clear();
    colourWarning = "";
    try {
      if (!window.Papa || !window.Chart || !window.luxon || !window.FootballRankingsData || !Chart.registry.plugins.get("zoom")) {
        throw new Error("A chart library could not be loaded. Check your connection and reload this page.");
      }
      const [csv] = await Promise.all([fetchCSV("EnglandLeagueResults_wRanks.csv"), loadColours()]);
      feedback.textContent = "Preparing team histories…";
      await parseHistory(csv);
      if (!histories.size) throw new Error("No valid team ratings were found in the results file.");
      const summary = FootballRankingsData.summarise(histories);
      records = summary.records;
      fullStart = summary.start;
      fullEnd = Math.max(Date.now(), summary.end);
      teams = [...histories.keys()].sort((a, b) => a.localeCompare(b, "en"));
      createChart();
      for (const requested of new URLSearchParams(window.location.search).getAll("team")) {
        const team = teams.find((name) => name.toLowerCase() === requested.toLowerCase());
        if (team && !selected.has(team))
          selected.set(team, { ...FootballRankingsData.chooseStyle(metadata.get(team), [...selected.values()]), visible: true });
      }
      render();
      for (const id of ["team", "add", "reset", "zoom-in", "zoom-out"]) byId(id).disabled = false;
      feedback.textContent = `${teams.length} teams available. Type a name to add it to the plot.`;
      byId("data-note").textContent = `Recorded ratings: ${formatDate(summary.start)} – ${formatDate(
        summary.end
      )}. Reload to pick up new results.${colourWarning}`;
    } catch (error) {
      console.error("Could not load team rankings:", error);
      if (chart) {
        chart.destroy();
        chart = null;
      }
      feedback.textContent = `Could not load the rankings. ${error.message}`;
      byId("retry").hidden = false;
    }
  }

  byId("retry").addEventListener("click", load);
  load();
})();
