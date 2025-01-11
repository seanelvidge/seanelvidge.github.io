---
layout: post
title: Euro 2020 Predictions
date: 2021-06-07 15:09:00
description: It’s football tournament time, which means it’s football tournament prediction time.
tags: mathematics football
related_posts: true
thumbnail: assets/img/wc2018/WCicon.png
---

For the 2018 World Cup I created a prediction model for the tournament (you can read the [details here](https://seanelvidge.github.io/article/2018/World_Cup_2018_Predictions/){:target="\_blank"}. Overall the model did well and I was pretty happy with it.

For this tournament, Euro ~~2020~~ ~~2021~~ 2020 (it took me a while to realize that this tournament is called Euro 2020) I have built a new model which is much more simple than my World Cup variant.

There are a few reasons for this decision, primarily based around the fact that this particular tournament is not going to be hosted in one country (as it is usually), but instead will be played over 11 countries. Whilst this could be accounted for in the modelling (as many other people have done) I am not sure exactly how this home advantage will pan out – because the change of format is something which we just have no data on. Not to mention that this year, for the first time, there was a higher % of away wins (40) than home wins (38) [obviously this past year almost every game has been played behind closed doors].

So my model for this tournament first requires a rating for each team. This is similar to the [World Football Elo ratings (WFER)](https://www.eloratings.net/){:target="\_blank"} but with some changes I have made (I am currently writing up the exact details). It then takes every World Cup and European Championship fixture, excludes the home team (since I do not want that impact in my model) and then looks at the “home” team rating and “away” team rating (these are now meaningless terms) and what the result was.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <figure>
            {% include figure.liquid loading="eager" path="assets/img/euro2020/hda_3.png" class="img-fluid rounded z-depth-1" zoomable=true %}
            <figcaption style="text-align: center; margin-top: 8px;">Scatter plot of ‘[H]ome win’, ‘[D]raw’ and ‘[A]way win’ by team rating.</figcaption>
        </figure>
    </div>
</div>

Whilst this plot is obviously quite messy, overall we can see some rough trends. These highlight an immediate problem. Given that I thought I had removed home advantage we should expect that the black line would be exactly on the line y=x. That is, if two teams are equally rated you would expect this is more likely to result in a draw. However you can see from the figure that this is not true. Although the red, ‘away win’ and blue ‘home win’ regressions do confirm what we would expect – e.g. if the home team has a higher rating than the away team then it is more likely to result in a home win. The issues could be explained by either residual home/away impacts in the data, or an issue with my team rating system.

Using this data we could now fit any number of machine learning classification models. For this model we use a [naive Bayes classifier](https://en.wikipedia.org/wiki/Naive_Bayes_classifier){:target="\_blank"}, which gives the following probabilities for a home or away win, or a draw:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
    <figure>
        {% include figure.liquid loading="eager" path="assets/img/euro2020/homeWin.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
        <figcaption style="text-align: center; margin-top: 8px;">Home win probabilities (note the change in colour scale for the draw plot)</figcaption>
    </figure>
    </div>
    <div class="col-sm mt-3 mt-md-0">
    <figure>
        {% include figure.liquid loading="eager" path="assets/img/euro2020/awayWin.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
        <figcaption style="text-align: center; margin-top: 8px;">Away win probabilities (note the change in colour scale for the draw plot)</figcaption>
    </figure>
    </div>
	<div class="col-sm mt-3 mt-md-0">
    <figure>
        {% include figure.liquid loading="eager" path="assets/img/euro2020/draw.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
        <figcaption style="text-align: center; margin-top: 8px;">Draw probabilities (note the change in colour scale for the draw plot)</figcaption>
    </figure>
    </div>
</div>

The above plots show how the probability of a given event changes as a function of the two teams rating. Combining all of these plots into one shows the decision ‘surfaces’, as the model transitions from ‘H’ to ‘D’ to ‘A’.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <figure>
            {% include figure.liquid loading="eager" path="assets/img/euro2020/dSurface.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
            <figcaption style="text-align: center; margin-top: 8px;">Plot of decision surfaces for the Euro 2020 prediction model.</figcaption>
        </figure>
    </div>
</div>

This model can then be used to predict the outcome of the European Championships. Simulating the entire tournament 20,000 times (this was made slightly difficult by the way [some] third-placed teams enter the knockout phase) gives rise to the following probabilities for tournament winners:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <figure>
            {% include figure.liquid loading="eager" path="assets/img/euro2020/EC_plot_20000.png" class="img-fluid rounded z-depth-1" zoomable=true %}
            <figcaption style="text-align: center; margin-top: 8px;">Probabilities of teams winning Euro 2020.</figcaption>
        </figure>
    </div>
</div>

My model predicts that France is most likely to win Euro 2020 closely followed by Belgium. Unfortunately the model only ranks England as 7th most likely with odds of 6.6%.

I have entered my model in the [Futbolmetrix sophisticated prediction contest](https://futbolmetrix.wordpress.com/2021/06/03/euro-2020-sophisticated-prediction-contest/){:target="\_blank"}, so it will be interesting to see how that turns out.
