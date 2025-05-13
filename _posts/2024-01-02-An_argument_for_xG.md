---
layout: post
title: An Argument for xG
date: 2024-01-02 23:40:00
description: The use of expected goals (xG) in football has its proponents and, very high profile, detractors. I think it is useful and here are my reasons why.
tags: football
thumbnail: assets/img/xG.png
related_posts: true
giscus_comments: true
---

The use of expected goals (xG) in football has its proponents and, very high profile, detractors. Amongst those detractors includes Gary Lineker, Alan Shearer and Micah Richards and it is mentioned regulalry on their [podcast](https://linktr.ee/therestisfootball).

(If you are unfamiliar with xG there is a good description of it [here](https://theanalyst.com/2023/08/what-is-expected-goals-xg))

One thing that has come up a few times during the podcast is their negative opinion on xG. Whilst this post might be a bit like Billy Beane talking to the Oakland A’s scouting team, I wanted to at least present an "argument for" xG:

First off, the negative opinion of xG is not surprising, very often the stat is misused, to the point where it is nonsensical. Not out of malice by anyone, but just because there are subtleties involved (and social media character limits often stop the discussion – so in this case I hope you forgive the length of this post). Even the name is quite confusing, "expected" does not mean what it regularly means in English but rather its mathematical definition (I'll leave out any actual mathematics, but "the average outcome of an event if it were repeated a large number of times").

Naively I think it makes sense to have a metric which evaluates the quality of chances in a game (whether that is xG or something else). For example, following the [Liverpool v Manchester United](https://www.bbc.co.uk/sport/football/live/czv2vv2w2yxt) game on December 17th (which ended 0-0) there was a comment on the podcast that Liverpool had 34 shots (to United’s 6). The comment (I believe) was meant to suggest that the result was surprising. Perhaps it was? Certainly 34 is more than 6, but how good were those shots, perhaps United's 6 shots were all from within the 6 yard box and Liverpool's all from 40 yards away? We could look at "shots on target" (8 – 1) but that still doesn’t tell the full story: one of those on target shots was from 30 yards out (Elliott; 81st minute) which is surely much less likely to result in a goal than one from within the 6 yard box (Gravenbech; 16th minute). xG is used to distinguish between the quality of those shots (Elliott’s shot had an xG of 0.02, whereas Gravenbech’s was 0.41).

Overall the xG for that match was 2.38 - 0.75, but that does not mean Liverpool "deserved" to win that particular game (you can not "win the xG" as [Thomas Tuchel said about Bayern against Frankfurt](https://www.bavarianfootballworks.com/2023/12/9/23994402/bayern-munich-eintracht-frankfurt-bundesliga-thomas-tuchel-kimmich-upamecano-neuer-mazraoui-davies)), it tells us that by the end of the game, Liverpool had the higher quality of chances, but it doesn't tell us about the expected outcome.

What is an even more crazy way of using xG (which comes up worryingly often) is looking at/analysing/commenting on a single goals xG – it is essentially meaningless. Take a penalty, which has a fixed xG in most models (a little more on that in a minute), of 0.79. That means that on average 79% of penalties are scored (Shearer's Premier League record was 56 out of 67, 83.6%) but the value of 0.79xG doesn't take into account match context, it is easier to score a penalty when you are 4-0 up at home, than if it is 1-1 in the 90th minute, away from home, to win the league (for example). And that is true for any individual xG 'event', context matters, an individual attempt is just that, individual and unique. The stupidity of this was highlighted by the discussion of the xG of Garnacho’s overhead kick against Everton (0.08xG) which Alan on the podcast (rightly) described as a "pile of sh!t". However I would implore you to appreciate that discussing that goal as being scored 8 times in 100 is just xG being used wrong, rather than xG actually being wrong.

As a further example it is like commenting on the roll of a dice (die). The "expected" value of rolling one dice is 3.5 (yes – the expected value is not a value you can ever even get), but for a dice roll any of the numbers, 1, 2, …, 6 are equally likely and commenting on the fact that you didn’t get a "3.5" makes absolutely no sense. However if you took 1000 dice rolls, and look at the average that you got over that period if it was significantly different from 3.5 then you might start to suspect that something might be up (e.g. weighted dice). That is where xG comes into its own, over long time periods, investigating the difference between xG and actual goals scored across half a season, a full season etc., that's where you can start to draw conclusions about teams/players and how they are performing. Is a team/player consistently under/over-performing their xG? Is a particular striker a great finisher, consistently getting in the right positions and doing better than expected or are they doing what you would expect for a team creating that many opportunities?

Now we are halfway through the season we are starting to have enough data for interesting discussions to happen (just like there is no point in looking at the Premier League table after the first game of the season, there is no point at looking at xG until enough games have been played), perhaps there could be discussion around (for example) Son Heung-min's continual “over-performance” in terms of goals scored. Or for a further example, Lineker and Shearer have mentioned a number of times that, whilst not diminishing Haaland’s excellent return last season, they both would have done very well in that Man City team. Well, Haaland’s 22/23 season xG was 33, and he scored 35 goals, so that is pretty much what you would “expect” (for someone getting in those positions, and of course there is a huge amount of skill in being the player in “the right place, at the right time” to get that xG). In fact since 2019 Haaland has racked up an xG of 99 and scored 112, so he is above what we “expect” which makes sense for a player of his obvious quality. But, using xG, we can start to look at interesting things across the worlds best players, perhaps a way of investigating the differences in their finishing ability from their positional play, and the quality of the teams they play in, for example look at the table below comparing goals scored against their accumulative xG (only using data from 2014 onwards). I’ve highlighted (and ranked) the players most over and under performing according to this metric for a selection of the worlds best:

<style>
table {
    border-collapse: collapse;
    width: 50%;
    margin: 20px auto;
}
th, td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
}
th {
    cursor: pointer;
    background-color: #f4f4f4;
}
</style>

<table id="footballTable">
  <thead>
    <tr>
      <th onclick="sortTable('footballTable', 0)">Name</th>
      <th onclick="sortTable('footballTable', 1)">Goals Scored</th>
      <th onclick="sortTable('footballTable', 2)">Accumulative xG</th>
      <th onclick="sortTable('footballTable', 3)">% difference</th>
    </tr>
  </thead>
  <tbody>    
    <tr>
      <td>Son Heung-Min</td>
      <td>126</td>
      <td>92</td>
      <td>+37</td>
    </tr>
    <tr>
      <td>Harry Kane</td>
      <td>231</td>
      <td>198</td>
      <td>+16</td>
    </tr>
    <tr>
      <td>Lionel Messi</td>
      <td>253</td>
      <td>220</td>
      <td>+15</td>
    </tr>
    <tr>
      <td>Kylian Mbappé</td>
      <td>183</td>
      <td>161</td>
      <td>+14</td>
    </tr>
    <tr>
      <td>Erling Haaland</td>
      <td>112</td>
      <td>99</td>
      <td>+13</td>
    </tr>
    <tr>
      <td>Cristiano Ronaldo</td>
      <td>234</td>
      <td>229</td>
      <td>+2.2</td>
    </tr>
    <tr>
      <td>Karim Benzema</td>
      <td>166</td>
      <td>169</td>
      <td>-1.8</td>
    </tr>
    <tr>
      <td>Robert Lewandowski</td>
      <td>269</td>
      <td>276</td>
      <td>-2.5</td>
    </tr>
    <tr>
      <td>Victor Osimhen</td>
      <td>70</td>
      <td>73</td>
      <td>-4.1</td>
    </tr>
    <tr>
      <td>Alexander Isak</td>
      <td>51</td>
      <td>55</td>
      <td>-7.3</td>
    </tr>
    <tr>
      <td>Gabriel Jesus</td>
      <td>72</td>
      <td>97</td>
      <td>-26</td>
    </tr>
  </tbody>
</table>

<script>
function sortTable(tableID, columnIndex) {
    const table = document.getElementById(tableID);
    const rows = Array.from(table.rows).slice(1); // Exclude header row
    const isNumeric = !isNaN(rows[0].cells[columnIndex].innerText);

    let sortedRows = rows.sort((a, b) => {
        const aVal = isNumeric ? +a.cells[columnIndex].innerText : a.cells[columnIndex].innerText.toLowerCase();
        const bVal = isNumeric ? +b.cells[columnIndex].innerText : b.cells[columnIndex].innerText.toLowerCase();
        return aVal > bVal ? 1 : -1;
    });

    const currentSort = table.dataset.sortOrder === "asc" ? "desc" : "asc";
    if (currentSort === "desc") sortedRows.reverse();
    table.dataset.sortOrder = currentSort;

    sortedRows.forEach(row => table.tBodies[0].appendChild(row));
}
</script>

One final thought about the xG values that you will have seen presented. Different peoples and companies xG values are not all of the same quality. The original xG models “just” considered the position of where the shot was taken which has clear weaknesses because you know nothing about whether you are 15 yards out, but with an open goal, or 15 yards out on the half-turn with three defenders around you. More modern xG calculations (such as the one from Opta used by Match of the Day) are built on over a million shots considering, amongst others:

- Distance to the goal,
- Angle to the goal,
- Goalkeeper position,
- The clarity the shooter has of the goal mouth, based on the positions of other players,
- The amount of pressure they are under from the opposition defenders,
- Shot type, such as which foot the shooter used or whether it was a volley/header/one-on-one,
- Pattern of play (e.g., open play, fast break, direct free-kick, corner kick, throw-in etc.),
- Information on the previous action, such as the type of assist (e.g., through ball, cross etc.)

So, when seeing xG analysis across the media you also have to be careful of the underlying xG model being used (and that information is very rarely provided).

Whilst there are a lot of challenges and caveats in using xG, and its misuse in the past means that people are sceptical of its merit now, I believe that there is potentially interesting analysis that can be done with it (if only more professional pundits would give it a chance…). Football is a game which is inherently “low-scoring” and so tools that analysts can use to enhance discussion could offer real benefits. Unfortunately it is often misused and misunderstood.
