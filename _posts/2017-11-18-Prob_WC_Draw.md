---
layout: post
title: Probability of World Cup Group Draw
date: 2017-11-18 12:24:00
description: The lineup for the 2018 FIFA World Cup is now complete, and the teams have been sorted into pots ahead of the group stage draw on December 1st. All draws are not equally likely, so what teams is your team likely to face?
tags: mathematics football
related_posts: true
thumbnail: assets/img/engPlayer.jpg
---

The lineup for the 2018 FIFA World Cup is now complete, and the teams have been sorted into pots ahead of the group stage draw on December 1st. All draws are not equally likely, so what teams is your team likely to face?

The format for the group stage was decided in September. Each team has been allocated a pot (1 to 4) based on “sporting principles”. The FIFA World Rankings (as of October 2017) were used to rank the teams in descending order (after Russia, who, as hosts, are the top seeds). The pots are:

<table style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr>
      <th style="border: 1px solid black; padding: 8px;">Pot 1</th>
      <th style="border: 1px solid black; padding: 8px;">Pot 2</th>
      <th style="border: 1px solid black; padding: 8px;">Pot 3</th>
      <th style="border: 1px solid black; padding: 8px;">Pot 4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Russia</td>
      <td style="border: 1px solid black; padding: 8px;">Spain</td>
      <td style="border: 1px solid black; padding: 8px;">Denmark</td>
      <td style="border: 1px solid black; padding: 8px;">Serbia</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Germany</td>
      <td style="border: 1px solid black; padding: 8px;">Peru</td>
      <td style="border: 1px solid black; padding: 8px;">Iceland</td>
      <td style="border: 1px solid black; padding: 8px;">Nigeria</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Brazil</td>
      <td style="border: 1px solid black; padding: 8px;">Switzerland</td>
      <td style="border: 1px solid black; padding: 8px;">Costa Rica</td>
      <td style="border: 1px solid black; padding: 8px;">Australia</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Portugal</td>
      <td style="border: 1px solid black; padding: 8px;">England</td>
      <td style="border: 1px solid black; padding: 8px;">Sweden</td>
      <td style="border: 1px solid black; padding: 8px;">Japan</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Argentina</td>
      <td style="border: 1px solid black; padding: 8px;">Colombia</td>
      <td style="border: 1px solid black; padding: 8px;">Tunisia</td>
      <td style="border: 1px solid black; padding: 8px;">Morocco</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Belgium</td>
      <td style="border: 1px solid black; padding: 8px;">Mexico</td>
      <td style="border: 1px solid black; padding: 8px;">Egypt</td>
      <td style="border: 1px solid black; padding: 8px;">Panama</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Poland</td>
      <td style="border: 1px solid black; padding: 8px;">Uruguay</td>
      <td style="border: 1px solid black; padding: 8px;">Senegal</td>
      <td style="border: 1px solid black; padding: 8px;">Korea Republic</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">France</td>
      <td style="border: 1px solid black; padding: 8px;">Croatia</td>
      <td style="border: 1px solid black; padding: 8px;">Iran</td>
      <td style="border: 1px solid black; padding: 8px;">Saudi Arabia</td>
    </tr>
  </tbody>
</table>

