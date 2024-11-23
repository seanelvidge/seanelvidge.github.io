---
layout: page
title: Upper Atmosphere Modelling
img: https://serene.bham.ac.uk/output/aida/
importance: 1
category: work
related_publications: true
---

The Sun, a dynamic and ever-changing star at the center of our Solar System, periodically unleashes massive eruptions of energy and matter into space. When these eruptions reach Earth, they can disrupt technology, including GPS navigation, satellite orbits, and communication signals. Understanding and predicting these effects is vital, and is the core part of my academic research. The wider-[SERENE group at the University of Birmingham](https://serene.bham.ac.uk/){:target="\_blank"} leads research in this area using advanced mathematical models.

## Modeling the Upper Atmosphere

The upper atmosphere is modeled using three main approaches:

1. Statistical Models: Based on patterns and historical data.
2. Physics-Based Models: Using fundamental laws of physics.
3. Data Assimilation Models: Combining observations with models to improve accuracy.

SERENE's research covers all three areas, using cutting-edge tools to study the ionosphere and thermosphere.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="https://chain-new.chain-project.net/images/GNSS_Station_distribution.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="https://www.swsc-journal.org/articles/swsc/full_html/2019/01/swsc180038/swsc180038-fig8.tif" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="https://www.cosmic.ucar.edu/sites/default/files/styles/extra_large/public/2021-09/cosmic-2-spacecraft-small.jpg__1570x1116_q85_crop_subject_location-785%2C557_subsampling-2_upscale.jpg?itok=xrc8vXDr" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

## Key Models Developed or Used by SERENE

### E-CHAIM (Empirical Canadian High Arctic Ionospheric Model)

E-CHAIM focuses on electron density at high latitudes (above 50°N). It uses a combination of mathematical techniques and a rich database of ionospheric data to create detailed profiles of the upper atmosphere. This model is freely available to use and explore [here](https://chain-new.chain-project.net/index.php/projects/chaim/e-chaim){:target="\_blank"}.

### A-CHAIM (Assimilation Canadian High Arctic Ionosphere Model)

Building on E-CHAIM, A-CHAIM integrates real-time data from ground and satellite sources, refining forecasts using advanced computational methods. By processing data every five minutes, it provides near-instant updates and accurate forecasts for the ionosphere. Check it out [here](https://chain-new.chain-project.net/index.php/projects/chaim/a-chaim){:target="\_blank"}.

### AENeAS (Advanced Ensemble electron density Assimilation System)

AENeAS pushes the boundaries of space weather forecasting. It uses physics-based models combined with global observations to predict the behavior of the upper atmosphere. By addressing challenges like satellite collisions and GPS accuracy, AENeAS supports critical applications such as aviation and satellite management. This model is central to two UK-funded projects that aim to operationalize it at the UK Met Office.

### AIDA (Advanced Ionospheric Data Assimilation)

AIDA is a data assimilation model that blends observations with the "NeQuick" background model to provide ultra-rapid, rapid, and daily updates on ionospheric conditions. You can access its output in near-realtime from [here](https://serene.bham.ac.uk/output/){:target="\_blank"}.

### TIE-GCM (Thermosphere Ionosphere Electrodynamics General Circulation Model)

TIE-GCM, developed in the U.S., is one of the tools SERENE uses to simulate the ionosphere and thermosphere. The team contributes to maintaining and improving this widely used model, including developing a dockerized version for easier access. You can download daily updated TIE-GCM GPI (geophysical index file, with  Kp, F10.7, F10.7A) and IMF (IMF/OMNI data with solar wind density and velocity) [here](https://serene.bham.ac.uk/resources/TIE-GCM/){:target="\_blank"}.
