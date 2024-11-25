---
layout: post
title: Maths on a Mug 7
date: 2018-12-01 12:00:00
tags: mathematics MathsOnAMug
related_posts: true
thumbnail: assets/img/mathsonamug/mathsonamug_7.jpeg
---

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <figure>
            {% include figure.liquid loading="eager" path="assets/img/mathsonamug/mathsonamug_7.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
        </figure>
    </div>
</div>

I saw someone solving a Sudoku on the train this morning, which made again think about the minimum number of 'clues' (numbers in the grid) required to solve a puzzle. It has been [proven](https://arxiv.org/pdf/1201.0749){:target="\_blank"} that you need at least 17 clues to have a unique, solvable, solution.

The proof is not for the faint hearted, for a long time it had been conjectured that 17 clues were the minimum necessary, but no one had actually proved it. The authors of the proof conducted an exhaustive computer search for 16-clue Sudoku puzzles and found none, thereby proving that the minimum number of clues required is indeed 17. Their approach involved several key steps:

1. **Cataloging All Possible Sudoku Grids**: They generated a comprehensive list of all valid, completed Sudoku grids. Given the vast number of possible grids, this was a significant computational task.

2. **Developing an Efficient Search Algorithm**: The team created a program named "checker" to systematically search each completed grid for potential 16-clue puzzles that have a unique solution. This required implementing efficient algorithms capable of handling the computational complexity involved.

3. **Utilizing Unavoidable Sets and Hitting Set Algorithms**: They employed the concept of unavoidable sets—specific cell groupings that must contain at least one clue to ensure a unique solution. By identifying these sets, they could focus their search more effectively. To manage the computational challenges, they developed a novel algorithm for enumerating hitting sets, which are minimal sets of clues intersecting all unavoidable sets. This approach was crucial, as traditional backtracking algorithms would have been too slow for an exhaustive search.

4. **Conducting the Exhaustive Search**: With their optimized algorithms, they performed a thorough search across all possible Sudoku grids. The absence of any valid 16-clue puzzles in their findings led them to conclude that at least 17 clues are necessary for a Sudoku puzzle to have a unique solution.

<hr>

<div style="display: flex; justify-content: space-between; align-items: center;">
    <a href="https://seanelvidge.github.io/blog/2018/Maths_on_a_Mug_6/" style="text-decoration: none;">Previous Maths on a Mug</a>
    <a href="https://seanelvidge.github.io/blog/2019/Maths_on_a_Mug_8/" style="text-decoration: none;">Next Maths on a Mug</a>
</div>
