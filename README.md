# llm_js_games
Educational javascript games developed with the help of LLM

Most of these games were developed as examples for training courses on the use of AI-based systems.
Some have been developed using a combination of different LLMs, either locally or through platforms.

## js_games
Simple games

### Grid Game
*LLMs: qwen3-vl-4b (via Ollama), Perplexity*
A maze game.

#### Prompt
You are a system specialized in writing web pages.
I'd like an HTML/Javascript page with a simple game:
- The playing area is 600x600 px, with a 10x10 px grid of squares.
- There are some white rectangles, 1 square wide and 1 to 6 squares long, that can be arranged vertically or horizontally.
- There is a starting square, randomly placed, colored yellow.
- There is a finishing square, randomly placed, colored green.
- There is the main character (the size of a square), colored blue. He can be moved using the arrow keys.
- Each click of the arrow key moves the main character 3 squares in the direction indicated by the arrow key.
- If the main character hits a wall, he dies and the game starts over.
- If the main character reaches the finishing square, he wins and the game ends.

#### Prompt updates
Very good, thanks. Could you make some changes to avoid unwinnable situations?
- Larger cells (20x20px)
- 10-15 random walls
- A 4-cell long, cyan-colored wall, randomly positioned, moves the player to a random spot on the grid when hit.

There are still unwinnable conditions, so let's change them slightly:
- Passing through the cyan wall moves the protagonist to a random location.


### Brick Breaker Game
*LLMs: Gemini Pro*
An Arkanoid-like game.

#### Prompt
Hello, I'd like to make a simple JavaScript version of the brick game with the following features:
- From 1 to 5 levels, corresponding to the number of brick layers
- 3 initial lives
- Playing area dimensions: 500px wide, 800px high
- Bricks of 3 random tones of the same color (R, G, B), with different scores, e.g., R=1, G=2, B=3
- Each row must have two special bricks, one (yellow) releasing a life and one (purple) releasing a paddle width increment
- Below the playing area, there must be life and score counters
- The paddle must be moved using the left and right arrow keys; the up arrow releases the ball at the start of the game

#### Prompt updates
I'd like to change the paddle's behavior:
- After taking 5 width increments, it no longer increases, but two differently colored areas appear at the ends. If the ball bounces in one of these areas, the bounce angle is random.
- After taking 5 width increments, hitting the purple bricks produces "projectiles" that you can fire using the up arrow (one projectile per brick). When the paddle has a projectile, its color changes and returns to normal once fired. A projectile can only hit one brick.

Let's leave it to chance: randomly, the projectile gets bigger and passes through all the bricks in a straight line.
I would also slightly widen the areas at the edges of the paddle with the random bounce.

### Mahjong Cards Game
*LLMs: Codestral, DeepSeek-Coder-v2, Gemini Pro*

#### Prompt
Good morning, I'd like to make a simple Javascript version of Mah Jong Solitaire, with the following features:
- In the classic version, the tile set is as follows:
|Set | Count|
|-|-|
| Dots | 9 |
| Bamboo | 9 |
| Characters | 9 |
| Winds | 4 | 4!
| Dragons | 3 |
| Flowers | 1 |
| Seasons | 1 |
- In the classic version, each tile set is repeated 2 or 4 times.
- I'd like a simplified version where there's a variable (in the code) that allows you to specify the size of the tile set (e.g., $dim_bamboo=5) and the number of repetitions (at least 2, e.g., $set_multiplier=2).
- The tile object must have a color gradation ranging from a base palette (e.g., #f94144ff, #f3722cff, #f8961eff, #f9c74fff, #90be6dff, #43aa8bff, #577590ff) to a palette of the same shade, with an increment that makes it possible to distinguish the differences between the various steps. The HTML code for the color must be written within the tile. The base palette must be saved in a variable.
- The height of the tiles must be determined by a variable (initially 150px), and the height-to-width ratio must be the golden ratio.
- The tile object must be drawn on canvas with a 1px black border. The drop shadow must be simulated by placing an additional 3px black border to the left and bottom, and then a 1px white border.
- The tiles must be stacked so that each level is offset 5px up and to the right.
- When a tile is clicked, its border turns 2px yellow. If an identical tile (same set, same color) is subsequently clicked, both tiles disappear from the board. Otherwise, any click in another area of ​​the board or on a tile that doesn't match will deselect the first tile.
- Initially, the tiles are randomly distributed in a random rectangular area, ensuring there are at least 3 overlapping levels of tiles.
- There must be 2 buttons: one to initialize the game, the other to shuffle the remaining tiles.
Could you help me?


## js_doodles
Ok, these are not games but *divertissement*

### Camera Mobile Color Picker
*Gemini Pro*
A picker that allows you to select the color from the image of your phone's camera or a webcam.

#### Prompt
Good morning, I'd like to show my students an HTML page for use with a smartphone, with the following features:
- Preferred portrait orientation
- View the camera output in the main area (say, 2/3 of the page).
- Tap the image and select the color.
- Below the main area, create a space 765 px wide (255*3). Fill in with black and place three adjacent color bands, each one as wide as the respective component (R, G, B) of the selected color.
- Fill the remaining space with the selected color and display the color's HTML code.

### Camera Gesture Training
*Gemini Pro*

#### Prompt
I need to explain how an AI system is trained, and I'd like some help to think things through. Can we have a quick brainstorm? I need to identify:
- Type of technology to use (possibly JavaScript or Python), considering that I'd also like to demonstrate the neural networks on video (even a sample) during training, and possibly show inputs, layer connections, and outputs.
- I don't necessarily have to write the code; my goal is to help the students understand. I have a couple of hours available and could even install an educational program if available.
- For technical reasons, I won't have access to an internet connection, so everything will need to run locally on a standard Windows 10 laptop.
- The students have already seen 'Introduction to Deep Learning with Keras and TensorFlow' with another teacher, so I don't want numerical OCR as an example.
- We'll still need a training dataset and a testing dataset.
- I'd like something that can demonstrate how interesting this type of technology is.
- For example (but other solutions may also work) JavaScript + TensorFlow.js + Teachable Machine offline to train how to match gestures to actions, e.g. vertical movement of the left hand that changes the color of a box according to a gradient.

#### Prompt update
A "Reset" button would be helpful, and also - if possible - to see the webcam image "straightened" (it is now mirrored).
Would it be possible to visually represent the trained neural network (I mean with nodes and connections)?


