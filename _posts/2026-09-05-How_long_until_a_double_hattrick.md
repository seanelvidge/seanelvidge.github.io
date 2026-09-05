---
layout: post
title: How long until a double hat-trick in the Premier League?
date: 2026-09-05 22:00:00
description: No player has scored six goals in a single Premier League match - how surprising is that?
tags: football mathematics
related_posts: true
thumbnail: assets/img/topScorers.png
---

No player has scored six goals in a single Premier League match. This post estimates how surprising that absence is by modelling the distribution of individual player-match "goal hauls", conditional on the player scoring at least once. Using Premier League data from 1992-93 through 2025-26, excluding own goals, we observe 30,561 scoring player-matches: 27,285 single-goal hauls, 2,871 braces, 363 hat-tricks, 37 four-goal hauls, five five-goal hauls, and no six-goal hauls (double hat-tricks). 

# Introduction

There has never been a double hat-trick (six goals by a single player in a single match) in the English Premier League. The record remains five goals, jointly held by Andrew Cole, Alan Shearer, Jermain Defoe, Dimitar Berbatov and Sergio Aguero.

The absence of a six-goal haul raises a simple statistical question: is this surprising?

In this analysis we set the _response variable_ ($$K$$) to be the number of goals scored by a player in a single Premier League match. This post is all conditional on $$K>0$$ as we do not attempt to define every possible player-match 'opportunity' to score. A zero-goal observation could mean a starting striker who played 90 minutes, a full-back who played 12 minutes, or an unused substitute, depending on the chosen denominator. Instead, we model the distribution of positive player-match goal hauls: one, two, three, four, five and six-or-more.

This makes the analysis we need to do here a zero-truncated counting problem. What we hope to show in this blog is that a zero-truncated negative binomial distribution provides a coherent and effective model for Premier League individual scoring hauls. It is coherent because the negative binomial arises naturally as a mixed Poisson distribution, corresponding to heterogeneous latent scoring intensities across players, teams, match states and tactical roles. It is effective because it matches the observed distribution from one-goal hauls through the five-goal upper tail, and gives a plausible estimate for the still-unobserved double hat-trick.

# Data

