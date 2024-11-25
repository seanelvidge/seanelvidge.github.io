---
layout: post
title: Maths on a Mug 8
date: 2019-06-01 12:00:00
tags: mathematics MathsOnAMug
related_posts: true
thumbnail: assets/img/mathsonamug/mathsonamug_8.jpeg
---

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <figure>
            {% include figure.liquid loading="eager" path="assets/img/mathsonamug/mathsonamug_8.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
        </figure>
    </div>
</div>

This is the first #MathsOnAMug post related to my day job. 

I've been using a branch of statistics called '[Extreme Value Theory](https://en.wikipedia.org/wiki/Extreme_value_theory){:target="\_blank}' in order to come up with a statistical analysis of extreme space weather events. 

## What is Extreme Value Theory?

At its core, Extreme Value Theory (EVT) is about studying the tail ends of probability distributions - the parts where extreme events occur. While most statistics deal with "typical" values close to the center of a distribution, EVT zooms in on the rare and unusual. It provides a mathematical framework to model the likelihood and magnitude of extremes in a given dataset.

For example:

- Weather: EVT can estimate the probability of a 100-year flood or a record-breaking temperature.
- Finance: EVT helps assess the risk of catastrophic losses in financial markets.
- Engineering: EVT informs the design of structures like dams or bridges to withstand rare but severe stresses.

## How Does EVT Work?

EVT works by identifying patterns in the extreme values of data. It primarily uses two key approaches:

1. Block Maxima Method:
  * Data is divided into fixed blocks (e.g., annual rainfall totals).
  * The maximum value from each block is extracted.
  * These maxima are analyzed to fit one of three extreme value distributions:
    * Gumbel (light tails, for events like temperature extremes),
    * Fréchet (heavy tails, for events like financial crashes),
    * Weibull (bounded tails, for events like wave heights).
2. Peaks Over Threshold (POT) Method:
  * Instead of focusing on block maxima, this method examines all data points exceeding a certain threshold.
  * These exceedances are modeled using the Generalized Pareto Distribution, which provides a flexible way to describe the tail of the distribution.

Both methods aim to estimate the probability of extreme events and their expected severity.

## Why is EVT Important?

### Risk Assessment

Extreme events often have disproportionate consequences. Whether it's designing flood defenses, insuring against hurricanes, or managing financial risks, EVT provides a way to predict the likelihood of extreme scenarios and prepare accordingly.

### Safety and Resilience

Engineers use EVT to ensure that infrastructure can withstand rare but catastrophic events. For example, bridges are built to endure not just the strongest winds observed historically, but also the strongest winds predicted by EVT.

### Understanding a Changing World

In a world affected by climate change, the frequency and intensity of extreme weather events are shifting. EVT helps track and quantify these changes, guiding adaptation strategies.

### Applicability Across Disciplines

From environmental science to cybersecurity, EVT is a universal tool. It can estimate the risk of rare events like devastating cyberattacks or even the spread of misinformation in social networks.

## The Bottom Line

Extreme Value Theory gives us a lens to look beyond the ordinary, peering into the rare and unpredictable. By understanding the mathematics of extremes, we gain the tools to prepare for, and potentially mitigate, the most significant challenges nature and society throw our way. It’s a reminder that in life, as in statistics, the most unexpected events often carry the greatest consequences.

## EVT in Space Weather

There has been a lot of work on using EVT in space weather, on a wide range of topics. Personally I have used it to estiamte the run times of [solar flares](https://en.wikipedia.org/wiki/Solar_flare){:target="\_blank}, the [aa index](https://geomag.bgs.ac.uk/data_service/data/magnetic_indices/aaindex.html){:target="\_blank} and the probability of the [May 2024 solar storms](https://en.wikipedia.org/wiki/May_2024_solar_storms){:target="\_blank}:

* Elvidge, S., & Angling, M. J. (2018). Using extreme value theory for determining the probability of Carrington-like solar flares. Space Weather, 16, 417–421. [https://doi.org/10.1002/2017SW001727](https://doi.org/10.1002/2017SW001727){:target="\_blank}
* Elvidge, S. (2020). Estimating the occurrence of geomagnetic activity using the Hilbert-Huang transform and extreme value theory. Space Weather, 17, e2020SW002513. [https://doi.org/10.1029/2020SW002513](https://doi.org/10.1029/2020SW002513){:target="\_blank}
* Elvidge, S., & Themens, D. R. (2024). The Probability of the May 2024 Geomagnetic Superstorm. Authorea Preprints.
