---
layout: post
title: Correlation between Astronaut name and Apollo mission
date: 2015-12-15 18:25:00
description: Perhaps we’ve finally worked out Deke Slayton's method for choosing the Apollo crews, basing it on alphabetical order…
tags: mathematics
related_posts: true
thumbnail: assets/img/apollo_az.png
---

Python's `matplotlib` includes the impressive `XKCDify` feature, which allows plots to resemble Randall Munroe's style from [xkcd.com](https://xkcd.com).  
Upon discovering this feature (`matplotlib.pyplot.xkcd()`), I sought a creative application beyond replicating classic XKCD plots like [xkcd.com/653](https://xkcd.com/653) and [xkcd.com/1220](https://xkcd.com/1220).

Deke Slayton, the chief astronaut, selected the crews for the Apollo and Gemini missions, the exact process he used has been somewhat mysterious...

One day, while walking to work, I recalled that Armstrong, Aldrin, and Collins were on Apollo 11—all near the beginning of the alphabet. Similarly, Conrad and Bean were on Apollo 12 (though I couldn't recall the third crew member at that moment). I also remembered Lovell and Haise from Apollo 13, Shepard from Apollo 14, and Young from Apollo 16. This led me to consider that alphabetical order might have 'influenced' crew assignments.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/apollo_az" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>

Hey look! Clearly the order was, at least partially, determined alphabetically.

Or perhaps not? This observation brings us to the topic of confidence intervals, which are crucial in statistical analysis. While strong correlations can be found between various factors, this doesn't necessarily imply causation. For instance, there's a 0.985 correlation between arcade revenue and computer science doctorates awarded in the U.S. (More examples can be found at [tylervigen.com/spurious-correlations](https://tylervigen.com/spurious-correlations).)  
Even ignoring causation, one thing we should consider is the confidence interval of our correlation.

Confidence intervals indicate the reliability of a statistical measure; more data typically leads to greater trust in the result. These intervals are often specified at levels like 95% or 99%.

Let's examine a simple example, calculating a 95% confidence interval for a percentage:

A TV advertisement claimed that a certain hair conditioner is the nation's favorite, with small print stating, "73% of 64 people asked agreed." This means 47 people concurred (0.73 × 64 ≈ 47). A larger sample size would provide more confidence in this claim. However, we can use the confidence interval to assess the statistical significance of 73% from a sample of 64. The formula for a 95% confidence interval of a percentage is:

$$
95\text{\%} \text{ C.I.} = \pm 1.96 \times \sqrt{\frac{p(1-p)}{n}}
$$

where $p$ is the percentage (as a decimal) and $n$ is the sample size. Applying our numbers:

$$
\begin{align*}
95\text{\% C.I.} &= \pm 1.96 \times \sqrt{\frac{0.73 \times 0.27}{64}} \\
&= \pm 10.9
\end{align*}
$$

This results in a 95% confidence interval of approximately $\pm$11%, indicating that the true percentage likely falls between 62% and 84%. This technique is valuable when evaluating data; always consider confidence intervals to determine the reliability of a result.

In our case, the correlation coefficient between alphabetical ordering and Apollo astronauts is 0.45, suggesting a moderate positive correlation. However, it's essential to examine the confidence interval for this correlation. Calculating confidence intervals for correlations is more complex and often asymmetric. Detailed information on this topic is available at [statology.org](https://www.statology.org/confidence-interval-correlation-coefficient/)). For our data, the confidence interval ranges from 0.023 to 0.738, spanning from no correlation to a strong one.

Therefore, it's uncertain whether we've uncovered Deke's method or not.

The key takeaway is the importance of considering confidence intervals in statistical analysis.

For those interested, here's the [code used to create the plot](https://seanelvidge.github.io/assets/code/apollo_astronaut_az.py), which can serve as a starting point for experimenting with `plt.xkcd()`.
