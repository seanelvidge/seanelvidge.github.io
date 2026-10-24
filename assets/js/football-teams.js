// All club statistics and links work without JavaScript. This adds directory
// filtering and a local fallback for unavailable third-party crests.
(() => {
  const script = document.currentScript;
  const fallback = new URL("../img/blank-crest.png", script.src).href;
  document.querySelectorAll("[data-team-logo]").forEach((img) => {
    const useFallback = () => {
      if (img.src !== fallback) img.src = fallback;
    };
    img.addEventListener("error", useFallback);
    if (img.complete && img.naturalWidth === 0) useFallback();
  });

  const controls = document.querySelector(".team-directory-controls");
  if (!controls) return;
  const search = document.getElementById("team-search");
  const division = document.getElementById("team-division");
  const count = document.getElementById("team-search-count");
  const empty = document.getElementById("team-search-empty");
  const clubs = [...document.querySelectorAll("[data-team-search]")];
  const normalise = (value) =>
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  const filter = () => {
    const terms = normalise(search.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    clubs.forEach((club) => {
      const matches =
        terms.every((term) => normalise(club.dataset.teamSearch).includes(term)) &&
        (division.value === "all" || club.dataset.teamDivision === division.value);
      club.hidden = !matches;
      if (matches) visible++;
    });
    count.textContent = `${visible} ${visible === 1 ? "club" : "clubs"} shown`;
    empty.hidden = visible > 0;
  };
  controls.hidden = false;
  count.hidden = false;
  search.addEventListener("input", filter);
  division.addEventListener("change", filter);
  filter();
})();
