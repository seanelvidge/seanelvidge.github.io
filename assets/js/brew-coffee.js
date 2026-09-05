(function () {
  "use strict";
  const el = (id) => document.getElementById(`coffee-${id}`);
  const form = el("form"),
    status = el("status");
  const checkboxes = [...form.querySelectorAll('input[name="tastingNotes"]')];
  const groups = [...form.querySelectorAll(".coffee-note-group")];
  let selection, recipes, searchOpenState;
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const unit = () => document.querySelector('input[name="coffee-unit"]:checked').value;
  const fields = [
    ["brewRatio", "Coffee-to-water ratio"],
    ["grind", "Relative grind adjustment"],
    ["bloomRatio", "Bloom ratio"],
    ["bloomTime", "Bloom time"],
    ["bloomTemp", "Bloom temperature"],
    ["pulses", "Number of pulses"],
    ["pulseInterval", "Time between pulses"],
    ["pulseTemps", "Pulse temperatures"],
  ];
  function format(key, value) {
    if (key === "brewRatio" || key === "bloomRatio") return `1:${value.toFixed(1)}`;
    if (key === "grind") return value === 0 ? "0 · usual setting" : `${value > 0 ? "+" : ""}${value} · ${value < 0 ? "finer" : "coarser"}`;
    if (key === "bloomTime" || key === "pulseInterval") return `${value} seconds`;
    if (key === "bloomTemp") return `${CoffeeRecipe.temperatures(value, unit())} °${unit()}`;
    if (key === "pulseTemps") return `${CoffeeRecipe.temperatures(value, unit()).join(", ")} °${unit()}`;
    return String(value);
  }
  function filterNotes() {
    const query = el("note-search").value.trim().toLowerCase();
    if (query && !searchOpenState) searchOpenState = groups.map((group) => group.open);
    let count = 0;
    groups.forEach((group, i) => {
      let matches = 0;
      group.querySelectorAll("label").forEach((label) => {
        label.hidden = !label.textContent.toLowerCase().includes(query);
        if (!label.hidden) matches++;
      });
      group.hidden = matches === 0;
      if (query) group.open = matches > 0;
      else if (searchOpenState) group.open = searchOpenState[i];
      count += matches;
    });
    if (!query) searchOpenState = null;
    el("no-notes").hidden = count > 0;
  }
  function selectedNotes() {
    const selected = checkboxes.filter((input) => input.checked);
    el("note-count").textContent = selected.length ? `${selected.length} note${selected.length === 1 ? "" : "s"} selected` : "No notes selected";
    el("clear-notes").hidden = !selected.length;
    el("selected-notes").replaceChildren(
      ...selected.map((input) => {
        const button = node("button", "", `${input.parentElement.textContent.trim()} ×`);
        button.type = "button";
        button.setAttribute("aria-label", `Remove ${input.parentElement.textContent.trim()}`);
        button.addEventListener("click", () => {
          input.checked = false;
          selectedNotes();
          markChanged();
          el("note-search").focus();
        });
        return button;
      })
    );
  }
  function markChanged() {
    if (!recipes) return;
    el("output").hidden = true;
    status.textContent = "Options changed. Generate recipes to update all three versions.";
  }
  function readInputs() {
    const roast = form.querySelector('input[name="roast"]:checked')?.value;
    if (!roast) throw new Error("Choose a roast level.");
    const min = el("altitude-min").value === "" ? null : el("altitude-min").valueAsNumber;
    const max = el("altitude-max").value === "" ? null : el("altitude-max").valueAsNumber;
    if ([min, max].some((value) => value !== null && (!Number.isFinite(value) || value < 0)))
      throw new Error("Altitude must be a non-negative number.");
    if (min !== null && max !== null && min > max) throw new Error("The maximum altitude must be at least the minimum.");
    return {
      name: el("name").value.trim(),
      roast,
      country: el("country").value.trim(),
      processing: el("processing").value,
      altitude: min !== null && max !== null ? (min + max) / 2 : min ?? max,
      tastingNotes: checkboxes.filter((input) => input.checked).map((input) => input.value),
    };
  }
  function description() {
    return [
      `${selection.roast.replace("-", "–")} roast`,
      selection.country,
      selection.processing,
      selection.altitude !== null ? `${selection.altitude} m altitude` : "",
      selection.tastingNotes.length ? selection.tastingNotes.join(", ") : "",
    ]
      .filter(Boolean)
      .join(" · ");
  }
  function render() {
    const baseline = recipes[1].recipe;
    el("output-title").textContent = selection.name ? `Recipes for ${selection.name}` : "Your brewing recipes";
    el("summary").textContent = description();
    el("recipes").replaceChildren(
      ...recipes.map((age) => {
        const card = node("article", "football-panel coffee-recipe");
        card.dataset.age = age.id;
        const header = node("header");
        header.append(node("h3", "", age.label), node("p", "rankings-note", age.range));
        card.append(header);
        const list = node("dl");
        fields.forEach(([key, label]) => {
          const row = node("div", "coffee-recipe-row"),
            term = node("dt", "", label),
            value = node("dd");
          // Compare final, displayed values after all adjustments, limits and unit conversion.
          const changed = age.id !== "rested" && format(key, age.recipe[key]) !== format(key, baseline[key]);
          if (changed) term.append(node("span", "coffee-changed", "Changed"));
          if (key === "pulseTemps") {
            value.className = "coffee-pulses";
            CoffeeRecipe.temperatures(age.recipe[key], unit()).forEach((temperature, index) => {
              const pulse = node("span", "coffee-pulse");
              pulse.append(node("small", "", `Pulse ${index + 1}`), node("span", "", `${temperature} °${unit()}`));
              value.append(pulse);
            });
          } else value.textContent = format(key, age.recipe[key]);
          row.append(term, value);
          list.append(row);
        });
        card.append(list);
        return card;
      })
    );
    el("output").hidden = false;
  }
  function recipeText() {
    return [
      el("output-title").textContent,
      description(),
      ...recipes.map(
        (age) => `\n${age.label} (${age.range})\n` + fields.map(([key, label]) => `${label}: ${format(key, age.recipe[key])}`).join("\n")
      ),
      "\nGrind: 0 is your usual pour-over setting; negative is finer and positive is coarser. Adjustments are capped at -16 to +16, not calibrated grinder clicks.",
      "Bloom ratio is limited to 1:3 for the Fellow brewer. Each tasting-note rule applies once, even when several matching notes are selected.",
      "Recipe presets are starting points; adjust to taste. Age alone does not determine freshness.",
    ].join("\n");
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      selection = readInputs();
      recipes = CoffeeRecipe.compare(selection);
      render();
      status.textContent = "Three recipes ready: under 2 weeks, 2–6 weeks, and over 6 weeks after roasting.";
      // Move to the result without trapping touch scrolling or animating for reduced-motion users.
      el("output").scrollIntoView({ block: "start", behavior: "instant" });
    } catch (error) {
      el("output").hidden = true;
      status.textContent = error.message;
    }
  });
  el("note-search").addEventListener("input", filterNotes);
  form.addEventListener("input", (event) => {
    if (event.target === el("note-search")) return;
    if (event.target.name === "tastingNotes") selectedNotes();
    markChanged();
  });
  el("clear-notes").addEventListener("click", () => {
    checkboxes.forEach((input) => {
      input.checked = false;
    });
    selectedNotes();
    markChanged();
    el("note-search").focus();
  });
  el("reset").addEventListener("click", () => {
    form.reset();
    selection = recipes = null;
    filterNotes();
    selectedNotes();
    el("output").hidden = true;
    document.querySelector('input[name="coffee-unit"][value="C"]').checked = true;
    status.textContent = "Options cleared. Choose a roast level to start again.";
    form.querySelector('input[name="roast"]').focus();
  });
  document.querySelectorAll('input[name="coffee-unit"]').forEach((input) =>
    input.addEventListener("change", () => {
      if (recipes) render();
    })
  );
  el("download").addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([recipeText()], { type: "text/plain;charset=utf-8" }));
    const link = node("a");
    link.href = url;
    link.download = (selection.name.replace(/[^a-z0-9_-]+/gi, "_").slice(0, 80) || "Coffee") + "_recipes.txt";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = "Downloaded all three recipes.";
  });
  el("copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(recipeText());
      status.textContent = "All three recipes copied.";
    } catch {
      status.textContent = "Copying is unavailable in this browser. Use Download all three recipes instead.";
    }
  });
})();
