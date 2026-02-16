---
layout: page
permalink: /brewcoffee
title: Pulse Pour-Over Coffee Recipe Generator
nav: false
tags: coffee
---

Tool for generating coffee reciepes using a pulsed pour-over method (primarily designed for the [Fellow Aiden Precision Coffee Maker](https://amzn.to/4j7ni2U)). A description of the methodology is [here](https://seanelvidge.com/articles/2025/Pour_over_brewing_recipe_generator/).

<html lang="en">
<head>
  <style>
    fieldset {
      border: none;
      padding: 0;
      margin: 0;
    }
    legend {
      font-size: 1.2rem;
      font-weight: bold;
      padding: 0;
      margin-bottom: -5px;
    }
    hr {
      margin-top: 5px;
    }
    fieldset {
      border: 1px solid #ccc; /* Adjust thickness and color as needed */
      padding: 10px; /* Ensure some inner spacing */
      margin: 10px 0; /* Space it out from other elements */
      border-radius: 5px; /* Optional: rounded corners */
    }
  </style>
</head>
  <div class="container">
    <form id="coffeeForm">
      <!-- Coffee specifics inputs -->
      <label for="name">Name of Coffee:</label>
      <input type="text" id="name" name="name" placeholder="Enter the coffee name">
      <br>
      
	  <label for="roast">Roasting Level*:</label>
      <select id="roast" name="roast" required>
        <option value="">Select Roasting Level</option>
        <option value="light">1 (Light)</option>
        <option value="light-medium">2 (Light-Medium)</option>
        <option value="medium">3 (Medium)</option>
        <option value="medium-dark">4 (Medium-Dark)</option>
        <option value="dark">5 (Dark)</option>
      </select>
      <br>
	  
      <label for="country">Country of Growth:</label>
      <input type="text" id="country" name="country" list="countryList" placeholder="Select or type a country">
      <datalist id="countryList">
        <option value="Angola"></option>
		<option value="Bolivia"></option>
		<option value="Brazil"></option>
		<option value="Burundi"></option>
		<option value="Cameroon"></option>
		<option value="Central African Republic"></option>
		<option value="China"></option>
		<option value="Colombia"></option>
		<option value="Costa Rica"></option>
		<option value="Cuba"></option>
		<option value="Democratic Republic of the Congo"></option>
		<option value="Dominican Republic"></option>
		<option value="Ecuador"></option>
		<option value="El Salvador"></option>
		<option value="Ethiopia"></option>
		<option value="Gabon"></option>
		<option value="Ghana"></option>
		<option value="Guatemala"></option>
		<option value="Guinea"></option>
		<option value="Haiti"></option>
		<option value="Honduras"></option>
		<option value="India"></option>
		<option value="Indonesia"></option>
		<option value="Ivory Coast"></option>
		<option value="Jamaica"></option>
		<option value="Kenya"></option>
		<option value="Laos"></option>
		<option value="Liberia"></option>
		<option value="Madagascar"></option>
		<option value="Malawi"></option>
		<option value="Mexico"></option>
		<option value="Nicaragua"></option>
		<option value="Nigeria"></option>
		<option value="Panama"></option>
		<option value="Papua New Guinea"></option>
		<option value="Paraguay"></option>
		<option value="Peru"></option>
		<option value="Philippines"></option>
		<option value="Rwanda"></option>
		<option value="Sierra Leone"></option>
		<option value="Tanzania"></option>
		<option value="Thailand"></option>
		<option value="Timor Leste"></option>
		<option value="Togo"></option>
		<option value="Trinidad and Tobago"></option>
		<option value="Uganda"></option>
		<option value="United States"></option>
		<option value="Venezuela"></option>
		<option value="Vietnam"></option>
		<option value="Yemen"></option>
		<option value="Zambia"></option>
		<option value="Zimbabwe"></option>
      </datalist>
      <br>

      <label>Altitude of Growth (in metres):</label>
      <input type="number" id="altitudeMin" name="altitudeMin" placeholder="Minimum altitude" step="any">
      <input type="number" id="altitudeMax" name="altitudeMax" placeholder="Maximum altitude (optional)" step="any">
      <br>

      <label for="processing">Processing Method:</label>
      <select id="processing" name="processing">
        <option value="">Select Processing</option>
        <option value="Washed">Washed (Wet) Process</option>
    	<option value="Monsooned">Monsooned</option>
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
      <br>

      <label for="daysRoasted">Days Since Roasted:</label>
      <input type="number" id="daysRoasted" name="daysRoasted">
      <br>
      <br>

      <label>Tasting Notes (select all that apply):</label>

      <div class="checkbox-group">
        <fieldset>
          <legend><h5>Fruity Notes</h5></legend>
          <label><input type="checkbox" name="tastingNotes" value="Apple"> Apple</label>
      <label><input type="checkbox" name="tastingNotes" value="Apricot"> Apricot</label>
      <label><input type="checkbox" name="tastingNotes" value="Blackberry"> Blackberry</label>
      <label><input type="checkbox" name="tastingNotes" value="Blueberry"> Blueberry</label>
      <label><input type="checkbox" name="tastingNotes" value="Cherry"> Cherry</label>
      <label><input type="checkbox" name="tastingNotes" value="Grapefruit"> Grapefruit</label>
      <label><input type="checkbox" name="tastingNotes" value="Lemon"> Lemon</label>
      <label><input type="checkbox" name="tastingNotes" value="Lime"> Lime</label>
      <label><input type="checkbox" name="tastingNotes" value="Mango"> Mango</label>
      <label><input type="checkbox" name="tastingNotes" value="Orange"> Orange</label>
      <label><input type="checkbox" name="tastingNotes" value="Papaya"> Papaya</label>
      <label><input type="checkbox" name="tastingNotes" value="Passionfruit"> Passionfruit</label>
      <label><input type="checkbox" name="tastingNotes" value="Peach"> Peach</label>
      <label><input type="checkbox" name="tastingNotes" value="Pear"> Pear</label>
      <label><input type="checkbox" name="tastingNotes" value="Pineapple"> Pineapple</label>
      <label><input type="checkbox" name="tastingNotes" value="Plum"> Plum</label>
      <label><input type="checkbox" name="tastingNotes" value="Raspberry"> Raspberry</label>
      <label><input type="checkbox" name="tastingNotes" value="Strawberry"> Strawberry</label>
        </fieldset>

        <fieldset>
          <legend><h5>Nutty & Chocolate Notes</h5></legend>
          <label><input type="checkbox" name="tastingNotes" value="Almond"> Almond</label>
      <label><input type="checkbox" name="tastingNotes" value="Chocolate Dark"> Chocolate (Dark)</label>
      <label><input type="checkbox" name="tastingNotes" value="Chocolate Milk"> Chocolate (Milk)</label>
      <label><input type="checkbox" name="tastingNotes" value="Cocoa Powder"> Cocoa Powder</label>
      <label><input type="checkbox" name="tastingNotes" value="Hazelnut"> Hazelnut</label>
      <label><input type="checkbox" name="tastingNotes" value="Peanut"> Peanut</label>
      <label><input type="checkbox" name="tastingNotes" value="Walnut"> Walnut</label>
        </fieldset>

        <fieldset>
          <legend><h5>Sweet & Caramel Notes</h5></legend>

<label><input type="checkbox" name="tastingNotes" value="Brown Sugar"> Brown Sugar</label>
<label><input type="checkbox" name="tastingNotes" value="Caramel"> Caramel</label>
<label><input type="checkbox" name="tastingNotes" value="Honey"> Honey</label>
<label><input type="checkbox" name="tastingNotes" value="Maple Syrup"> Maple Syrup</label>
<label><input type="checkbox" name="tastingNotes" value="Molasses"> Molasses</label>

</fieldset>

<fieldset>
          <legend><h5>Floral & Herbal Notes</h5></legend>
      <label><input type="checkbox" name="tastingNotes" value="Basil"> Basil</label>
      <label><input type="checkbox" name="tastingNotes" value="Chamomile"> Chamomile</label>
      <label><input type="checkbox" name="tastingNotes" value="Hibiscus"> Hibiscus</label>
      <label><input type="checkbox" name="tastingNotes" value="Jasmine"> Jasmine</label>
      <label><input type="checkbox" name="tastingNotes" value="Lavender"> Lavender</label>
      <label><input type="checkbox" name="tastingNotes" value="Mint"> Mint</label>
      <label><input type="checkbox" name="tastingNotes" value="Rose"> Rose</label>
      <label><input type="checkbox" name="tastingNotes" value="Thyme"> Thyme</label>
        </fieldset>

        <fieldset>
          <legend><h5>Other Notes</h5></legend>
      <label><input type="checkbox" name="tastingNotes" value="Butter"> Butter</label>
      <label><input type="checkbox" name="tastingNotes" value="Cedar"> Cedar</label>
      <label><input type="checkbox" name="tastingNotes" value="Cream"> Cream</label>
      <label><input type="checkbox" name="tastingNotes" value="Fermented Fruit"> Fermented Fruit</label>
      <label><input type="checkbox" name="tastingNotes" value="Leather"> Leather</label>
      <label><input type="checkbox" name="tastingNotes" value="Moss"> Moss</label>
      <label><input type="checkbox" name="tastingNotes" value="Mushroom"> Mushroom</label>
      <label><input type="checkbox" name="tastingNotes" value="Red Wine"> Red Wine</label>
      <label><input type="checkbox" name="tastingNotes" value="Rum"> Rum</label>
      <label><input type="checkbox" name="tastingNotes" value="Smoke"> Smoke</label>

<label><input type="checkbox" name="tastingNotes" value="Tobacco"> Tobacco</label>
<label><input type="checkbox" name="tastingNotes" value="Toast"> Toast</label>
<label><input type="checkbox" name="tastingNotes" value="Vanilla"> Vanilla</label>
<label><input type="checkbox" name="tastingNotes" value="White Wine"> White Wine</label>
<label><input type="checkbox" name="tastingNotes" value="Yeast"> Yeast</label>

</fieldset>
<br>
<label>Select temperature unit:   </label>
<input type="radio" id="celsius" name="unit" value="C" checked style="margin-right: 0px;">
<label for="celsius">°C</label>
<input type="radio" id="fahrenheit" name="unit" value="F" style="margin-left: 20px; margin-right: 0px;">
<label for="fahrenheit">°F</label>
</div>
<br>
<br>

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

    function convertTemperature(input, unit) {
	if (unit !== 'F') return input;
	const convert = c => Math.round((c * 9 / 5) + 32);

	if (Array.isArray(input)) {
    	  return input.map(convert);
  	} else {
    	  return convert(input);
        }
    }

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
      const selectedUnit = document.querySelector('input[name="unit"]:checked').value;
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
      const roast = document.getElementById('roast').value.trim(); // parseInt(document.getElementById('roast').value);
      const daysRoasted = parseInt(document.getElementById('daysRoasted').value);
  
      // Gather selected tasting notes into an array
      const tastingNotesElements = document.querySelectorAll('input[name="tastingNotes"]:checked');
      let tastingNotes = [];
      tastingNotesElements.forEach(note => {
        tastingNotes.push(note.value);
      });
	  
	  let brewRatio, bloomRatio, bloomTime, bloomTemp, pulses, pulseInterval, grind;//, pulseTemps;
	  if (roast === "light") { // Light Roast defaults: less extraction needed; higher bloom to overcome dense structure.
		  brewRatio = 17;
		  bloomRatio = 3.5; // Higher bloom ratio for dense, light roasts.
		  bloomTime = 60; // Longer bloom for extended extraction.
		  bloomTemp = 99;
		  pulses = 6;    // More pulses for full extraction.
		  pulseInterval = 35;  // Adjust time between pulses to control extraction speed, from higher -> low
		  //pulseTemps = [99, 99, 99];
		  grind = 0;
		  roastProfile = "light";
	   } else if (roast === "light-medium") { // Light-Medium Roast defaults: slightly lower than light, but still robust extraction.
  		  brewRatio = 16.5;
		  bloomRatio = 3;
		  bloomTime = 55;
		  bloomTemp = 97.5;
		  pulses = 5;
		  pulseInterval = 32.5;
		  //pulseTemps = [97.5, 97.5, 97.5];
		  grind = 0;
	    } else if (roast === "medium") { // Medium Roast defaults: balanced extraction.
		  brewRatio = 16;
		  bloomRatio = 2.5;
		  bloomTime = 50;
		  bloomTemp = 96;
		  pulses = 4;
		  pulseInterval = 30;
		  //pulseTemps = [96, 96, 96];
		  grind = 0;
	    } else if (roast === "medium-dark") { // Medium-Dark Roast defaults: slightly more aggressive extraction early on.
  		  brewRatio = 15.5;
		  bloomRatio = 2;
		  bloomTime = 45;
		  bloomTemp = 97.5;
		  pulses = 3;
		  pulseInterval = 27.5;
		  //pulseTemps = [90.5, 90.5, 90.5];
		  grind = 0;
	    } else if (roast === "dark") { // Dark Roast defaults: lower extraction due to brittle structure.
		  brewRatio = 15;  // Increase dose to increase strenght, after lowing strength by having a coarser grind
		  bloomRatio = 1.5;
		  bloomTime = 40;
		  bloomTemp = 99;  // Start with very hot bloom to increase complexity in the cup
		  pulses = 3;     // Fewer pulses to prevent bitterness.
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
		  if (["ethiopia", "kenya", "rwanda", "burundi"].some(ctry => countryLC.includes(ctry))) {
			bloomRatio -= 0.5;        // Lower bloom ratio for high-solubility East African beans.
			bloomTime -= 5;        // Shorter bloom to avoid over-extraction.
			bloomTemp -= 3;        // Lower bloom temperature to control acidity.
			pulses = Math.max(pulses-1, 2);  // Fewer pulses to prevent over-extraction.
		  } else if (["brazil", "colombia", "guatemala"].some(ctry => countryLC.includes(ctry))) {
			bloomRatio += 0.5;      // Higher bloom ratio for softer, Latin American beans.
			bloomTime += 5;        // Longer bloom for full degassing.
			bloomTemp += 3;        // Higher bloom temperature for enhanced extraction.
			pulses = Math.min(pulses+1, 6);            // More pulses for even extraction.
		  } else if (["indonesia", "sumatra", "java"].some(ctry => countryLC.includes(ctry))) {
			bloomRatio = 2.5;      // Indonesian beans: robust extraction with moderate bloom.
			bloomTime = 50;
			// bloomTemp = 95;     // Do we want a specific temperature for this location?
			pulses = Math.min(pulses+1, 6);
		  }
		}

      // ---- Altitude Adjustments ----
      // Higher-altitude beans are denser, requiring stronger extraction.
      if (altitude !== null) {
        if (altitude > 1500) {
          brewRatio -= 0.5;         // Stronger ratio for denser, high-altitude beans.
          bloomRatio += 0.5;      // Increase bloom ratio to assist in degassing.
          bloomTime += 5;        // Longer bloom for thorough CO2 release.
          bloomTemp += 1.5;         // Hotter bloom water helps initial extraction.
          pulses = Math.max(pulses, 4);  // Ensure enough pulses.
	  grind -= 2;             // High-elevation coffee are denser and require finer grinds for optimal extraction.
        } else if (altitude < 1200) {
          brewRatio += 0.5;         // Weaker ratio for softer, low-altitude beans.
          bloomRatio = Math.max(bloomRatio - 0.5, 1.5);   // Reduce bloom ratio.
          bloomTime = Math.max(bloomTime - 5, 20);        // Shorten bloom time.
          pulses = Math.max(pulses - 1, 2);               // Fewer pulses.
	  grind += 2;             // Low-elevation coffee extract more quickly, so a coarser grind prevents over-extraction.
        }
      }

      // ---- Processing Method Adjustments ----
	if (processing !== "") {
	
	  // Natural, Honey, Carbonic, and Anaerobic methods retain more sugars, needing longer bloom.
	  if (processing === "Natural" || processing.includes("Honey") || processing === "Carbonic" || processing === "Anaerobic") {
	    bloomRatio = Math.max(bloomRatio + 0.5, 2.5);   // Ensure sufficient water for degassing.
	    bloomTime  = Math.max(bloomTime  + 5, 45);      // Extend bloom time.
	    pulses     = Math.min(pulses + 1, 6);           // Increase pulses to control uneven extraction.
	
	  } else if (processing === "Washed" || processing === "Double Fermentation" || processing === "Wet-Hulled") {
	    bloomRatio -= 0.5;                              // Cleaner beans need less bloom.
	    bloomTime  -= 5;                                // Shorter bloom time.
	    pulses      = Math.max(pulses - 1, 2);           // Fewer pulses.
	
	  // Monsooned: more porous / lower density / “aged” character -> easier to extract, less need for degassing,
	  // prefer gentler temps + more, smaller pulses for control.
	  } else if (processing === "Monsooned" || processing.includes("Monsoon")) {
	    bloomRatio = Math.max(bloomRatio + 0.5, 2.5);    // Slightly higher bloom ratio to fully wet/saturate porous beans.
	    bloomTime  = Math.max(bloomTime - 5, 30);        // Slightly shorter bloom time (typically less trapped CO₂).
	    pulses     = Math.min(pulses + 1, 6);            // More pulses (smaller pours) to avoid over-extracting early.
	    bloomTemp  -= 2;                                 // Slightly lower bloom temperature for control.
	  }
	
	  // Grind settings for processing is in different groups
	  if (processing === "Washed" || processing.includes("White") || processing.includes("Yellow") || processing.includes("Fermentation") || processing === "Carbonic") {
	    grind -= 4;      // Clean and bright flavor profiles benefit from a slower extraction.
	  } else if (processing.includes("Red") || processing.includes("Black") || processing === "Pulped Natural") {
	    grind -= 2;      // Balances sweetness and body while ensuring clarity.
	  } else if (processing === "Natural") {
	    grind += 2;      // Naturally processed coffees have more body and fruitiness, which can become muddled if over-extracted.
	  } else if (processing === "Wet-Hulled") {
	    grind += 4;      // Heavy-bodied and earthy coffees can become too bitter if over-extracted.
	  } else if (processing === "Monsooned" || processing.includes("Monsoon")) {
	    grind -= 2;      // More porous/easier extraction: slightly finer can help keep strength at gentler temps.
	  }
	}

      // ---- Roasting Level Adjustments ----
      // Roast profiles for grind size is also different
      if (roast == "light") { grind -= 4; }
      else if (roast == "light-medium") { grind -= 2; }
      else if (roast == "medium-dark") { grind += 2; }
      else if (roast == "dark") { grind += 4; }

      // ---- Days Since Roasted Adjustments ----
      // Adjust based on bean freshness (CO2 levels affect extraction dynamics).
      // Fresh coffee (0–7 days): high CO2 requires extra degassing (higher bloom ratio/time, higher temp, fewer pulses).
      // Moderately aged coffee (8–20 days): moderate settings.
      // Aged coffee (>20 days): minimal degassing (lower bloom, lower temp, additional pulses).
      if (!isNaN(daysRoasted)) {
        if (daysRoasted >= 0 && daysRoasted <= 7) {
          bloomRatio += 0.5 // Math.max(bloomRatio, 2.5);      // Increase bloom ratio for extra degassing.
          bloomTime += 5 // Math.max(bloomTime, 45);         // Extend bloom time.
          if (bloomTemp < 92) { bloomTemp = 92; }      // Ensure higher temperature for fresh beans.
          pulses = Math.max(pulses - 1, 2);            // Fewer pulses to manage rapid CO2 release.
	  grind -= 4
        } else if (daysRoasted > 20) {  // don't change any of the settings if between 8 and 20 days roasted.
          bloomRatio -= 0.5 // Math.min(bloomRatio, 1.5);    // Minimal bloom needed.
          bloomTime -= 5 // Math.min(bloomTime, 25);      // Shorter bloom time.
          bloomTemp = Math.min(bloomTemp, 87);      // Lower temperature to avoid over-extraction.
          pulses = Math.min(pulses+1, 6);  // Increase pulses to maintain even extraction.
	  grind += 4
        }
      }

      // ---- Tasting Notes Adjustments ----
      // Adjust parameters to highlight specific flavor profiles.
      const fruityNotes = ["Strawberry", "Blueberry", "Raspberry", "Blackberry", "Lemon", "Orange", "Grapefruit", "Lime", "Peach", "Apricot", "Cherry", "Plum", "Mango", "Pineapple", "Papaya", "Passionfruit"];
      const nuttyChocoNotes = ["Almond", "Hazelnut", "Walnut", "Peanut", "Chocolate Dark", "Chocolate Milk", "Cocoa Powder"];
      const floralHerbalNotes = ["Jasmine", "Lavender", "Rose", "Chamomile", "Hibiscus", "Mint", "Basil", "Thyme"];
      const heavySweetNotes = ["Molasses", "Maple Syrup", "Caramel", "Honey"];
      const brightCleanNotes = ["Apple", "Pear", "Peach", "Passionfruit", "Jasmine", "Hibiscus", "White Wine"];
      const deepHeavyNotes = ["Chocolate Dark", "Maple Syrup", "Molasses", "Tobacco", "Leather"];
      const acidityNotes = ["Lemon", "Orange", "Lime", "Passionfruit", "White Wine"];
      const creamyNotes = ["Walnut", "Peanut", "Butter", "Cream"];

      if (tastingNotes.some(note => fruityNotes.includes(note))) {
        brewRatio += 0.5; // More water highlights bright, acidic notes.
        bloomTemp += 2;   // Higher temperature boosts fruity extraction.
	grind -= 4;
      }
      if (tastingNotes.some(note => nuttyChocoNotes.includes(note))) {
        brewRatio -= 0.5; // Less water to enhance body and richness.
	grind += 2;
      }
      if (tastingNotes.some(note => floralHerbalNotes.includes(note))) {
        bloomRatio += 0.5; // Extra water in bloom to extract delicate aromatics.
	grind += 2;
      }
      if (tastingNotes.some(note => heavySweetNotes.includes(note))) {
        bloomRatio -= 0.5; // Lower bloom preserves syrupy body.
	grind -= 2;
      }
      if (tastingNotes.some(note => acidityNotes.includes(note))) {
        bloomTime += 5; // Extend bloom to fully extract bright acidity.
	grind -= 4;
      }
      if (tastingNotes.some(note => note === "Brown Sugar")) {
        bloomTime -= 5; // Shorten bloom for a fuller body.
	grind -= 2;
      }
      if (tastingNotes.some(note => creamyNotes.includes(note))) {
        bloomTemp -= 2; // Lower temperature to preserve smooth, creamy textures.
      }
      if (tastingNotes.some(note => brightCleanNotes.includes(note))) {
        pulses = Math.min(pulses+1, 6); // More pulses promote clarity.
      }
      if (tastingNotes.some(note => deepHeavyNotes.includes(note))) {
        pulses = Math.max(pulses-1, 2); // Fewer pulses enhance depth.
	grind += 4;
      }

      // ---- Pulse Temperature Profile ----
      // Determine the temperature for each pulse based on roast profile and process.
      let pulseTemps = [];
	  
        if (roast === "light" || roast === "light-medium") {
          // Light roasts: start lower and gradually increase to enhance extraction.
          let startTemp = 90, endTemp = 96;
          let step = (endTemp - startTemp) / (pulses - 1);
          for (let i = 0; i < pulses; i++) {
            pulseTemps.push(Math.round(startTemp + step * i));
          }
        } else if (roast === "medium") {
          // Medium roasts: maintain a stable temperature.
          for (let i = 0; i < pulses; i++) {
	    if (processing === "Carbonic" || processing === "Anaerobic") {
	      pulseTemps.push(bloomTemp + 1);  // Carbonic/Anaerobic may benefit from the higher range to balance fermentation notes.
	    } else {
            pulseTemps.push(bloomTemp);
          }
	  }
        } else if (roast === "medium-dark") {
          // Darker roasts: start higher then gradually decrease to avoid bitterness.
          let startTemp = 91, endTemp = 85;
          let step = (startTemp - endTemp) / (pulses - 1);
          for (let i = 0; i < pulses; i++) {
	    if (processing === "Anaerobic") {
              pulseTemps.push(Math.round(startTemp -1 - step * i));  // Anaerobic Fermentation dark roasts may need to stay on the lower end to avoid amplifying funky/spiced notes.
	    } else {
	      pulseTemps.push(Math.round(startTemp - step * i));
            }
          }
	} else if (roast === "dark") {
          // Darker roasts: start higher then gradually decrease to avoid bitterness.
          let startTemp = 86, endTemp = 80;
          let step = (startTemp - endTemp) / (pulses - 1);
          for (let i = 0; i < pulses; i++) {
	    if (processing === "Anaerobic") {
              pulseTemps.push(Math.round(startTemp -1 - step * i));  // Anaerobic Fermentation dark roasts may need to stay on the lower end to avoid amplifying funky/spiced notes.
	    } else {
	      pulseTemps.push(Math.round(startTemp - step * i));
            }
          }
	}

		// Adjust temps if Monsoon
		if (processing === "Monsooned") {
			pulseTemps = pulseTemps.map(t => t - 2);
		}
  
        // Further adjust pulse temperatures based on tasting notes.
        if (tastingNotes.some(note => ["Lemon", "Orange", "Grapefruit", "Lime", "Strawberry", "Blueberry", "Raspberry", "Blackberry", "Jasmine", "Lavender", "Rose"].includes(note))) {
          pulseTemps[0] += 1 // Math.max(pulseTemps[0], 96); // Boost first pulse for bright, fruity notes.
        }
        if (tastingNotes.some(note => ["Caramel", "Vanilla", "Brown Sugar", "Honey", "Cocoa Powder"].includes(note))) {
          pulseTemps[pulses - 1] -= 1 // Math.min(pulseTemps[pulses - 1], 90); // Lower final pulse for sweetness.
        }

      // ---- Pulse Temperature Adjustments Based on Days Since Roasted ----
      // Fresh coffee: slightly lower pulse temps to counter CO2 resistance.
      // Aged coffee: slightly higher pulse temps to enhance extraction of diminished volatiles.
      if (!isNaN(daysRoasted)) {
        if (daysRoasted >= 0 && daysRoasted <= 7) {
          pulseTemps = pulseTemps.map(temp => temp - 1);
        } else if (daysRoasted > 20) {
          pulseTemps = pulseTemps.map(temp => temp + 1);
        }
      }

      // Set limits to the variables
      brewRatio = Math.max(14, Math.min(brewRatio, 20));
      bloomRatio = Math.max(1, Math.min(bloomRatio, 3));
      bloomTime = Math.max(1, Math.min(bloomTime, 120));
      bloomTemp = Math.max(50, Math.min(bloomTemp, 99));
      pulses = Math.max(1, Math.min(pulses, 10));
      pulseInterval = Math.max(1, Math.min(pulseInterval, 60));
      pulseTemps = pulseTemps.map(v => Math.min(Math.max(v, 50), 99));

      // Convert from C to F if needed
      bloomTemp = convertTemperature(bloomTemp, selectedUnit);
      pulseTemps = convertTemperature(pulseTemps, selectedUnit);

      displayOutput(name, brewRatio, bloomRatio, bloomTime, bloomTemp, pulses, pulseInterval, pulseTemps, grind, selectedUnit);
    }
  
    function displayOutput(name, brewRatio, bloomRatio, bloomTime, bloomTemp, pulses, pulseInterval, pulseTemps, grind, selectedUnit) {
      // Format the output text for display and for download.
      currentRecipeText = "Coffee Recipe";
      if (name !== "") {
        currentRecipeText += " for " + name;
      }
      currentRecipeText += "\n\nCoffee Grind Setting*: " + grind +
	      		   "\nCoffee-to-Water Ratio: 1:" + parseFloat(brewRatio).toFixed(1) +
                           "\nBloom Ratio: 1:" + parseFloat(bloomRatio).toFixed(1) +
                           "\nBloom Time: " + String(bloomTime) + " seconds" +
                           "\nBloom Temperature: " + String(bloomTemp) + " °" + selectedUnit +
                           "\nNumber of Pulses: " + String(pulses) +
                           "\nTime Between Pulses: " + String(pulseInterval) + " seconds" +
                           "\nPulse Temperatures: " + pulseTemps.join(", ") + " °" + selectedUnit +
	                   "\n"+
	                   "\n* where 0 is your default grind settings for pour over coffee";
  
      // Also display the output on the webpage.
      const outputDiv = document.getElementById('output');
      outputDiv.innerHTML =
        "<h2>Brew Parameters</h2>" +
	"<p><strong>Coffee Grind Setting*:</strong> " + grind + "</p>" +
        "<p><strong>Coffee-to-Water Ratio:</strong> 1:" + parseFloat(brewRatio).toFixed(1) + "</p>" +
        "<p><strong>Bloom Ratio:</strong> 1:" + parseFloat(bloomRatio).toFixed(1) + "</p>" +
        "<p><strong>Bloom Time:</strong> " + String(bloomTime) + " seconds</p>" +
        "<p><strong>Bloom Temperature:</strong> " + String(bloomTemp) + " °" + selectedUnit + "</p>" +
        "<p><strong>Number of Pulses:</strong> " + String(pulses) + "</p>" +
        "<p><strong>Time Between Pulses:</strong> " + String(pulseInterval) + " seconds</p>" +
        "<p><strong>Pulse Temperatures:</strong> " + pulseTemps.join(", ") + " °" + selectedUnit + "</p>" +
	"<p></p>" +
	"<p>* where 0 is your default grind settings for pour over coffee</p>";
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

</html>
