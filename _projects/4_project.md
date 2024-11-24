---
layout: page
title: Satellite drag
img: assets/img/satellite.jpg
importance: 3
category: work
---

The potential collision of satellites in Low Earth Orbit (LEO) poses a significant challenge for modern society, as our reliance on satellite-based technologies continues to grow. Accurate forecasting of the upper atmosphere is crucial in predicting satellite orbits, mitigating risks, and ensuring the safe operation of these essential assets.

Our state-of-the-art thermosphere model, AENeAS (Advanced Ensemble electron density Assimilation System), is designed to address this issue. AENeAS is being deployed for operational use at the UK Met Office, providing both real-time assessments (nowcasts) of the thermosphere and accurate, actionable forecasts. These forecasts are invaluable for satellite operators, as they can inform decision-making processes related to collision avoidance, ultimately enhancing the safety and longevity of satellites in LEO.

A key innovation of AENeAS is the novel assimilation of two-line element (TLE) data and orbital radar information, as well as taking advantage of a wealth of ionospheric observations. By incorporating these datasets into our model, we can achieve a more comprehensive understanding of the thermosphere and its impact on satellite orbits. This, in turn, improves the precision and reliability of our forecasts, offering satellite operators the insights they need to make well-informed decisions.

Collaboration is at the core of our approach, as we work closely with a diverse range of stakeholders, including industry, government agencies, and international research universities and institutions. These partnerships allow us to exchange knowledge, resources, and expertise, ultimately fostering the development of cutting-edge solutions to the challenges posed by satellite collisions in LEO.

By continuously refining and expanding our thermosphere model, AENeAS, we strive to advance our understanding of the upper atmosphere, improve satellite orbit predictions, and contribute to the safe and sustainable operation of satellite-based technologies that are vital to modern society.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/bsOjryyK5fI?si=y_YTyEl7emYTl8N8&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>
    <div class="col-sm-4 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/Iridium.png" title="Iridium satellite" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/6.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm-4 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/11.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    You can also have artistically styled 2/3 + 1/3 images, like these.
</div>

The code is simple.
Just wrap your images with `<div class="col-sm">` and place them inside `<div class="row">` (read more about the <a href="https://getbootstrap.com/docs/4.4/layout/grid/">Bootstrap Grid</a> system).
To make images responsive, add `img-fluid` class to each; for rounded corners and shadows use `rounded` and `z-depth-1` classes.
Here's the code for the last row of images above:

{% raw %}

```html
<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/6.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/11.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
```

{% endraw %}
