/* Football calculations shared by the league-table and head-to-head tools. */
(function (root) {
  "use strict";
  const dates = typeof module !== "undefined" && module.exports ? require("./team-rankings-data.js") : root.FootballRankingsData;

  function normaliseMatches(rows, now = Date.now()) {
    const matches = [];
    for (const row of rows) {
      const timestamp = dates.parseDate(row.Date);
      const home = String(row.HomeTeam || "").trim(),
        away = String(row.AwayTeam || "").trim();
      const h = String(row.hGoal ?? "").trim(),
        a = String(row.aGoal ?? "").trim();
      if (!Number.isFinite(timestamp) || timestamp > now || !home || !away || !/^\d+$/.test(h) || !/^\d+$/.test(a)) continue;
      if (!/^\d{4}\/\d{4}$/.test(row.Season || "")) continue;
      matches.push({
        Date: row.Date,
        timestamp,
        Season: row.Season,
        HomeTeam: home,
        AwayTeam: away,
        hGoal: Number(h),
        aGoal: Number(a),
        Division: String(row.Division || "").trim(),
        Tier: String(row.Tier || "").trim(),
      });
    }
    return matches.sort((a, b) => a.timestamp - b.timestamp);
  }

  function resolvePeriod({ mode, season, start, end }, seasons, league = false, today = new Date().toISOString().slice(0, 10)) {
    if (mode === "season") {
      if (!seasons.includes(season)) throw new Error("Choose a full season from the suggestions, such as 2023/2024.");
      return { mode, season };
    }
    if (mode === "all") return { mode };
    if (!start && !end && league) throw new Error("Enter a start or end date for the table.");
    if ((start && !Number.isFinite(dates.parseDate(start))) || (end && !Number.isFinite(dates.parseDate(end))))
      throw new Error("Enter valid start and end dates.");
    if (!start && end && league) {
      const year = Number(end.slice(0, 4)) - (Number(end.slice(5, 7)) < 7 ? 1 : 0);
      start = `${year}-07-01`;
      if (start < "1888-09-08") start = "1888-09-08";
    }
    start = start || "1888-09-08";
    end = end || today;
    if (start > end) throw new Error("The start date must be on or before the end date.");
    if (start < "1888-09-08" || end > today) throw new Error("Choose dates between 8 September 1888 and today.");
    return { mode: "dates", start, end };
  }

  function inPeriod(match, period) {
    return (
      (!period.season || match.Season === period.season) && (!period.start || match.Date >= period.start) && (!period.end || match.Date <= period.end)
    );
  }

  function leagueTable(matches, deductions, config) {
    let filtered = matches.filter(
      (m) => inPeriod(m, config) && (!config.tier || m.Tier === config.tier) && (!config.division || m.Division === config.division)
    );
    const notes = [];
    const withdrawals = { "1931/1932": ["3", "Wigan Borough"], "1961/1962": ["4", "Accrington Stanley"] };
    const withdrawal = withdrawals[config.season];
    if (withdrawal && filtered.some((m) => m.Tier === withdrawal[0] && [m.HomeTeam, m.AwayTeam].includes(withdrawal[1]))) {
      filtered = filtered.filter((m) => m.HomeTeam !== withdrawal[1] && m.AwayTeam !== withdrawal[1]);
      notes.push(`${withdrawal[1]}’s expunged results are excluded.`);
    }
    const stats = new Map();
    const blank = (Team) => ({ Team, Played: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, Points: 0, Adjustment: 0 });
    for (const m of filtered) {
      if (!stats.has(m.HomeTeam)) stats.set(m.HomeTeam, blank(m.HomeTeam));
      if (!stats.has(m.AwayTeam)) stats.set(m.AwayTeam, blank(m.AwayTeam));
      const home = stats.get(m.HomeTeam),
        away = stats.get(m.AwayTeam);
      home.Played++;
      away.Played++;
      home.GF += m.hGoal;
      home.GA += m.aGoal;
      away.GF += m.aGoal;
      away.GA += m.hGoal;
      // The change takes effect in 1981/82, including the two-point spring of 1981.
      const winPoints = Number(m.Season.slice(0, 4)) < 1981 ? 2 : 3;
      if (m.hGoal > m.aGoal) {
        home.Won++;
        home.Points += winPoints;
        away.Lost++;
      } else if (m.hGoal < m.aGoal) {
        away.Won++;
        away.Points += winPoints;
        home.Lost++;
      } else {
        home.Drawn++;
        away.Drawn++;
        home.Points++;
        away.Points++;
      }
    }
    if (config.season === "1919/1920" && (stats.has("Leeds City") || stats.has("Port Vale"))) {
      const combined = blank("Leeds City & Port Vale");
      for (const team of ["Leeds City", "Port Vale"]) {
        const row = stats.get(team);
        if (row) for (const key of ["Played", "Won", "Drawn", "Lost", "GF", "GA", "Points"]) combined[key] += row[key];
        stats.delete(team);
      }
      stats.set(combined.Team, combined);
      notes.push("Port Vale’s record includes the results inherited from Leeds City.");
    }
    const teamSeasons = new Map();
    for (const m of filtered)
      for (const team of [m.HomeTeam, m.AwayTeam]) {
        if (!teamSeasons.has(team)) teamSeasons.set(team, new Set());
        teamSeasons.get(team).add(m.Season);
      }
    for (const row of deductions) {
      const team = String(row.Team || "").trim();
      const points = Number(row.Pts_deducted);
      const applies = config.season ? row.Season === config.season : row.Date >= config.start && row.Date <= config.end;
      if (!applies || !Number.isFinite(points) || !teamSeasons.get(team)?.has(row.Season)) continue;
      const stat = stats.get(team);
      if (stat) {
        stat.Points -= points;
        stat.Adjustment -= points;
      }
    }
    const goalAverage = filtered.length > 0 && filtered.every((m) => Number(m.Season.slice(0, 4)) < 1976);
    const ppg = config.season === "2019/2020" && filtered.length > 0 && filtered.every((m) => m.Tier === "3" || m.Tier === "4");
    const rows = [...stats.values()];
    for (const row of rows) {
      row.GD = row.GF - row.GA;
      row.GR = row.GA ? row.GF / row.GA : row.GF ? Infinity : 0;
      row.PPG = row.Points / row.Played;
    }
    rows.sort(
      (a, b) =>
        (ppg ? b.PPG - a.PPG : b.Points - a.Points) || (goalAverage ? b.GR - a.GR : b.GD - a.GD) || b.GF - a.GF || a.Team.localeCompare(b.Team)
    );
    rows.forEach((row, i) => {
      row.Pos = i + 1;
    });
    return { rows, matches: filtered, goalAverage, ppg, notes };
  }

  function headToHead(matches, team1, team2, period = {}, premier = false) {
    const meetings = matches.filter(
      (m) =>
        ((m.HomeTeam === team1 && m.AwayTeam === team2) || (m.HomeTeam === team2 && m.AwayTeam === team1)) &&
        inPeriod(m, period) &&
        (!premier || m.Date >= "1992-08-01")
    );
    const stats = {
      wins: [0, 0],
      goals: [0, 0],
      draws: 0,
      biggest: [
        { margin: 0, matches: [] },
        { margin: 0, matches: [] },
      ],
      history: [[], []],
      meetings,
    };
    for (const m of meetings) {
      const goals = m.HomeTeam === team1 ? [m.hGoal, m.aGoal] : [m.aGoal, m.hGoal];
      stats.goals[0] += goals[0];
      stats.goals[1] += goals[1];
      if (goals[0] === goals[1]) stats.draws++;
      else {
        const winner = goals[0] > goals[1] ? 0 : 1;
        stats.wins[winner]++;
        const margin = Math.abs(goals[0] - goals[1]),
          record = stats.biggest[winner];
        if (margin > record.margin) {
          record.margin = margin;
          record.matches = [];
        }
        if (margin === record.margin) record.matches.push(m);
      }
      for (let i = 0; i < 2; i++) stats.history[i].push({ x: m.timestamp, y: stats.wins[i], match: m });
    }
    return stats;
  }

  const api = { normaliseMatches, resolvePeriod, inPeriod, leagueTable, headToHead };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.FootballResultsData = api;
})(globalThis);
