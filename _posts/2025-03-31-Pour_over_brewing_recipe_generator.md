---
layout: post
title: Pour Over Brewing Recipe Generator
date: 2025-03-31 18:41:00
description: Generate pour over brewing coffee reciepes for a given bean
tags: misc
thumbnail: assets/img/fellow_aiden_full.jpg
related_posts: true
giscus_comments: true
---

I recently purchased a [Fellow Aiden Precision Coffee Maker](https://amzn.to/4j7ni2U) which is a pour over coffee brewer. Able to brew individual cups to whole batches this machine is fantastic, and gives you complete control of the recipe it uses. From the bloom time and temperature to the number of pulses and the ability to control the temperature of each individual pulse.

There are a number of default reciepes included and through the [Fellow Drops](https://fellowproducts.com/pages/fellow-drops) programme you can get a number of tuned recipes for those coffees. Whilst, at the end of the day, coffee all coems down to personal preference, and any provided reciepe will need fine tuning, there are some fundamentals which provide a good starting point. To try and capture that information I have made the following recipe generator:

[seanelvidge.com/brewcoffee](https://seanelvidge.com/brewcoffee)

If you visit that page, with the details of the coffee bean you have, you can have a look at what the reciepe generator says you should use. If you would like (a lot) more detail of the decisions that I have made to create the generator then read on.

# Roast Level Adjustments

Roast level significantly influences extraction dynamics. Light roasts, dense and less porous, require extended blooming (initial wetting) and multiple pulses of hot water at precise intervals to fully unlock their flavors. Consequently, the recipe defaults for light roasts feature higher bloom ratios and longer bloom times, ensuring sufficient CO₂ release for consistent extraction.

Conversely, dark roasts, due to their brittleness and faster extraction tendency, need lower extraction ratios and fewer pulses to avoid bitterness. The recipe parameters for darker roasts emphasize shorter bloom times and higher initial bloom temperatures to develop complexity without over-extraction.

### Specifics

Light Roast:

- Brew Ratio: Increased to 17 for lighter body.
- Bloom Ratio: Increased to 3.5 to aid degassing.
- Bloom Time: Extended to 60 seconds for thorough extraction.
- Pulse Count: Increased to 6, ensuring complete flavor extraction.

Dark Roast:

- Brew Ratio: Reduced to 15 to intensify body and reduce bitterness.
- Bloom Ratio: Decreased to 1.5 due to easier extraction.
- Bloom Time: Shortened to 40 seconds to prevent over-extraction.
- Pulse Count: Reduced to 3, limiting extraction bitterness.

# Bean Origin Influence

Beans from different regions exhibit unique physical traits influencing their extraction behavior. East African coffees, typically denser with higher solubility, require gentler bloom phases—lower ratios, shorter times, and reduced temperatures—to mitigate over-extraction and accentuate their bright, vibrant acidity.

Latin American coffees often demand a longer bloom and higher temperatures to thoroughly degas and enhance sweetness and body. Indonesian coffees, known for their robust character, are best extracted with moderate bloom parameters that balance intensity with clarity.

### Specifics

East African (Ethiopia, Kenya, etc.):

- Bloom Ratio: Decreased by 0.5 to minimize over-extraction.
- Bloom Time: Shortened by 5 seconds.
- Bloom Temperature: Reduced by 3°C.
- Pulse Count: Decreased by 1 to control acidity.

Latin American (Brazil, Colombia, Guatemala):

- Bloom Ratio: Increased by 0.5 for effective degassing.
- Bloom Time: Increased by 5 seconds.
- Bloom Temperature: Raised by 3°C.
- Pulse Count: Increased by 1 to promote even extraction.

Indonesian (Sumatra, Java):

- Bloom Ratio set to 2.5, Bloom Time standardized at 50 seconds.
- Pulse Count: Increased by 1 to maximize extraction clarity.

# Altitude Considerations

High-altitude coffees, denser due to slower maturation, need more aggressive extraction parameters—finer grind, stronger brew ratios, and longer bloom durations—to achieve optimal flavor development. In contrast, lower-altitude beans benefit from coarser grinds and gentler extraction processes to preserve balance and avoid bitterness.

### Specifics

High Altitude (>1500m):

- Brew Ratio: Reduced by 0.5 for stronger extraction.
- Bloom Ratio: Increased by 0.5 to assist degassing.
- Bloom Time: Increased by 5 seconds.
- Grind Size: Finer by 2 increments.

Low Altitude (<1200m):

- Brew Ratio: Increased by 0.5 for gentler extraction.
- Bloom Ratio: Decreased by 0.5.
- Bloom Time: Reduced by 5 seconds.
- Grind Size: Coarser by 2 increments.

# Processing Method Adjustments

Processing significantly impacts bean composition. Natural, honey, and anaerobic coffees, rich in sugars, require longer bloom periods and additional pulses to evenly extract these complex flavors. Washed coffees, typically cleaner and less dense, are best brewed with shorter blooms and fewer pulses, maintaining clarity and brightness.

### Specifics

Natural, Honey, Carbonic, Anaerobic:

- Bloom Ratio: Increased by 0.5 (minimum of 2.5).
- Bloom Time: Extended by 5 seconds (minimum of 45 seconds).
- Pulse Count: Increased by 1 to control extraction consistency.

Washed, Double Fermentation, Wet-Hulled:

- Bloom Ratio: Decreased by 0.5.
- Bloom Time: Reduced by 5 seconds.
- Pulse Count: Decreased by 1.

# Freshness Factor

The age of roasted coffee profoundly affects extraction due to CO₂ levels. Freshly roasted beans (0-7 days) release considerable CO₂, necessitating increased bloom water ratios, longer bloom times, and finer grinds to ensure thorough extraction without bitterness. Conversely, older beans (>20 days) benefit from shorter blooms, lower temperatures, and coarser grinds to avoid over-extraction and maintain desirable flavors.

### Specifics

Fresh Coffee (0–7 days):

- Bloom Ratio: Increased by 0.5.
- Bloom Time: Extended by 5 seconds.
- Grind Size: Finer by 4 increments.
- Pulse temperatures decreased by 1°C per pulse to counter CO₂ resistance.

Older Coffee (>20 days):

- Bloom Ratio: Decreased by 0.5.
- Bloom Time: Reduced by 5 seconds.
- Grind Size: Coarser by 4 increments.
- Pulse temperatures increased by 1°C per pulse to improve extraction.

# Flavor Profile Targeting

Achieving specific tasting notes requires fine-tuning extraction parameters:

- Fruity and acidic notes: Higher temperatures and finer grinds enhance bright flavors.
- Nutty and chocolatey notes: Richer bodies are cultivated through lower brew ratios and coarser grinds.
- Floral and herbal notes: Delicate aromatics emerge clearly with increased bloom ratios.
- Sweet and heavy notes: Lower bloom ratios preserve syrupy, sweet profiles.
- Creamy textures: Lower temperatures ensure smooth, rounded mouthfeels.

### Specifics

Fruity/Acidic Notes:

- Brew Ratio: Increased by 0.5 for brightness.
- Bloom Temperature: Raised by 2°C.
- Grind Size: Finer by 4 increments.

Nutty/Chocolate Notes:

- Brew Ratio: Decreased by 0.5 for richer body.
- Grind Size: Coarser by 2 increments.

Floral/Herbal Notes:

- Bloom Ratio: Increased by 0.5 for aromatic extraction.
- Grind Size: Coarser by 2 increments.

Heavy Sweet Notes:

- Bloom Ratio: Reduced by 0.5 for syrupy texture.
- Grind Size: Finer by 2 increments.

Creamy Notes:

- Bloom Temperature: Reduced by 2°C to preserve smoothness.

# Pulse Temperature Profiles

Dynamic pulse temperatures optimize extraction across roast levels:

- Light roasts gradually increase temperature across pulses, enhancing complexity.
- Medium roasts maintain stable temperatures for balanced extraction.
- Dark roasts reduce temperatures progressively to avoid bitterness, enhancing depth.

Final pulse temperatures further adjust to emphasize specific tasting notes—higher initial temperatures highlight bright, fruity notes, while lower final temperatures preserve sweetness and depth.

### Specifics

Light Roasts: Gradually increase temperature from 90°C to 96°C.

Medium Roasts: Maintain stable bloom temperature; adjust slightly for anaerobic or carbonic processes.

Dark Roasts: Decrease temperature progressively from 91°C to 85°C to minimize bitterness.

# Conclusion

The [Fellow Aiden Precision Coffee Maker](https://amzn.to/4j7ni2U) is a great coffee brewer, giving you almost complete control of the brewing process. You can access the recipe generator here:

[seanelvidge.com/brewcoffee](https://seanelvidge.com/brewcoffee)
