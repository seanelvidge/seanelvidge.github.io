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

<table>
  <thead>
    <tr>
      <th>Pot 1</th>
      <th>Pot 2</th>
      <th>Pot 3</th>
      <th>Pot 4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Russia</td>
      <td>Spain</td>
      <td>Denmark</td>
      <td>Serbia</td>
    </tr>
    <tr>
      <td>Germany</td>
      <td>Peru</td>
      <td>Iceland</td>
      <td>Nigeria</td>
    </tr>
    <tr>
      <td>Brazil</td>
      <td>Switzerland</td>
      <td>Costa Rica</td>
      <td>Australia</td>
    </tr>
    <tr>
      <td>Portugal</td>
      <td>England</td>
      <td>Sweden</td>
      <td>Japan</td>
    </tr>
    <tr>
      <td>Argentina</td>
      <td>Colombia</td>
      <td>Tunisia</td>
      <td>Morocco</td>
    </tr>
    <tr>
      <td>Belgium</td>
      <td>Mexico</td>
      <td>Egypt</td>
      <td>Panama</td>
    </tr>
    <tr>
      <td>Poland</td>
      <td>Uruguay</td>
      <td>Senegal</td>
      <td>Korea Republic</td>
    </tr>
    <tr>
      <td>France</td>
      <td>Croatia</td>
      <td>Iran</td>
      <td>Saudi Arabia</td>
    </tr>
  </tbody>
</table>


The exact rules for the draw are [described here](http://www.fifa.com/worldcup/news/y=2017/m=11/news=close-up-on-final-draw-procedures-2921440.html?intcmp=fifacom_hp_module_news_top) (with a handy video explanation). Roughly speaking the rules are that, after Russia, who will definitely be assigned to Group A, a random team from each pot will be drawn, and then placed in the next available group (alphabetically) which they are allowed to be put in (subject to constraints such as splitting up the confederation). This process is repeated until all teams have been drawn.

However, because of the rules of splitting confederations, each permutation of the 4 pots is not actually possible. So if you focus on one team you can look at what the probabilities of drawing other teams are. For example, the different probabilities of the draw for England are:

| Pot 1                 | Pot 2       | Pot 3                  | Pot 4                      |
| --------------------- | ----------- | ---------------------- | -------------------------- |
| Russia (12.5%)        |             | Denmark (7.1%)         | Serbia (6.5%)              |
| Germany (9.5%)        |             | Iceland (7.1%)         | Nigeria (12.0%)            |
| Brazil (20.0%)        |             | Costa Rica (17.0%)     | Australia (13.5%)          |
| Portugal (9.5%)       | England     | Sweden (7.1%)          | Japan (13.5%)              |
| Argentina (20.0%)     |             | Tunisia (15.4%)        | Morocco (12.1%)            |
| Belgium (9.5%)        |             | Egypt (15.4%)          | Panama (15.5%)             |
| Poland (9.5%)         |             | Senegal (15.4%)        | Korea Republic (13.5%)     |
| France (9.5%)         |             | Iran (15.4%)           | Saudi Arabia (13.5%)       |

The above was created using 1,000,000 simulations.

If you want to run your own experiment (with any team of your choice). The code I used can be [downloaded here](/assets/code/wcDraw.py). Running 100,000 simulations will take about 3 minutes. To change the number of simulations and/or the team of interest just edit the first two lines of the code (specifically change the variables `sims` and `pickedTeam`).

As for England, a South American giant in the form of either Brazil or Argentina from pot 1 is a daunting, but realistic, prospect for us in the Summer.

## Update

England ended up being drawn in [Group G](https://en.wikipedia.org/wiki/2018_FIFA_World_Cup_Group_G) alongside Belgium, Tunisia and Panama, the probabilities of this were:

| Pot 1     | Belgium     | 9.5%     |
| Pot 2     | England     | -     |
| Pot 3     | Tunisia     | 15.4%     |
| Pot 4     | Panama      | 15.5%     |
