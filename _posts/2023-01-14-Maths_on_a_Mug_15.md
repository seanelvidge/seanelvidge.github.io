---
layout: post
title: Maths on a Mug 15
date: 2023-01-14 12:00:00
tags: mathematics MathsOnAMug
related_posts: true
thumbnail: assets/img/mathsonamug/mathsonamug_15.jpeg
---

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <figure>
            {% include figure.liquid loading="eager" path="assets/img/mathsonamug/mathsonamug_15.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
        </figure>
    </div>
</div>

This is a "simple" [#MathsOnAMug](https://seanelvidge.github.io/blog/tag/mathsonamug/){:target="\_blank"}. Simple, but very important. This is [Bayes’ theorem](https://en.wikipedia.org/wiki/Bayes%27_theorem){:target="\_blank"}:

$$
P(A|B)=P(B|A)P(A)P(B).
$$

This relates the probability of observing $$A$$ given that $$B$$ is true where $$A$$ and $$B$$ are events, we also require that the probability of $$B$$ does not equal 0 (i.e. $$P(B)\neq 0$$). It allows us to find the probability of a cause, given an effect.

Bayes’ can lead to some surprising, count-intuitive, results. [Dr. House](https://en.wikipedia.org/wiki/Gregory_House){:target="\_blank"} never thinks his patients have Lupus. [Lupus](https://en.wikipedia.org/wiki/Systemic_lupus_erythematosus){:target="\_blank"} is a condition where antibodies that are supposed to attack foreign cells to prevent infections instead attack plasma proteins which can lead to blood clots. It is believed that 2% of the population have lupus. Suppose that a test is 98% accurate if a person has the disease and 74% accurate if they do not. Given the 98% accuracy of the test, should House really assume his patient with a positive result doesn’t have Lupus?

We can check the probability using Bayes’ theorem. Let L represent Lupus, T the test and 1 and 0 positive/negative respectively (I’ll leave as an exercise to the reader to calculate the individual probabilities):

$$
\begin{eqnarray*}
P(L=1|T=1) &=& \frac{P(T=1|L=1)P(L=1)}{P(T=1)},\\
&=& \frac{(0.98)(0.02)}{0.0196 + 0.2548},\\
&=& \frac{0.0196}{0.2744},\\
&=& 0.0715
\end{eqnarray*}
$$

So House’s insight is sensible, even given a positive result there is only a 7.14% chance of the person actually having Lupus!

How we interpret Bayes’ theorem depends on how we interpret probability, a [Bayesian](https://en.wikipedia.org/wiki/Bayesian_probability){:target="\_blank"} or [Frequentist](https://en.wikipedia.org/wiki/Frequentist_probability){:target="\_blank"} interpretation. This is a long running fight in mathematics, and it is worth reading about it to see where you come down on the argument. I’ll leave you with a quote from Savage ([1954](http://www.isbnsearch.org/isbn/0486623491){:target="\_blank"}).

> It is unanimously agreed that statistics depends somehow on probability. But, as to what probability is and how it is connected with statistics, there has seldom been such complete disagreement and breakdown of communication since the Tower of Babel.

<hr>

<div style="display: flex; justify-content: space-between; align-items: center;">
    <a href="https://seanelvidge.github.io/articles/2021/Maths_on_a_Mug_14/" style="text-decoration: none;">Previous Maths on a Mug</a>
    Next Maths on a Mug
</div>
