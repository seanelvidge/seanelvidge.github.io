---
layout: post
title: The Crawshaw Method (for Quadratics)
date: 2012-05-01 20:49:00
description: How to solve quadratic equations using the Crawshaw method
tags: mathematics
related_posts: true
---

Something all High School students (and above) need to know is how to factorize quadratic equations. However I am amazed how few people know a decent (and easy) way of doing this! 

I'll keep this as simple as possible, and just show you how to use the method.

First we consider a simple case (and sadly this is where a lot of the problems arise from!), we want to factorize the quadratic equation,

$$
x^2+5x+6.
$$

Now, as far as I know, it is universally taught that to factorize this you have to "find" two numbers that times together to make $$+6$$ (the constant term) and add to make $$+5$$ (the linear term). This is pretty easy, we choose the numbers $$+2$$ and $$+3$$, and then we simply write down the answer,

$$
x^2+5x+6=(x+2)(x+3).
$$

Easy.

The problem is when you arrive at a question like,

$$
3x^2-7x-6.
$$

If we proceed in the same way as we were `taught' above we need to find two numbers which times together to make $$-6$$ and add to make $$-7$$. We then need to try and work out what on Earth to do with these numbers, the problem is, it is not in any way obvious and quite a lot of guess work, or at least trial and error, is required.  The answer we would be looking for was

$$
3x^2-7x-6=(3x+2)(x-3).
$$

I think what is clear is that we need a concise, dare I say easy, method to solve any quadratic equation.

Let me introduce the _Crawshaw method_.

We first will apply the method to the 'easy' quadratic formula (the method is identical for all quadratics), you only need to remember that $$x=1x$$, only we don't write the $$1$$. So the quadratic to solve is $$x^2+5x+6$$.

The first step of the method tells us that we need to find two numbers which add together to make $$+5$$ and times to make $$1\times 6=6$$, that is, the coefficient of the quadratic term ($$1$$) multiplied by the constant term ($$6$$). These numbers are $$2$$ and $$3$$.

The second step is to rewrite the linear term as a combination of the numbers we have just found. So for this question the linear term is $$+5x$$ the numbers we found were $$2$$ and $$3$$ so we will replace $$+5x$$ in the quadratic with $$+2x+3x$$. So our quadratic is now:

$$
x^2+2x+3x+6.
$$

Which is of course the exact same equation but now we can continue with the method.

We now draw an imaginary line down the middle of the equation:

$$
x^2+2x\quad/\quad+3x+6.
$$

Next we factorize the left hand side, getting:

$$
x(x+2)\quad/\quad+3x+6.
$$

We then need to factorize the right hand side, but making sure that the bracket terms are the same, i.e.

$$
x(x+2)\quad/\quad+3(x+2).
$$

Then finally we get our two brackets (for the factorized answer) as the one bracket we already have, and the two terms that are on the outside of the brackets (i.e. in this case $$x$$ and $$+3$$). Thus our answer becomes

$$
(x+2)(x+3).
$$

This method does seem more difficult for this 'easy' equation (i.e. one where the coefficient of the quadratic term is $$1$$) but the beauty of the Crawshaw method is that it works exactly the same for all quadratic equations.

Now let us consider the second equation, that is $$3x^2-7x-6$$. We approach it in exactly the same way.

First find two numbers which times together to make $$3\times -6 = -18$$ (that is the coefficient of the quadratic term multiplied by the constant term) and add together to make $$-7$$. Such numbers are $$-9$$ and $$+2$$. So we now rewrite the linear term with these numbers (i.e. replacing $$-7x=-9x+2x$$) so we get:

$$
3x^2-9x+2x-6.
$$

Now we draw an imaginary line down the middle and factorize both sides of the equation:

$$
\begin{eqnarray*}
3x^2-9x &\quad& /\quad 2x-6,
3x(x-3) &\quad/& \quad +2(x-3).
\end{eqnarray*}
$$

So we then have our factorized solution,

$$
3x^2-7x-6=(3x+2)(x-3).
$$

See, wasn't that easier?

I present to you, the Crawshaw method.
