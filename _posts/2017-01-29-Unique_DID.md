---
layout: post
title: Number of Unique Song Choices on Desert Island Discs
date: 2017-01-29 11:34:00
description: How many unique song choices to guests pick on Desert Island Discs?
tags: internet
related_posts: true
thumbnail: assets/img/did1.png
---

[Desert Island Discs](http://www.bbc.co.uk/programmes/b006qnmr) celebrates its 75th birthday today, and today’s guest is [David Beckham](http://www.bbc.co.uk/programmes/b08bz0rz). Beckham will pick 8 song choices to take away with him on a desert island. What I wondered was, will all of his song choices have been picked by guests previously? With over 3,000 episodes there are going to be a lot of repetitions.

Obviously the very first guest, [Vic Oliver](http://www.bbc.co.uk/programmes/p009y0nq) had to pick 8 unique song choices. There was no one before him! The second guest, [James Agate](http://www.bbc.co.uk/programmes/p009y0nl) also picked 8 unique choices (they were all different to Vic Oliver’s).  This continued until the 8th guest, [Joan Jay](http://www.bbc.co.uk/programmes/p009y0my), who only had 7 unique choices (she picked Ave Maria by Charles‐François Gounod the same as [Pat Kirkwood](http://www.bbc.co.uk/programmes/p009y0n8)). A quick scrape of the BBC 4 webpage gives us all of the song choices of each of the guests. Plotting the data as a histogram of ‘unique’ choices leads to a not unsurprising result:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/did1.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>

On average a castaway picks 3 unique choices, but really anything between 2 and 5 unique choices is quite probable. Picking 0 unique choices (~100 out of 3096 castaways) and all (8) unique choices (~50 out of 3096 castaways) is not very likely. The thing that is rather interesting though is if you look at the number of unique choices as a time series:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/did2.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>

The data is obviously very noisy, with 0 and 8 unique choices scattered throughout the time series. But there is a clear trend. I’ve fitted a curve (least-squares) to the data and the results hopefully become clear. There was a decrease in the number of unique choices from the start of the show down until the mid 1980s, and since then there has been an increase again! I would guess that this has something to do with the explosion of popular music, the early choices are dominated by “famous” classical music pieces, but this has decreased over time.