The exact rules for the draw are [described here](http://www.fifa.com/worldcup/news/y=2017/m=11/news=close-up-on-final-draw-procedures-2921440.html?intcmp=fifacom_hp_module_news_top) (with a handy video explanation). Roughly speaking the rules are that, after Russia, who will definitely be assigned to Group A, a random team from each pot will be drawn, and then placed in the next available group (alphabetically) which they are allowed to be put in (subject to constraints such as splitting up the confederation). This process is repeated until all teams have been drawn.

However, because of the rules of splitting confederations, each permutation of the 4 pots is not actually possible. So if you focus on one team you can look at what the probabilities of drawing other teams are. For example, the different probabilities of the draw for England are:

<table style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr>
      <th style="border: 1px solid black; padding: 8px;">Pot 1</th>
      <th style="border: 1px solid black; padding: 8px;">Pot 2</th>
      <th style="border: 1px solid black; padding: 8px;">Pot 3</th>
      <th style="border: 1px solid black; padding: 8px;">Pot 4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Russia (12.5%)</td>
      <td style="border: 1px solid black; padding: 8px;"></td>
      <td style="border: 1px solid black; padding: 8px;">Denmark (7.1%)</td>
      <td style="border: 1px solid black; padding: 8px;">Serbia (6.5%)</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Germany (9.5%)</td>
      <td style="border: 1px solid black; padding: 8px;"></td>
      <td style="border: 1px solid black; padding: 8px;">Iceland (7.1%)</td>
      <td style="border: 1px solid black; padding: 8px;">Nigeria (12.0%)</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Brazil (20.0%)</td>
      <td style="border: 1px solid black; padding: 8px;"></td>
      <td style="border: 1px solid black; padding: 8px;">Costa Rica (17.0%)</td>
      <td style="border: 1px solid black; padding: 8px;">Australia (13.5%)</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Portugal (9.5%)</td>
      <td style="border: 1px solid black; padding: 8px;">England</td>
      <td style="border: 1px solid black; padding: 8px;">Sweden (7.1%)</td>
      <td style="border: 1px solid black; padding: 8px;">Japan (13.5%)</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Argentina (20.0%)</td>
      <td style="border: 1px solid black; padding: 8px;"></td>
      <td style="border: 1px solid black; padding: 8px;">Tunisia (15.4%)</td>
      <td style="border: 1px solid black; padding: 8px;">Morocco (12.1%)</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Belgium (9.5%)</td>
      <td style="border: 1px solid black; padding: 8px;"></td>
      <td style="border: 1px solid black; padding: 8px;">Egypt (15.4%)</td>
      <td style="border: 1px solid black; padding: 8px;">Panama (15.5%)</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Poland (9.5%)</td>
      <td style="border: 1px solid black; padding: 8px;"></td>
      <td style="border: 1px solid black; padding: 8px;">Senegal (15.4%)</td>
      <td style="border: 1px solid black; padding: 8px;">Korea Republic (13.5%)</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">France (9.5%)</td>
      <td style="border: 1px solid black; padding: 8px;"></td>
      <td style="border: 1px solid black; padding: 8px;">Iran (15.4%)</td>
      <td style="border: 1px solid black; padding: 8px;">Saudi Arabia (13.5%)</td>
    </tr>
  </tbody>
</table>

The above was created using 1,000,000 simulations.

If you want to run your own experiment (with any team of your choice). The code I used can be [downloaded here](/assets/code/wcDraw.py). Running 100,000 simulations will take about 3 minutes. To change the number of simulations and/or the team of interest just edit the first two lines of the code (specifically change the variables `sims` and `pickedTeam`).

As for England, a South American giant in the form of either Brazil or Argentina from pot 1 is a daunting, but realistic, prospect for us in the Summer.

## Update

England ended up being drawn in [Group G](https://en.wikipedia.org/wiki/2018_FIFA_World_Cup_Group_G) alongside Belgium, Tunisia and Panama, the probabilities of this were:

<table style="border-collapse: collapse; width: 50%;">
  <thead>
    <tr>
      <th style="border: 1px solid black; padding: 8px;">Pot</th>
      <th style="border: 1px solid black; padding: 8px;">Country</th>
      <th style="border: 1px solid black; padding: 8px;">Percentage</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Pot 1</td>
      <td style="border: 1px solid black; padding: 8px;">Belgium</td>
      <td style="border: 1px solid black; padding: 8px;">9.5%</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Pot 2</td>
      <td style="border: 1px solid black; padding: 8px;">England</td>
      <td style="border: 1px solid black; padding: 8px;">-</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Pot 3</td>
      <td style="border: 1px solid black; padding: 8px;">Tunisia</td>
      <td style="border: 1px solid black; padding: 8px;">15.4%</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Pot 4</td>
      <td style="border: 1px solid black; padding: 8px;">Panama</td>
      <td style="border: 1px solid black; padding: 8px;">15.5%</td>
    </tr>
  </tbody>
</table>
