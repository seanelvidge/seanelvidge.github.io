---
layout: post
title: Does a 4–0 Win Tell Us More Than a 1–0 Win?
date: 2026-10-24 09:20:00 +0100
description: How winning margins improve my football ratings, with ten seasons of validation and a closer look at uncertainty in predicted league tables.
tags: football mathematics
related_posts: true
thumbnail: assets/img/football-margin-season-validation.png
image_alt: Bar chart showing that using winning margins reduces prediction error in each season from 2016/17 to 2025/26.
last_modified_at: 2026-10-24
---

A 1–0 win and a 4–0 win both earn three points. For a model trying to estimate how strong a team is, though, the score might tell us something extra.

In [my original article on football rankings]({% post_url 2025-12-15-Football_team_rankings %}), I described a model that tracks each team's hidden strength, along with uncertainty about that strength. The ratings respond to how surprising a result was. An unexpected win moves a team more than a routine one, and a team we know little about can move more quickly than an established side.

That article explains the main framework. This is an update to what the model learns after the final whistle: it now uses **the margin of victory**, as well as who won.

My suspicion was that this might make very little difference. Football gives us deflections, red cards, missed penalties and the occasional afternoon when every shot goes in. A bigger score does not necessarily mean a much better team.

But we have a long [database of English league results]({% post_url 2024-12-28-All_England_football_league_results %}), so this is something we can test.

## Does it actually help?

The comparison uses **20,096 matches across the top four divisions**, covering 2016/17 to 2025/26. For every match, each model makes its prediction using only information available before that match. It then sees the result, updates the ratings, and moves on.

The margin model's settings were chosen using earlier seasons, 2000/01 to 2015/16. Both models are scored on exactly the same later matches.

| Measure     | Using results alone | Using results and winning margins |
| ----------- | ------------------: | --------------------------------: |
| Log loss    |            1.035789 |                      **1.033491** |
| Brier score |            0.207478 |                      **0.206965** |

Lower is better for both. Log loss particularly penalises confident predictions that turn out to be wrong. The Brier score measures how far the predicted probabilities were from the outcome that happened; here it is averaged over the three possible outcomes.

The improvement is small: about **0.22% in log loss** and **0.25% in Brier score**. Those are reductions in prediction error, not percentage-point increases in the number of winners correctly picked. Football remains very capable of ruining a good forecast.

So I was right to suspect that margin of victory is not particular impactful in our predictions. However the improvement is consistent, it is present in all ten evaluation seasons:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/football-margin-season-validation.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Positive reductions in log loss in all ten seasons from 2016/17 to 2025/26, ranging from about 0.0005 to 0.0046. The overall reduction is 0.0023." caption="Each bar compares the same matches with and without winning-margin information. Taller bars mean a larger improvement. The dashed line is the overall average, weighted by the number of matches." %}
    </div>
</div>

The statistical checks also support an improvement across the period as a whole; the details are below. The results are encouraging evidence, with the usual need to keep checking what happens next.

## A big win needs some context

Suppose a strong favourite wins 4–0 at home. That might be a good performance, but a comfortable win was already plausible. An underdog winning by the same score is much more surprising.

This update to the ranking model accounts for that distinction. It asks how large a winning margin was expected **given the teams' strengths and which team won**. The score can then add evidence beyond the win itself.

This also allows something that initially sounds odd: a strong favourite can win narrowly and have its rating fall. The team won, but the overall performance supplied less evidence of its strength than the model expected. Conversely, a team can lose narrowly and come out looking a little better.

There is a deliberate limit here. The model uses goal difference, so 1–0 and 2–1 supply the same information. Likewise, 0–0 and 2–2 are treated alike. Modelling attacking and defensive strength separately would (and may well) be a future extension; it is not what this update does.

## What about the final league table?

There is a related change to the [league table predictor]({{ '/tableProbs' | relative_url }}). Early in the season, its forecasts were too confident about the range of possible final points totals.

The tool still holds team strengths fixed within a simulated season. But it now allows for uncertainty about what those fixed strengths are: for each simulated season it draws one strength for each team, uses it for all that team's remaining matches, then draws again for the next simulated season.

