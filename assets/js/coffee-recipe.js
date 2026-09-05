/* Recipe heuristics with owner-approved age bands and limits; temperatures are stored in Celsius. */
(function (root) {
  "use strict";
  const ROASTS = ["light", "light-medium", "medium", "medium-dark", "dark"];
  const AGE_LIMITS = { fresh: 14, rested: 42 };
  const GRIND_LIMIT = 16;
  const AGES = [
    { id: "fresh", label: "Fresh coffee", range: "Under 2 weeks (0–13 days)", days: 7 },
    { id: "rested", label: "Medium-rested coffee", range: "2–6 weeks (14–42 days)", days: 28 },
    { id: "aged", label: "Long-term coffee", range: "Over 6 weeks (43+ days)", days: 49 },
  ];
  function calculate({ roast, country = "", altitude = null, processing = "", daysRoasted = NaN, tastingNotes = [] }) {
    if (!ROASTS.includes(roast)) throw new Error("Choose a roast level.");
    if (altitude !== null && (!Number.isFinite(altitude) || altitude < 0)) throw new Error("Altitude must be a non-negative number.");
    let brewRatio, bloomRatio, bloomTime, bloomTemp, pulses, pulseInterval, grind; //, pulseTemps;
    if (roast === "light") {
      // Light Roast defaults: less extraction needed; higher bloom to overcome dense structure.
      brewRatio = 17;
      bloomRatio = 3.5; // Starting heuristic; the final ratio is capped at the brewer's 1:3 limit.
      bloomTime = 60; // Longer bloom for extended extraction.
      bloomTemp = 99;
      pulses = 6; // More pulses for full extraction.
      pulseInterval = 35; // Adjust time between pulses to control extraction speed, from higher -> low
      //pulseTemps = [99, 99, 99];
      grind = 0;
    } else if (roast === "light-medium") {
      // Light-Medium Roast defaults: slightly lower than light, but still robust extraction.
      brewRatio = 16.5;
      bloomRatio = 3;
      bloomTime = 55;
      bloomTemp = 97.5;
      pulses = 5;
      pulseInterval = 32.5;
      //pulseTemps = [97.5, 97.5, 97.5];
      grind = 0;
    } else if (roast === "medium") {
      // Medium Roast defaults: balanced extraction.
      brewRatio = 16;
      bloomRatio = 2.5;
      bloomTime = 50;
      bloomTemp = 96;
      pulses = 4;
      pulseInterval = 30;
      //pulseTemps = [96, 96, 96];
      grind = 0;
    } else if (roast === "medium-dark") {
      // Medium-Dark Roast defaults: slightly more aggressive extraction early on.
      brewRatio = 15.5;
      bloomRatio = 2;
      bloomTime = 45;
      bloomTemp = 97.5;
      pulses = 3;
      pulseInterval = 27.5;
      //pulseTemps = [90.5, 90.5, 90.5];
      grind = 0;
    } else if (roast === "dark") {
      // Dark Roast defaults: lower extraction due to brittle structure.
      brewRatio = 15; // Increase dose to increase strenght, after lowing strength by having a coarser grind
      bloomRatio = 1.5;
      bloomTime = 40;
      bloomTemp = 99; // Start with very hot bloom to increase complexity in the cup
      pulses = 3; // Fewer pulses to prevent bitterness.
      pulseInterval = 25;
      //pulseTemps = [85, 85, 85];
      grind = 0;
    } else {
      console.log("Something went very badly wrong, you should never be able to get to this message");
    }

    if (country != "") {
      // ---- Country of Origin Adjustments ----
      // Adjust based on bean density and solubility (e.g., East African beans are denser).
      const countryLC = country.toLowerCase();
      if (["ethiopia", "kenya", "rwanda", "burundi"].some((ctry) => countryLC.includes(ctry))) {
        bloomRatio -= 0.5; // Lower bloom ratio for high-solubility East African beans.
        bloomTime -= 5; // Shorter bloom to avoid over-extraction.
        bloomTemp -= 3; // Lower bloom temperature to control acidity.
        pulses = Math.max(pulses - 1, 2); // Fewer pulses to prevent over-extraction.
      } else if (["brazil", "colombia", "guatemala"].some((ctry) => countryLC.includes(ctry))) {
        bloomRatio += 0.5; // Higher bloom ratio for softer, Latin American beans.
        bloomTime += 5; // Longer bloom for full degassing.
        bloomTemp += 3; // Higher bloom temperature for enhanced extraction.
        pulses = Math.min(pulses + 1, 6); // More pulses for even extraction.
      } else if (["indonesia", "sumatra", "java"].some((ctry) => countryLC.includes(ctry))) {
        bloomRatio = 2.5; // Indonesian beans: robust extraction with moderate bloom.
        bloomTime = 50;
        // bloomTemp = 95;     // Do we want a specific temperature for this location?
        pulses = Math.min(pulses + 1, 6);
      }
    }

    // ---- Altitude Adjustments ----
    // Higher-altitude beans are denser, requiring stronger extraction.
    if (altitude !== null) {
      if (altitude > 1500) {
        brewRatio -= 0.5; // Stronger ratio for denser, high-altitude beans.
        bloomRatio += 0.5; // Increase bloom ratio to assist in degassing.
        bloomTime += 5; // Longer bloom for thorough CO2 release.
        bloomTemp += 1.5; // Hotter bloom water helps initial extraction.
        pulses = Math.max(pulses, 4); // Ensure enough pulses.
        grind -= 2; // High-elevation coffee are denser and require finer grinds for optimal extraction.
      } else if (altitude < 1200) {
        brewRatio += 0.5; // Weaker ratio for softer, low-altitude beans.
        bloomRatio = Math.max(bloomRatio - 0.5, 1.5); // Reduce bloom ratio.
        bloomTime = Math.max(bloomTime - 5, 20); // Shorten bloom time.
        pulses = Math.max(pulses - 1, 2); // Fewer pulses.
        grind += 2; // Low-elevation coffee extract more quickly, so a coarser grind prevents over-extraction.
      }
    }

    // ---- Processing Method Adjustments ----
    if (processing !== "") {
      // Natural, Honey, Carbonic, and Anaerobic methods retain more sugars, needing longer bloom.
      if (processing === "Natural" || processing.includes("Honey") || processing === "Carbonic" || processing === "Anaerobic") {
        bloomRatio = Math.max(bloomRatio + 0.5, 2.5); // Ensure sufficient water for degassing.
        bloomTime = Math.max(bloomTime + 5, 45); // Extend bloom time.
        pulses = Math.min(pulses + 1, 6); // Increase pulses to control uneven extraction.
      } else if (processing === "Washed" || processing === "Double Fermentation" || processing === "Wet-Hulled") {
        bloomRatio -= 0.5; // Cleaner beans need less bloom.
        bloomTime -= 5; // Shorter bloom time.
        pulses = Math.max(pulses - 1, 2); // Fewer pulses.

        // Monsooned: more porous / lower density / “aged” character -> easier to extract, less need for degassing,
        // prefer gentler temps + more, smaller pulses for control.
      } else if (processing === "Monsooned" || processing.includes("Monsoon")) {
        bloomRatio = Math.max(bloomRatio + 0.5, 2.5); // Slightly higher bloom ratio to fully wet/saturate porous beans.
        bloomTime = Math.max(bloomTime - 5, 30); // Slightly shorter bloom time (typically less trapped CO₂).
        pulses = Math.min(pulses + 1, 6); // More pulses (smaller pours) to avoid over-extracting early.
        bloomTemp -= 2; // Slightly lower bloom temperature for control.
      }

      // Grind settings for processing is in different groups
      if (
        processing === "Washed" ||
        processing.includes("White") ||
        processing.includes("Yellow") ||
        processing.includes("Fermentation") ||
        processing === "Carbonic"
      ) {
        grind -= 4; // Clean and bright flavor profiles benefit from a slower extraction.
      } else if (processing.includes("Red") || processing.includes("Black") || processing === "Pulped Natural") {
        grind -= 2; // Balances sweetness and body while ensuring clarity.
      } else if (processing === "Natural") {
        grind += 2; // Naturally processed coffees have more body and fruitiness, which can become muddled if over-extracted.
      } else if (processing === "Wet-Hulled") {
        grind += 4; // Heavy-bodied and earthy coffees can become too bitter if over-extracted.
      } else if (processing === "Monsooned" || processing.includes("Monsoon")) {
        grind -= 2; // More porous/easier extraction: slightly finer can help keep strength at gentler temps.
      }
    }

    // ---- Roasting Level Adjustments ----
    // Roast profiles for grind size is also different
    if (roast == "light") {
      grind -= 4;
    } else if (roast == "light-medium") {
      grind -= 2;
    } else if (roast == "medium-dark") {
      grind += 2;
    } else if (roast == "dark") {
      grind += 4;
    }

    // ---- Days Since Roasted Adjustments ----
    // Adjust based on bean freshness (CO2 levels affect extraction dynamics).
    // Owner-selected presets, not universal freshness thresholds:
    // fresh <14 days; medium 14–42 days inclusive; long-term >42 days.
    // Keep the existing adjustments, moving the temperature drop to the long-term band.
    if (!isNaN(daysRoasted)) {
      if (daysRoasted >= 0 && daysRoasted < AGE_LIMITS.fresh) {
        bloomRatio += 0.5; // Math.max(bloomRatio, 2.5);      // Increase bloom ratio for extra degassing.
        bloomTime += 5; // Math.max(bloomTime, 45);         // Extend bloom time.
        if (bloomTemp < 92) {
          bloomTemp = 92;
        } // Ensure higher temperature for fresh beans.
        pulses = Math.max(pulses - 1, 2); // Fewer pulses to manage rapid CO2 release.
        grind -= 4;
      } else if (daysRoasted > AGE_LIMITS.rested) {
        // The medium-rested band does not need an age adjustment.
        bloomRatio -= 0.5; // Math.min(bloomRatio, 1.5);    // Minimal bloom needed.
        bloomTime -= 5; // Math.min(bloomTime, 25);      // Shorter bloom time.
        bloomTemp = Math.min(bloomTemp, 87); // Lower temperature to avoid over-extraction.
        pulses = Math.min(pulses + 1, 6); // Increase pulses to maintain even extraction.
        grind += 4;
      }
    }

    // ---- Tasting Notes Adjustments ----
    // Apply each trait once, regardless of how many selected notes match it.
    // Descriptors are not intensity scores. Different traits may still combine.
    // Additional presets reuse the existing family heuristics; generic "Other"
    // notes trigger only that family's broad rule, not a guessed sub-trait.
    const fruityNotes = [
      "Strawberry",
      "Blueberry",
      "Raspberry",
      "Blackberry",
      "Lemon",
      "Orange",
      "Grapefruit",
      "Lime",
      "Peach",
      "Apricot",
      "Cherry",
      "Plum",
      "Mango",
      "Pineapple",
      "Papaya",
      "Passionfruit",
      "Blackcurrant",
      "Grape",
      "Lychee",
      "Nectarine",
      "Mandarin",
      "Other Fruity",
    ];
    const nuttyChocoNotes = [
      "Almond",
      "Hazelnut",
      "Walnut",
      "Peanut",
      "Chocolate Dark",
      "Chocolate Milk",
      "Cocoa Powder",
      "Cashew",
      "Pecan",
      "Pistachio",
      "Other Nutty & Chocolate",
    ];
    const floralHerbalNotes = [
      "Jasmine",
      "Lavender",
      "Rose",
      "Chamomile",
      "Hibiscus",
      "Mint",
      "Basil",
      "Thyme",
      "Bergamot",
      "Black Tea",
      "Green Tea",
      "Orange Blossom",
      "Other Floral & Herbal",
    ];
    const heavySweetNotes = ["Molasses", "Maple Syrup", "Caramel", "Honey", "Fig", "Raisin", "Toffee", "Butterscotch", "Other Sweet & Caramel"];
    const brightCleanNotes = ["Apple", "Pear", "Peach", "Passionfruit", "Jasmine", "Hibiscus", "White Wine"];
    const deepHeavyNotes = ["Chocolate Dark", "Maple Syrup", "Molasses", "Tobacco", "Leather"];
    const acidityNotes = ["Lemon", "Orange", "Lime", "Passionfruit", "White Wine", "Mandarin"];
    const creamyNotes = ["Walnut", "Peanut", "Butter", "Cream", "Coconut", "Other Creamy"];

    if (tastingNotes.some((note) => fruityNotes.includes(note))) {
      brewRatio += 0.5; // More water highlights bright, acidic notes.
      bloomTemp += 2; // Higher temperature boosts fruity extraction.
      grind -= 4;
    }
    if (tastingNotes.some((note) => nuttyChocoNotes.includes(note))) {
      brewRatio -= 0.5; // Less water to enhance body and richness.
      grind += 2;
    }
    if (tastingNotes.some((note) => floralHerbalNotes.includes(note))) {
      bloomRatio += 0.5; // Extra water in bloom to extract delicate aromatics.
      grind += 2;
    }
    if (tastingNotes.some((note) => heavySweetNotes.includes(note))) {
      bloomRatio -= 0.5; // Lower bloom preserves syrupy body.
      grind -= 2;
    }
    if (tastingNotes.some((note) => acidityNotes.includes(note))) {
      bloomTime += 5; // Extend bloom to fully extract bright acidity.
      grind -= 4;
    }
    if (tastingNotes.some((note) => note === "Brown Sugar")) {
      bloomTime -= 5; // Shorten bloom for a fuller body.
      grind -= 2;
    }
    if (tastingNotes.some((note) => creamyNotes.includes(note))) {
      bloomTemp -= 2; // Lower temperature to preserve smooth, creamy textures.
    }
    if (tastingNotes.some((note) => brightCleanNotes.includes(note))) {
      pulses = Math.min(pulses + 1, 6); // More pulses promote clarity.
    }
    if (tastingNotes.some((note) => deepHeavyNotes.includes(note))) {
      pulses = Math.max(pulses - 1, 2); // Fewer pulses enhance depth.
      grind += 4;
    }

    // ---- Pulse Temperature Profile ----
    // Determine the temperature for each pulse based on roast profile and process.
    let pulseTemps = [];

    if (roast === "light" || roast === "light-medium") {
      // Light roasts: start lower and gradually increase to enhance extraction.
      let startTemp = 90,
        endTemp = 96;
      let step = (endTemp - startTemp) / (pulses - 1);
      for (let i = 0; i < pulses; i++) {
        pulseTemps.push(Math.round(startTemp + step * i));
      }
    } else if (roast === "medium") {
      // Medium roasts: maintain a stable temperature.
      for (let i = 0; i < pulses; i++) {
        if (processing === "Carbonic" || processing === "Anaerobic") {
          pulseTemps.push(bloomTemp + 1); // Carbonic/Anaerobic may benefit from the higher range to balance fermentation notes.
        } else {
          pulseTemps.push(bloomTemp);
        }
      }
    } else if (roast === "medium-dark") {
      // Darker roasts: start higher then gradually decrease to avoid bitterness.
      let startTemp = 91,
        endTemp = 85;
      let step = (startTemp - endTemp) / (pulses - 1);
      for (let i = 0; i < pulses; i++) {
        if (processing === "Anaerobic") {
          pulseTemps.push(Math.round(startTemp - 1 - step * i)); // Anaerobic Fermentation dark roasts may need to stay on the lower end to avoid amplifying funky/spiced notes.
        } else {
          pulseTemps.push(Math.round(startTemp - step * i));
        }
      }
    } else if (roast === "dark") {
      // Darker roasts: start higher then gradually decrease to avoid bitterness.
      let startTemp = 86,
        endTemp = 80;
      let step = (startTemp - endTemp) / (pulses - 1);
      for (let i = 0; i < pulses; i++) {
        if (processing === "Anaerobic") {
          pulseTemps.push(Math.round(startTemp - 1 - step * i)); // Anaerobic Fermentation dark roasts may need to stay on the lower end to avoid amplifying funky/spiced notes.
        } else {
          pulseTemps.push(Math.round(startTemp - step * i));
        }
      }
    }

    // Adjust temps if Monsoon
    if (processing === "Monsooned") {
      pulseTemps = pulseTemps.map((t) => t - 2);
    }

    // Further adjust pulse temperatures based on tasting notes.
    if (
      tastingNotes.some((note) =>
        [
          "Lemon",
          "Orange",
          "Grapefruit",
          "Lime",
          "Strawberry",
          "Blueberry",
          "Raspberry",
          "Blackberry",
          "Jasmine",
          "Lavender",
          "Rose",
          "Mandarin",
          "Blackcurrant",
          "Orange Blossom",
        ].includes(note)
      )
    ) {
      pulseTemps[0] += 1; // Math.max(pulseTemps[0], 96); // Boost first pulse for bright, fruity notes.
    }
    // Experimental, deliberately small finish adjustment for previously unused
    // earthy/roasted/fermented notes and new spice/tea presets. Share the existing
    // sweet-note rule so selecting several families never compounds this reduction.
    const gentleFinishNotes = [
      "Caramel",
      "Vanilla",
      "Brown Sugar",
      "Honey",
      "Cocoa Powder",
      "Toffee",
      "Butterscotch",
      "Other Sweet & Caramel",
      "Cedar",
      "Moss",
      "Mushroom",
      "Smoke",
      "Toast",
      "Cereal",
      "Other Earthy & Roasted",
      "Fermented Fruit",
      "Red Wine",
      "Rum",
      "Yeast",
      "Other Fermented & Wine-like",
      "Cinnamon",
      "Clove",
      "Nutmeg",
      "Cardamom",
      "Other Spiced",
      "Black Tea",
      "Green Tea",
    ];
    if (tastingNotes.some((note) => gentleFinishNotes.includes(note))) {
      pulseTemps[pulses - 1] -= 1;
    }

    // ---- Pulse Temperature Adjustments Based on Days Since Roasted ----
    // Fresh coffee: slightly lower pulse temps to counter CO2 resistance.
    // Aged coffee: slightly higher pulse temps to enhance extraction of diminished volatiles.
    if (!isNaN(daysRoasted)) {
      if (daysRoasted >= 0 && daysRoasted < AGE_LIMITS.fresh) {
        pulseTemps = pulseTemps.map((temp) => temp - 1);
      } else if (daysRoasted > AGE_LIMITS.rested) {
        pulseTemps = pulseTemps.map((temp) => temp + 1);
      }
    }

    // Set limits to the variables
    brewRatio = Math.max(14, Math.min(brewRatio, 20));
    bloomRatio = Math.max(1, Math.min(bloomRatio, 3)); // Fellow Aiden maximum confirmed by the site owner.
    bloomTime = Math.max(1, Math.min(bloomTime, 120));
    bloomTemp = Math.max(50, Math.min(bloomTemp, 99));
    pulses = Math.max(1, Math.min(pulses, 10));
    pulseInterval = Math.max(1, Math.min(pulseInterval, 60));
    pulseTemps = pulseTemps.map((v) => Math.min(Math.max(v, 50), 99));
    grind = Math.max(-GRIND_LIMIT, Math.min(grind, GRIND_LIMIT));

    return { brewRatio, bloomRatio, bloomTime, bloomTemp, pulses, pulseInterval, pulseTemps, grind };
  }
  function temperatures(value, unit) {
    const convert = (c) => (unit === "F" ? Math.round((c * 9) / 5 + 32) : c);
    return Array.isArray(value) ? value.map(convert) : convert(value);
  }
  function compare(inputs) {
    return AGES.map((age) => ({ ...age, recipe: calculate({ ...inputs, daysRoasted: age.days }) }));
  }
  const api = { ROASTS, AGE_LIMITS, GRIND_LIMIT, AGES, calculate, temperatures, compare };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CoffeeRecipe = api;
})(globalThis);
