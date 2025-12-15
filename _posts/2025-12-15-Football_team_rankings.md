---
layout: post
title: Tracking Football Team Strengths with a Bayesian Kalman Model
date: 2025-12-15 09:20:00
description: The methodology behind my football team strength model.
tags: football mathematics
related_posts: true
thumbnail: assets/img/football_rankings.png
---

Not all football-rating systems are the same. Many of the public ones, like the excellent [ClubElo](http://clubelo.com/System), do a fine job of ranking teams using elegant updates. Win and your rating rises, lose and it falls; the amount you move depends on how "surprised" the model was.

This model begins in the same spirit but replaces those heuristic updates with a probabilistic engine: a _Bayesian Extended Kalman Filter_ coupled to a modern version of the Bradley–Terry model (with added draws). The core idea is simple: treat each team's strength as something hidden that we estimate and track through time, with uncertainty that expands between matches and contracts when new results arrive.

Across the [full historical dataset](https://seanelvidge.com/articles/2024/All_England_football_league_results/) (every English league match since 1888) the system achieves a mean Brier score of 0.2035. These values are significantly better than many published computer models (e.g. [Nyamdorj et al. 2014](https://www.stat.cmu.edu/cmsac/sure/2023/showcase/soccer/report.html), [BSIC, 2024](https://bsic.it/odds-at-play-testing-efficiency-in-the-premier-league-and-serie-a/) and [Harvard Sports Analysis Collective, 2015](https://harvardsportsanalysis.org/2015/07/5988/)) which indicates a stable, well-calibrated predictive performance. Crucially, because the filter quantifies its own uncertainty, it can tell us not only who is strongest, but how confident we should be in that judgement.

The rest of this post goes into the mathematical details of the ranking algorithm, but if you want to access the underlying data it is [available here](https://github.com/seanelvidge/England-football-results) (specifically the file `EnglandLeagueResults_wRanks.csv`). 

## The Big Picture

Imagine every team has a hidden "true strength" $$s_i$$. Before a match, the home and away teams carry beliefs about their current strengths, each with an associated uncertainty. When they play, the result provides new information that updates those beliefs.

In the ClubElo framework this update is written directly as

$$
R_{\text{new}} = R_{\text{old}} + K(S - E),
$$

where $$S$$ is the score (1 for a win, 0.5 for a draw, 0 for a loss), $$E$$ is the expected probability, and $$K$$ is a fixed responsiveness parameter.

Here, the same logic is embedded in a [Kalman filter](https://en.wikipedia.org/wiki/Kalman_filter), which means the effective $$K$$ is learned automatically. The update size depends on two things: how uncertain we are about the teams, and how surprising the result was. Upsets between uncertain teams lead to large updates; shocks between well-understood teams barely move the needle.

Between matches, team strengths are not frozen. Instead, they evolve according to a _mean-reverting stochastic process_, allowing form to drift while preventing runaway behaviour. Newly promoted teams begin with large uncertainty and adapt quickly; established teams gravitate toward long-term baselines rather than rising indefinitely.

## Modelling Match Outcomes (Wins, Draws, Losses)

Match outcomes are modelled using the [Davidson extension](https://www.jstor.org/stable/2283595) of the [Bradley–Terry model](https://en.wikipedia.org/wiki/Bradley%E2%80%93Terry_model), which naturally incorporates draws. The probability of each outcome is

$$
\Pr(\text{Home}) = \frac{e^{\Delta}}{e^{\Delta} + e^{-\Delta} + \kappa},
$$

$$
\Pr(\text{Draw}) = \frac{\kappa}{e^{\Delta} + e^{-\Delta} + \kappa},
$$

$$
\Pr(\text{Away}) = \frac{e^{-\Delta}}{e^{\Delta} + e^{-\Delta} + \kappa},
$$

where

$$
\Delta = \beta \bigl(s_H - s_A + h\bigr).
$$

Here, $$s_H$$ and $$s_A$$ are the latent strengths of the home and away teams, $$\beta$$ is a scaling parameter, $$\kappa$$ controls the draw rate, and $$h$$ is the home-advantage term.

## Home Advantage - Explicit and Time-Varying

Home advantage is not treated as a fixed constant. Instead, it is explicitly modelled and allowed to vary over time. Historical analysis shows that home-win rates in English football have declined dramatically since the late 19th century, falling from well above 60% to closer to 40–45% in the modern era (see [this analysis](https://seanelvidge.com/articles/2025/Home_advantage_in_English_football/)).

By allowing the home-advantage parameter $$h$$ to evolve slowly with time, the model correctly distinguishes between a home match in 1890 and one in 2025. This prevents systematic bias when comparing teams across eras and is a key improvement over static-advantage rating systems.

## Validation and Rating Scale

Predictive accuracy is measured using the [Brier score](https://en.wikipedia.org/wiki/Brier_score), defined as the mean squared error between predicted probabilities and observed outcomes. Over the full dataset the score is 0.2035 (for the 2024/25 season it is 0.2085), indicating robust calibration both historically and in the present day.

Internally, the filter operates on a latent "skill" scale roughly spanning $$-3$$ to $$+3$$. However for presentation, these values are mapped linearly onto an Elo-style scale, centred on 1000 points, with elite teams reaching 1800+ and lower-league teams clustering about a thousand points below. This transformation is purely cosmetic; all inference happens on the latent scale.

# Part II — If You Dare Read On: The Mathematics

## 1. State Evolution ([Ornstein–Uhlenbeck](https://en.wikipedia.org/wiki/Ornstein%E2%80%93Uhlenbeck_process) Dynamics)

Each team’s latent strength evolves as

$$
s_{i,t+1} = \rho\, s_{i,t} + (1 - \rho)\, \mu_{\text{tier}(i,t)} + \varepsilon_{i,t},
$$

with

$$
\varepsilon_{i,t} \sim \mathcal{N}(0, q_i).
$$

Here, $$\rho$$ controls persistence, $$\mu_{\text{tier}}$$ is the long-term baseline for the team's division tier, and $$q_i$$ is the process variance. This formulation allows ratings to drift while remaining anchored to realistic league-level expectations.

## 2. Observation Model

Given predicted strengths $$s_H$$ and $$s_A$$, the model produces a probability vector

$$
\mathbf{p} =
\begin{bmatrix}
p_H \\
p_D \\
p_A
\end{bmatrix},
$$

using the Davidson–Bradley–Terry equations above. The Jacobian matrix $$H$$ is computed by differentiating $$\mathbf{p}$$ with respect to the state vector $$[s_H, s_A]^T$$, enabling linearisation of the nonlinear observation model.

## 3. Extended Kalman Filter Update

Prediction step:

$$
x^- = F x_t,
$$

$$
P^- = F P_t F^\top + Q,
$$

where $$F = \rho I$$ and $$Q$$ is the process-noise covariance.

Observation noise:

$$
R = \operatorname{diag}(\mathbf{p}) - \mathbf{p}\mathbf{p}^\top.
$$

Update step:

$$
K = P^- H^\top \bigl(H P^- H^\top + R\bigr)^{-1},
$$

$$
x_{t+1} = x^- + K (y - \mathbf{p}),
$$

$$
P_{t+1} = (I - K H) P^-.
$$

The Kalman gain $$K$$ replaces the fixed $$K$$-factor of traditional Elo systems, adapting automatically to uncertainty and surprise. A secondary control loop monitors the normalised innovation squared to ensure statistical consistency over time.

## Why This Matters

This framework enforces mathematical honesty. Uncertainty is explicit, calibration is measurable, and every parameter—$$\beta$$, $$\rho$$, $$q$$, $$\kappa$$, tier baselines, and historical home advantage—has a clear interpretation.

Instead of a single magic constant, the model becomes a living system that adapts across seasons, divisions, and eras. When a lower-league team's rating converges toward that of a top-flight side, it is not guesswork—it is a probabilistic statement grounded in data, uncertainty, and time.