If we have underestimated a team, that can affect thirty remaining matches together. With only three matches left, there is much less time for the same uncertainty to change the table. This gives the early-season forecast a wider, more realistic spread without needing to 'invent' a sequence of future changes in form.

In historical checks, an 80% range for a team's final points total contained the actual total only **59.75%** of the time at the start of the season. With the updated ratings and shared strength uncertainty, that becomes **81.08%**. The chart below separates the contribution of the new ratings from the contribution of carrying their uncertainty into the simulations:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="lazy" path="assets/img/football-league-uncertainty-validation.png" class="img-fluid rounded z-depth-1" zoomable=true alt="At the start of the season, actual coverage of 80 percent final-points intervals rises from 59.75 percent with results-only fixed estimates, to 63.42 percent with margin-based fixed estimates, to 81.08 percent when rating uncertainty is sampled." caption="An 80% forecast interval should contain the eventual points total about 80% of the time. Sampling one uncertain strength per team brings coverage much closer to that target, especially when most of the season remains." %}
    </div>
</div>

Across all the tested stages of the season, the combined changes improve the final-position probability score by about **5%**. That is a separate result from the much smaller improvement in individual match predictions. The [league-position article]({% post_url 2025-12-22-League_table_prediction_probabilities %}) explains the simulation and its assumptions in more detail.

## Part II — If You Dare Read On: The Mathematics

## 1. Keep the result model, add a conditional margin

The Davidson outcome model from the [original article]({% post_url 2025-12-15-Football_team_rankings %}) remains:

$$
\Delta=\beta(s_H-s_A)+h,
$$

$$
(p_H,p_D,p_A)=\frac{(e^\Delta,\kappa,e^{-\Delta})}{e^\Delta+\kappa+e^{-\Delta}},
$$

with $$\beta=0.9$$. Strengths are forecast to the match date using the same calendar-time evolution as before.

For a decisive result, let $$z=1$$ for a home win and $$z=-1$$ for an away win. Define the _excess winning margin_

$$
k=|g_H-g_A|-1.
$$

A one-goal win has $$k=0$$; a four-goal win has $$k=3$$. Conditional on the winner, model this with a geometric distribution:

$$
P(k\mid z,\Delta)=\frac{\lambda^k}{(1+\lambda)^{k+1}},
$$

with $$k=0,1,\ldots$$ and

$$
\lambda=\exp(\alpha+c z\Delta).
$$

Its mean is $$\lambda$$ and variance is $$\lambda(1+\lambda)$$, allowing occasional large margins. The selected slope is $$c=0.75$$, while $$\alpha$$ is learned separately for each division tier.

The joint likelihood is

$$
P(z,k\mid\Delta)=P(z\mid\Delta)P(k\mid z,\Delta).
$$

Conditioning on the winner matters: the extra term describes how large the win was, so the win itself is not counted twice. Summing over all possible margins recovers the original Davidson result probabilities. A draw has no additional margin term.

The current score is used only after the pre-match prediction has been recorded. Its information changes later predictions.

## 2. Updating the strengths

Write

$$
\begin{aligned}
m&=p_H-p_A,\\
V_z&=p_H+p_A-m^2,\\
t&=\frac{\lambda}{1+\lambda}.
\end{aligned}
$$

For a decisive result, the score and observed information in $$\Delta$$ are

$$
g_\Delta=z-m+c z\{k-(k+1)t\},
$$

$$
J_\Delta=V_z+c^2(k+1)t(1-t).
$$

Here, "score" means the derivative of the log likelihood, rather than the numbers on the scoreboard. The first term in each expression comes from the result; the second comes from the margin. For a draw, use $$z=0$$ and omit the margin terms.

With the prior marginal variances $$v_H,v_A$$, define

$$
\begin{aligned}
g&=\beta g_\Delta,\\
J&=\beta^2J_\Delta,\\
D&=1+(v_H+v_A)J.
\end{aligned}
$$

The update is then

$$
\begin{aligned}
s_H^+&=s_H+\frac{v_Hg}{D},\\
s_A^+&=s_A-\frac{v_Ag}{D},
\end{aligned}
$$

