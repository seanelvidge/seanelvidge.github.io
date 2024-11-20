---
layout: post
title: Leveling the Playing Field: Adjusting Goal Records in International Football
date: 2024-11-20 13:13:00-0400
description: By weighting international goals by strength of the opposition we can compare goal scoring prowess across the decades. 
tags: mathematics football
related_posts: true
thumbnail: assets/img/engPlayer.jpg
---

In recent years, we've witnessed a surge in international football records being shattered. Modern players are scoring at unprecedented rates, and while this is undoubtedly exciting for fans, it raises an important question: Are today's goal-scoring feats truly comparable to those of past legends?

The landscape of international football has evolved significantly. The expansion of FIFA membership has introduced many new, smaller nations into the competitive arena. This influx has led to more matches where traditional football powerhouses face off against developing teams, often resulting in lopsided scorelines. Consequently, contemporary players have more opportunities to inflate their goal tallies against weaker opposition.

This shift poses a challenge when attempting to compare the goal-scoring records of current players with those from previous eras. The legends of the past often played fewer matches against a more consistent level of competition, making their goal tallies a reflection of performances against relatively equal opponents.

So, how can we level the playing field and make fair comparisons across different football eras?

## Introducing a Weighted Goal System
To address this disparity, I embarked on a project to adjust goal records by accounting for the relative strength of the opposition. The idea is to assign a weighting to each goal based on the difficulty of scoring against a particular team at the time of the match. This method aims to provide a more nuanced evaluation of a player's goal-scoring achievements.

### Utilizing ELO Ratings
The foundation of this approach lies in the ELO rating system, a method originally devised for ranking chess players but now widely adopted across various sports, including football. ELO ratings provide a dynamic measure of a team's strength, updating after each match based on the result and the quality of the opposition.

By leveraging historical ELO ratings, we can assess the relative strength of any two teams at the time they played. This allows us to calculate a weighting factor for each goal scored, reflecting the challenge posed by the opponent.

### The Weighting Formula
The weighting for each goal is determined using the following formula:

$$
\text{Weigth} = 1 - k\times\frac{E-O}{E}
$$

Where, $E$ is the ELO rating of England before the match, $O$ is the ELO rating of the opposition before the match and $k$ a scaling constant that adjusts the sensitivity of the weighting to the difference in ELO ratings.

This formula adjusts the weight of a goal based on how much stronger or weaker the opposition is relative to England:

* If England faces a stronger team ($O > E$), the weighting increases above 1, acknowledging the greater difficulty.
* If England faces a weaker team ($O < E$), the weighting decreases below 1, reflecting the relatively easier challenge.
* The constant $k$ controls how much the difference in ratings affects the weighting.

### Interpreting the Weighting
Adjusting the $k$ value alters the impact of the opposition's strength:

* A higher $k$ value (e.g., 2) amplifies the effect, giving more weight to goals against stronger teams and less to those against weaker ones.
* A lower $k$ value (e.g., 1) minimizes the effect, resulting in a more uniform weighting across different opponents.

By experimenting with different $k$ values, we can fine-tune the system to balance fairness and sensitivity, ensuring that exceptional performances against top-tier teams are appropriately recognized while maintaining a reasonable value for consistent scoring against all opponents.

For the rest of this post we use a value of $k=2$.

In that adjusted table we get the following:

| Ranking |      Name      | Adjusted Goals |
| :-----: | :------------: | :------------: |
|    1    |  Wayne Rooney  |       49       |
|    2    |  Gary Lineker  |       46       |
|    3    | Bobby Charlton |       43       |
|    4    |  Michael Owen  |       39       |
|    5    | Jimmy Greaves  |      34.5      |
|    5    |  Alan Shearer  |     34. 5      |

You can see that Rooney is still number 1 - despite down weighting the friendly goals.

But okay, perhaps you think friendlies shouldn't count at all and only competitive fixtures should be counted (the 'Adjusted Goals' column is if we again weight finals goals more heavily, the first ranking column is for the 'non-adjusted' goals):

| Ranking |      Name       | Goals | Adjusted Goals | Adjusted Ranking |
| :-----: | :-------------: | :---: | :------------: | :--------------: |
|    1    |  Wayne Rooney   |  36   |       42       |        1         |
|    2    | Stephen Bloomer |  28   |       28       |        6         |
|    3    | Bobby Charlton  |  27   |       32       |        3         |
|    4    |  Michael Owen   |  26   |       32       |        3         |
|    5    |  Gary Lineker   |  24   |       34       |        2         |
|    6    |  Jimmy Greaves  |  23   |       24       |        8         |

Again, Rooney comes top for both the usual and adjusted goal tallies. (One way) to knock Rooney off that top spot (if you particularly want to for some reason) is to look at the 'goals per cap ratio'. To use this stat we have to set a cap limit because of the people who didn't play very much. For example, Albert Allen, Francis Bradshaw, John Veitch, John Yates and Rev. Walter Gilliat who were all capped once by England, and each scored a hattrick on their one, and only, appearance for England. This gives them a rather impressive 3 goals per cap ratio. If we only consider players who have at least 40 caps then:

| Ranking |     Name      | Goals per cap |
| :-----: | :-----------: | :-----------: |
|    1    | Jimmy Greaves |     0.77      |
|    2    | Gary Lineker  |      0.6      |
|    3    | Peter Crouch  |     0.52      |
|    4    |  Geoff Hurst  |     0.49      |
|    5    | Alan Shearer  |     0.48      |
|    6    | Wayne Rooney  |     0.47      |

Finally, if you again weighted the goals (since Crouch scored 12 of his 22 goals in friendlies) you would find the order is Greaves, Lineker, Hurst, Shearer, Rooney (Crouch drops from 3rd to 8th).

I am not going to make any conclusions about if Rooney is England’s greatest attacker or not, that is up to you! All the data I’ve used in this post was collected from [englandstats.com](https://www.englandstats.com/) and is accurate as of today (11th September, 2015). If you want to play around with the data I’ve collated all the stats (player names, caps, minutes played and goals scored (separated into individual competitions)) into an Excel file available [here](https://seanelvidge.github.io/assets/files/england_goal_data_2015_09_11.xlsx).

