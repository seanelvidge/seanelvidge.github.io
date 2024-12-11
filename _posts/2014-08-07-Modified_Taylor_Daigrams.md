---
layout: post
title: Modified Taylor Diagrams
date: 2014-08-07 21:29:00
description: Python code for making your own modified Taylor diagrams.
tags: code spaceWeather
thumbnail: assets/img/mtd.jpg
related_posts: true
---

[Taylor diagrams](https://en.wikipedia.org/wiki/Taylor_diagram) are a nice way of visualizing validation results of a variety of models. The diagrams can be used to graphically summarize how close a set of patterns (in this case a set of models) match observations. This is done by plotting the standard deviation of the time series of the model values, against the correlation (the Pearson product-moment correlation) between the time series of the model values and the observations. Exploiting the geometric relationship between correlation and standard deviation we can also plot the standard deviation of the model error.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <figure style="max-width:50%;">
            {% include figure.liquid loading="eager" path="assets/img/mtd.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
        </figure>
    </div>
</div>

Whilst Taylor originally used the "centered pattern RMS difference" my approach [(as described in this paper](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1002/2014RS005435)) is to use the standard deviation of the model errors, a more commonly undertstood term. Additionally Taylor's original approach did not allow for the plotting of model biases, I have added this via a colour scale.

Python code to make your own modified Taylor diagrams is [avaialble here](/assets/code/modifiedtaylordiagram.py).
