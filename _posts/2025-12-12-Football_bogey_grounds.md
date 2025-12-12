---
layout: post
title: Football Bogey Grounds and How Statistics Can Prove Them
date: 2025-12-12 19:04:00
description: Can a football club actually have a statistically verifiable football bogey ground or is it just bad luck?
tags: football mathematics
related_posts: true
thumbnail: assets/img/bogey_team.png
---

Football supporters are never short of folklore. Some of it heroic, some of it tragic, and some of it mathematically suspicious. Among the more enduring tales is the _bogey ground_: that one venue where your club never quite manages to win, no matter how many times the fixture computer sends you there with fresh optimism, a new manager and a good run of form.

But one question always pops up in the back of my mind when I hear this: When is a bogey ground actually a bogey ground, and when is it just a trick of small numbers?

Most fans instinctively understand the point. Losing your only ever visit to Carlisle does not make Brunton Park a cursed ground. A couple of failed trips to Luton are not evidence of eldritch forces at work. Yet, scattered across the long history of English league football, a few pairs of teams have met often enough, and still produced zero away wins, that bogey grounds become statistically real.

In the Premier League an example of this is Fulham, and their trips to Arsenal.

Fulham have played 32 league matches away at Arsenal. They have never won.

Not once. Not in 1914 (lost 2-0). Not in 1964 (2-2). Not in 2014 (lost 2-0).

Zero wins from thirty-two attempts. Seven draws. Twenty-five defeats.

Even more striking, this isn't just a bad example, this is, among every club in the entire Football League dataset, over 135 years of football, no team has a larger, more emphatic, more mathematically convincing record of away futility than Fulham at Arsenal.

So let’s take a look, not just at the record itself, but at how we can quantify bogeyness in a way that recognises your intuition ("two games aren’t enough!") but takes advantage of the huge dataset football provides.

## Why "never won" isn’t enough (the curse of small $$n$$)

Imagine you flip a coin twice and get two tails. Does that mean the coin is biased?

Of course not. You need _more_ flips before you start thinking that someone is up.

The same goes for football. A team losing its only away visit to Manchester City tells you nothing. Losing twice? Still nothing except a faint sense of déjà vu. Losing five times? Now you're paying attention. Losing ten times? Stop buying tickets to the away game.

So what we need is a way of answering this question:

Given a team has played $$n$$ away matches at a ground and won none, what is a reasonable upper limit on how good their _true_ chance of winning there might be?

Fortunately statistics, as it always does, gives us a handy tool for working this out, the [Wilson confidence interval.](https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval)

## A (gentle) introduction to the Wilson interval

Don’t panic; no equations are necessary. Just an idea. A Wilson interval takes two bits of information:

- the number of games played ($$n$$), and
- the number of games won (0, in our bogey-ground case)

and asks:

"If their true underlying chance of winning were $$p$$, how big could $$p$$ realistically be before the observed data (zero wins) would start to look implausible?"

For small $$n$$ (not many games played) the answer is: "$$p$$ could still be quite large."

For large $$n$$ (a large number of games played) the answer is: "$$p$$ must be quite small."

This lines up with our intuition.

A team with 0 wins from 2 tries? Their true win rate might easily be 30%, 40%, even 50%.

A team with 0 wins from 32 tries? Now the interval collapses. It tells you the true away win probability is almost certainly very small, low enough that even by bad luck alone, you'd be surprised _not_ to have picked up a single win after that many attempts.

The Wilson interval is good for this particular problem (compared to other approaches like the Wald Interval) because it behaves properly at the boundaries (like at 0% or 100%), where ordinary methods can breakdown. Football fans should love it because it gives scientific legitimacy to something they've always known: **some bogey grounds are imaginary, but a few are real**.

## The most convincing bogey of them all: Fulham at Arsenal

So, what does Wilson say about Fulham’s 0 wins from 32 away league games at Arsenal?

It says this:

> In each of Fulham's away matches against Arsenal their probability of winning must have been (at the very most) 10% for 0 wins out of 32 to not be statistically suspicious.

Mathematically this comes from plugging $$n$$ (number of games) and $$z$$ (which is equal to 1.96 for 95% 'confidence') into the equation for calculating the upper bound of the Wilson interval:

