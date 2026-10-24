#!/usr/bin/env node
// Offline integrity check of a generated table against its exact local inputs.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const Match = require("../assets/js/match-probabilities-data.js");
const Simulation = require("../assets/js/league-simulation.js");
const { validateExampleRank } = require("./generate_table_probs.js");
const tablePath = process.argv[2];
const modelPath = process.argv[3];
if (!tablePath || !modelPath) throw new Error("Usage: node scripts/check_table_probs.js TABLE_JSON MODEL_JSON [AUDIT_JSON]");
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const table = JSON.parse(fs.readFileSync(tablePath, "utf8"));
const model = JSON.parse(fs.readFileSync(modelPath, "utf8"));
assert.equal(table.model_version, Match.MODEL_VERSION);
assert.equal(table.simulation_version, Simulation.VERSION);
assert.deepEqual(table.uncertainty, Simulation.DEFAULT_UNCERTAINTY);
assert.equal(table.model_sha256, sha(modelPath));
assert.equal(table.ranked_sha256, sha(path.join(path.dirname(modelPath), "EnglandLeagueResults_wRanks.csv")));
assert.equal(model.ranked_sha256, table.ranked_sha256);
assert.equal(table.deductions_sha256, sha(path.join(path.dirname(modelPath), "EnglishTeamPointDeductions.csv")));
assert.equal(table.last_result_date, model.as_of);
const generator = crypto.createHash("sha256");
for (const relative of ["generate_table_probs.js", "../assets/js/match-probabilities-data.js", "../assets/js/league-simulation.js"])
  generator.update(fs.readFileSync(path.join(__dirname, relative)));
assert.equal(table.generator_sha256, generator.digest("hex"));
let rowError = 0,
  columnError = 0,
  examples = 0,
  unobservedWithoutExample = 0,
  teams = 0,
  matches = 0;
for (const tier of table.tiers) {
  const n = tier.teams.length;
  teams += n;
  matches += tier.fixtures.length;
  const fixtures = tier.fixtures.map(([h, a, pH, pD, pA]) => {
    assert.ok(h >= 0 && h < n && a >= 0 && a < n && h !== a);
    assert.ok([pH, pD, pA].every((p) => Number.isFinite(p) && p >= 0 && p <= 1));
    assert.ok(Math.abs(pH + pD + pA - 1) < 1e-14);
    return { h, a, pH, pD, pA };
  });
  tier.teams.forEach((team, i) => {
    const p = tier.posProbs[team];
    assert.ok(p.every((v) => Number.isFinite(v) && v >= 0 && v <= 1));
    rowError = Math.max(rowError, Math.abs(p.slice(1).reduce((a, b) => a + b, 0) - 1));
    for (let k = 1; k <= n; k++) {
      if (tier.impossible[team][k]) assert.equal(p[k], 0);
      const example = tier.examples[team][k];
      if (example) {
        assert.ok(validateExampleRank(tier.teams, fixtures, tier.basePoints, example, i, k));
        examples++;
      } else if (!tier.impossible[team][k]) {
        assert.equal(p[k], 0);
        unobservedWithoutExample++;
      }
    }
  });
  for (let k = 1; k <= n; k++) columnError = Math.max(columnError, Math.abs(tier.teams.reduce((sum, team) => sum + tier.posProbs[team][k], 0) - 1));
}
assert.ok(rowError < 1e-12 && columnError < 1e-12);
const result = {
  model_version: table.model_version,
  simulation_version: table.simulation_version,
  settings: table.uncertainty,
  sims_per_tier: table.sims,
  tiers: table.tiers.length,
  teams,
  remaining_fixtures: matches,
  validated_examples: examples,
  unobserved_without_example: unobservedWithoutExample,
  max_row_sum_error: rowError,
  max_column_sum_error: columnError,
  input_and_source_hashes_match: true,
  table_sha256: sha(tablePath),
};
if (process.argv[4]) fs.writeFileSync(process.argv[4], JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
