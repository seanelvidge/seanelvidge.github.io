---
layout: post
title: Levelling the Playing Field, Adjusting Goal Records in International Football
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
\text{Weight} = 1 - k\times\frac{E-O}{E}
$$

Where, $$E$$ is the ELO rating of England before the match, $$O$$ is the ELO rating of the opposition before the match and $$k$$ a scaling constant that adjusts the sensitivity of the weighting to the difference in ELO ratings.

This formula adjusts the weight of a goal based on how much stronger or weaker the opposition is relative to England:

- If England faces a stronger team ($$O > E$$), the weighting increases above 1, acknowledging the greater difficulty.
- If England faces a weaker team ($$O < E$$), the weighting decreases below 1, reflecting the relatively easier challenge.
- The constant $$k$$ controls how much the difference in ratings affects the weighting.

### Interpreting the Weighting

Adjusting the $$k$$ value alters the impact of the opposition's strength:

- A higher $$k$$ value (e.g., 2) amplifies the effect, giving more weight to goals against stronger teams and less to those against weaker ones.
- A lower $$k$$ value (e.g., 1) minimizes the effect, resulting in a more uniform weighting across different opponents.

By experimenting with different $$k$$ values, we can fine-tune the system to balance fairness and sensitivity, ensuring that exceptional performances against top-tier teams are appropriately recognized while maintaining a reasonable value for consistent scoring against all opponents.

For the rest of this post we use a value of $$k=2$$.

### Results

When I last wrote a post similar to this, Wayne Rooney had just [broke the England National team goal record with 50 goals](https://seanelvidge.github.io/blog/2015/Rooney-50/). Since then Kane has broke this record again (at the time of writing) with 69 goals. Using the above approach the updated top 10 of England goal scorers are:

| Ranking |      Name      | Adjusted Goals | Goals |
| :-----: | :------------: | :------------: | :---: |
|    1    |   Harry Kane   |       45       |  69   |
|    2    |  Gary Lineker  |       37       |  48   |
|    3    | Bobby Charlton |       36       |  49   |
|    4    | Jimmy Greaves  |       35       |  44   |
|    5    |  Wayne Rooney  |       34       |  53   |
|    6    |  Michael Owen  |       30       |  40   |
|    7    |  Alan Shearer  |       23       |  30   |
|    8    |   Tom Finney   |       23       |  30   |
|    9    | Nat Lofthouse  |       22       |  30   |
|   10    | Frank Lampard  |       21       |  29   |

You can see that whilst Kane is still number 1 - his number of goals are significantly less. (Note that the adjusted number of goals here have been rounded to the nearest goal for ease of reading).

As may be expected Kane has the biggest change between actual goals scored (69) and the weighted number of goals (45) with a difference of 24, perphaps reaffirming the theory that modern day players are scoring a significant amount of their goals against weaker opposition than in the past. Gary Lineker moves from 4th in the all time list to 2nd.

At the other end of the table we end up with a number of people (41) who (because of the rounding as well) move from having scored at least 1 for England to being on 0 goals, but only four who go from more than 1 to zero:

|       Name        | Goals | Adjusted Goals |
| :---------------: | :---: | :------------: |
|   Tammy Abraham   |   3   |       0        |
|     Paul Ince     |   2   |       0        |
|   Tyrone Mings    |   2   |       0        |
| James Ward-Prowse |   2   |       0        |

Unfortuntaely Tammy Abraham's 3 goals for England were scored against very much weaker opposition in the form of Montenegro (England won 7-0 on 14/11/19), Andorra (England won 0-5 on 09/10/21) and San Marino (England won 0-10 on 15/11/21).

If you want to have a look at the data you can access it all [here](https://seanelvidge.github.io/assets/files/england_elo_goal_data.csv)) (which also includes the "Adjusted Total" which weights Friendlies as 0.5 and "finals" as 2x (as per the description [here](https://seanelvidge.github.io/blog/2015/Rooney-50/).
