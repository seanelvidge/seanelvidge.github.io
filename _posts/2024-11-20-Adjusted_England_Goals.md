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
      <th onclick="sortTable(0)">Ranking</th>
      <th onclick="sortTable(1)">Name</th>
      <th onclick="sortTable(2)">Goals</th>
      <th onclick="sortTable(3)">Weighted Goals</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Harry Kane</td>
      <td>69</td>
      <td>45</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Gary Lineker</td>
      <td>48</td>
      <td>37</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Bobby Charlton</td>
      <td>49</td>
      <td>36</td>
    </tr>
    <tr>
      <td>4</td>
      <td>Jimmy Greaves</td>
      <td>44</td>
      <td>35</td>
    </tr>
    <tr>
      <td>5</td>
      <td>Wayne Rooney</td>
      <td>53</td>
      <td>34</td>
    </tr>
    <tr>
      <td>6</td>
      <td>Michael Owen</td>
      <td>40</td>
      <td>30</td>
    </tr>
    <tr>
      <td>7</td>
      <td>Alan Shearer</td>
      <td>30</td>
      <td>23</td>
    </tr>
    <tr>
      <td>8</td>
      <td>Tom Finney</td>
      <td>30</td>
      <td>23</td>
    </tr>
    <tr>
      <td>9</td>
      <td>Nat Lofthouse</td>
      <td>30</td>
      <td>22</td>
    </tr>
    <tr>
      <td>10</td>
      <td>Frank Lampard</td>
      <td>29</td>
      <td>21</td>
    </tr>
  </tbody>
</table>

<script>
function sortTable(columnIndex) {
    const table = document.getElementById("footballTable");
    const rows = Array.from(table.rows).slice(1); // Exclude header row
    const isNumeric = !isNaN(rows[0].cells[columnIndex].innerText);

    let sortedRows = rows.sort((a, b) => {
        const aVal = isNumeric ? +a.cells[columnIndex].innerText : a.cells[columnIndex].innerText.toLowerCase();
        const bVal = isNumeric ? +b.cells[columnIndex].innerText : b.cells[columnIndex].innerText.toLowerCase();
        return aVal > bVal ? 1 : -1;
    });

    // Check if already sorted in ascending order, then reverse
    const currentSort = table.dataset.sortOrder === "asc" ? "desc" : "asc";
    if (currentSort === "desc") sortedRows.reverse();
    table.dataset.sortOrder = currentSort;

    // Re-append sorted rows to the table body
    sortedRows.forEach(row => table.tBodies[0].appendChild(row));
}
</script>

You can see that whilst Kane is still number 1 - his number of goals are significantly less. (Note that the adjusted number of goals here have been rounded to the nearest goal for ease of reading).

As may be expected Kane has the biggest change between actual goals scored (69) and the weighted number of goals (45) with a difference of 24, perphaps reaffirming the theory that modern day players are scoring a significant amount of their goals against weaker opposition than in the past. Gary Lineker moves from 4th in the all time list to 2nd.

At the other end of the table we end up with a number of people (41) who (because of the rounding as well) move from having scored at least 1 for England to being on 0 goals, but only four who go from more than 1 to zero:

<table style="border-collapse: collapse; width: 50%;">
  <thead>
    <tr>
      <th style="border: 1px solid black; padding: 8px;">Name</th>
      <th style="border: 1px solid black; padding: 8px;">Goals</th>
      <th style="border: 1px solid black; padding: 8px;">Weighted Goals</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Tammy Abraham</td>
      <td style="border: 1px solid black; padding: 8px;">3</td>
      <td style="border: 1px solid black; padding: 8px;">0</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Paul Ince</td>
      <td style="border: 1px solid black; padding: 8px;">2</td>
      <td style="border: 1px solid black; padding: 8px;">0</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Tyrone Mings</td>
      <td style="border: 1px solid black; padding: 8px;">2</td>
      <td style="border: 1px solid black; padding: 8px;">0</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">James Ward-Prowse</td>
      <td style="border: 1px solid black; padding: 8px;">2</td>
      <td style="border: 1px solid black; padding: 8px;">0</td>
    </tr>
  </tbody>
</table>

Unfortuntaely Tammy Abraham's 3 goals for England were scored against very much weaker opposition in the form of Montenegro (England won 7-0 on 14/11/19), Andorra (England won 0-5 on 09/10/21) and San Marino (England won 0-10 on 15/11/21).

If you want to have a look at the data you can access it all [here](https://seanelvidge.github.io/assets/files/england_elo_goal_data.csv)) (which also includes the "Adjusted Total" which weights Friendlies as 0.5 and "finals" as 2x (as per the description [here](https://seanelvidge.github.io/blog/2015/Rooney-50/).
