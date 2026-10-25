// Shared by the build and the 404 page, so typed names resolve consistently.
(() => {
  function normaliseName(value) {
    const name = String(value).normalize("NFKC").trim();
    if (!name || !/^[\p{L}\p{N} &'()._-]+$/u.test(name) || name.includes("..")) return null;
    return (
      name
        .replace(/\.+$/, "")
        .replace(/[\s_-]+/g, "")
        .toLowerCase() || null
    );
  }

  function resolvePath(pathname, aliases, teamsRoot = "/teams/") {
    if (pathname === teamsRoot.slice(0, -1)) return teamsRoot;
    if (!pathname.startsWith(teamsRoot)) return null;
    let name = pathname.slice(teamsRoot.length).replace(/\/$/, "");
    try {
      name = decodeURIComponent(name);
    } catch (_) {
      return teamsRoot;
    }
    const key = normaliseName(name);
    return key && Object.hasOwn(aliases, key) ? aliases[key] : teamsRoot;
  }

  if (typeof module === "object" && module.exports) {
    module.exports = { normaliseName, resolvePath };
    return;
  }

  const direct = document.currentScript?.dataset.teamRedirect;
  if (direct) {
    window.location.replace(direct);
    return;
  }
  const element = document.getElementById("football-team-route-data");
  if (!element) return;
  const config = JSON.parse(element.textContent);
  const target = resolvePath(window.location.pathname, config.aliases, config.teamsRoot);
  if (target !== null) window.location.replace(target);
  else window.setTimeout(() => window.location.replace(config.home), 3000);
})();
