---
layout: post
title: Euro 2020 – The Final Modelling Results
date: 2021-07-14 11:18:00
description: Final analysis of how our Euro 2020 model performed.
tags: mathematics football
related_posts: true
thumbnail: assets/img/euro2020/final.png
---

With a disappointing end to the tournament (for us England fans anyway!) here is the final conclusions of how the model performed.

Unfortunately a mixture of work commitments, and games coming thick and fast, I was unable to keep this website up-to-date with my predictions for each fixture, but I did carry on doing them offline.

(As a reminder: the model description is [here](https://seanelvidge.github.io/blog/2021/Euro_2020_Predictions/){:target="\_blank"} and the other models we compare against are [here]().)

The Round of 16 gave us some truly surprising results, with every single model (including the bookies!) doing (a lot) worse than our Lazy prediction of 33% for Home, Draw and Away. This then seemed to be a sign of what was to come, the semifinal and final was worse than Lazy for most of the tested models. It made for an exciting tournament but a disaster for predictions!

The final performance analysis of the models was:

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
      <td style="border: 1px solid black; padding: 8px;">0.586</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Bookies</td>
      <td style="border: 1px solid black; padding: 8px;">0.588</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Average</td>
      <td style="border: 1px solid black; padding: 8px;">0.609</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">BDC</td>
      <td style="border: 1px solid black; padding: 8px;">0.655</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Lazy</td>
      <td style="border: 1px solid black; padding: 8px;">0.667</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">SSC</td>
      <td style="border: 1px solid black; padding: 8px;">0.728</td>
    </tr>
  </tbody>
</table>

Immediate things to note are that HAL won (just)! Clearly that is a great result. It is interesting though that SSC (small “smart” crowd) ended up doing much worse than Lazy, which is terrible! I would have expected that to do much better.

The poor performance likely comes from the fact that there were a number of “perfect” wrong answers. By that I mean that the model (my friends) all predicted something would definitely happen (e.g. England to beat Denmark after 90 minutes). That gave it a probability of 100%, when it didn’t happen, the maximum penalty of 2.0 was assigned.

Nothing in football is ever going to be 100% certain (the most one sided result that the bookies predicted was a Germany win against Hungary in the group stage [80.7%] – it ended up as a draw!). If we set a rule that SSC can never predict more than an 80% result then the Brier Score drops to 0.627 and ends up beating BDC and Lazy – more like I would have expected! Making SSC’s maximum prediction 60% further drops the Brier Score to 0.577 – making it the winning model! However this is likely because there was a large number of surprising results in the tournament, so this is really only a post-tournament model, and not a fair assessment. Setting the maximum to 80% (matching the Bookies maximum value) seems like a fair compromise though!

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
      <td style="border: 1px solid black; padding: 8px;">0.586</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Bookies</td>
      <td style="border: 1px solid black; padding: 8px;">0.588</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Average</td>
      <td style="border: 1px solid black; padding: 8px;">0.609</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">SSC</td>
      <td style="border: 1px solid black; padding: 8px;">0.627</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">BDC</td>
      <td style="border: 1px solid black; padding: 8px;">0.655</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Lazy</td>
      <td style="border: 1px solid black; padding: 8px;">0.667</td>
    </tr>
  </tbody>
</table>

Overall, a great result for HAL. Also, overall, the model came 3rd in Futbolmetrix's [Sophisticated Prediction Contest](https://futbolmetrix.wordpress.com/2021/07/12/euro2020-sophcon-final-results/){:target="\_blank"} which I am very happy with. The results post has some interesting statistical analysis and definitely worth checking out.
