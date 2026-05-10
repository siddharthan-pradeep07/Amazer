# Welcome to the instruction guide for using Amazer. #

### About:
Amazer is a web platfrom, for analizing the mazes for micro-mouse competion. It has various features like, maze generation, path finding, Algorithm simulations, maze code generation. It also provides data regarding the maze.

### Micro-mouse: 
It is a robotic mouse that solves a maze, using a various algorithms, the most common algorithm used is flood-fill, It is the oldest robotic competiton prominently held in Japan, US and UK. (Reference: Take a look at the video by veritasium in youtube) [View video](https://youtu.be/ZMQbHMgK2rw?si=y8FAdEtewEqJMsnd) 

## Website Usage instructions:

  1. Generate a maze, by clicking the generate maze button. 
  2. If you have a custom maze, You can click the "clear walls" button and start making a maze from scratch by clicking the wall/way. 
  3. After you have a proper maze, you can click the "find path(shortest)" button to find the shortest path denoted using (yellow)
  4. Then the program draws the shortest possible line from the start(green) to finish(4x red)
  5. you can click the "generate raw code" button to generate a raw direction info. and a piece of micro-mouse code.

   Raw file Example: 
     ``` 1. Straight
         2. Right
         3. Straight
         4. Straight
         5. Left
            ........ ```

Code file: The code file is written in C++, Custom genearted based on the path. Code(piece) works for micromouses made using esps, and arduinos.
    
  6. Toggle between Code / Raw. to view files.
  7. Click the "copy" button to copy the Code / Raw file. 
  8. Add it in your micromouse code to make it follow the exact path to finish.
  9. Click the "Dead ends" button to mark the dead ends (blue) click again to remove.
  10. View the Data:
       
    ```1. total number of cells covered by the path.
       2. no. of right turns
       3. no. of left turns
       4. no. of strights 
       5. no, of dead ends
       6. (approx) Time taken to complete the maze.```

 11. Click "simulate left wall following", the program draws the path using the algorithm
 12. Similarly for right wall following.
 13. Click "simulate (shortest path)" to make the program gradually draw a line from start to finish.
 14. Click copy maze ID to copy a unique ID (different for all mazes) 
 15. Paste the same ID whenever/whereever (in the text box) to load the exact same maze.
 16. Click the "Simulate DFS algorithm" button to make the program simulate DFS (Depth first Search) Algorithm. more info about the alogrithm [Here](https://medium.com/@MLSec_Forge/the-development-of-algorithms-in-micromouse-competitions-and-its-impact-on-machine-learning-2837444cce60) 
 17. Configure custom finish by clicking the "Configure finish cells" button, select the finish cells and then press "click again to implement" button. 
 18. Similarly, the user can also configure the start cell.
 19. Select the mouse from 5 different options.
 20. Change the maze size, by clicking the up/down arrows (16x16, 20x20, 4x4)

Micro mice are hardware artworks, but to run it properly and make it function as expected, it needs a lot of tweaking in. Even minute things are important, as those are the ones which causes a lot of problems when it runs through the maze. Amazer helps to run, test analize the micro-mouse as well as the maze itself with various tools to provide the best user experience. 

Made by Siddharthan for hackclub/beest < happy hacking >