$$
\mbox{Wilson Upper Bound} = \frac{z^2}{n+z^2} = \frac{1.96^2}{32+1.96^2} = 0.107 = 10.7\%
$$

So the only way we could avoid saying Arsenal is Fulham's away team nemesis is if we believe Fulham, across the whole history of the fixture (starting in 1913; [see my head-to-head tool here](https://seanelvidge.com/h2h?team1=Arsenal&team2=Fulham)), have not had better than a 10% chance of winning those games. Whilst we can't be (mathematically) certain that it is true, it is incredibly unlikely. Typical away win rates in the top division over history are roughly 25-30% range. Even clear cut underdogs often have pre-match win probabilities around 15-20%.

So, therefore, I think it is safe to say to conclude:

> Fulham away at Arsenal is not just a bogey ground, it is the bogey ground.

The Premier League’s most mathematically defensible curse.

## Other bogey teams

Fulham–Arsenal is the only pair in the entire database whose Wilson upper bound hovers at just above the 10% threshold. But several others get close, here are the best (or worst) of the rest:

<table style="border-collapse: collapse; width: 75%;">
  <thead>
    <tr>
      <th style="border: 1px solid black; padding: 8px;">Away Team</th>
      <th style="border: 1px solid black; padding: 8px;">Home Team</th>
      <th style="border: 1px solid black; padding: 8px;">Played</th>
      <th style="border: 1px solid black; padding: 8px;">Record</th>
      <th style="border: 1px solid black; padding: 8px;">Wilson Upper</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Fulham</td>
      <td style="border: 1px solid black; padding: 8px;">Arsenal</td>
      <td style="border: 1px solid black; padding: 8px;">32</td>
      <td style="border: 1px solid black; padding: 8px;">0W–7D–25L</td>
      <td style="border: 1px solid black; padding: 8px;">10.7%</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Grimsby Town</td>
      <td style="border: 1px solid black; padding: 8px;">Blackburn Rovers</td>
      <td style="border: 1px solid black; padding: 8px;">28</td>
      <td style="border: 1px solid black; padding: 8px;">0W–9D–19L</td>
      <td style="border: 1px solid black; padding: 8px;">12.1%</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Mansfield Town</td>
      <td style="border: 1px solid black; padding: 8px;">Reading</td>
      <td style="border: 1px solid black; padding: 8px;">26</td>
      <td style="border: 1px solid black; padding: 8px;">0W–5D–21L</td>
      <td style="border: 1px solid black; padding: 8px;">12.9%</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Tranmere Rovers</td>
      <td style="border: 1px solid black; padding: 8px;">Barnsley</td>
      <td style="border: 1px solid black; padding: 8px;">26</td>
      <td style="border: 1px solid black; padding: 8px;">0W–11D–15L</td>
      <td style="border: 1px solid black; padding: 8px;">12.9%</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Oldham Athletic</td>
      <td style="border: 1px solid black; padding: 8px;">Charlton Athletic</td>
      <td style="border: 1px solid black; padding: 8px;">25</td>
      <td style="border: 1px solid black; padding: 8px;">0W–11D–14L</td>
      <td style="border: 1px solid black; padding: 8px;">13.3%</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Newport County</td>
      <td style="border: 1px solid black; padding: 8px;">Luton Town</td>
      <td style="border: 1px solid black; padding: 8px;">24</td>
      <td style="border: 1px solid black; padding: 8px;">0W–7D–17L</td>
      <td style="border: 1px solid black; padding: 8px;">13.8%</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">Coventry City</td>
      <td style="border: 1px solid black; padding: 8px;">Preston North End</td>
      <td style="border: 1px solid black; padding: 8px;">24</td>
      <td style="border: 1px solid black; padding: 8px;">0W–9D–15L</td>
      <td style="border: 1px solid black; padding: 8px;">13.8%</td>
    </tr>
  </tbody>
</table>


These are not small samples. These are not casual coincidences. When you are approaching 20 or 30 visits with no victory, it is time to stop thinking you are unlucky and start accepting you have a bogey ground.
