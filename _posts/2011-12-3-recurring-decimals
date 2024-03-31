---
layout: post
title: Recurring Decimals - Something on the Repetend
date: 2010-08-26 18:47:00-0400
description: How to calculate the size of the repetend for recurring decimals
tags: mathematics
related_posts: true
---

Here is an interesting fact I "discovered" today (I know many have before, but it was a personal discovery) a nice little fact about recurring decimals.

By a recurring decimal I mean a decimal which eventually becomes periodic, i.e. $$0.333\cdots$$. However from here on I will use the overbar notation, so the repetend (the bit which is repeated) is overlined giving us: 

$$
0.333\cdots = 0.\overline{3}.
$$

Now any fraction (in its lowest terms) which has a prime denominator (which isn't 2 or 5) will result in a recurring decimal, i.e. $$\frac{2}{13}=0.\overline{153846}$$, and it is these fractions (with prime denominator) that I am going to start with.

The interesting thing is, it is very easy to work out how many digits long the repetend is for such fractions (we'll briefly talk about other fractions in just two ticks). The number of digits for the fraction $$\frac{n}{p}$$ (where $$n$$ and $$p$$ are coprime as to meet the condition that the fraction is in its lowest form) is always less than or equal to $$p-1$$. For example, $$\frac{1}{7} = 0.\overline{142857}$$ and sure enough that repetend has $$7-1=6$$ digits and $$\frac{2}{11}=0.\overline{18}$$ and that repetend has $$2\le 10=11-1$$ digits.

A striking further observation (we'll talk about how you prove these shortly) tells us that the number of digits in the repetend is a factor of $$p-1$$. So in our example of $$\frac{2}{11}$$ we got a length of 2, which is a factor of $$11-1=10$$.

In fact we can make this a bit more firm, rather than saying it is some number less than $$p-1$$. The number of digits is equal to the order of $$10\mbox{ modulo } p$$. Order in this context refers to the smallest such integer $$m$$ such that $$10^m \equiv 1\mbox{ modulo } p$$. Again, take our examples. For $$\frac{1}{7}$$ we have that $$10^6 \equiv 1 \mbox{ mod } 7$$ and thus the number of digits in the repetend is 6. Whereas for $$\frac{2}{11}$$, we get that $$10^2 \equiv 1 \mbox{ mod } 11$$ and so the number of digits in that repetend must be 2, which it is.

The proof is fairly simple, have a go yourself. The hint (if you need it) is to use Fermat's Little Theorem, i.e. $$10^{p-1}\equiv 1\mbox{ mod } p$$.

In passing, I'll also mention that if you have a fraction of them form $$\frac{1}{k}$$, where $$k$$ is any integer (not necessarily prime as in the case above) then the number of digits in the repetend (if there are any!) is less than or equal to $$k-1$$. So a fairly similar result holds, but note, this is only works when the numerator is 1.
