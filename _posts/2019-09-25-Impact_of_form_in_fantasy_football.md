---
layout: post
title: The Impact of Form in Fantasy Football
date: 2019-09-25 10:09:00
description: Does "form" impact player points in fantasy football?
tags: mathematics football
related_posts: true
thumbnail: assets/img/formFPL/form_fpl.png
giscus_comments: true
---

I am a keen player of [Fantasy Football](https://fantasy.premierleague.com/){:target="\_blank"}. Not only is the game huge fun (and **very** addictive) it also provides an excellent opportunity to play around with a whole host of mathematics. I posted a controversial thread on Twitter which has been reasonably popular (and even inspired a [few Reddit threads](https://www.reddit.com/r/FantasyPL/comments/d4wtdc/theres_no_such_thing_as_player_form/){:target="\_blank"} and mentioned in three podcasts [that I am aware of]). The focus was on the impact of "form" on points scored in fantasy football.

I will assume if you are reading on you understand, at least the basics, of how fantasy football (from herein, FPL), works. Put simply: a manager picks a team of 15 players with a limit of at most 3 from anyone team and budget constraints, players actions during the games get converted into points, most points at the end of the season and you win! This one version of the game (the “official version”) is played by over 7.5M people!

Another action you have as a manager is the ability to transfer players in and out of your team. Obviously you want to make the right choice, bringing in a player just before he (for example) scores, is a great feeling. A lot of discussion about who to bring in is often based around “form”.

## My hypothesis is, "in FPL there is no such thing as form".

The problem comes from Apophenia. The tendency to perceive connections and meaning between unrelated things. This is also commonly thought of as the "[Gambler's fallacy](https://en.wikipedia.org/wiki/Gambler%27s_fallacy){:target="\_blank"}". The other issue, especially when considering form, is that people are very poor at thinking about 'random' patterns. Ask a group of people to spread themselves out randomly in a room and they inevitably place themselves evenly.

[In practice, randomness comes in 'clumps'. These clumps are then mistakenly thought to be non-random](https://en.wikipedia.org/wiki/Clustering_illusion){:target="\_blank"}.

Take for example a player which scores 15 goals in a season. A random shuffle of these goals throughout the GWs may look like this:

1,1,1,1,0,1,0,0,1,0,0,1,0,1,0,0,0,0,0,0,0,1,1,0,1,1,0,0,1,0,0,1,0,0,0,1,0,0

(this random sequence was generated in Python). Where ‘1’s are goals. If this was a striker in FPL would everyone be transferring in in those first 6 weeks citing fantastic form thanks to a good rest over the summer and bemoaning the run of 7 games without a goal in the middle of the season? Perhaps during the busy festive periods?

Perfectly reasonable, but we’re just finding patterns in randomness. We know this for certain since this pattern was generated randomly!

Now, lets try to quantify the above with data. First, lets make our dataset. Consider every player over the last 2 seasons and for their points we will use the 'adjusted' points [AP] model (points with the appearance points removed).

Further to this I have also removed any bonus points scored and tried to account for fixture difficulty. To account for fixture difficulty I have calculated the average AP scored and conceded by a team respectively.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
    <figure>
        {% include figure.liquid loading="eager" path="assets/img/formFPL/avgPts_con.jpeg" class="img-fluid rounded z-depth-1" zoomable=true %}
    </figure>
    </div>
    <div class="col-sm mt-3 mt-md-0">
    <figure>
        {% include figure.liquid loading="eager" path="assets/img/formFPL/avgPts_scored.jpeg" class="img-fluid rounded z-depth-1" zoomable=true %}
    </figure>
    </div>
</div>

A (reasonable?) way to account for the difficulty is then removing these 2 numbers.

For example, consider Man City v Watford. City players score on average 1.12 AP points per game and Watford concede 0.61. So in that match City players have 1.73 points removed. However Watford score 0.26 and Man City concede -0.02 so Watford players have 0.24 points removed.

Then for each player, for each season, the average (mean) of their scores are removed. That leaves us with this kind of thing:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <figure>
            {% include figure.liquid loading="eager" path="assets/img/formFPL/AP_Sterling.jpeg" class="img-fluid rounded z-depth-1" zoomable=true %}
          <figcaption style="text-align: center; margin-top: 8px;">Time series of avg. removed adjusted points for Sterling for the 2018/19 season, the gaps are games where he played no part.</figcaption>
        </figure>
    </div>
</div>

Looking across the whole dataset we have 20,875 data points. Of those 7,180 are positive (above the mean) and 13,767 are negative (below the mean).

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <figure>
            {% include figure.liquid loading="eager" path="assets/img/formFPL/FPL_ptDist.png" class="img-fluid rounded z-depth-1" zoomable=true %}
          <figcaption style="text-align: center; margin-top: 8px;">Distribution of points from this analysis.</figcaption>
        </figure>
    </div>
</div>

So, overall, there is a 34% chance that a player will exceed their average points in a given GW. Note this doesn’t vary hugely depending on the player. For 2 examples: in 2018/19 Sterling exceeded his average 38% of the time, in 2017/18 Maguire exceeded his 37% of the time.

Using this value as a basis, we can work out how this compares with the number of “above mean” weeks in weeks following one above the mean. E.g. the impact of form. If form exists we would expect there to be groupings of “above mean” weeks rather than them being random.

To draw this conclusion we need to know what the statistically expected values would be. To calculate those we assume that the scores are distributed by a [binomial distribution](https://en.wikipedia.org/wiki/Binomial_distribution){:target="\_blank"}.

This is a distribution for calculating the number of successes (in this case above mean weeks) in a sequence of trials. Using a base rate of 34% (if we randomly pick a player and a GW there is a 34% chance that it is above the mean) we can compare stats with the actual data.

First we look at “3 week form” that is, if a player scores above their mean in a given GW, what is the chance that they score above the mean **at least once** in the next 2 weeks?

From the statistical distribution, we would expect there to be a 57% chance of this happening, and if we look at the cold hard numbers from the last 2 seasons then it happened 52% of the time. Pretty close!

If we do the same for “4 week form” (following an above mean score the player posts another above mean score at least once in the next 3 weeks). The binomial distribution says that we should expect that 71% of the time, the data? 61%.

“5 week form” stats says: 81%, our data: 72% and finally “6 wk form”, stats: 88%, data: 78%.

So what conclusions can we draw from that? If a player scores above average (for that player) in a given GW, it has no impact on their expected returns in any of the following 5 weeks.

Similarly if you look at something like the chance of “2 above mean weeks in 4”, or “3 above in 5” or any such combo, the same thing happens. The empirically calculated results are (very much) in line with the statistically expected values.

## Dare I conclude: There is no such thing as form in FPL.

Clearly there are other short term factors which can impact a player, which keen FPL players should focus on. For example a short term injury to a key player could have a large impact on another (e.g. an injury to Kane might be a good time to bring in Moura/Son).

Perhaps different positions or prices would experience it differently? Here is a plot showing that analysis. Values above the diagonal line are when we observe returns in the data more than expected (form).

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <figure>
            {% include figure.liquid loading="eager" path="assets/img/formFPL/pt_analysis.jpeg" class="img-fluid rounded z-depth-1" zoomable=true %}
        </figure>
    </div>
</div>

Whilst this shows a number of values above the line (suggesting form) they are not statistically significant (when breaking it down by position and price there are far fewer data points) and there doesn’t seem to be any clear patterns.

For example whilst forwards between 9-10M show a deviation between observed and expected (they experience form) the opposite is seen for forwards between 8-9M and 10M+.

Overall, this extra bit of analysis helps to support the conclusion that there is no observable impact of form in FPL.

For more discussion checkout either the original [Twitter thread](https://twitter.com/FPLHAL/status/1173356501328703488?s=20){:target="\_blank"}, or the [Reddit comments](https://www.reddit.com/r/FantasyPL/comments/d4wtdc/theres_no_such_thing_as_player_form/){:target="\_blank"}.