The empirical distribution used here was constructed from scorer-level Premier League goal data. Historical scorer and goal-time data were taken from [@schochastics](https://github.com/schochastics/football-data). Own goals were excluded since the aim is to model goals credited to an attacking player, not all goals credited to the team. Across the Premier League period considered, 1992–93 through 2025–26, the observed positive player-match distribution is:

| Goals by one player in one match |      Count |
| -------------------------------: | ---------: |
|                                1 |     27,285 |
|                                2 |      2,871 |
|                                3 |        363 |
|                                4 |         37 |
|                                5 |          5 |
|                               6+ |          0 |
|                        **Total** | **30,561** |


The period contains 13,166 Premier League matches. This follows from three 22-club seasons with 462 matches each, followed by 31 20-club seasons with 380 matches each. The mean number of scoring player-matches per Premier League match is therefore

$$
\frac{30561}{13166} = 2.321.    
$$

This value is only used for translating the fitted distribution into calendar-time estimates for the first double hat-trick. It is not used to estimate the number of zero-goal player appearances.

# Model
## Why not a simple Poisson model?
We model the distribution of player-match goal hauls using the Poisson distribution. That is, for a count variable $Y$,

$$
P(Y=k)=\frac{\exp^{-\lambda}\lambda^k}{k!},
$$

where $$\lambda$$ is the expected number of events in the interval. This fixed-rate Poisson model is useful because goals are rare events. However, it is implausible for this exact example of individual player-match goal hauls if we use the same $$\lambda$$ for all players and matches. A goalkeeper, a centre-back, a substitute winger, a penalty-taking forward and Erling Haaland are not drawn from the same scoring process. The Poisson idea is not necessarily wrong, but rather the homogeneity is.

## Mixed Poisson Interpretation

A more realistic assumption is that goals are Poisson conditional on a latent player-match scoring intensity:

$$
Y_i \vert \Delta_i \sim \text{Poisson}(\Delta_i).
$$

Here $$\Delta_i$$ varies across player-matches. Variation in $$\Delta_i$$ captures, in a reduced form, differences in position, ability, minutes played, team strength, opposition strength, match state and wider tactical context. We assume that these latent rates follow a gamma distribution:

$$
\Delta_i \sim \text{Gamma}(r, \beta),
$$

where $$r$$ is the shape parameter and $$\beta$$ is the rate parameter. Mixing the Poisson distribution over the gamma distribution gives a negative binomial marginal distribution:

$$
P(Y=k)=\frac{\Gamma(k+r)}{\Gamma(r)k!}(1-p)^rp^k,\quad k=0,1,2,\ldots,
$$

where 

$$
p=\frac{1}{\beta + 1}.
$$

This has mean $$E(Y)=\frac{rp}{1-p}$$ and variance $$Var(Y)=\frac{rp}{(1-p)^2}$$. Since the variance exceeds the mean when $$p>0$$ the negative binomial accommodates over-dispersion relative to the Poisson distribution. In football terms, the upper tail is fatter because the population is a mixture of many low-rate and some high-rate player-match scoring processes, which suitably describes the scenario we are working in.

## Zero Truncation
The data in the previous Table contains only player-matches in which a player scored at least once. Therefore the appropriate model is the zero-truncated negative binomial:

$$
P(K=k\vert K>0)=\frac{P(Y=k)}{1-P(Y=0)},\quad k=1,2,3,\ldots
$$

Since

$$
P(Y=0)=(1-p)^r,
$$

the fitted probabilities are

$$
P(K=k)=\frac{\frac{\Gamma(k+r)}{\Gamma(r)k!}(1-p)^rp^k}{1-(1-p)^r},\quad k=1,2,3,\ldots
$$

For observed counts, $$n_k$$, the log-likelihood is

$$
l(r,p) = \sum_k n_k\left[\log\Gamma(k+r) - \log\Gamma(r) - \log(k!) + r\log(1-p) + k\log(p) - \log\left(1-(1-p)^r\right) \right],
$$

with observed categories $$k=1,\ldots,5$$ and the grouped tail $$k\ge 6$$ with zero observations in the tail.

# Results
## Fitted Zero-Truncated Negative Binomial

The maximum likelihood estimates of the zero-truncated negative binomial are:

$$
\hat{r} &=& 0.4767,\\
\hat{p} &=& 0.1434,
$$

and the corresponding zero probability in the truncated distribution is

$$
P(Y=0)= (1-\hat{p})^{\hat{r}}=0.9288.
$$

Thus, under the implied full latent model, only about 7.12% of player-match latent scoring processes produce at least one goal. However, this interpretation should be treated cautiously, because the analysis does not define the set of all zero-goal opportunities.

The table below compares the observed counts with the fitted zero-truncated negative binomial expectations.

| Goals | Observed | Expected | Observed / Expected |
| ----: | -------: | -------: | ------------------: |
|     1 |   27,285 | 27,280.4 |               1.000 |
|     2 |    2,871 |  2,889.4 |               0.994 |
|     3 |      363 |    342.2 |               1.061 |
|     4 |       37 |     42.7 |               0.867 |
|     5 |        5 |      5.5 |               0.912 |
|    6+ |        0 |     0.83 |                   – |


The fit is close across the full observed range. The model slightly overestimates four-goal hauls, slightly underestimates exact hat-tricks, and places less than one expected observation in the unobserved six-or-more tail. The Pearson goodness-of-fit statistic gives $$\chi^2=3.01$$ and and a likelihood-ratio deviance gives $$G^2=3.85.$$

With six grouped categories and two fitted parameters, this corresponds to approximately three degrees of freedom. The corresponding approximate $$p$$-values are 0.39 and 0.28 respectively. These should not be over-interpreted because the upper tail is sparse, but there is no evident lack of fit.

## Comparison with Simpler Models
For comparison, the following table reports fit diagnostics for three zero-truncated positive-count models:

- zero-truncated Poisson;
- shifted geometric;
- zero-truncated negative binomial.

The shifted geometric distribution is

$$
P(K=k) = (1-q)q^{k-1},\quad k=1,2,3\ldots.
$$

It is included because the observed continuation ratios are approximately constant, which makes the geometric distribution a natural empirical benchmark.

| Model                            | Parameters | Pearson χ² | Deviance G² |      AIC |      BIC |
| -------------------------------- | ---------: | ---------: | ----------: | -------: | -------: |
| Zero-truncated Poisson           |          1 |     145.10 |      113.51 | 23,685.9 | 23,694.2 |
| Shifted geometric                |          1 |       9.02 |        9.27 | 23,581.6 | 23,590.0 |
| Zero-truncated negative binomial |          2 |       3.01 |        3.85 | 23,578.2 | 23,594.9 |


The zero-truncated Poisson model is clearly inadequate. It does not produce enough upper-tail mass. However the shifted geometric distribution is surprisingly good, and in terms of BIC performs the best. The zero-truncated negative binomial gives the best AIC and the best diagnostic fit, but its advantage over the geometric model should be described as moderate rather than overwhelming. The main reason to prefer the negative binomial is mechanistic. The shifted geometric is a compact description of the observed decay rate. The negative binomial explains why the tail is fat: it is what we expect when player-match scoring rates are heterogeneous.

## Continuation Ratios
An additional useful way to understand the distribution is to examine the empirical ratios between adjacent haul sizes:

$$
\frac{n_{k+1}}{n_k}.
$$

These ratios help to answer the informal question: once a player has reached a given scoring level, how often does the next level appear? The empirical rate, from the data, compared with the rates from the zero-truncated negative binomial (ZTNB) are shown below:

| Step | Empirical Ratio | ZTNB Fitted Ratio |
| ---: | --------------: | ----------------: |
|  2/1 |          10.52% |            10.59% |
|  3/2 |          12.64% |            11.84% |
|  4/3 |          10.19% |            12.47% |
|  5/4 |          13.51% |            12.84% |
|  6/5 |               – |            13.09% |

The fitted negative binomial recurrence relation is

$$
\frac{P(K=k+1)}{P(K=k)} = \frac{p(k+r)}{k+1}.
$$

For the fitted parameters, the continuation ratio rises slowly from approximately 10.6% at $$1\rightarrow 2$$ to 13.1% at $$5\rightarrow 6$$. This matches the empirical pattern: the distribution decays rapidly, but not as rapidly as a fixed-rate Poisson model would imply.

# Probability of a Double Hat-Trick
In answering our question on the probability of a double hat-trick (6 goals), there is a subtle difference between the probability of there being _exactly_ six goals in a match or _six or more_ goals. The fitted model gives, for exactly six goals,

$$
P(K=6\vert K>0)=2.35\times 10^{-5}
$$

and for, six or more goals,

$$
P(K\ge 6\vert K>0) = 2.71\times 10^{-5}.
$$

Thus, conditional on a player scoring at least once, the fitted probability of a six-or-more-goal haul is approximately one in 36,900 scoring player-matches:

$$
\frac{1}{2.71\times 10^{-5}} \approx 36,900.
$$

Across the Premier League era to date, there have been 30,561 scoring player-matches. The expected number of six-or-more-goal hauls is therefore

$$
30,561\times 2.71\times 10^{-5} = 0.83.
$$

Approximating six-or-more hauls as rare independent events, the probability of seeing none (as we so far have) is

$$
\exp(-0.83) = 0.437.
$$

So, under the fitted model, the probability of no double hat-trick so far is about 44%.

This is the main result. The Premier League is not "overdue" a double hat-trick. The absence of a six-goal haul is entirely plausible. But the expected count is no longer negligible; observing the first double hat-trick would not be a statistical shock.


## Future Waiting Time
Using the historical rate of scoring player-matches per match, 2.321, with a current 380-match season contains approximately $$2.321 \times 380=882$$ scoring player-matches.

The per-season probability of at least one six-or-more-goal haul is therefore approximately

$$
1-(1-2.71\times 10^{-5})^{882} = 0.0236.
$$

That is about 2.4% per season, or one six-or-more-goal haul every 42 Premier League seasons. The cumulative probability over future periods is shown below

| Future Period | Probability of at least one $$K\ge 6$$ haul |
| ------------: | ------------------------------------------: |
|      1 season |                                        2.4% |
|     5 seasons |                                       11.3% |
|    10 seasons |                                       21.2% |
|    20 seasons |                                       38.0% |
|    30 seasons |                                       51.2% |
|    40 seasons |                                       61.5% |


On this model, the first Premier League double hat-trick becomes roughly a coin-flip proposition over the next 30 seasons, assuming the future resembles the historical period.

## Uncertainty
The uncertainty is substantial because the upper tail is informed by only 37 four-goal hauls, five five-goal hauls and no six-goal hauls. A parametric bootstrap from the fitted grouped distribution gives an indicative 95% interval for $$P(K\ge 6\vert K>0)$$ of approximately $$1.5\times 10^{-5}$$ to $$4.2\times 10^{-5}$$. This corresponds to a rate between roughly one six-or-more haul every 27 to 75 seasons. 

# Discussion
The zero-truncated negative binomial model provides a coherent account of individual English association football Premier League scoring hauls. A fixed-rate Poisson model assumes one scoring intensity for all player-matches. That is implausible. A mixed Poisson model allows each player-match to have its own latent intensity. Some player-matches are low-rate events: centre-backs, defensive midfielders, late substitutes and players in weak attacking teams. Some are high-rate events: elite centre-forwards, penalty-takers, dominant teams at home, mismatched fixtures and unusual match states. If those latent intensities are gamma-distributed, the marginal goal-haul distribution is negative binomial.

The negative binomial reproduces the observed upper tail. A model of double hat-tricks must simultaneously account for the many single goals, the thousands of braces (two-goal hauls), the 363 hat-tricks, the 37 four-goal games and the five five-goal games. The zero-truncated negative binomial does this with two parameters. The model also clarifies the difference between "not yet observed" and "surprising". The fitted distribution expects 0.83 six-or-more hauls across Premier League history. A zero count is therefore not anomalous. But the same model gives a non-trivial future hazard: around 2.4% per 380-game season.

## Limitations
The analysis has several limitations.

First, the model is stationary. It assumes that the historical Premier League haul distribution is informative about future seasons. Scoring environments change. Substitution rules, added time, tactical approaches, squad depth, financial inequality and the presence of exceptional forwards can all affect the tail.

Second, the model ignores covariates. A six-goal haul is unlikely to occur in a typical player-match. It is more likely in a specific context: a dominant team, a weak opponent, an early goal, possibly a red card and possibly penalties. A covariate model could estimate such contextual effects directly.

Third, the model treats scoring player-matches as exchangeable. In reality, they are clustered by player, team, season and fixture. A hierarchical model with player and team random effects would be a natural extension.

Fourth, the inference about six-goal hauls is extrapolative. The model is fitted to data up to five goals and then used to infer the unobserved six-or-more tail. The extrapolation is modest, because six is only one goal beyond the observed record of five, but it is still an extrapolation.

Finally, the data depend on credited goals. Historical revisions by dubious goals panels or differences between scorer databases can alter individual haul counts, especially around own goals and deflections. This is unlikely to change the broad fitted distribution, but it matters for exact reproducibility.

# Conclusion
Individual English Premier League association football scoring hauls are well described by a zero-truncated negative binomial distribution. The model arises naturally from a mixed Poisson view of football scoring, in which each player-match has its own latent scoring intensity. This is a more plausible mechanism than a homogeneous Poisson process and gives the fat upper tail needed to account for four- and five-goal hauls.

The fitted distribution implies that the Premier League should have expected approximately 0.83 six-or-more-goal hauls since 1992. The probability of observing none is therefore about 44%. The absence of a double hat-trick is, therefore, not surprising. However, the first double hat-trick is also not a remote fantasy. Under the fitted model, it is approximately a once-every-42-seasons event, with a roughly 51\% chance of occurring at least once over the next 30 seasons.

The Premier League's first double hat-trick would be historic. It would not be inexplicable.

## Acknowledgements
Goal statistics derived from data provided in the [https://github.com/schochastics/football-data](https://github.com/schochastics/football-data) repository by David Schoch, used under the Open Data Commons Attribution License (ODC-By) v1.0.
