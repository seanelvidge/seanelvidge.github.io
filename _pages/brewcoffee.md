---
layout: page
permalink: /brewcoffee
title: Pulse Pour-Over Coffee Recipe Generator
description: Build a recipe around your coffee, then compare how it changes as the beans rest.
nav: false
tags: coffee
---

<link rel="stylesheet" href="{{ '/assets/css/team-rankings.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/football-tools.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/brew-coffee.css' | relative_url }}">

<div class="team-rankings football-tool coffee-tool" id="coffee-tool">
  <p class="rankings-note">A starting point for pulsed pour-over brewing, primarily designed for the <a href="https://amzn.to/4j7ni2U">Fellow Aiden Precision Coffee Maker</a>. <a href="https://seanelvidge.com/articles/2025/Pour_over_brewing_recipe_generator/">Read about the methodology</a>.</p>
  <form id="coffee-form" class="football-panel">
    <fieldset>
      <legend class="football-label">Roast level <span class="rankings-note">(required)</span></legend>
      <div class="coffee-roasts"><label><input type="radio" name="roast" value="light" required><span><i aria-hidden="true" style="--roast-colour:#cfad7b"></i>Light</span></label>
<label><input type="radio" name="roast" value="light-medium" required><span><i aria-hidden="true" style="--roast-colour:#b08050"></i>Light–medium</span></label>
<label><input type="radio" name="roast" value="medium" required><span><i aria-hidden="true" style="--roast-colour:#8b5c36"></i>Medium</span></label>
<label><input type="radio" name="roast" value="medium-dark" required><span><i aria-hidden="true" style="--roast-colour:#633e2b"></i>Medium–dark</span></label>
<label><input type="radio" name="roast" value="dark" required><span><i aria-hidden="true" style="--roast-colour:#39271e"></i>Dark</span></label></div>
    </fieldset>
    <div class="coffee-input-grid">
      <section aria-labelledby="coffee-beans-heading">
        <h2 id="coffee-beans-heading">About your beans</h2>
        <p class="rankings-note">Everything below is optional. Use what’s on the bag.</p>
        <div class="football-field"><label for="coffee-name">Coffee name</label><input type="text" id="coffee-name" placeholder="e.g. My morning blend" maxlength="200"></div>
        <div class="football-field"><label for="coffee-country">Origin</label><input type="text" id="coffee-country" list="coffee-countries" placeholder="Type or select a country" autocomplete="off"><datalist id="coffee-countries"><option value="Angola"></option>
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
		<option value="Zimbabwe"></option></datalist></div>
        <div class="football-field"><label for="coffee-processing">Processing method</label><select id="coffee-processing"><option value="">Not specified</option>
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
        <option value="Double Fermentation">Double Fermentation</option></select></div>
        <fieldset class="coffee-altitude">
          <legend class="football-label">Growing altitude</legend>
          <div class="football-date-fields">
            <div class="football-field"><label for="coffee-altitude-min">Altitude / minimum (m)</label><input id="coffee-altitude-min" type="number" min="0" step="any" placeholder="e.g. 1500" aria-describedby="coffee-altitude-help"></div>
            <div class="football-field"><label for="coffee-altitude-max">Maximum (m, optional)</label><input id="coffee-altitude-max" type="number" min="0" step="any" placeholder="e.g. 1800" aria-describedby="coffee-altitude-help"></div>
          </div>
          <p id="coffee-altitude-help" class="rankings-note">Enter one altitude, or two for a range. A range uses its midpoint.</p>
        </fieldset>
      </section>
      <section aria-labelledby="coffee-notes-heading">
        <h2 id="coffee-notes-heading">Tasting notes</h2>
        <p class="rankings-note">Choose any notes from the bag, or “Other” in the closest family. Tap a selected chip to remove it.</p>
        <div class="football-field"><label for="coffee-note-search">Find a tasting note</label><input id="coffee-note-search" type="search" placeholder="e.g. chocolate, lemon, caramel" autocomplete="off" aria-controls="coffee-note-groups"></div>
        <div class="coffee-selection-heading"><span id="coffee-note-count" class="rankings-note" role="status">No notes selected</span><button id="coffee-clear-notes" class="rankings-button" type="button" hidden>Clear notes</button></div>
        <div id="coffee-selected-notes" class="coffee-selected-notes"></div>
        <div id="coffee-note-groups"><details class="coffee-note-group" open><summary>Fruity Notes</summary><div class="coffee-chips"><label><input type="checkbox" name="tastingNotes" value="Apple"><span>Apple</span></label>
