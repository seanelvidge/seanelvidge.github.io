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

When I last wrote a post similar to this, Wayne Rooney had just [broke the England National team goal record with 50 goals](https://seanelvidge.github.io/blog/2015/Rooney-50/). Since then Kane has broke this record again (at the time of writing) with 69 goals. Using the above approach the updated top 10 of England goal scorers are (the "Ranking" is based on the weighted goals column):

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

If you want to have a look at the data you can access it all [here](https://seanelvidge.github.io/assets/files/england_elo_goal_data.csv)) (which also includes the "Adjusted Total" which weights Friendlies as 0.5 and "finals" as 2x (as per the description [here](https://seanelvidge.github.io/blog/2015/Rooney-50/)).

## Data

If you want to have a look at the data in a little more detail (but without downloading the whole datefile above) the below is a sortable table for England players with at least 40 caps):

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

<table id="dataTableUpdated">
  <thead>
    <tr>
<th onclick="sortTableUpdated(0)">Name</th><th onclick="sortTableUpdated(1)">Caps</th><th onclick="sortTableUpdated(2)">Total Goals</th><th onclick="sortTableUpdated(3)">Goals per cap</th><th onclick="sortTableUpdated(4)">Weighted Goals</th><th onclick="sortTableUpdated(5)">Adjusted Total</th>
    </tr>
  </thead>
  <tbody>
<tr><td>Peter Shilton</td><td>125</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Wayne Rooney</td><td>120</td><td>53</td><td>0.44</td><td>34</td><td>53.0</td></tr><tr><td>David Beckham</td><td>115</td><td>17</td><td>0.15</td><td>12</td><td>18.0</td></tr><tr><td>Steven Gerrard</td><td>114</td><td>21</td><td>0.18</td><td>13</td><td>22.5</td></tr><tr><td>Bobby Moore</td><td>108</td><td>2</td><td>0.02</td><td>1</td><td>1.0</td></tr><tr><td>Ashley Cole</td><td>107</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Bobby Charlton</td><td>106</td><td>49</td><td>0.46</td><td>36</td><td>43.0</td></tr><tr><td>Frank Lampard</td><td>106</td><td>29</td><td>0.27</td><td>21</td><td>27.5</td></tr><tr><td>Billy Wright</td><td>105</td><td>3</td><td>0.03</td><td>2</td><td>2.0</td></tr><tr><td>Harry Kane</td><td>103</td><td>69</td><td>0.67</td><td>45</td><td>80.0</td></tr><tr><td>Kyle Walker</td><td>93</td><td>1</td><td>0.01</td><td>1</td><td>1.0</td></tr><tr><td>Bryan Robson</td><td>90</td><td>26</td><td>0.29</td><td>18</td><td>25.0</td></tr><tr><td>Michael Owen</td><td>89</td><td>40</td><td>0.45</td><td>30</td><td>40.0</td></tr><tr><td>Kenny Sansom</td><td>86</td><td>1</td><td>0.01</td><td>1</td><td>1.0</td></tr><tr><td>Gary Neville</td><td>85</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Ray Wilkins</td><td>84</td><td>3</td><td>0.04</td><td>3</td><td>3.5</td></tr><tr><td>John Stones</td><td>83</td><td>3</td><td>0.04</td><td>2</td><td>5.0</td></tr><tr><td>Raheem Sterling</td><td>82</td><td>20</td><td>0.24</td><td>14</td><td>23.5</td></tr><tr><td>Rio Ferdinand</td><td>81</td><td>3</td><td>0.04</td><td>2</td><td>4.0</td></tr><tr><td>Jordan Henderson</td><td>81</td><td>3</td><td>0.04</td><td>2</td><td>5.0</td></tr><tr><td>Gary Lineker</td><td>80</td><td>48</td><td>0.6</td><td>37</td><td>46.0</td></tr><tr><td>John Barnes</td><td>79</td><td>11</td><td>0.14</td><td>8</td><td>9.5</td></tr><tr><td>John Terry</td><td>78</td><td>6</td><td>0.08</td><td>5</td><td>3.5</td></tr><tr><td>Stuart Pearce</td><td>78</td><td>5</td><td>0.06</td><td>4</td><td>3.5</td></tr><tr><td>Terry Butcher</td><td>77</td><td>3</td><td>0.04</td><td>2</td><td>3.0</td></tr><tr><td>Tom Finney</td><td>76</td><td>30</td><td>0.39</td><td>23</td><td>23.0</td></tr><tr><td>David Seaman</td><td>75</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Joe Hart</td><td>75</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Sol Campbell</td><td>73</td><td>1</td><td>0.01</td><td>1</td><td>2.0</td></tr><tr><td>Jordan Pickford</td><td>73</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Gordon Banks</td><td>73</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Alan Ball</td><td>72</td><td>8</td><td>0.11</td><td>6</td><td>5.0</td></tr><tr><td>Martin Peters</td><td>67</td><td>20</td><td>0.3</td><td>14</td><td>19.0</td></tr><tr><td>Paul Scholes</td><td>66</td><td>14</td><td>0.21</td><td>11</td><td>16.0</td></tr><tr><td>Tony Adams</td><td>66</td><td>5</td><td>0.08</td><td>4</td><td>4.5</td></tr><tr><td>Dave Watson</td><td>65</td><td>4</td><td>0.06</td><td>3</td><td>4.0</td></tr><tr><td>Harry Maguire</td><td>64</td><td>7</td><td>0.11</td><td>4</td><td>8.5</td></tr><tr><td>Alan Shearer</td><td>63</td><td>30</td><td>0.48</td><td>23</td><td>35.0</td></tr><tr><td>Kevin Keegan</td><td>63</td><td>21</td><td>0.33</td><td>15</td><td>18.5</td></tr><tr><td>Ray Wilson</td><td>63</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>David Platt</td><td>62</td><td>27</td><td>0.44</td><td>20</td><td>25.5</td></tr><tr><td>Emile Heskey</td><td>62</td><td>7</td><td>0.11</td><td>5</td><td>6.0</td></tr><tr><td>Chris Waddle</td><td>62</td><td>6</td><td>0.1</td><td>5</td><td>5.5</td></tr><tr><td>Declan Rice</td><td>62</td><td>5</td><td>0.08</td><td>4</td><td>5.0</td></tr><tr><td>Emlyn Hughes</td><td>62</td><td>1</td><td>0.02</td><td>1</td><td>1.0</td></tr><tr><td>Gary Cahill</td><td>61</td><td>5</td><td>0.08</td><td>4</td><td>3.5</td></tr><tr><td>James Milner</td><td>61</td><td>1</td><td>0.02</td><td>0</td><td>1.0</td></tr><tr><td>Ray Clemence</td><td>61</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Marcus Rashford</td><td>60</td><td>17</td><td>0.28</td><td>14</td><td>18.0</td></tr><tr><td>Peter Beardsley</td><td>59</td><td>9</td><td>0.15</td><td>7</td><td>9.0</td></tr><tr><td>Des Walker</td><td>59</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Phil Neville</td><td>59</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Jimmy Greaves</td><td>57</td><td>44</td><td>0.77</td><td>35</td><td>35.0</td></tr><tr><td>Jermain Defoe</td><td>57</td><td>20</td><td>0.35</td><td>10</td><td>18.0</td></tr><tr><td>Paul Gascoigne</td><td>57</td><td>10</td><td>0.18</td><td>7</td><td>10.0</td></tr><tr><td>Gareth Southgate</td><td>57</td><td>2</td><td>0.04</td><td>1</td><td>1.5</td></tr><tr><td>Johnny Haynes</td><td>56</td><td>18</td><td>0.32</td><td>14</td><td>15.5</td></tr><tr><td>Joe Cole</td><td>56</td><td>10</td><td>0.18</td><td>6</td><td>9.0</td></tr><tr><td>Stanley Matthews</td><td>54</td><td>11</td><td>0.2</td><td>9</td><td>8.5</td></tr><tr><td>Kieran Trippier</td><td>54</td><td>1</td><td>0.02</td><td>1</td><td>2.0</td></tr><tr><td>Glen Johnson</td><td>54</td><td>1</td><td>0.02</td><td>1</td><td>0.5</td></tr><tr><td>Glenn Hoddle</td><td>53</td><td>8</td><td>0.15</td><td>6</td><td>7.0</td></tr><tr><td>Gareth Barry</td><td>53</td><td>3</td><td>0.06</td><td>2</td><td>2.0</td></tr><tr><td>Paul Ince</td><td>53</td><td>2</td><td>0.04</td><td>0</td><td>2.0</td></tr><tr><td>David James</td><td>53</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Trevor Francis</td><td>52</td><td>12</td><td>0.23</td><td>9</td><td>12.5</td></tr><tr><td>Teddy Sheringham</td><td>51</td><td>11</td><td>0.22</td><td>9</td><td>11.0</td></tr><tr><td>Phil Neal</td><td>50</td><td>5</td><td>0.1</td><td>3</td><td>4.5</td></tr><tr><td>Geoff Hurst</td><td>49</td><td>24</td><td>0.49</td><td>18</td><td>27.0</td></tr><tr><td>Ron Flowers</td><td>49</td><td>10</td><td>0.2</td><td>8</td><td>9.0</td></tr><tr><td>Eric Dier</td><td>49</td><td>3</td><td>0.06</td><td>3</td><td>3.5</td></tr><tr><td>Colin Bell</td><td>48</td><td>9</td><td>0.19</td><td>8</td><td>7.0</td></tr><tr><td>Jimmy Dickinson</td><td>48</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Theo Walcott</td><td>47</td><td>8</td><td>0.17</td><td>5</td><td>8.5</td></tr><tr><td>Trevor Brooking</td><td>47</td><td>5</td><td>0.11</td><td>5</td><td>6.0</td></tr><tr><td>Mick Channon</td><td>46</td><td>21</td><td>0.46</td><td>17</td><td>17.5</td></tr><tr><td>Gary Stevens</td><td>46</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Mark Wright</td><td>45</td><td>1</td><td>0.02</td><td>1</td><td>2.0</td></tr><tr><td>Bukayo Saka</td><td>43</td><td>12</td><td>0.28</td><td>6</td><td>15.5</td></tr><tr><td>Phil Foden</td><td>43</td><td>4</td><td>0.09</td><td>3</td><td>4.5</td></tr><tr><td>Martin Keown</td><td>43</td><td>2</td><td>0.05</td><td>1</td><td>1.0</td></tr><tr><td>Chris Woods</td><td>43</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Jimmy Armfield</td><td>43</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Peter Crouch</td><td>42</td><td>22</td><td>0.52</td><td>14</td><td>17.0</td></tr><tr><td>Danny Welbeck</td><td>42</td><td>16</td><td>0.38</td><td>9</td><td>15.0</td></tr><tr><td>Tony Woodcock</td><td>42</td><td>16</td><td>0.38</td><td>11</td><td>15.5</td></tr><tr><td>Steve Coppell</td><td>42</td><td>7</td><td>0.17</td><td>5</td><td>6.0</td></tr><tr><td>Phil Thompson</td><td>42</td><td>1</td><td>0.02</td><td>1</td><td>1.0</td></tr><tr><td>David Batty</td><td>42</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Owen Hargreaves</td><td>42</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Mick Mills</td><td>42</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Paul Robinson</td><td>41</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Bob Crompton</td><td>41</td><td>0</td><td>0.0</td><td>0</td><td>0.0</td></tr><tr><td>Jude Bellingham</td><td>40</td><td>6</td><td>0.15</td><td>5</td><td>8.0</td></tr><tr><td>Phil Jagielka</td><td>40</td><td>3</td><td>0.07</td><td>2</td><td>2.0</td></tr>
  </tbody>
</table>

<script>
function sortTableUpdated(columnIndex) {{
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("dataTableUpdated");
    switching = true;
    while (switching) {{
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {{
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[columnIndex];
            y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {{
                shouldSwitch = true;
                break;
            }}
        }}
        if (shouldSwitch) {{
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }}
    }}
}}
</script>
