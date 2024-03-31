---
layout: post
title: God's Number is 20
date: 2011-02-15 19:25:00-0400
description: You never need more than 20 moves to solve a Rubik cube
tags: mathematics
related_posts: true
---

The Rubik Cube was invented by one Erno Rubik in 1974 and has gone one to be one of the most popular puzzles in the world, having sold over 350 million units worldwide, even though many people can not solve it! Although perhaps that isn't overly surprising given the vast number of possible positions that the cube can take, some 43,252,003,274,489,856,000 (that is approximately 43 quintillion) with only 1 correct solution, i.e. if you want to solve it, randomly turning the cube almost certainly won't get you there. To put that number in perspective, imagine 43 quintillion standard size (5.7cm) Rubik's cubes stacked on top of each other. This would cover a distance of about 260 light years, or the distance from Earth to our next nearest star (i.e. Proxima Centauri, not the Sun) and back 30 times!

But where does this number come from?

A standard 3x3x3 Rubik's cube has 8 corner pieces, 12 edge pieces and 6 centres. Since the centre pieces are fixed, there is nothing we can do to move them, so they do not enter our calculation to the number of possible positions. As there are 8 corner pieces we have $$8!$$ (that is 8 factorial or $$8!=8 \times 7 \times 6 \times 5 \times 4 \times 3 \times 2 \times 1=40320$$) ways of positioning them, and we are free to place the first 7 where ever we want, however once these 7 are positioned, the 8th is clearly forced to be in a particular place, so we have $$3^7$$ ($$3^7=2187$$) possibile positions for these $$8!$$ options. The 3 arises since each corner piece has 3 colours on it. So far we have counted

$$
8! \times 3^7 = 88179840.
$$

Now, for the 12 edges, you may imagine that we have $$12!$$ options, however we have to note that an odd permutation of corners results in an odd permutation of the edges, thus there are only $$\frac{12!}{2}$$ options. Then in the same ways as the corners we count how many possible positions we can have, this time each piece only has 2 colours on it, but in a similar way once we have chosen where the first 11 go, the 12th piece is fixed, thus giving $$2^{11}$$ options. So in total we have

$$
8! \times 3^7 \times \frac{12!}{2} \times 2^{11} = 43,252,003,274,489,856,000
$$

possible positions, which is what we wanted to show.

Possibly one of the reason for the Rubik's cube continued success is the fact that when you have solved it once, you want to mix it up and start again but this time do it quicker! This process just repeats and since 1981 there have been World Championships for 'speedsolving', plus a variety of other competitions. The current fastest recorded time of solving a Rubik's cube is 6.65 seconds, solved by Feliks Zemdegs, a truly unbelievable feat. (Update: as of July 2023 the record is 3.13 seconds, achieved by Max Park). But should we care about Rubik's cube? Are they just for fun? Well from a mathematical point of view, they are very interesting:

For starters, Rubik's cube are really very useful for examples and considering finite group theory, in fact the [Group Theory Wikipedia page](https://en.wikipedia.org/wiki/Group_theory) has a picture of a Rubik cube at the very start. [Tom Davis](http://geometer.org/) has written a very good document on Group Theory via Rubik's Cubes which if you are interested in such things I would recommend you [check it out](http://geometer.org/rubik/group.pdf). However the point of this blog post is actually to do with the question: 'what is the maximum number of moves it takes to solve a Rubik's cube'?

The real quest is to find an algorithm which will solve any Rubik cube in the minimum number of moves, this is called 'God's Algorithm'. The number of moves that this algorithm takes, in the worst case, is called 'God's Number'. The first work on this was done in 1980s and in 1981 Thistlethwaite proved that God's number must be greater than or equal to 18 and less than or equal to 52. Over time these bounds were tightened, and it was in 1995 that the lower bound was first proved to be 20, this was done by Michael Reid (he had previously shown that the upper bound is less than or equal to 29). In the late 2000s Tomas Rokicki did some great work on tightening the upper bounds, culminating in this paper showing the upper bound to be less than or equal to 22.

But, given the title of this blog, I hope you have worked out that the upper bound has since be refined to 20, that is both the lower bound and upper bound are 20, thus God's Number is 20! And who is to thank for this? Well it is thanks to Morley Davidson, John Dethridge, Herbert Kociemba and Tomas Rokicki, not to mention Google, who donated idle computer time. They completed the solution to the problem, by first writing a computer program that could solve the position of any Rubik's cube in about 20 seconds (not necessarily an optimal solution, but one that took less than 20 moves), and reduced the number of cases they actually needed to solve, via a variety of methods, including considering symmetry, this reduced the number of possible considerations to 55,882,296. To check this number of possibilities would have taken approximately 35 years with a high end computer, and this is where Google came in. The job was spread across a number of computers at Google which then completed the task in a few weeks. Proving that in fact every possible Rubik's cube position can be solved in 20 moves or less! So 'God's Number' is 20, quite a remarkable fact.
