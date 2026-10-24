const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");
const Match = require("../assets/js/match-probabilities-data.js");
const League = require("./generate_table_probs.js");
const Simulation = require("../assets/js/league-simulation.js");
const fixtures = require("./fixtures/prediction-parity.json");

test("browser probabilities and calendar forecasts agree with Python production calculations", () => {
  for (const c of fixtures) {
    const actual = Match.fromSnapshot(c.model, "Home", "Away", c.date, c.tier);
    actual.forEach((value, i) => assert.ok(Math.abs(value - c.expected[i]) < 2e-14));
    const forecast = Match.forecastTeam(c.model.teams.Home, c.date, c.model, c.tier);
    assert.ok(Math.abs(forecast.skill - c.forecast[0]) < 2e-14);
    assert.ok(Math.abs(forecast.variance - c.forecast[1]) < 2e-14);
  }
  assert.throws(() => Match.fromSnapshot({ ...fixtures[0].model, model_version: "old" }, "Home", "Away"), /refreshed/);
  assert.throws(() => Match.forecastTeam(fixtures[0].model.teams.Home, "1888-01-01", fixtures[0].model), /precedes/);
  assert.ok(Match.fromSkills(10000, -10000, 0.5, -0.3).every(Number.isFinite));
});

function exactPositions(teams, basePoints, fixtures) {
  const expected = teams.map(() => Array(teams.length + 1).fill(0));
  function visit(index, points, probability) {
    if (index === fixtures.length) {
      points.forEach((value, team) => {
        const above = points.filter((p) => p > value).length;
        const tied = points.filter((p) => p === value).length;
        for (let position = above + 1; position <= above + tied; position++) expected[team][position] += probability / tied;
      });
      return;
    }
    const f = fixtures[index];
    [f.pH, f.pD, f.pA].forEach((p, result) => {
      const next = [...points];
      next[f.h] += [3, 1, 0][result];
      next[f.a] += [0, 1, 3][result];
      visit(index + 1, next, probability * p);
    });
  }
  visit(0, basePoints, 1);
  return expected;
}

test("joint season simulation agrees with exhaustive enumeration, including random ties", () => {
  const teams = ["A", "B", "C"];
  const fixtures = [
    { h: 0, a: 1, pH: 0.5, pD: 0.2, pA: 0.3 },
    { h: 1, a: 2, pH: 0.4, pD: 0.3, pA: 0.3 },
    { h: 2, a: 0, pH: 0.3, pD: 0.3, pA: 0.4 },
  ];
  const exact = exactPositions(teams, [3, 2, 1], fixtures);
  const sims = 100000;
  const first = League.computePositionProbabilitiesMC(teams, [3, 2, 1], fixtures, sims, "enumeration");
  const second = League.computePositionProbabilitiesMC(teams, [3, 2, 1], fixtures, sims, "enumeration");
  assert.deepEqual(first, second);
  teams.forEach((team, i) => {
    const row = first.posProbs[team];
    assert.ok(Math.abs(row.reduce((a, b) => a + b, 0) - 1) < 1e-12);
    for (let position = 1; position <= 3; position++) {
      const p = exact[i][position];
      assert.ok(Math.abs(row[position] - p) < 6 * Math.sqrt((p * (1 - p)) / sims) + 1 / sims);
    }
  });
  for (let position = 1; position <= 3; position++) assert.ok(Math.abs(teams.reduce((s, t) => s + first.posProbs[t][position], 0) - 1) < 1e-12);
});

test("completed seasons retain tied possible places and points; example checks accept any random tie order", () => {
  const sim = League.computePositionProbabilitiesMC(["A", "B", "C"], [4, 4, 1], [], 20000, "ties");
  assert.ok(Math.abs(sim.posProbs.A[1] - 0.5) < 0.02);
  assert.equal(sim.posProbs.C[3], 1);
  assert.equal(sim.pointSummary[0].mean, 4);
  assert.ok(League.validateExampleRank(["A", "B", "C"], [], [4, 4, 1], [], 0, 2));
  assert.equal(League.validateExampleRank(["A", "B", "C"], [], [4, 4, 1], [], 0, 3), false);
  assert.throws(() => League.computePositionProbabilitiesMC(["A", "B"], [0, 0], [], 0, "bad"), /positive/);
});

test("remaining fixtures use both venues and points include known deductions and unplayed teams", () => {
  const played = [{ HomeTeam: "A", AwayTeam: "B", Result: "H" }];
  assert.equal(League.inferRemainingFixturesDoubleRoundRobin(played, ["A", "B", "C"]).length, 5);
  assert.deepEqual(League.computePointsSoFar(played, { "2020/2021": { A: -2 } }, "2020/2021", ["A", "B", "C"]), { A: 1, B: 0, C: 0 });
});

