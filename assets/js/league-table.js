(function () {
  "use strict";
  const UI = FootballTools,
    D = FootballResultsData;
  const el = (id) => document.getElementById(`league-${id}`),
    form = el("form"),
    status = el("status");
  let data, period, current, columns, title, subtitle;
  let sort = { key: "Pos", direction: 1 };

  function updateCompetitions() {
    if (!data) return;
    let chosen;
    try {
      chosen = period();
    } catch {
      chosen = {};
    }
    const matches = data.matches.filter((m) => D.inPeriod(m, chosen));
    UI.options(el("divisions"), [...new Set(matches.map((m) => m.Division))].sort());
    const previous = el("tier").value;
    const tiers = [...new Set(matches.map((m) => m.Tier))].sort();
    el("tier").replaceChildren(
      ...[["", "All tiers"], ...tiers.map((tier) => [tier, `Tier ${tier}`])].map(([value, label]) => {
        const option = UI.element("option", "", label);
        option.value = value;
        return option;
      })
    );
    el("tier").value = previous === "" || tiers.includes(previous) ? previous : tiers[0] || "";
  }

  function displayedRows() {
    return current.rows.slice().sort((a, b) => {
      const difference = sort.key === "Team" ? a.Team.localeCompare(b.Team) : a[sort.key] - b[sort.key];
      return difference * sort.direction || a.Pos - b.Pos;
    });
  }
  function value(row, key) {
    if (key === "GR" || key === "PPG") return Number.isFinite(row[key]) ? row[key].toFixed(3) : "∞";
    if (key === "GD" && row[key] > 0) return `+${row[key]}`;
    if (key === "Team") return row.Team + (row.Adjustment ? " *" : "");
    return String(row[key]);
  }

  function renderTable() {
    const table = el("table");
    table.replaceChildren();
    table.append(UI.element("caption", "", `${title} · ${subtitle}`));
    const head = document.createElement("thead"),
      headRow = document.createElement("tr");
    for (const column of columns) {
      const th = UI.element("th", column.detail ? "football-detail-column" : "");
      th.scope = "col";
      th.setAttribute("aria-sort", sort.key === column.key ? (sort.direction === 1 ? "ascending" : "descending") : "none");
      const button = UI.element("button", "", column.label);
      button.type = "button";
      button.title = column.full;
      button.setAttribute("aria-label", `Sort by ${column.full}`);
      button.addEventListener("click", () => {
        sort = { key: column.key, direction: column.key === "Pos" ? 1 : sort.key === column.key ? -sort.direction : column.key === "Team" ? 1 : -1 };
        renderTable();
        el("table").querySelectorAll("thead button")[columns.indexOf(column)].focus();
      });
      th.append(button);
      headRow.append(th);
    }
    head.append(headRow);
    table.append(head);
    const body = document.createElement("tbody");
    for (const row of displayedRows()) {
      const tr = document.createElement("tr");
      for (const column of columns) {
        const td = UI.element("td", column.detail ? "football-detail-column" : column.key === "Points" ? "football-points" : "");
        if (column.key === "Team") {
          const wrap = UI.element("div", "football-team");
          const img = UI.crest(row.Team, data.clubs);
          if (img) wrap.append(img);
          wrap.append(UI.element("span", "", value(row, column.key)));
          td.append(wrap);
          if (row.Adjustment) td.title = `${row.Adjustment > 0 ? "+" : ""}${row.Adjustment} points adjustment`;
        } else td.textContent = value(row, column.key);
        tr.append(td);
      }
      body.append(tr);
    }
    table.append(body);
  }

  function generate() {
    try {
      const config = period();
      if (UI.radio(form, "competition") === "tier") config.tier = el("tier").value;
      else {
        config.division = UI.matchName(el("division").value, [...new Set(data.matches.map((m) => m.Division))], "league");
        el("division").value = config.division;
      }
      current = D.leagueTable(data.matches, data.deductions, config);
      UI.url({ ...UI.periodParams(config), tier: config.division ? undefined : config.tier || "all", division: config.division });
      if (!current.rows.length) {
        el("output").hidden = true;
        status.textContent = "No matches found for this competition and period. Try another season, league or date range.";
        return;
      }
      const divisions = [...new Set(current.matches.map((m) => m.Division))];
      title = config.division || (divisions.length === 1 ? divisions[0] : config.tier ? `Tier ${config.tier}` : "All tiers");
      subtitle = `${UI.periodLabel(config)} · ${current.rows.length} teams · ${current.matches.length.toLocaleString("en-GB")} matches`;
      el("title").textContent = title;
      el("summary").textContent = subtitle;
      columns = [
        { key: "Pos", label: "Pos", full: "position" },
        { key: "Team", label: "Team", full: "team" },
        { key: "Played", label: "GP", full: "games played" },
        ...[
          ["Won", "W", "wins"],
          ["Drawn", "D", "draws"],
          ["Lost", "L", "losses"],
          ["GF", "GF", "goals for"],
          ["GA", "GA", "goals against"],
        ].map(([key, label, full]) => ({ key, label, full, detail: true })),
        {
          key: current.goalAverage ? "GR" : "GD",
          label: current.goalAverage ? "GR" : "GD",
          full: current.goalAverage ? "goal average" : "goal difference",
        },
        ...(current.ppg ? [{ key: "PPG", label: "PPG", full: "points per game" }] : []),
        { key: "Points", label: "Pts", full: "points" },
      ];
      const rule = current.ppg
        ? "Standings use points per game for the curtailed 2019/2020 season."
        : `Standings use points, then ${current.goalAverage ? "goal average" : "goal difference"}, then goals scored.`;
      el("rules").textContent = `${rule} Wins earn two points before 1981/1982 and three from that season onwards. ${
        divisions.length > 1 ? "This table combines multiple divisions. " : ""
      }${current.notes.join(" ")}`;
      const adjusted = current.rows.filter((row) => row.Adjustment);
      el("adjustments").hidden = !adjusted.length;
      el("adjustments").textContent = `* Points adjustments: ${adjusted
        .map((row) => `${row.Team} ${row.Adjustment > 0 ? "+" : ""}${row.Adjustment}`)
        .join("; ")}.`;
      sort = { key: "Pos", direction: 1 };
      renderTable();
      el("output").hidden = false;
      status.textContent = "Table ready. Change the filters to explore another season or period.";
    } catch (error) {
      status.textContent = error.message;
      el("output").hidden = true;
    }
  }

  function reset() {
    form.reset();
    el("season").value = data.seasons[0];
    UI.panels(form, "period");
    UI.panels(form, "competition");
    updateCompetitions();
    el("tier").value = "1";
    el("output").hidden = true;
    UI.url({});
    status.textContent = "Choose a period and competition to generate a table.";
  }

  function download() {
    // Draw a complete, sharp table even when the on-page mobile view is compact.
    const rows = displayedRows(),
      width = 1200,
      height = 150 + rows.length * 36 + 130;
    const canvas = document.createElement("canvas");
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    ctx.fillStyle = "#f7f8fa";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#24292f";
    ctx.font = "bold 25px sans-serif";
    ctx.fillText(title, 26, 42, width - 52);
    ctx.font = "16px sans-serif";
    ctx.fillText(subtitle, 26, 73, width - 52);
    const statsWidth = (width - 450) / (columns.length - 2);
    const x = (i) => (i === 0 ? 46 : i === 1 ? 88 : 430 + (i - 2) * statsWidth);
    columns.forEach((column, i) => {
      ctx.textAlign = i === 1 ? "left" : "center";
      ctx.fillText(column.label, x(i), 115);
    });
    rows.forEach((row, index) => {
      const top = 130 + index * 36;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(20, top, width - 40, 31);
      columns.forEach((column, i) => {
        ctx.textAlign = i === 1 ? "left" : "center";
        ctx.fillStyle = "#24292f";
        ctx.font = ["Team", "Points"].includes(column.key) ? "bold 16px sans-serif" : "16px sans-serif";
        ctx.fillText(value(row, column.key), x(i), top + 22, i === 1 ? 310 : statsWidth - 4);
      });
    });
    ctx.textAlign = "left";
    ctx.font = "14px sans-serif";
    const foot = 155 + rows.length * 36;
    ctx.fillText(
      current.ppg
        ? "Ordered by points per game (2019/2020)."
        : `Ordered by ${sort.key}. Standings use points, ${current.goalAverage ? "goal average" : "goal difference"}, then goals scored.`,
      26,
      foot,
      width - 52
    );
    if (current.rows.some((row) => row.Adjustment))
      ctx.fillText("* Includes recorded points adjustments. Details: seanelvidge.com/leaguetable", 26, foot + 25);
    ctx.fillText("English league results · seanelvidge.com/leaguetable", 26, foot + 52);
    canvas.toBlob((blob) => {
      if (!blob) {
        status.textContent = "The image could not be created. Please try again.";
        return;
      }
      const link = UI.element("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `league-table-${title.replace(/[^a-z0-9]+/gi, "-")}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (data) generate();
  });
  el("reset").addEventListener("click", reset);
  el("share").addEventListener("click", () => UI.share(status));
  el("download").addEventListener("click", download);
  el("details").addEventListener("click", () => {
    const full = el("table-panel").classList.toggle("football-all-columns");
    el("details").setAttribute("aria-pressed", String(full));
    el("details").textContent = full ? "Compact view" : "All columns";
  });
  form.querySelectorAll('input[name="competition"]').forEach((input) => input.addEventListener("change", () => UI.panels(form, "competition")));
  form
    .querySelectorAll('input[name="period"], #league-season, #league-start, #league-end')
    .forEach((input) => input.addEventListener("change", updateCompetitions));

  async function load() {
    el("retry").hidden = true;
    el("controls").disabled = true;
    status.textContent = "Loading league results and points adjustments…";
    try {
      data = await UI.load(true);
      period = UI.initPeriod("league", data, true);
      const params = new URLSearchParams(window.location.search);
      const legacy = params.get("start_year") || params.get("year");
      if (params.has("season") || legacy) el("season").value = params.get("season") || `${Number(legacy) - 1}/${Number(legacy)}`;
      if (params.has("startDate") || params.has("endDate")) {
        UI.chooseRadio(form, "period", "dates");
        el("start").value = params.get("startDate") || "";
        el("end").value = params.get("endDate") || "";
      }
      updateCompetitions();
      if (params.has("tier")) {
        const tier = params.get("tier");
        if (tier !== "all" && ![...el("tier").options].some((option) => option.value === tier))
          throw new Error("That tier is unavailable for the selected period.");
        el("tier").value = tier === "all" ? "" : tier;
      }
      if (params.has("division")) {
        UI.chooseRadio(form, "competition", "division");
        el("division").value = params.get("division");
      }
      UI.panels(form, "competition");
      el("controls").disabled = false;
      el("data-note").textContent = `Results through ${UI.date(data.matches[data.matches.length - 1].Date)}. Reload for new results.${
        data.colourWarning
      }`;
      generate();
    } catch (error) {
      status.textContent = error.message;
      el("retry").hidden = false;
      // A malformed shared filter should still allow editing once data is ready.
      if (data && period) el("controls").disabled = false;
    }
  }
  el("retry").addEventListener("click", load);
  load();
})();
