---
layout: post
title: Number of Days Between Easter's
date: 2018-04-17 14:51:00
description: "How many sleeps is it until next Easter?"
tags: mathematics python
related_posts: true
thumbnail: assets/img/daysToEaster.png
---

My three year old asked me a pretty interesting question this morning, "how many sleeps is it until next Easter?"

Okay, on the one hand the question is pretty straight forward. Easter this year (2018) was on April 1st, next year (2019) Easter falls on April 21st, so 385 days. But what is more interesting is what is the range and distribution of the possible number of days between consecutive Easter’s?

I've previously [written about the distribution of pancake day/Shrove Tuesday](https://seanelvidge.github.io/blog/2017/Distr_Pancake_Day/){:target="\_blank"}. In that article I discussed the (very) complicated way that Easter is calculated and provide a computus for finding Easter Sunday. Looping through the years 1 to 9999 (the extreme limits of [Python's datetime module](https://docs.python.org/2/library/datetime.html){:target="\_blank"}) we actually find that there are only 4 possible options for the number of days until next Easter: 350, 357, 378 and 385 days.

Given that Easter can fall on any day between March 22nd and April 25th I think this is quite a surprising result. The four options are not evenly distributed:

- 350 days – 24.5%
- 357 days – 38.7%
- 378 days – 5.1%
- 386 days – 31.7%

and we won’t have a 378 day Easter gap until 2021/22 and then 2048/49 after that.
