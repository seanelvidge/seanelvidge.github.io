---
layout: page
permalink: /brewcoffee
title: Pulse Pour-Over Coffee Recipe Generator
description: Tool for generating coffee reciepes using a pulsed pour-over method (primarily designed for the Fellow Aiden Precision Coffee Maker)
nav: false
tags: coffee
---

<form id="coffeeForm">
      <!-- Coffee specifics inputs -->
      <label for="name">Name of Coffee:</label>
      <input type="text" id="name" name="name" placeholder="Enter the coffee name">
      
	  <label for="roast">Roasting Level*:</label>
      <select id="roast" name="roast" required>
        <option value="">Select Roasting Level</option>
        <option value="1">1 (Light)</option>
        <option value="2">2 (Light-Medium)</option>
        <option value="3">3 (Medium)</option>
        <option value="4">4 (Medium-Dark)</option>
        <option value="5">5 (Dark)</option>
      </select>
	  
      <label for="country">Country of Growth:</label>
      <input type="text" id="country" name="country" list="countryList" placeholder="Select or type a country">
      <datalist id="countryList">
        <option value="Brazil">
        <option value="Vietnam">
        <option value="Colombia">
        <option value="Indonesia">
        <option value="Honduras">
        <option value="Ethiopia">
        <option value="India">
        <option value="Uganda">
        <option value="Mexico">
        <option value="Guatemala">
        <option value="Peru">
        <option value="Nicaragua">
        <option value="China">
        <option value="Ivory Coast">
        <option value="Costa Rica">
        <option value="Kenya">
        <option value="Papua New Guinea">
        <option value="Tanzania">
        <option value="El Salvador">
        <option value="Ecuador">
        <option value="Cameroon">
        <option value="Laos">
        <option value="Madagascar">
        <option value="Gabon">
        <option value="Thailand">
        <option value="Venezuela">
        <option value="Dominican Republic">
        <option value="Haiti">
        <option value="Democratic Republic of the Congo">
        <option value="Rwanda">
        <option value="Burundi">
        <option value="Philippines">
        <option value="Togo">
        <option value="United States">
        <option value="Guinea">
        <option value="Yemen">
        <option value="Cuba">
        <option value="Panama">
        <option value="Bolivia">
        <option value="Timor Leste">
        <option value="Central African Republic">
        <option value="Nigeria">
        <option value="Ghana">
        <option value="Sierra Leone">
        <option value="Angola">
        <option value="Jamaica">
        <option value="Paraguay">
        <option value="Malawi">
        <option value="Trinidad and Tobago">
        <option value="Zimbabwe">
        <option value="Liberia">
        <option value="Zambia">
      </datalist>

      <label>Altitude of Growth (in metres):</label>
      <input type="number" id="altitudeMin" name="altitudeMin" placeholder="Minimum altitude" step="any">
      <input type="number" id="altitudeMax" name="altitudeMax" placeholder="Maximum altitude (optional)" step="any">

      <label for="processing">Processing Method:</label>
      <select id="processing" name="processing" required>
        <option value="">Select Processing</option>
        <option value="Washed">Washed (Wet) Process</option>
        <option value="Natural">Natural (Dry) Process</option>
        <option value="Honey White">Honey Process – White</option>
        <option value="Honey Yellow">Honey Process – Yellow</option>
        <option value="Honey Red">Honey Process – Red</option>
        <option value="Honey Black">Honey Process – Black</option>
        <option value="Anaerobic">Anaerobic Fermentation</option>
        <option value="Carbonic">Carbonic Maceration</option>
        <option value="Wet-Hulled">Wet-Hulled</option>
        <option value="Pulped Natural">Pulped Natural</option>
        <option value="Double Fermentation">Double Fermentation</option>
      </select>

      <label>Tasting Notes (select all that apply):</label>
      <div class="checkbox-group">
        <fieldset>
          <legend>Fruity Notes</legend>
          <label><input type="checkbox" name="tastingNotes" value="Strawberry"> Strawberry</label>
          <label><input type="checkbox" name="tastingNotes" value="Blueberry"> Blueberry</label>
          <label><input type="checkbox" name="tastingNotes" value="Raspberry"> Raspberry</label>
          <label><input type="checkbox" name="tastingNotes" value="Blackberry"> Blackberry</label>
          <label><input type="checkbox" name="tastingNotes" value="Lemon"> Lemon</label>
          <label><input type="checkbox" name="tastingNotes" value="Orange"> Orange</label>
          <label><input type="checkbox" name="tastingNotes" value="Grapefruit"> Grapefruit</label>
          <label><input type="checkbox" name="tastingNotes" value="Lime"> Lime</label>
          <label><input type="checkbox" name="tastingNotes" value="Peach"> Peach</label>
          <label><input type="checkbox" name="tastingNotes" value="Apricot"> Apricot</label>
          <label><input type="checkbox" name="tastingNotes" value="Cherry"> Cherry</label>
          <label><input type="checkbox" name="tastingNotes" value="Plum"> Plum</label>
          <label><input type="checkbox" name="tastingNotes" value="Mango"> Mango</label>
          <label><input type="checkbox" name="tastingNotes" value="Pineapple"> Pineapple</label>
          <label><input type="checkbox" name="tastingNotes" value="Papaya"> Papaya</label>
          <label><input type="checkbox" name="tastingNotes" value="Passionfruit"> Passionfruit</label>
        </fieldset>

        <fieldset>
          <legend>Nutty & Chocolate Notes</legend>
          <label><input type="checkbox" name="tastingNotes" value="Almond"> Almond</label>
          <label><input type="checkbox" name="tastingNotes" value="Hazelnut"> Hazelnut</label>
          <label><input type="checkbox" name="tastingNotes" value="Walnut"> Walnut</label>
          <label><input type="checkbox" name="tastingNotes" value="Peanut"> Peanut</label>
          <label><input type="checkbox" name="tastingNotes" value="Chocolate Dark"> Chocolate Dark</label>
          <label><input type="checkbox" name="tastingNotes" value="Chocolate Milk"> Chocolate Milk</label>
          <label><input type="checkbox" name="tastingNotes" value="Cocoa Powder"> Cocoa Powder</label>
        </fieldset>

        <fieldset>
          <legend>Sweet & Caramel Notes</legend>
          <label><input type="checkbox" name="tastingNotes" value="Caramel"> Caramel</label>
          <label><input type="checkbox" name="tastingNotes" value="Honey"> Honey</label>
          <label><input type="checkbox" name="tastingNotes" value="Brown Sugar"> Brown Sugar</label>
          <label><input type="checkbox" name="tastingNotes" value="Molasses"> Molasses</label>
          <label><input type="checkbox" name="tastingNotes" value="Maple Syrup"> Maple Syrup</label>
        </fieldset>

        <fieldset>
          <legend>Floral & Herbal Notes</legend>
          <label><input type="checkbox" name="tastingNotes" value="Jasmine"> Jasmine</label>
          <label><input type="checkbox" name="tastingNotes" value="Lavender"> Lavender</label>
          <label><input type="checkbox" name="tastingNotes" value="Rose"> Rose</label>
          <label><input type="checkbox" name="tastingNotes" value="Chamomile"> Chamomile</label>
          <label><input type="checkbox" name="tastingNotes" value="Hibiscus"> Hibiscus</label>
          <label><input type="checkbox" name="tastingNotes" value="Mint"> Mint</label>
          <label><input type="checkbox" name="tastingNotes" value="Basil"> Basil</label>
          <label><input type="checkbox" name="tastingNotes" value="Thyme"> Thyme</label>
        </fieldset>

        <fieldset>
          <legend>Other Notes</legend>
          <label><input type="checkbox" name="tastingNotes" value="Apple/Pear"> Apple/Pear</label>
          <label><input type="checkbox" name="tastingNotes" value="Red Wine"> Red Wine</label>
          <label><input type="checkbox" name="tastingNotes" value="White Wine"> White Wine</label>
          <label><input type="checkbox" name="tastingNotes" value="Rum"> Rum</label>
          <label><input type="checkbox" name="tastingNotes" value="Fermented Fruit"> Fermented Fruit</label>
          <label><input type="checkbox" name="tastingNotes" value="Yeast"> Yeast</label>
          <label><input type="checkbox" name="tastingNotes" value="Tobacco"> Tobacco</label>
          <label><input type="checkbox" name="tastingNotes" value="Cedar"> Cedar</label>
          <label><input type="checkbox" name="tastingNotes" value="Leather"> Leather</label>
          <label><input type="checkbox" name="tastingNotes" value="Mushroom"> Mushroom</label>
          <label><input type="checkbox" name="tastingNotes" value="Moss"> Moss</label>
          <label><input type="checkbox" name="tastingNotes" value="Vanilla"> Vanilla</label>
          <label><input type="checkbox" name="tastingNotes" value="Butter"> Butter</label>
          <label><input type="checkbox" name="tastingNotes" value="Cream"> Cream</label>
          <label><input type="checkbox" name="tastingNotes" value="Toast"> Toast</label>
          <label><input type="checkbox" name="tastingNotes" value="Smoke"> Smoke</label>
        </fieldset>
      </div>

      <label for="daysRoasted">Days Since Roasted:</label>
      <input type="number" id="daysRoasted" name="daysRoasted" required>

      <div class="button-container">
        <button type="button" onclick="calculateRecipe()">Generate Recipe</button>
        <button type="button" onclick="downloadRecipe()">Download Recipe</button>
      </div>
    </form>

    <div class="output" id="output"></div>

  </div>

  <script>
    // Global variable to store the formatted recipe text for downloading.
    let currentRecipeText = "";
    
    function calculateRecipe() {
      // Force user to select a roasting level before proceeding.
      const roastSelect = document.getElementById('roast');
      if (roastSelect.value === "") {
        alert("Please select a roasting level.");
        return;
      }
  
      // Retrieve input values
      const name = document.getElementById('name').value.trim();
      const country = document.getElementById('country').value.trim();
      const altitudeMin = parseFloat(document.getElementById('altitudeMin').value);
      const altitudeMax = parseFloat(document.getElementById('altitudeMax').value);
      let altitude;
      if (!isNaN(altitudeMin) && !isNaN(altitudeMax)) {
        altitude = (altitudeMin + altitudeMax) / 2;
      } else if (!isNaN(altitudeMin)) {
        altitude = altitudeMin;
      } else if (!isNaN(altitudeMax)) {
        altitude = altitudeMax;
      } else {
        altitude = null;
      }
  
      const processing = document.getElementById('processing').value.trim();
      const roastLevel = parseInt(document.getElementById('roast').value);
      const daysRoasted = parseInt(document.getElementById('daysRoasted').value);
  
      // Gather selected tasting notes into an array
      const tastingNotesElements = document.querySelectorAll('input[name="tastingNotes"]:checked');
      let tastingNotes = [];
      tastingNotesElements.forEach(note => {
        tastingNotes.push(note.value);
      });
  
      // --- If no optional parameters are provided, use roast-level defaults ---
      if (
        country === "" &&
        altitude === null &&
        processing === "" &&
        tastingNotes.length === 0
      ) {
        let brewRatio, bloomRatio, bloomTime, bloomTemp, pulses, pulseInterval, pulseTemps;
        switch (roastLevel) {
          case 1: // Light Roast defaults: less extraction needed; higher bloom to overcome dense structure.
            brewRatio = 17;
            bloomRatio = 3;
            bloomTime = 45;
            bloomTemp = 99;
            pulses = 3;
            pulseInterval = 23;
            pulseTemps = [99, 99, 99];
            break;
          case 2: // Light-Medium Roast defaults: slightly lower than light, but still robust extraction.
            brewRatio = 16.5;
            bloomRatio = 2.5;
            bloomTime = 38;
            bloomTemp = 97.5;
            pulses = 3;
            pulseInterval = 23;
            pulseTemps = [97.5, 97.5, 97.5];
            break;
          case 3: // Medium Roast defaults: balanced extraction.
            brewRatio = 16;
            bloomRatio = 2;
            bloomTime = 30;
            bloomTemp = 96;
            pulses = 3;
            pulseInterval = 23;
            pulseTemps = [96, 96, 96];
            break;
          case 4: // Medium-Dark Roast defaults: slightly more aggressive extraction early on.
            brewRatio = 16;
            bloomRatio = 2;
            bloomTime = 30;
            bloomTemp = 97.5;
            pulses = 3;
            pulseInterval = 23;
            pulseTemps = [90.5, 90.5, 90.5];
            break;
          case 5: // Dark Roast defaults: lower extraction due to brittle structure.
            brewRatio = 16;
            bloomRatio = 2;
            bloomTime = 30;
            bloomTemp = 99;
            pulses = 3;
            pulseInterval = 23;
            pulseTemps = [85, 85, 85];
            break;
          default:
            brewRatio = 16;
            bloomRatio = 2;
            bloomTime = 30;
            bloomTemp = 96;
            pulses = 3;
            pulseInterval = 23;
            pulseTemps = [96, 96, 96];
        }
        displayOutput(name, brewRatio, bloomRatio, bloomTime, bloomTemp, pulses, pulseInterval, pulseTemps);
        return;
      }
  
      // --- Otherwise, calculate adjustments based on provided parameters ---
      // Base values for adjustments.
      let brewRatio = 16;      // Default water:coffee ratio.
      let bloomRatio = 2;      // Default multiplier for water during bloom phase.
      let bloomTime = 30;      // Default bloom time in seconds.
      let bloomTemp = 93;      // Default bloom water temperature (°C).
      let pulses = 4;          // Default number of pour-over pulses.
      let pulseInterval = 30;  // Default time between pulses.
      let delicateProcess = false;  // Flag for methods that require lower pulse temperatures.
  
      // ---- Country of Origin Adjustments ----
      // Adjust based on bean density and solubility (e.g., East African beans are denser).
      const countryLC = country.toLowerCase();
      if (["ethiopia", "kenya", "rwanda", "burundi"].some(ctry => countryLC.includes(ctry))) {
        bloomRatio = 2;      // Lower bloom ratio for high-solubility East African beans.
        bloomTime = 25;        // Shorter bloom to avoid over-extraction.
        bloomTemp = 90;        // Lower bloom temperature to control acidity.
        pulses = 3;            // Fewer pulses to prevent over-extraction.
      } else if (["brazil", "colombia", "guatemala"].some(ctry => countryLC.includes(ctry))) {
        bloomRatio = 2.5;      // Higher bloom ratio for softer, Latin American beans.
        bloomTime = 40;        // Longer bloom for full degassing.
        bloomTemp = 93;        // Higher bloom temperature for enhanced extraction.
        pulses = 5;            // More pulses for even extraction.
      } else if (["indonesia", "sumatra", "java"].some(ctry => countryLC.includes(ctry))) {
        bloomRatio = 2.5;      // Indonesian beans: robust extraction with moderate bloom.
        bloomTime = 40;
        bloomTemp = 95;
        pulses = 5;
      }
  
      // ---- Altitude Adjustments ----
      // Higher-altitude beans are denser, requiring stronger extraction.
      if (altitude !== null) {
        if (altitude > 1500) {
          brewRatio = 15;         // Stronger ratio for denser, high-altitude beans.
          bloomRatio += 0.5;      // Increase bloom ratio to assist in degassing.
          bloomTime += 10;        // Longer bloom for thorough CO₂ release.
          bloomTemp += 2;         // Hotter bloom water helps initial extraction.
          pulses = Math.max(pulses, 5);  // Ensure enough pulses.
        } else if (altitude < 1200) {
          brewRatio = 17;         // Weaker ratio for softer, low-altitude beans.
          bloomRatio = Math.max(bloomRatio - 0.5, 1.5); // Reduce bloom ratio.
          bloomTime = Math.max(bloomTime - 5, 20);        // Shorten bloom time.
          pulses = Math.max(pulses - 1, 2);               // Fewer pulses.
        }
      }
  
      // ---- Processing Method Adjustments ----
      // Natural, Honey, Carbonic, and Anaerobic methods retain more sugars, needing longer bloom.
      if (processing === "Natural" || processing.includes("Honey") || processing === "Carbonic" || processing === "Anaerobic") {
        bloomRatio = Math.max(bloomRatio, 3.0); // Ensure sufficient water for degassing.
        bloomTime = Math.max(bloomTime, 45);      // Extend bloom time.
        pulses = Math.max(pulses, 5);             // Increase pulses to control uneven extraction.
        if (processing === "Carbonic" || processing === "Anaerobic") {
          delicateProcess = true;  // Lower pulse temperatures to preserve volatile notes.
        }
      } else if (processing === "Washed" || processing === "Double Fermentation" || processing === "Wet-Hulled") {
        bloomRatio = Math.min(bloomRatio, 2.0);   // Cleaner beans need less bloom.
        bloomTime = Math.min(bloomTime, 30);        // Shorter bloom time.
        pulses = Math.min(pulses, 4);               // Fewer pulses.
      }
  
      // ---- Roasting Level Adjustments ----
      // Lighter roasts require more bloom and extraction time; darker roasts need less.
      let roastProfile = "medium"; // Default profile.
      if (roastLevel <= 2) {
        brewRatio = Math.max(brewRatio, 15);      // Slightly stronger extraction.
        bloomRatio = Math.max(bloomRatio, 3);     // Higher bloom ratio for dense, light roasts.
        bloomTime = Math.max(bloomTime, 55);        // Longer bloom for extended extraction.
        pulses = Math.max(pulses, 6);               // More pulses for full extraction.
        roastProfile = roastLevel === 1 ? "light" : "light-medium";
      } else if (roastLevel >= 4) {
        brewRatio = Math.min(brewRatio, 17);        // Weaker ratio to avoid over-extraction.
        bloomRatio = Math.min(bloomRatio, 2.0);       // Lower bloom ratio for porous, dark roasts.
        bloomTime = Math.min(bloomTime, 35);          // Shorter bloom time.
        pulses = Math.min(pulses, 4);                 // Fewer pulses to prevent bitterness.
        roastProfile = roastLevel === 4 ? "medium-dark" : "dark";
      }
  
      // ---- Days Since Roasted Adjustments ----
      // Adjust based on bean freshness (CO₂ levels affect extraction dynamics).
      // Fresh coffee (0–7 days): high CO₂ requires extra degassing (higher bloom ratio/time, higher temp, fewer pulses).
      // Moderately aged coffee (8–20 days): moderate settings.
      // Aged coffee (>20 days): minimal degassing (lower bloom, lower temp, additional pulses).
      if (!isNaN(daysRoasted)) {
        if (daysRoasted >= 0 && daysRoasted <= 7) {
          bloomRatio = Math.max(bloomRatio, 2.5);   // Increase bloom ratio for extra degassing.
          bloomTime = Math.max(bloomTime, 45);        // Extend bloom time.
          if (bloomTemp < 92) { bloomTemp = 92; }      // Ensure higher temperature for fresh beans.
          pulses = Math.max(pulses - 1, 2);            // Fewer pulses to manage rapid CO₂ release.
        } else if (daysRoasted >= 8 && daysRoasted <= 20) {
          bloomRatio = 2.0;    // Moderate bloom ratio.
          bloomTime = 35;      // Average bloom time.
          bloomTemp = 90;      // Moderate bloom temperature.
          // Pulses remain as determined.
        } else if (daysRoasted > 20) {
          bloomRatio = 1.5;    // Minimal bloom needed.
          bloomTime = 25;      // Shorter bloom time.
          bloomTemp = 87;      // Lower temperature to avoid over-extraction.
          pulses = pulses + 1; // Increase pulses to maintain even extraction.
        }
      }
  
      // ---- Tasting Notes Adjustments ----
      // Adjust parameters to highlight specific flavor profiles.
      const fruityNotes = ["Strawberry", "Blueberry", "Raspberry", "Blackberry", "Lemon", "Orange", "Grapefruit", "Lime", "Peach", "Apricot", "Cherry", "Plum", "Mango", "Pineapple", "Papaya", "Passionfruit"];
      const nuttyChocoNotes = ["Almond", "Hazelnut", "Walnut", "Peanut", "Chocolate Dark", "Chocolate Milk", "Cocoa Powder"];
      const floralHerbalNotes = ["Jasmine", "Lavender", "Rose", "Chamomile", "Hibiscus", "Mint", "Basil", "Thyme"];
      const heavySweetNotes = ["Molasses", "Maple Syrup", "Caramel", "Honey"];
      const brightCleanNotes = ["Apple/Pear", "Peach", "Passionfruit", "Jasmine", "Hibiscus", "White Wine"];
      const deepHeavyNotes = ["Chocolate Dark", "Maple Syrup", "Molasses", "Tobacco", "Leather"];
      const acidityNotes = ["Lemon", "Orange", "Lime", "Passionfruit", "White Wine"];
      const creamyNotes = ["Walnut", "Peanut", "Butter", "Cream"];
  
      if (tastingNotes.some(note => fruityNotes.includes(note))) {
        brewRatio = parseFloat(brewRatio) + 0.5; // More water highlights bright, acidic notes.
        bloomTemp += 2;                          // Higher temperature boosts fruity extraction.
      }
      if (tastingNotes.some(note => nuttyChocoNotes.includes(note))) {
        brewRatio = parseFloat(brewRatio) - 0.5; // Less water to enhance body and richness.
      }
      if (tastingNotes.some(note => floralHerbalNotes.includes(note))) {
        bloomRatio += 0.25; // Extra water in bloom to extract delicate aromatics.
      }
      if (tastingNotes.some(note => heavySweetNotes.includes(note))) {
        bloomRatio = Math.max(bloomRatio - 0.3, 1.5); // Lower bloom preserves syrupy body.
      }
      if (tastingNotes.some(note => acidityNotes.includes(note))) {
        bloomTime += 5; // Extend bloom to fully extract bright acidity.
      }
      if (tastingNotes.some(note => note === "Brown Sugar")) {
        bloomTime = Math.max(bloomTime - 5, 20); // Shorten bloom for a fuller body.
      }
      if (tastingNotes.some(note => creamyNotes.includes(note))) {
        bloomTemp -= 2; // Lower temperature to preserve smooth, creamy textures.
      }
      if (tastingNotes.some(note => brightCleanNotes.includes(note))) {
        pulses = Math.max(pulses, 5); // More pulses promote clarity.
      }
      if (tastingNotes.some(note => deepHeavyNotes.includes(note))) {
        pulses = Math.max(pulses - 1, 2); // Fewer pulses enhance depth.
      }
  
      // ---- Pulse Interval Based on Roast Profile ----
      // Adjust time between pulses based on roast to control extraction speed.
      if (roastProfile === "light" || roastProfile === "light-medium") {
        pulseInterval = 35;
      } else if (roastProfile === "medium") {
        pulseInterval = 30;
      } else if (roastProfile === "medium-dark" || roastProfile === "dark") {
        pulseInterval = 25;
      }
  
      // ---- Pulse Temperature Profile ----
      // Determine the temperature for each pulse based on roast profile and process.
      let pulseTemps = [];
      if (delicateProcess) {
        // For Carbonic or Anaerobic processes, use lower, controlled temperatures.
        for (let i = 0; i < pulses; i++) {
          pulseTemps.push(87 + i); // Slight incremental rise.
        }
      } else {
        if (roastProfile === "light" || roastProfile === "light-medium") {
          // Light roasts: start lower and gradually increase to enhance extraction.
          let startTemp = 90, endTemp = 96;
          let step = (endTemp - startTemp) / (pulses - 1);
          for (let i = 0; i < pulses; i++) {
            pulseTemps.push(Math.round(startTemp + step * i));
          }
        } else if (roastProfile === "medium") {
          // Medium roasts: maintain a stable temperature.
          for (let i = 0; i < pulses; i++) {
            pulseTemps.push(bloomTemp);
          }
        } else if (roastProfile === "medium-dark" || roastProfile === "dark") {
          // Dark roasts: start higher then gradually decrease to avoid bitterness.
          let startTemp = 94, endTemp = 88;
          let step = (startTemp - endTemp) / (pulses - 1);
          for (let i = 0; i < pulses; i++) {
            pulseTemps.push(Math.round(startTemp - step * i));
          }
        }
        // Further adjust pulse temperatures based on tasting notes.
        if (tastingNotes.some(note => ["Lemon", "Orange", "Grapefruit", "Lime", "Strawberry", "Blueberry", "Raspberry", "Blackberry", "Jasmine", "Lavender", "Rose"].includes(note))) {
          pulseTemps[0] = Math.max(pulseTemps[0], 96); // Boost first pulse for bright, fruity notes.
        }
        if (tastingNotes.some(note => ["Caramel", "Vanilla", "Brown Sugar", "Honey", "Cocoa Powder"].includes(note))) {
          pulseTemps[pulses - 1] = Math.min(pulseTemps[pulses - 1], 90); // Lower final pulse for sweetness.
        }
      }
  
      // ---- Pulse Temperature Adjustments Based on Days Since Roasted ----
      // Fresh coffee: slightly lower pulse temps to counter CO₂ resistance.
      // Aged coffee: slightly higher pulse temps to enhance extraction of diminished volatiles.
      if (!isNaN(daysRoasted)) {
        if (daysRoasted >= 0 && daysRoasted <= 7) {
          pulseTemps = pulseTemps.map(temp => temp - 1);
        } else if (daysRoasted > 20) {
          pulseTemps = pulseTemps.map(temp => temp + 1);
        }
      }
  
      displayOutput(name, brewRatio, bloomRatio, bloomTime, bloomTemp, pulses, pulseInterval, pulseTemps);
    }
  
    function displayOutput(name, brewRatio, bloomRatio, bloomTime, bloomTemp, pulses, pulseInterval, pulseTemps) {
      // Format the output text for display and for download.
      currentRecipeText = "Coffee Recipe";
      if (name !== "") {
        currentRecipeText += " for " + name;
      }
      currentRecipeText += "\n\nCoffee-to-Water Ratio: 1:" + parseFloat(brewRatio).toFixed(1) +
                           "\nBloom Ratio: 1:" + parseFloat(bloomRatio).toFixed(1) +
                           "\nBloom Time: " + bloomTime + " seconds" +
                           "\nBloom Temperature: " + bloomTemp + " °C" +
                           "\nNumber of Pulses: " + pulses +
                           "\nTime Between Pulses: " + pulseInterval + " seconds" +
                           "\nPulse Temperatures: " + pulseTemps.join(', ') + " °C";
  
      // Also display the output on the webpage.
      const outputDiv = document.getElementById('output');
      outputDiv.innerHTML =
        "<h2>Brew Parameters</h2>" +
        "<p><strong>Coffee-to-Water Ratio:</strong> 1:" + parseFloat(brewRatio).toFixed(1) + "</p>" +
        "<p><strong>Bloom Ratio:</strong> 1:" + parseFloat(bloomRatio).toFixed(1) + "</p>" +
        "<p><strong>Bloom Time:</strong> " + bloomTime + " seconds</p>" +
        "<p><strong>Bloom Temperature:</strong> " + bloomTemp + " °C</p>" +
        "<p><strong>Number of Pulses:</strong> " + pulses + "</p>" +
        "<p><strong>Time Between Pulses:</strong> " + pulseInterval + " seconds</p>" +
        "<p><strong>Pulse Temperatures:</strong> " + pulseTemps.join(', ') + " °C</p>";
    }
  
    function downloadRecipe() {
      if (currentRecipeText === "") {
        alert("Please generate a recipe first!");
        return;
      }
      // Determine a filename using the coffee name if provided.
      const coffeeName = document.getElementById('name').value.trim();
      const filename = coffeeName ? coffeeName.replace(/\s+/g, "_") + "_recipe.txt" : "coffee_recipe.txt";
      const blob = new Blob([currentRecipeText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
  
      // Create a temporary anchor element and trigger download.
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  </script>
