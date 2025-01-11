---
layout: post
title: Euro 2020 – Round 1 Results & Validation Methodology
date: 2021-06-15 23:14:00
description: Description of the methodology for validating my Euro 2020 football model
tags: mathematics football
related_posts: true
thumbnail: assets/img/euro2020/dSurface.jpg
---

With the first round of fixtures complete we can have a first peak of how well our model is doing (for the details about my Euro’s prediction model see my [previous post](https://seanelvidge.github.io/article/2021/Euro_2020_Predictions/){:target="\_BLANK"}.)

A hugely important thing for any model is validation. How well is our model doing? One way to investigate this is by looking at the [Brier Score](https://en.wikipedia.org/wiki/Brier_score){:target="\_BLANK"} of the model. The Brier score is used to measure the accuracy of probabilistic predictions. Fundamentally it is the mean square error of the forecast and varies from 0 (perfect prediction) to 2. So the lower the score the better. For each result a Brier score is calculated and then an overall score is given to the models by taking the mean value.

As a baseline, a simple prediction of 33% for each result (win/draw/loss) gives you a Brier score of 0.666. So we should always be looking to do better than that. Likely the best model of this tournament will be that of the bookies (it usually is!). Our version of the bookies model will be to take the average of a range of bookies (rather than taking any one organisation) which can be found on [oddsportal.com](http://www.oddsportal.com/){:target="\_BLANK"}, these are then converted to a probability.

Two final models for comparison come from ‘crowd wisdom’. Firstly from [SofaScore](http://www.sofascore.com/){:target="\_BLANK"}, where people can vote on a particular result (typically over 170,000 people vote on these results). Very little thought is needed, you simply press a button about what result you think is most likely, and this is a “secondary” reason for using the app (it is for finding out sports scores). An alternative crowd model comes from a smaller, “smarter”, crowd.

For the Premier League, FA Cup, World Cup and Euro’s my friends and I take part in a prediction competition, we predict the result of every fixture (with a suitably complicated scoring system based on the correct result, goals a team score and goal difference). Looking at these 10 peoples predictions we can assign probabilities based on the results they projected (e.g.if 7 people think “Team A” will win, then we assign a 70% probability).

So that rounds off the models we are going to compare:

- HAL 9000 (that is the name of my model)
- Bookies
- BDC (Big Dumb Crowd)
- SSC (Small Smart Crowd)
- Lazy (all results 33%)

<table style="border-collapse: collapse; width: 50%;">
  <thead>
    <tr>
      <th style="border: 1px solid black; padding: 8px;">Model</th>
      <th style="border: 1px solid black; padding: 8px;">Brier Score</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">HAL 9000</td>
      <td style="border: 1px solid black; padding: 8px;">0.522</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">SSC</td>
      <td style="border: 1px solid black; padding: 8px;">0.547</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Bookies</td>
      <td style="border: 1px solid black; padding: 8px;">0.575</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">BDC</td>
      <td style="border: 1px solid black; padding: 8px;">0.663</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Lazy</td>
      <td style="border: 1px solid black; padding: 8px;">0.667</td>
    </tr>
  </tbody>
</table>

Currently HAL is winning with a Brier score of 0.522 and the SSC is also beating the bookies (but we’ve only played 12 of 51 matches so plenty of time for that to change!). At least we can have some confidence in our model.
