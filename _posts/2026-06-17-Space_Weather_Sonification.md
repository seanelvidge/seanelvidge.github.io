---
layout: post
title: Space Weather - The Musical
date: 2026-06-17 22:00:00
description: Listen to the May 2024 geomagnetic superstorm as a piano score, with pitch, rhythm and dynamics derived from real solar and geomagnetic indices.
tags: spaceWeather mathematics
related_posts: true
thumbnail: assets/img/May_Storm_20240505-20240515.jpg
image_alt: Opening bars of a piano score generated from space weather data during the May 2024 geomagnetic superstorm.
last_modified_at: 2026-09-06
---

What does a geomagnetic storm sound like?

Not metaphorically. Literally.

Imagine taking the indices we use to drive our models of near-Earth space (solar radio flux, sunspot number, geomagnetic activity, ring-current disturbance) and translating it into a piece of music. This isn't a "space-inspired" soundtrack, but a deterministic piano score where every pitch, rhythm, chord, tempo change and accent is driven by real space weather indices.

That is what this blog post is all about. About how we turn space weather events into piano music. The result is a structured musical translation of the space environment, built so that the data can be heard.

## The May 2024 Superstorm

For an introduction to the event's physical setting, see [solar storms and the solar cycle]({% post_url 2024-10-11-Solar_storms_are_like_buses %}). To explore how unusual storms are quantified, read the [extreme value theory explainer]({% post_url 2019-06-01-Maths_on_a_Mug_8 %}).

{% include video.liquid path="/assets/sonification/May_Storm_20240505-20240515.pdf" width="100%" height="700"
  class="rounded z-depth-1" title="May 2024 storm score" %}

{% include audio.liquid path="/assets/sonification/May_Storm_20240505-20240515.mp3" controls=true %}
(Click play and listen along whilst you read the rest of the post explaining where the music comes from)

## A storm, compressed into the hands of a pianist

The example above uses data from May 5th to 15th 2024. This 10-day window captures the period around the major May 2024 geomagnetic storm — an event of intense aurora, severe geomagnetic activity and unusually (at least in recent times) dynamic near-Earth conditions.

Musically, the piece is placed onto a fixed daily grid:

- one day becomes four bars;
- each bar is in 6/4;
- one day is therefore 24 quarter-note beats;
- one hour corresponds to one quarter-note beat;
- thirty minutes corresponds to half a beat.

So however expressive the notes become (more details below), the structure remains anchored in time. Every layer of space weather indices realigns at midnight. Each day takes up the same "musical space", allowing the changing behaviour of the Sun-Earth system to become clear through changes in texture, pitch, rhythm and intensity.

## Five indices, five jobs

Here we use five space weather indices, and each are given a different job to do in defining the music:

- F10.7: the adjusted solar radio flux, controls the harmonic root in the left hand.
- Sunspot number: adds 'density' to the left-hand. When the sunspot number is sufficiently high, we add an octave root.
- Hp30: drives the right-hand melody. Because Hp30 is available every 30 minutes, it provides a natural melodic line.
- Kp: controls the broad rhythmic regime. Quiet geomagnetic periods lead to slower figures; storm periods create denser patterns.
- Dst: as it becomes more negative, the music becomes more forceful through dynamics, accents and tempo.

I was keen to use as many indices as possible to give the music as much 'texture' as I could do - entirely deterministically. I have tried to make solar activity shape harmony, geomagnetic activity shape motion and storm intensity shape tension.

## The right hand melody: Hp30

The right hand is the most active. It uses a pitch drawn from F# minor (my favourite), ranging from F#4 to E6. Each Hp30 value is normalised and mapped to one of fourteen pitches.

This means that higher geomagnetic activity tends to push the melody upward. But the mapping is not absolute. To create the score we do some local normalisation, i.e. we care both about how large Hp30 is on a physical scale and how large it is relative to the other values in the selected date range. This was needed so that even quite periods (geomagnetically) stay interesting.

The Kp (a logarithmic scale from 0 to 9) is used to define the rhythm:

- below Kp 5, the rhythm is relatively slow;
- from Kp 5 to 7, the rhythm becomes more active;
- above Kp 7, each hour becomes a four-note semiquaver figure.

But the exact rhythm inside each hour also responds to local movement in Hp30 and Dst. If Hp30 jumps within the hour, or if Dst changes sharply from one hour to the next, the right hand becomes more animated. A quiet Kp period is therefore not forced to be dull if the other data are still moving.

## The left hand: harmony and tension

The left hand provides the harmonic 'frame' of the piece. It chooses roots from an ordered set:

F#, A, B, C#, D, E, G#.

These are not arranged chromatically but arranged to give useful harmonies inside the F# minor world we're working in.

Each day has four bars, and each bar receives one harmonic root. F10.7 selects the base root. Then the day's pattern of F10.7 and sunspot-number change determines how the four roots move. If solar activity and sunspots are both rising, the harmony tends to climb. If both are falling, it descends. If they disagree, the progression takes a mixed path.

The chords themselves are simple diatonic triads: F# minor, A major, B minor, C# minor, D major, E major and G# diminished. This keeps the harmonic language coherent while still allowing the data to move the music through different regions of the scale.

Dst and Kp then decide how much weight the left hand carries. In low-tension periods, a bar may simply be one long chord. In moderate tension, a bass note is added before the chord. In high tension, the left hand pulses with repeated bass-plus-chord figures. A storm is therefore not only heard in the treble melody but also changes the 'weight' of the piano texture.

## Tempo, dynamics and accents

The score also has some performance notes in it. Whilst the overall tempo of the piece remains constant throughout, average note length is (slightly) determined by solar activity, Hp30, Dst, and Kp can all push the tempo upward (having an impact of making the piece feel like the speed is changing, but only really ranges from about 60 to 120 bpm so remains playable (at least to my limits!).

We also use four dynamic levels: p, mp, mf and f. This allows for clear changes in intensity without going over the top. Accents appear when the normalised activity is high enough. Staccato is added to the shortest right-hand notes. During intense storm intervals, the music becomes not just higher or faster, but sharper and more articulated.

## Why this is more than sonification

Many data-to-music projects work by assigning one variable to pitch and another to volume. That can be effective, but it often produces a thin musical result. This piano mapping is a little more ambitious. It treats the space weather system as a set of interacting musical lines:

- long-timescale solar conditions become harmony;
- short-timescale geomagnetic changes become melody;
- storm thresholds become rhythmic regimes;
- Dst depression becomes tension;
- sunspot number becomes chord density;
- daily evolution becomes harmonic progression.

This is also all deterministic. Given the same date range then the same notes, rhythms, dynamics and accents are produced. There are no random choices. This is important because it means the musical output is reproducible. The piece can be discussed, analysed and regenerated.

## Hearing the May 2024 storm

{% include audio.liquid path="/assets/sonification/May_Storm_20240505-20240515.mp3" controls=true %}

In calm moments of the space environment, the music has 'space'. The left hand can hold long chords while the right hand moves slowly through the scale. As activity increases, the melody becomes more agile. Rhythms subdivide. The tempo rises. Accents appear. The left hand gains pulse. The storm becomes audible not as noise, but as structure.

That is the most compelling aspect of the approach. Space weather is often communicated through plots, maps, alerts and indices. Those are essential. But music offers a different route into the same system. It lets us hear change, pressure, release, escalation and recovery.

The May 2024 storm was a scientific event, an operational challenge and, for many people, a spectacular visual experience. In this piano version, it becomes something else as well: a short, reproducible musical portrait of a disturbed geospace environment.
