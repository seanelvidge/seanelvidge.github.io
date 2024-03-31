---
layout: post
title: Hilbert's Hotel
date: 2010-08-24 18:47:00-0400
description: Use Hilbert's hotel to rethink about infinity
tags: mathematics
categories: mathematics
related_posts: true
---

[David Hilbert](https://en.wikipedia.org/wiki/David_Hilbert) was a greatly influential mathematician born in 1862. He worked in a variety of areas including infinite sets and it is in this area that he presented his 'Hotel', or his 'paradox of the Grand Hotel'. Which helps the reader consider the infinite., so lets give it a go:

Consider a hotel with a _countably infinite_ number of rooms. Countably infinite is a set which has the same number of elements (cardinality) of the set of natural numbers (the counting numbers: 0, 1, 2, 3, ..., there is no fixed decision on whether 0 is a natural number or not, it isn't important here but I thought I would mention it). Now consider that all of the rooms in the hotel are currently occupied, you may think that the manager should put up a 'No Vacancy' sign, but perhaps not...

Suppose that a guest turns up looking for a room. What should the manager say? Well that is easy, he gets every guest already in the hotel to move up one room. So the person in room 1 should move to room 2, the person in room 2 moves to room 3 etc. etc. We know this can continue since there is an infinite number of rooms in the hotel. So then we get that room 1 is empty, and we can put the guest in that room. This same method will work for any finite number of guests that show up at the hotel!

Now how about if countably infinite number of people turn up asking for a room in the hotel. Can we fit infinitely more people into the hotel? Once again the manager has no problems, he asks the guests to move rooms. He asks the person in room 1 to move to room 2, the person in room 2 to room 4, the person in room 3 to room 6 and in general the person in room $$n$$ to $$2n$$. Again we can do this because there is an infinite number of rooms in the hotel! Now $$2n$$ is always even, so all the odd numbered rooms are free, and the number of odd numbers is the same as the number of natural numbers, so there are countably infinite spaces. The fact that the odd numbers and natural numbers have the same cardinality itself is counter-intuitive, but hopefully I can convince you that it is true very quickly:

$$
\begin{eqnarray*}
1 &\longrightarrow & 1 \\
3 &\longrightarrow & 2 \\
5 &\longrightarrow & 3 \\
7 &\longrightarrow & 4 \\
9 &\longrightarrow & 5 \\
11 &\longrightarrow & 6 \\
\vdots &\longrightarrow & \vdots
\end{eqnarray*}
$$

So there is a clear mapping between the natural numbers and the odd numbers. Hence the infinite number of guests can fit in the hotel.

The final case to consider, what if a countably infinite number of coaches turn up, each with a countably infinite number of passengers. Is there room for all of them in the hotel? You've guessed it, there is! As long as the seats on the coaches are numbered (we can avoid this condition if we can use the beast which is the '[Axiom of Choice](https://en.wikipedia.org/wiki/Axiom_of_choice)') we can find everyone a room. First we want to empty all of the odd rooms again, we do this the same as above, move everyone in room $$n$$ to room $$2n$$. Now take the 1st coach, say the seats are numbered $$1, 2, 3, \ldots$$ then we can place the person in coach 1, seat 1 in room $$3^1$$, seat 2 in room $$3^2$$, seat 3 in room $$3^3$$ etc. etc. Now for coach 2, again with seats numbered $$1, 2, 3, \ldots$$ we place the person in seat 1 in room $$5^1$$, seat 2 to room $$5^2$$ etc. etc. So in general for coach $$i$$ and the person in seat $$n$$ we can place them in room $$p^n$$ where $$p$$ is $$i+1$$th prime number, and there we have it! We have taken our hotel, with a countably infinite number of rooms, each of which is occupied, and managed to find space for an infinite number of coaches, each with an infinite number of passengers.

This is a great concept to test your understanding of infinity. The reason that this all works is because in a hotel with infinitely many rooms the statements 'every room is occupied' and 'no more guests can stay in the hotel' are not the same.
