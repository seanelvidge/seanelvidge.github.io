---
layout: post
title: Maths on a Mug 11
date: 2020-07-14 12:00:00
tags: mathematics MathsOnAMug
related_posts: true
thumbnail: assets/img/mathsonamug/mathsonamug_11.jpeg
---

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <figure>
            {% include figure.liquid loading="eager" path="assets/img/mathsonamug/mathsonamug_11.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
        </figure>
    </div>
</div>

This is one of the more common things that students ask me. Mostly this comes from people who have watched the incredibly successful [Numperphile video](https://www.youtube.com/watch?v=w-I6XTVZXww){:target="\_blank"}, but the result was [well known](https://en.wikipedia.org/wiki/1_%2B_2_%2B_3_%2B_4_%2B_%E2%8B%AF){:target="\_blank"} before then. There are a number of ways to 'prove' this result, giving rise to much internet angst, my favourite (and simplest) is that of [Ramanujan](https://en.wikipedia.org/wiki/Srinivasa_Ramanujan){:target="\_blank"}:

$$
\begin{eqnarray*}
c &=& 1 + 2 + 3 + 4 + 5 + 6 + \cdots,\\
4c &=& \quad 4 \qquad +8 \qquad +12 + \cdots,\\
-3c &=& 1 - 2 + 3 - 4 + 5 - 6 + \cdots,\\
-3c &=& \frac{1}{(1+1)^2},\\
-3c &=& \frac{1}{4},\\
c &=& \frac{-1}{12}.
\end{eqnarray*}
$$

Can you spot the mistake?

Fundamentally the flaws of these argument often arise from treating infinite sums like finite sums. In general, [associativity](https://en.wikipedia.org/wiki/Associative_property){:target="\_blank"} and [commutativity](https://en.wikipedia.org/wiki/Commutative_property){:target="\_blank"} do not hold for infinite series. As an example, take the series $$1−1+1−1+1−1+1−1+\cdots=0$$, and then add some brackets:

$$
\begin{eqnarray*}
(1−1)+(1−1)+(1−1)+(1−1)+\cdots=0,\\
1+(−1+1)+(−1+1)+(−1+1)+(−1+\cdots=1.
\end{eqnarray*}
$$

Which give you different answers!

For an excellent description of all the errors with the $$1+2+3+\cdots=\frac{-1}{12}$$ proof see the excellent [Plus magazine article](https://plus.maths.org/content/infinity-or-just-112){:target="\_blank"}.

<hr>

<div style="display: flex; justify-content: space-between; align-items: center;">
    <a href="https://seanelvidge.github.io/blog/2020/Maths_on_a_Mug_10/" style="text-decoration: none;">Previous Maths on a Mug</a>
    <a href="https://seanelvidge.github.io/blog/2020/Maths_on_a_Mug_12/" style="text-decoration: none;">Next Maths on a Mug</a>
</div>
