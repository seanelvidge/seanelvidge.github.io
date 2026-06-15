---
layout: post
title: Who wins in a 48 team World Cup - Panini
date: 2026-06-11 19:30:00
description: Who is the biggest winner of the new, larger, 48 team World Cup? Panini, with the increase in the numbers of stickers to complete their album.
tags: football mathematics
related_posts: true
thumbnail: assets/img/panini_sticker_book.jpeg
---

Since 1970 in Mexico [Panini](https://paninistore.com/) have published the official World Cup sticker book. It has become synonymous with the tournament, with a huge following and has become a multi-billion dollar business. It is estimated that for this World Cup between 500 and 800 million sticker packs will be sold [[1]](https://www.marca.com/en/world-cup/2026/06/05/world-cup-stickers-1-4-billion-euro-business-with-an-underlying-controversy.html).

So what does it take to complete the sticker book? And how has this changed from the last 32-team World Cup (Qatar 2022) to this, the first 48-team World Cup? Well, the 50% increase in teams, "only" leads to a 10% increase in required stickers (but a 42% increase in costs...).

For this analysis we assume that stickers are randomly distributed in packs and are each equally likely (which has been claimed to be the case by the Panini CEO, however [research has shown](https://academic.oup.com/jrssig/article/18/3/5/7038156?searchresult=1&login=false) that 'shiny' stickers are systematically rarer than others by about 2x).

To see where these numbers come from, let $$N$$ by the total number of stickers in the album and $$k$$ be the number of stickers in one pack. So each pack contains $$k$$ **distinct** stickers which are sampled uniformly at random from the $$N$$ possible stickers. So each pack is equally likely to be any one of

$$
{N\choose k}
$$

which means "$$N$$ choose $$k$$" and, simply, is used to represent the number of ways to choose $$k$$ items from a set of $$N$$ items where order does not matter. You can calculate its numerical value using:

$$
{N\choose k} = \frac{N!}{(N-k)!k!}
$$

where "!" means [factorial](https://en.wikipedia.org/wiki/Factorial).

So the number we are trying to find is:

$$
E_m = \text{ expected number of additional packs needed when you already have } m \text{ distinct stickers}
$$

and in our specific case the goal is to compute $$E_0$$ because we start with zero (0) stickers. The boundary condition is $$E_N = 0$$ because once you already have all $$N$$ stickers, you need to more packs. Now suppose you currently have $$m$$ distinct stickers, then

$$
N-m
$$

stickers are still missing. In the next pack of $$k$$ stickers, suppose exactly $$r$$ of them are new stickers. To get exactly $$r$$ new stickers:

- choose $$r$$ stickers from the $$N-m$$ missing stickers,
- choose the remaining $$k-r$$ stickers from the $$m$$ stickers you already have.

So the number of packs that contain exactly $$r$$ new stickers is:

$$
{{N-m}\choose r}{m\choose {k-r}}.
$$

Since all possible packs are equally likely, the probability of getting exactly $$r$$ new stickers is:

$$
p_{m,r} = \frac{{{N-m}\choose r}{m\choose {k-r}}}{{N\choose k}},
$$

where invalid binomial terms are treated as zero. Then, the possible values of $$r$$ are:

$$
\max(0,k-m) \le r \le \min(k,N-m)
$$

because you cannot get more new stickers than are missing, and you cannot get more than $$k$$ new stickers from one pack. So now we need fewer stickers to complete our collection, specifically we move from 'state' $$m$$ to state $$m+r$$ with probability $$p_{m,r}$$. Therefore:

$$
E_m = 1 + \sum p_{m,r}E_{m+r},
$$

where the "1" represents the pack you just bought. However, one possible outcome is $$r=0$$, meaning the pack we bought contains no new stickers. In that case we remain at state $$m$$, so $$E_m$$ appears on both sides:

$$
E_m = 1 + p_{m,0}E_m+\sum_{r\ge 1}p_{m,r}E_{m+r},
$$

which we can rearrange to get:

$$
\begin{eqnarray*}
E_m - p_{m,0}E_m &=& 1+\sum_{r\ge 1}p_{m,r}E_{m+r},\\
E_m(1-p_{m,0}) &=& 1 + \sum_{r\ge 1}p_{m,r}E_{m+r},\\
E_m &=& \frac{1+\sum_{r\ge 1}p_{m,r}E_{m+r}}{1-p_{m,0}}.
\end{eqnarray*}
$$

This gives an exact recursive calculation. Since $$E_m$$ depends only on $$E_{m+1}, E_{m+2},\ldots,E_N$$ we compute backwards from:

$$
E_N=0
$$

down to

$$
E_0.
$$

In 2022 each Panini pack contained 5 stickers and the whole album required 670 stickers. So that gives $$N=670$$ and $$k=5$$, using the recurrence relation described above gives:

$$
E\approx 946.9837488
$$

so the expected number of packs required to complete the album is 947 packs.

In 2026, each pack contains 7 stickers and an album needs 980 stickers. So with $$N=980$$ and $$k=7$$, and using the defined relation the expected number of packs is:

$$
E_0 \approx 1042.36
$$

or about 1042 packs. The increase from 947 packs to 1042 packs is an increase of about 10% (10.031...% to be more precise).

A multi-pack of stickers at my local supermarket costs £7.50 for 6 packs. To get the expected number of 1042 packs requires 174 multi-packs at a cost of £1,305.

For comparison, in 2022, a 6 pack multi-pack (remembering each contained 5 stickers per pack), cost £4.99, so to get the expected number of 947 packs, 158 packs were needed, at a total cost of £788.42. Adjusting for inflation that comes to £918.89.

So whilst we only need 10% more stickers, we should expect to spend 42% more to complete the album.