$$
\begin{aligned}
v_H^+&=v_H-\frac{v_H^2J}{D},\\
v_A^+&=v_A-\frac{v_A^2J}{D}.
\end{aligned}
$$

This is one Gaussian update using the joint likelihood's derivatives. For draws it reduces to the results-only categorical update. As before, the filter retains marginal variances and discards the covariance induced between the two teams, so it remains an approximation.

After each complete date, the tier's home advantage, log draw weight and margin intercept are updated using their likelihood scores, with learning rate 0.001. The margin intercept starts at $$\log 0.8$$. Every match on a given date uses the shared parameters available before that date's results, preventing the ordering of same-day matches from changing their forecasts.

## 3. How convincing is the improvement?

The development comparison tested conditional geometric and Poisson excess-margin distributions, five margin slopes, and four process variances. Results-only controls were allowed the same process-variance choices. The winning margin model selected the existing weekly process variance of 0.0017, so the gain is not simply the result of making it more responsive than the comparator.

For log loss, the mean difference between the margin model and the results-only model is **−0.002298**. Resampling whole seasons gives a 95% interval of **[−0.003089, −0.001565]**. For the Brier score, the difference is **−0.000513**, with interval **[−0.000700, −0.000346]**. Both favour the margin model throughout their intervals.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="lazy" path="assets/img/football-margin-confidence-intervals.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Relative reductions in log loss and Brier score are about 0.22 and 0.25 percent, with both 95 percent intervals wholly above zero." caption="The same score differences expressed as percentages of the results-only baseline. Whiskers are 95% intervals from resampling whole seasons; zero would mean no improvement." %}
    </div>
</div>

A two-sided paired sign-flip test at season level gives **p = 0.001953** for both measures. Using seasons as blocks preserves dependence between matches within a season, rather than pretending that every match is an independent experiment. There are only ten evaluation seasons, though, and adjacent seasons need not be completely independent either.

The mean improvement is present in all four tiers, but the evidence is weaker when each tier is tested separately. In particular, the Premier League's log-loss sign-flip test does not reach the 5% threshold. The strong pooled result should not be read as proof of significance in every division.

## 4. Carrying uncertainty into a season

For simulation $$b$$, draw

$$
S_i^{(b)}\sim\mathcal{N}(\widehat s_i,v_i)
$$

once for each team, using its rating forecast at the simulation cutoff. Use that same $$S_i^{(b)}$$ in every remaining fixture involving the team. Each fixture is drawn once, and its result awards points to both opponents.

For a final points total $$T$$, the relevant identity is

$$
\begin{aligned}
\operatorname{Var}(T)&=\mathbb{E}[\operatorname{Var}(T\mid S)]\\
&\quad+\operatorname{Var}(\mathbb{E}[T\mid S]).
\end{aligned}
$$

Fixing strength at its estimated mean misses the variation in expected points across plausible strengths. With many remaining games, that shared effect can be substantial. Independently redrawing strength for each match would average much of it away.

The league comparison uses 152 historical forecast cutoffs and 20,000 simulations per cutoff, excluding the incomplete 2019/20 League One and League Two seasons. The rank probability score compares the cumulative probabilities of finishing at or above each position with what actually happened, averaging the squared differences across the possible cutoffs. Lower is better. Sampling rating uncertainty improves this score even when comparing against the same margin-based ratings held at fixed estimates: the difference is **−0.002265**, with 95% interval **[−0.002873, −0.001653]**.

I also tested extra uncertainty about average future form. Its development-selected setting made the points distributions too wide in the later evaluation seasons, without improving the position score over sampling the existing rating uncertainty. That extension is disabled. The decision to keep the simpler version uses this retrospective comparison; a future evaluation will provide a cleaner check of the final choice.

Calibration is still imperfect. At the start of a season, the nominal 95% points interval covers 92.89% of observed totals. The simulator also uses random tie-breaks on points and cannot anticipate future deductions or changes to squads. Allowing for uncertainty makes the forecast more useful, without making it certain.

The complete rating history has been replayed with the margin update. You can explore it through the [rankings history]({{ '/teamRankings' | relative_url }}), [match probability calculator]({{ '/matchProbs' | relative_url }}) and [predicted league tables]({{ '/tableProbs' | relative_url }}).