test("mismatched model and ranking builds fail without overwriting the published forecast", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "football-inputs-"));
  try {
    const output = path.join(dir, "out.json");
    fs.writeFileSync(output, "keep existing forecast");
    fs.writeFileSync(path.join(dir, "ranked.csv"), "Date,Season\n2020-01-01,2019/2020\n");
    fs.writeFileSync(path.join(dir, "deductions.csv"), "Season,Team,Pts_deducted\n");
    fs.writeFileSync(path.join(dir, "model.json"), JSON.stringify({ model_version: Match.MODEL_VERSION, ranked_sha256: "wrong" }));
    const run = spawnSync(process.execPath, [path.join(__dirname, "generate_table_probs.js")], {
      encoding: "utf8",
      env: {
        ...process.env,
        FOOTBALL_RANKED_CSV: path.join(dir, "ranked.csv"),
        FOOTBALL_DEDUCTIONS_CSV: path.join(dir, "deductions.csv"),
        FOOTBALL_MODEL_JSON: path.join(dir, "model.json"),
        TABLE_PROBS_OUT: output,
      },
    });
    assert.equal(run.status, 1);
    assert.match(run.stderr, /different builds/);
    assert.equal(fs.readFileSync(output, "utf8"), "keep existing forecast");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("all live prediction entrypoints use the shared versioned model", () => {
  for (const relative of ["../assets/js/match-probabilities.js", "../_pages/tableProbs.md", "generate_table_probs.js", "solve_target_position.js"]) {
    const source = fs.readFileSync(path.join(__dirname, relative), "utf8");
    assert.match(source, /\.fromSnapshot\(/);
    assert.doesNotMatch(source, /function (deltaBaseAndKappa|predictProbs|eraProbsFromYear)/);
  }
});

test("one shared uncertain strength per season agrees with independent Gaussian quadrature", () => {
  const exact = require("./fixtures/season-uncertainty.json");
  const { strength } = exact;
  const fixtures = [
    [0, 1],
    [1, 0],
  ].map(([h, a]) => {
    const [pH, pD, pA] = Match.fromSkills(strength.means[h], strength.means[a], strength.homeAdvantage, strength.logDraw, strength.beta);
    return { h, a, pH, pD, pA };
  });
  const sims = 200000;
  const sim = Simulation.computePositionProbabilitiesMC(["A", "B"], [0, 0], fixtures, sims, "shared-strength-quadrature", strength);
  const fixed = Simulation.computePositionProbabilitiesMC(["A", "B"], [0, 0], fixtures, sims, "shared-strength-quadrature");
  exact.points.forEach((p, i) => assert.ok(Math.abs(sim.pointDistribution[0][i] - p) < 6 * Math.sqrt((p * (1 - p)) / sims) + 1 / sims));
  assert.ok(Math.abs(sim.pointSummary[0].mean - exact.mean) < 0.025);
  assert.ok(Math.abs(sim.pointSummary[0].variance - exact.variance) < 0.05);
  assert.ok(sim.pointSummary[0].variance > fixed.pointSummary[0].variance + 0.3);
  assert.ok(Math.abs(sim.posProbs.A[1] - exact.positions[1]) < 0.01);
  const zero = Simulation.computePositionProbabilitiesMC(["A", "B"], [0, 0], fixtures, sims, "shared-strength-quadrature", {
    ...strength,
    variances: [0, 0],
  });
  assert.deepEqual(zero, fixed);
});

test("average OU process uncertainty matches numerical integration and vanishes at zero horizon", () => {
  const rho = 0.995,
    q = 0.0017,
    a = -Math.log(rho);
  for (const weeks of [0.01, 1, 10, 40]) {
    const steps = 10000,
      dt = weeks / steps;
    let numerical = 0;
    for (let i = 0; i < steps; i++) numerical += ((-Math.expm1(-a * (i + 0.5) * dt) / (a * weeks)) ** 2 * dt * 2 * a * q) / (1 - rho ** 2);
    const actual = Simulation.averageProcessVariance(weeks, rho, q);
    assert.ok(Math.abs(actual - numerical) < 1e-9, `${weeks}: ${actual} vs ${numerical}`);
  }
  assert.equal(Simulation.averageProcessVariance(0, rho, q), 0);
  assert.ok(Simulation.averageProcessVariance(40, rho, q) > Simulation.averageProcessVariance(10, rho, q));
});

test("browser and generator use the same uncertain-strength simulator", () => {
  assert.equal(League.computePositionProbabilitiesMC, Simulation.computePositionProbabilitiesMC);
  const page = fs.readFileSync(path.join(__dirname, "../_pages/tableProbs.md"), "utf8");
  assert.match(page, /LeagueSimulation\.computePositionProbabilitiesMC/);
  assert.match(page, /LeagueSimulation\.strengthDistribution/);
  assert.doesNotMatch(page, /function computePositionProbabilitiesMC/);
  assert.match(page, /simulation_version !== LeagueSimulation\.VERSION/);
});
