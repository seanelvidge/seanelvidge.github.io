---
layout: post
title: Distribution of Pancake Day
date: 2017-02-28 14:27:00
description: Today is pancake day and it got me thinking about the fact that I remember the day falling on my birthday (March 7th) just once in my lifetime. How long will I have to wait until it next falls on my birthday?
tags: mathematics football code
related_posts: true
thumbnail: assets/img/pancake_day.png
---

Today is pancake day, and it got me thinking about the fact that it once fell on my birthday (March 7th). How long will I have to wait until it next falls on my birthday?

Pancake day, or [Shrove Tuesday](https://en.wikipedia.org/wiki/Shrove_Tuesday), is the day before the first day of Lent, or exactly 47 days before Easter Sunday. So to calculate when Pancake day will be we just need to work out when Easter Sunday is.

[The Economist sums this up nicely:](http://www.economist.com/blogs/economist-explains/2013/03/economist-explains-why-easter-moves-around)

"According to the Bible, Jesus held the Last Supper with his disciples on the night of the Jewish festival of Passover, died the next day (Good Friday) and rose again on the third day (the following Sunday). The beginning of Passover is determined by the first full moon after the vernal equinox, which can occur on any day of the week. To ensure that Easter occurs on a Sunday, the Council of Nicaea therefore ruled in 325AD that Easter would be celebrated on the Sunday after the first full moon on or after the vernal equinox. But there’s a twist: if the full moon falls on a Sunday, then Passover begins on a Sunday, so Easter is then delayed by a week to ensure that it still occurs after Passover. To confuse matters further, the council fixed the date of the vernal equinox at March 21st, the date on which it occurred in 325AD (though it now occurs on March 20th), and introduced a set of tables to define when the full moon occurs that do not quite align with the actual astronomical full moon (which means that, in practice, Easter can actually occur before Passover)."

Fortunately we can use a [computus](https://en.wikipedia.org/wiki/Computus) to determine the date of Easter Sunday. There are many approaches to calculating the date but the one I've gone for (in Python) is:

```python
import datetime as dt

def easterDate(year):
    a = year % 19
    b = year//4
    c = (b//25) + 1
    d = (c*3)//4
    e = ((a*19) - ((c*8 + 5)//25) + d + 15) % 30
    f = e + (29578 - a - e*32)//1024
    g = f - ((year % 7) + b - d + f + 2) % 7
    h = g//32
    day = g - h*31
    month = h + 3
    return dt.date(year, month, day)

print(easterDate(2017))
# 2017-04-16
```

And so Pancake date is found by subtracting 47 days:

```python
print(easterDate(2017) - dt.timedelta(days=47))
# 2017-02-28
```

Today’s date!

We get the distribution of Pancake days by looping through all the years which Python's datetime module can deal with (1900 to 9999) and get:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/pancake_day.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>

The earliest date that Pancake day can fall on is Feb 3rd (the earliest date for Easter is March 22nd, which occurs if the full moon falls on Saturday March 21st). The latest pancake day is March 9th (that gives the latest Easter as April 25th which needs quite a specific set up – the full moon would have to occur March 20th, meaning the first full moon after March 21st would be April 18th. If however April 18th is a Sunday then Easter is celebrated the following Sunday, April 25th). We can see from the distribution that the tail of these extreme dates occur quite rarely, they then ramp up to a fairly even distribution of dates between Feb 9th and March 4th (excluding Feb 29th, which has an obvious dip).

Unfortunately my birthday falls quite far down the tail of the distribution, March 7th, only two days earlier than the latest possible Pancake day. Only 1.67% of Pancake days fall on that date. Which, given that the UK life expectancy for men is 81.5 years, means I should only expect to live to see 1, beautiful, pancake-birthday, which I did, on March 7th 2000. I’ll have to wait (and try and hold out) until 2079 to see another.

[Here is a link](/assets/code/Shrove_Tue_Dist.py), to the code I used to for this post.
