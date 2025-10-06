---
layout: post
title: The Trend in Taylor Swift's Mood
date: 2025-10-04 12:00:00
description: Taylor Swift doesn't just release albums, she releases chapters of her life, what does the average pitch of these albums look like?
tags: mathematics code
related_posts: true
---

Taylor Swift doesn't just release albums, she releases chapters of her life. From the optimism of _Fearless_ to the bite of _Reputation_, from the hushed poetry of _folklore_ to the midnight reflections of, well, _Midnights_. Each album is often thought of as a snapshot of where she was at that moment in time.

But can we actually see that story in the music itself? I thought I'd try.

The chart below shows an experiment: every dot is a Taylor Swift song, plotted by its "average pitch". The black line is the overall trend album by album, a kind of data-driven glimpse into her changing musical mood.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/TaylorSwiftMood.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>

Here's how it works. Every song can be broken down into thousands of tiny audio frames, and we can estimate the pitch of each. You could then just average all those frames/estimated pitches together, but then you end up something pretty meaningless: a whispered aside would count the same as a belted chorus.

Instead, I weighted each frame by its 'loudness'. Big, bold notes dominate, quiet moments barely move the needle. Mathematically the "weighted average pitch" looks like this:

$$
M = \frac{\sum_{i=1}^{N}w_im_i}{\sum{i=1}^{N}w_i},
$$

where $$m_i$$ is the pitch of a frame (in MIDI numbers) and $$w_i$$ is how loud it was. Here we do this in "MIDI" because it is a musical scale. Every step is a semitone. If we used raw frequency in Hertz the maths would skew towards the low notes in a way that doesn't really match how we actually hear music.

So, if you look at our plot, focusing on the smoothed black line, a story starts to appear:

- Early albums like _Fearless_ are higher up the stave, matching the wide-eyed optimism of youth.
- _1989_ soars with big pop anthems.
- Then comes the brooding dip of _Reputation_, the fallout years.
- During lockdown, _folklore_ and _evermore_ settle into quieter, lower ground.
- _Midnights_ stays low, steeped in melancholy.
- And then _The Tortured Poets Department_ plunges deepest of all.
- Then finally with _Life of a Showgirl_, the line bends upward again (significantly). Happy times have returned.

Obviously this is a very simplistic look at the album, and its emotional impact: lyrics, harmony, production, they all matter. But still, there's something striking about seeing the arc of her career emerge from the raw numbers. By weighting the most powerful sung moments, we get a sense of where the "centre of gravity" of each album lies.

And it turns out that when Taylor sings her life, the data sings it back.

---

Note: If you would like to try this yourself, if we other artists [here is the link](/assets/code/taylor_swift.py), to the code I used to make this post. You just need to pass a folder of music files to the code and it will work out the rest for you.
