---
layout: post
title: Maths on a Mug 12
date: 2020-12-07 12:00:00
tags: mathematics MathsOnAMug
related_posts: true
thumbnail: assets/img/mathsonamug/mathsonamug_12.jpeg
---

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <figure>
            {% include figure.liquid loading="eager" path="assets/img/mathsonamug/mathsonamug_12.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
        </figure>
    </div>
</div>

A classic! This is one of my favourite results from [Graph Theory](https://en.wikipedia.org/wiki/Graph_theory). The branch of mathematics invented by [Euler](https://en.wikipedia.org/wiki/Leonhard_Euler), this theorem is known as [Euler’s Formula](https://en.wikipedia.org/wiki/Planar_graph#Euler.27s_formula). It is a remarkable fact that for any planar graph (edges only intersect at their endpoints) the number of faces (regions bound by an edge) plus the number of vertices (corner points) minus the number of edges is equal to 2.

Take for example a cube, which has 6 faces, 8 vertices (corners) and 12 edges:

$$
\begin{eqnarray*}
F+V−E &=& 2,\\
6+8−12 &=& 2.
\end{eqnarray*}
$$

I think this is a lovely little fact. The proof is quite straight forward, using induction on the number of edges:

For $$E=0$$ (i.e. there are no edges) then it is fairly trivial, since there can be only one vertex ($$V=1$$) and one face ($$F=1$$). So clearly $$F+V−E=2$$. 

Now assume it holds for all planar graphs with less than $$E$$ edges (where $$E\ge 1$$). Let $$G$$ be a graph with $$E$$ edges. If $$G$$ is a tree, then $$V=E+1$$ and $$F=1$$, so $$F+V−E=2$$. 

The only remaining case is if $$G$$ is not a tree. In which case let $$m$$ be a cycle edge of $$G$$ and let us investigate $$G−m$$. The connected planar graph $$G−m$$ has $$V$$ vertices, $$E−1$$ edges and $$F−1$$ faces so using our inductive hypothesis $$(F−1)+V−(E−1)=2$$, which implies that $$F+V−E=2$$ as required.
