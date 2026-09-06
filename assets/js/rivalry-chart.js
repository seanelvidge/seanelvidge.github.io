(function () {
  "use strict";
  const root = document.getElementById("rivalry-wins"),
    display = document.getElementById("rivalry-chart-display"),
    status = document.getElementById("rivalry-chart-status");
  if (!root) return;
  try {
    // The theme also bundles a legacy Chart constructor; it cannot render this
    // chart if the current Chart.js download fails.
    if (typeof window.Chart?.getChart !== "function" || !window.luxon || !window.FootballWinHistory) {
      throw new Error("Chart library unavailable");
    }
    const payload = JSON.parse(document.getElementById("rivalry-chart-data").textContent);
    const history = FootballWinHistory.fromRows(payload.teams, payload.rows);
    // Use the existing accessible fallback palette: no additional data source
    // is needed for the rivalry chart, and all results come from the page build.
    const styles = [FootballRankingsData.chooseStyle()];
    styles.push(FootballRankingsData.chooseStyle({}, styles));
    display.hidden = false;
    const chart = new Chart(
      document.getElementById("rivalry-history"),
      FootballWinHistory.config({
        teams: payload.teams,
        history,
        styles,
        theme: () => FootballTools.theme(root),
        date: FootballTools.date,
      })
    );
    new MutationObserver(() => FootballWinHistory.updateTheme(chart, FootballTools.theme(root))).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    status.hidden = true;
  } catch (error) {
    display.hidden = true;
    status.textContent = "The chart could not load. All statistics and recent results are still available on this page; reload to try again.";
    console.warn("Rivalry chart unavailable:", error);
  }
})();
