---
layout: post
title: All England football league results
date: 2024-12-28 10:09:00
description: A plain text set of all England football (soccer) league results from 1888 to present.
tags: football
thumbnail: assets/img/england_league_results.png
related_posts: true
---

This article describes a plain text database of all England football (soccer) league results from 1888 to the present day (covering over 209,000 matches).

You can access the latest database on its dedicated github page: [England-football-results](https://github.com/seanelvidge/England-football-results/tree/main)

The database is updated roughly every two days (although I am looking for approaches to speed this up) for the top four divisions in England: Premier League, Championship, League 1 and League 2. The motivation for making the database is that I do a lot of statistical analysis on various bits and pieces in football (you can see some [here](https://seanelvidge.com/blog/tag/football/)), and not having an easy to read database really slows me down.

The [database](https://github.com/seanelvidge/England-football-results/tree/main) is a comma (",") delimited csv file with the following columns:

| Column   | Details                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date     | the day of the match (string; format "YYYY-MM-DD")                                                                                                      |
| Season   | the season the match took place in (string; format "YYYY/YYYY")                                                                                         |
| HomeTeam | the home team name (string)                                                                                                                             |
| AwayTeam | the away team name (string)                                                                                                                             |
| Score    | the final score (string; format "X-Z")                                                                                                                  |
| hGoal    | number of goals scored by the home team (integer; "X" from the "Score" column)                                                                          |
| aGoal    | number of goals scored by the away team (integer; "Z" from the "Score" column)                                                                          |
| Division | numerical representation of the division which the match was from: 1, 2, 3 or 4, where "1" is the top division (currently the Premier League) (integer) |
| Result   | the result "H" (home win), "A" (away win), "D" (draw) (string)                                                                                          |

The data from 1888 to 2016 is based on that from:
James P. Curley (2016). engsoccerdata: English Soccer Data 1871-2016. http://dx.doi.org/10.5281/zenodo.13158

Between 1921 and 1958 there was a Third Division North and South, in the database we give both the numerical representation "3".

Such a long database of results leads to some confusion around team names, the answer to the most common set of questions I have received in terms of team names:

- [Accrington F.C.](https://en.wikipedia.org/wiki/Accrington_F.C.) is a different team to [Accrington Stanley](https://en.wikipedia.org/wiki/Accrington_Stanley_F.C.). Acrrington F.C. were one of the founder members of the Football League, but unfortunately were dissolved in 1896.
- [Brighton & Hove Albion](https://en.wikipedia.org/wiki/Brighton_%26_Hove_Albion_F.C.), [New Brighton Tower](https://en.wikipedia.org/wiki/New_Brighton_Tower_F.C.) and [New Brighton](https://en.wikipedia.org/wiki/New_Brighton_A.F.C.) are all different clubs. New Brighton Tower were in existence from 1896-1901 and whilst Brighton & Hove Albion were formed in 1901, the "spiritual" successor to New Brighton Tower, was New Brighton (1921-1983 and 1993-2012; originally formed by the relocation of [South Liverpool](<https://en.wikipedia.org/wiki/South_Liverpool_F.C._(1890s)>))
- Burton [Swifts](https://en.wikipedia.org/wiki/Burton_Swifts_F.C.), [Wanderers](https://en.wikipedia.org/wiki/Burton_Wanderers_F.C.), [United](https://en.wikipedia.org/wiki/Burton_United_F.C.), [Town](https://en.wikipedia.org/wiki/Burton_Town_F.C.) and [Albion](https://en.wikipedia.org/wiki/Burton_Albion_F.C.) are all different teams. Burton Swifts joined with Wanderers to form Burton United in 1901, which in 1924 merged with Burton Town and in 1950 merged with the newly formed Burton Albion.
- Whilst [Leeds Unitd](https://en.wikipedia.org/wiki/Leeds_United_F.C.) were formed following/replacing [Leeds City](https://en.wikipedia.org/wiki/Leeds_City_F.C.) (and played in the same ground). No players or management from Leeds City moved to Leeds United so we treat them as separate football clubs.
- [Middlesbrough Ironopolis](https://en.wikipedia.org/wiki/Middlesbrough_Ironopolis_F.C.) (1889-1894) is separate team from [Middlesbrough](https://en.wikipedia.org/wiki/Middlesbrough_F.C.) (1876-).
- [Rotherham County](https://en.wikipedia.org/wiki/Rotherham_County_F.C.) merged with [Rotherham Town](<https://en.wikipedia.org/wiki/Rotherham_Town_F.C._(1899)>) in 1925 to form [Rotherham United](https://en.wikipedia.org/wiki/Rotherham_United_F.C.).
- [Wigan Athletic](https://en.wikipedia.org/wiki/Wigan_Athletic_F.C.) were formed (1932) a year after [Wigan Borough](https://en.wikipedia.org/wiki/Wigan_Borough_F.C.) were wound up (1931) and we treat them separately. Wigan Athletic was the sixth attempt to create a stable football club in Wigan following the dissolving of Wigan A.F.C., [County](https://en.wikipedia.org/wiki/Wigan_County_F.C.) (1897-1900), [United](https://en.wikipedia.org/wiki/Wigan_United_A.F.C.) (1896-1914), [Town](https://en.wikipedia.org/wiki/Wigan_Town_A.F.C.) (1905-1908) and [Borough](https://en.wikipedia.org/wiki/Wigan_Borough_F.C.) (1920-1931).

Hopefully there are lots of fun things you can do with this, please let me know about any of them! A couple of simple examples:

- You can use the form on this site to work out a league table for any given season and division or for any arbitrary date range, from 1888 to present (remembering before 1981 there was only [2 points for a win](https://en.wikipedia.org/wiki/Three_points_for_a_win) in English football): [https://seanelvidge.com/leaguetable](https://seanelvidge.com/leaguetable)
- To find the Head-to-Head statistics of any two clubs who have played in the English Football League visit: [https://seanelvidge.com/h2h](https://seanelvidge.com/h2h)
  - This code can have the team names passed directly into the url, e.g. to get the head-to-head statistics of Arsenal v Chelsea visit: [https://seanelvidge.com/h2h?team1=Arsenal&team2=Chelsea](https://seanelvidge.com/h2h?team1=Arsenal&team2=Chelsea)