<label><input type="checkbox" name="tastingNotes" value="Apricot"><span>Apricot</span></label>
<label><input type="checkbox" name="tastingNotes" value="Blackberry"><span>Blackberry</span></label>
<label><input type="checkbox" name="tastingNotes" value="Blackcurrant"><span>Blackcurrant</span></label>
<label><input type="checkbox" name="tastingNotes" value="Blueberry"><span>Blueberry</span></label>
<label><input type="checkbox" name="tastingNotes" value="Cherry"><span>Cherry</span></label>
<label><input type="checkbox" name="tastingNotes" value="Fig"><span>Fig</span></label>
<label><input type="checkbox" name="tastingNotes" value="Grape"><span>Grape</span></label>
<label><input type="checkbox" name="tastingNotes" value="Grapefruit"><span>Grapefruit</span></label>
<label><input type="checkbox" name="tastingNotes" value="Lemon"><span>Lemon</span></label>
<label><input type="checkbox" name="tastingNotes" value="Lime"><span>Lime</span></label>
<label><input type="checkbox" name="tastingNotes" value="Lychee"><span>Lychee</span></label>
<label><input type="checkbox" name="tastingNotes" value="Mandarin"><span>Mandarin</span></label>
<label><input type="checkbox" name="tastingNotes" value="Mango"><span>Mango</span></label>
<label><input type="checkbox" name="tastingNotes" value="Nectarine"><span>Nectarine</span></label>
<label><input type="checkbox" name="tastingNotes" value="Orange"><span>Orange</span></label>
<label><input type="checkbox" name="tastingNotes" value="Papaya"><span>Papaya</span></label>
<label><input type="checkbox" name="tastingNotes" value="Passionfruit"><span>Passionfruit</span></label>
<label><input type="checkbox" name="tastingNotes" value="Peach"><span>Peach</span></label>
<label><input type="checkbox" name="tastingNotes" value="Pear"><span>Pear</span></label>
<label><input type="checkbox" name="tastingNotes" value="Pineapple"><span>Pineapple</span></label>
<label><input type="checkbox" name="tastingNotes" value="Plum"><span>Plum</span></label>
<label><input type="checkbox" name="tastingNotes" value="Raisin"><span>Raisin</span></label>
<label><input type="checkbox" name="tastingNotes" value="Raspberry"><span>Raspberry</span></label>
<label><input type="checkbox" name="tastingNotes" value="Strawberry"><span>Strawberry</span></label>
<label><input type="checkbox" name="tastingNotes" value="Other Fruity"><span>Other Fruity</span></label></div></details>
<details class="coffee-note-group"><summary>Nutty &amp; Chocolate Notes</summary><div class="coffee-chips"><label><input type="checkbox" name="tastingNotes" value="Almond"><span>Almond</span></label>
<label><input type="checkbox" name="tastingNotes" value="Cashew"><span>Cashew</span></label>
<label><input type="checkbox" name="tastingNotes" value="Chocolate Dark"><span>Chocolate (Dark)</span></label>
<label><input type="checkbox" name="tastingNotes" value="Chocolate Milk"><span>Chocolate (Milk)</span></label>
<label><input type="checkbox" name="tastingNotes" value="Cocoa Powder"><span>Cocoa Powder</span></label>
<label><input type="checkbox" name="tastingNotes" value="Hazelnut"><span>Hazelnut</span></label>
<label><input type="checkbox" name="tastingNotes" value="Peanut"><span>Peanut</span></label>
<label><input type="checkbox" name="tastingNotes" value="Pecan"><span>Pecan</span></label>
<label><input type="checkbox" name="tastingNotes" value="Pistachio"><span>Pistachio</span></label>
<label><input type="checkbox" name="tastingNotes" value="Walnut"><span>Walnut</span></label>
<label><input type="checkbox" name="tastingNotes" value="Other Nutty &amp; Chocolate"><span>Other Nutty &amp; Chocolate</span></label></div></details>
<details class="coffee-note-group"><summary>Sweet &amp; Caramel Notes</summary><div class="coffee-chips"><label><input type="checkbox" name="tastingNotes" value="Brown Sugar"><span>Brown Sugar</span></label>
<label><input type="checkbox" name="tastingNotes" value="Butterscotch"><span>Butterscotch</span></label>
<label><input type="checkbox" name="tastingNotes" value="Caramel"><span>Caramel</span></label>
<label><input type="checkbox" name="tastingNotes" value="Honey"><span>Honey</span></label>
<label><input type="checkbox" name="tastingNotes" value="Maple Syrup"><span>Maple Syrup</span></label>
<label><input type="checkbox" name="tastingNotes" value="Molasses"><span>Molasses</span></label>
<label><input type="checkbox" name="tastingNotes" value="Toffee"><span>Toffee</span></label>
<label><input type="checkbox" name="tastingNotes" value="Other Sweet &amp; Caramel"><span>Other Sweet &amp; Caramel</span></label></div></details>
<details class="coffee-note-group"><summary>Floral, Herbal &amp; Tea Notes</summary><div class="coffee-chips"><label><input type="checkbox" name="tastingNotes" value="Basil"><span>Basil</span></label>
<label><input type="checkbox" name="tastingNotes" value="Bergamot"><span>Bergamot</span></label>
<label><input type="checkbox" name="tastingNotes" value="Black Tea"><span>Black Tea</span></label>
<label><input type="checkbox" name="tastingNotes" value="Chamomile"><span>Chamomile</span></label>
<label><input type="checkbox" name="tastingNotes" value="Green Tea"><span>Green Tea</span></label>
<label><input type="checkbox" name="tastingNotes" value="Hibiscus"><span>Hibiscus</span></label>
<label><input type="checkbox" name="tastingNotes" value="Jasmine"><span>Jasmine</span></label>
<label><input type="checkbox" name="tastingNotes" value="Lavender"><span>Lavender</span></label>
<label><input type="checkbox" name="tastingNotes" value="Mint"><span>Mint</span></label>
<label><input type="checkbox" name="tastingNotes" value="Orange Blossom"><span>Orange Blossom</span></label>
<label><input type="checkbox" name="tastingNotes" value="Rose"><span>Rose</span></label>
<label><input type="checkbox" name="tastingNotes" value="Thyme"><span>Thyme</span></label>
<label><input type="checkbox" name="tastingNotes" value="Other Floral &amp; Herbal"><span>Other Floral &amp; Herbal</span></label></div></details>
<details class="coffee-note-group"><summary>Creamy Notes</summary><div class="coffee-chips"><label><input type="checkbox" name="tastingNotes" value="Butter"><span>Butter</span></label>
<label><input type="checkbox" name="tastingNotes" value="Coconut"><span>Coconut</span></label>
<label><input type="checkbox" name="tastingNotes" value="Cream"><span>Cream</span></label>
<label><input type="checkbox" name="tastingNotes" value="Vanilla"><span>Vanilla</span></label>
<label><input type="checkbox" name="tastingNotes" value="Other Creamy"><span>Other Creamy</span></label></div></details>
<details class="coffee-note-group"><summary>Earthy &amp; Roasted Notes</summary><div class="coffee-chips"><label><input type="checkbox" name="tastingNotes" value="Cedar"><span>Cedar</span></label>
<label><input type="checkbox" name="tastingNotes" value="Cereal"><span>Cereal</span></label>
<label><input type="checkbox" name="tastingNotes" value="Leather"><span>Leather</span></label>
<label><input type="checkbox" name="tastingNotes" value="Moss"><span>Moss</span></label>
<label><input type="checkbox" name="tastingNotes" value="Mushroom"><span>Mushroom</span></label>
<label><input type="checkbox" name="tastingNotes" value="Smoke"><span>Smoke</span></label>
<label><input type="checkbox" name="tastingNotes" value="Tobacco"><span>Tobacco</span></label>
<label><input type="checkbox" name="tastingNotes" value="Toast"><span>Toast</span></label>
<label><input type="checkbox" name="tastingNotes" value="Other Earthy &amp; Roasted"><span>Other Earthy &amp; Roasted</span></label></div></details>
<details class="coffee-note-group"><summary>Fermented &amp; Wine-like Notes</summary><div class="coffee-chips"><label><input type="checkbox" name="tastingNotes" value="Fermented Fruit"><span>Fermented Fruit</span></label>
<label><input type="checkbox" name="tastingNotes" value="Red Wine"><span>Red Wine</span></label>
<label><input type="checkbox" name="tastingNotes" value="Rum"><span>Rum</span></label>
<label><input type="checkbox" name="tastingNotes" value="White Wine"><span>White Wine</span></label>
<label><input type="checkbox" name="tastingNotes" value="Yeast"><span>Yeast</span></label>
<label><input type="checkbox" name="tastingNotes" value="Other Fermented &amp; Wine-like"><span>Other Fermented &amp; Wine-like</span></label></div></details>
<details class="coffee-note-group"><summary>Spiced Notes</summary><div class="coffee-chips"><label><input type="checkbox" name="tastingNotes" value="Cardamom"><span>Cardamom</span></label>
<label><input type="checkbox" name="tastingNotes" value="Cinnamon"><span>Cinnamon</span></label>
<label><input type="checkbox" name="tastingNotes" value="Clove"><span>Clove</span></label>
<label><input type="checkbox" name="tastingNotes" value="Nutmeg"><span>Nutmeg</span></label>
<label><input type="checkbox" name="tastingNotes" value="Other Spiced"><span>Other Spiced</span></label></div></details></div>
        <p id="coffee-no-notes" class="rankings-note" role="status" hidden>No matching notes. Clear the search and choose “Other” in the closest family.</p>
      </section>
    </div>
    <div class="football-actions">
      <button type="submit" class="rankings-button rankings-button-primary">Generate three recipes</button>
      <button id="coffee-reset" type="button" class="rankings-button">Reset</button>
    </div>
    <p class="rankings-note">You’ll get versions for under 2 weeks, 2–6 weeks, and over 6 weeks after roasting—no roast-date entry needed.</p>
  </form>
  <p id="coffee-status" class="rankings-note" role="status" aria-live="polite"></p>
  <section id="coffee-output" aria-labelledby="coffee-output-title" hidden>
    <div class="rankings-toolbar football-output-heading">
      <div><h2 id="coffee-output-title">Your brewing recipes</h2><p id="coffee-summary" class="rankings-note"></p></div>
      <fieldset><legend class="football-label">Temperature units</legend><div class="football-segments"><label><input type="radio" name="coffee-unit" value="C" checked><span>°C</span></label><label><input type="radio" name="coffee-unit" value="F"><span>°F</span></label></div></fieldset>
    </div>
    <p class="rankings-note">“Changed” marks a difference from the 2–6-week recipe. Day 14 starts the middle band; day 42 is still included. The long-term temperature reduction starts after 6 weeks.</p>
    <div id="coffee-recipes" class="coffee-recipes"></div>
    <p class="rankings-note">Grind is a relative adjustment: 0 is your usual pour-over setting, negative is finer and positive is coarser. Adjustments are capped at −16 to +16; these numbers are not calibrated grinder clicks. Bloom ratio is limited to 1:3 for the Fellow brewer.</p>
    <p class="rankings-note">Treat these recipes as starting points and adjust to taste. The age bands are recipe presets, not a judgement of when a coffee is at its best; roast, storage and the coffee itself also matter.</p>
    <div class="football-actions">
      <button id="coffee-download" type="button" class="rankings-button rankings-button-primary">Download all three recipes</button>
      <button id="coffee-copy" type="button" class="rankings-button">Copy recipes</button>
    </div>
  </section>
  <noscript>Enable JavaScript to generate your coffee recipes.</noscript>
</div>

<script defer src="{{ '/assets/js/coffee-recipe.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/brew-coffee.js' | relative_url }}"></script>
