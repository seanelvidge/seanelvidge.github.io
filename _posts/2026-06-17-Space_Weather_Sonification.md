---
layout: post
title: Space Weather - The Musical
date: 2026-06-17 23:30:00
description: What does a geomagnetic storm sound like? Not metaphorically. Literally.
tags: spaceWeather mathematics
related_posts: true
thumbnail: assets/sonification/May_Storm_20240505-20240515.pdf
---

What does a geomagnetic storm sound like?

Not metaphorically. Literally.

Imagine taking the indices we use to drive our models of near-Earth space (solar radio flux, sunspot number, geomagnetic activity, ring-current disturbance) and translating it into a piece of music. Not a vague "space-inspired" soundtrack, but a deterministic piano score where every pitch, rhythm, chord, tempo change and accent is driven by real space weather indices.

That is what this blog post is all about. About how we turn space weather events into a two-hand piano piece. The result is not random sonification. It is a structured musical translation of the space environment, built so that the data can be heard as musical behaviour.

## The May 2024 Superstorm

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/sonification/May_Storm_20240505-20240515.pdf" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>

{% include audio.liquid path="/assets/sonification/May_Storm_20240505-20240515.mp3" controls=true %}

## A storm, compressed into the hands of a pianist

The example above uses data from May 5th to 15th 2024. This 10-day window captures the period around the major May 2024 geomagnetic storm — an event of intense aurora, severe geomagnetic activity and unusually (at least in recent times) dynamic near-Earth conditions.

Musically, the whole piece is placed onto a fixed daily grid:

- one day becomes four bars;
- each bar is in 6/4;
- one day is therefore 24 quarter-note beats;
- one hour corresponds to one quarter-note beat;
- thirty minutes corresponds to half a beat.

So however expressive the notes become (more details below), the structure remains anchored in time. Every layer realigns at midnight. Each day occupies takes up the same "musical space", allowing the changing behaviour of the Sun-Earth system to become clear through changes in texture, pitch, rhythm and intensity.

## Five indices, five different jobs

Here we use five space weather indices, and each are given a different job to do in defining the music:

- F10.7: the adjusted solar radio flux, controls the harmonic root in the left hand.
- Sunspot number: adds density to the left-hand. When the sunspot number is sufficiently high, we add an octave root.
- Hp30: drives the right-hand melody. Because Hp30 is available every 30 minutes, it provides a natural melodic line.
- Kp: controls the broad rhythmic regime. Quiet geomagnetic periods lead to slower figures; storm periods create denser patterns.
- Dst: as it becomes more negative, the music becomes more forceful through dynamics, accents, tempo and additional texture.

Crucially these roles are not decorative. Each index is mapped into a particular part of the musical language. Solar activity shapes harmony. Geomagnetic activity shapes motion. Storm intensity shapes tension.

## The right hand: Hp30 as melody

The right hand is most active. It uses a pitch drawn from F# minor (my favourite), ranging from F#4 to E6. Each Hp30 value is normalised and mapped to one of fourteen pitches.

This means that higher geomagnetic activity tends to push the melody upward. But the mapping is not purely absolute. The script blends fixed normalisation with local normalisation. In other words, it cares both about how large Hp30 is on a physical scale and how large it is relative to the other values in the selected date range. That choice matters musically because without some local normalisation, quiet periods can become flat and uninteresting. Without fixed normalisation, tiny changes during a quiet day might be exaggerated. The blended approach preserves both scientific scale and musical expressiveness.

The Kp is used to define the rhythm:

- below Kp 5, the rhythm is relatively slow;
- from Kp 5 to 7, the rhythm becomes more active;
- above Kp 7, each hour becomes a four-note semiquaver figure.

But the exact rhythm inside each hour also responds to local movement in Hp30 and Dst. If Hp30 jumps within the hour, or if Dst changes sharply from one hour to the next, the right hand becomes more animated. A quiet Kp period is therefore not forced to be dull if the other data are still moving.

## The left hand: solar harmony and storm tension

The left hand provides the harmonic frame. It chooses roots from an ordered set:

F#, A, B, C#, D, E, G#.

These are not arranged chromatically. They are arranged to give useful harmonies inside the F# minor world we're working in.

Each day has four bars, and each bar receives one harmonic root. F10.7 selects the base root. Then the day's pattern of F10.7 and sunspot-number change determines how the four roots move. If solar activity and sunspots are both rising, the harmony tends to climb. If both are falling, it descends. If they disagree, the progression takes a mixed path.

The chords themselves are simple diatonic triads: F# minor, A major, B minor, C# minor, D major, E major and G# diminished. This keeps the harmonic language coherent while still allowing the data to move the music through different regions of the scale.

Dst and Kp then decide how much weight the left hand carries. In low-tension periods, a bar may simply be one long chord. In moderate tension, a bass note is added before the chord. In high tension, the left hand pulses with repeated bass-plus-chord figures. A storm is therefore not only heard in the treble melody but also changes the 'weight' of the piano texture.

## Tempo, dynamics and accents

The score also has some performance notes in it. Each day receives a tempo marking. The base tempo is 76 bpm, but solar activity, Hp30 activity, Dst storm depth and Kp activity can all push the tempo upward. The result is clipped between 60 and 116 bpm, so the music remains playable (at least to my limits!) and controlled.

We use four dynamic levels: p, mp, mf and f. This allows for clear changes in intensity without going over the top. Accents appear when the normalised activity is high enough. Staccato is added to the shortest right-hand notes. During intense storm intervals, the music becomes not just higher or faster, but sharper and more articulated.

## Why this is more than sonification

Many data-to-music projects work by assigning one variable to pitch and another to volume. That can be effective, but it often produces a thin musical result. This piano mapping is more ambitious.

It treats the space weather system as a set of interacting musical responsibilities:

- long-timescale solar conditions become harmony;
- short-timescale geomagnetic changes become melody;
- storm thresholds become rhythmic regimes;
- Dst depression becomes tension;
- sunspot number becomes chord density;
- daily evolution becomes harmonic progression.

This is also all deterministic. Given the same date range then the same notes, rhythms, dynamics and accents are produced. There are no random choices. This is important because it means the musical output is reproducible. The piece can be discussed, analysed and regenerated.

## Hearing the May 2024 storm

{% include audio.liquid path="/assets/sonification/May_Storm_20240505-20240515.mp3" controls=true %}

In quiet moments, the music has space. The left hand can hold long chords while the right hand moves slowly through the scale. As activity increases, the melody becomes more agile. Rhythms subdivide. The tempo rises. Accents appear. The left hand gains pulse. The storm becomes audible not as noise, but as structure under pressure.

That is the most compelling aspect of the approach. Space weather is often communicated through plots, maps, alerts and indices. Those are essential. But music offers a different route into the same system. It lets us hear change, pressure, release, escalation and recovery.

The May 2024 storm was a scientific event, an operational challenge and, for many people, a spectacular visual experience. In this piano version, it becomes something else as well: a short, reproducible musical portrait of a disturbed geospace environment.
