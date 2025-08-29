# Plateformer-Game-

1. Overview : This is a 2D platformer, designed to run smoothly on desktop The player controls a red square, moving across platforms, jumping, and collecting coins. The game also features enemies that must be avoided. Background music, jump sounds, coin collection sounds, and game-over sounds are included for a rich experience.

2.Technologies Used :

HTML5;

Provides the game structure, for graphics, on-screen buttons, and elements for sound.

CSS3 ;

Styles the canvas, background, controls, and makes the layout mobile-friendly and visually appealing.

JavaScript (ES6) ;

Implements game logic, animation, collision detection, levels, and audio control.

requestAnimationFrame is used for smooth animation.

Event listeners handle both keyboard and touch controls.

3.Game Structure :
HTML ;

: The main drawing area for the game.

: On-screen buttons for mobile users (left, right, jump).
: Background music and sound effects (coin, jump, game over).

CSS ;

Styles the canvas, body, buttons, and backgrounds.

Makes the game responsive and mobile-friendly.

JavaScript ;

Player object: Tracks position, size, color, speed, gravity, jump power, score, and alive status.

Levels array: Each level contains platforms, coins, and enemies.

Controls object: Tracks keyboard and on-screen button states.

Collision detection:

Player-platform collision (to determine if grounded)

Player-coin collision (increments score, plays coin sound)

Player-enemy collision (triggers game over, pauses music, plays sound)

Audio management:

Plays background music after first interaction (works for mobile browsers).

Pauses music on game over.

Resumes music on restart.

Enemy movement: Horizontal patrol with simple AI.

Level management: Automatically progresses to the next level when all coins are collected.

4.How It Works :
Initialization

Canvas is sized for the screen (responsive).

Player starts at the initial position.

Current level is loaded from the levels array.

Game Loop (Animation) :

requestAnimationFrame repeatedly calls gameLoop().

updatePlayer() handles movement, jump, gravity, collision, coin collection, and enemy collisions.

updateEnemies() moves enemies horizontally.

draw() functions render player, platforms, coins, enemies, score, and level.

Game over conditions display an overlay.

Controls :

Desktop: Arrow keys / WASD

Mobile: Touch on-screen buttons

Press R to restart the game on game over

Audio Handling :

First interaction (click or touch) starts background music.

Coins collection, jump, and game-over play respective sound effects.

Background music pauses on game over and resumes on restart.

Levels & Progression

All coins must be collected to progress.

Each level has unique platforms and enemy patterns.

Upon completing all levels, a congratulations alert is shown.

Programming Concepts Used :
Variables & Objects: Player, coins, platforms, enemies.

Arrays & Loops: Levels, platforms, coins, enemies iteration.

Functions: updatePlayer, updateEnemies, drawPlayer, nextLevel, restartGame, etc.

Event Listeners: Keyboard (keydown, keyup) and touch/mouse (touchstart, touchend, mousedown, mouseup).

Canvas Drawing: ctx.fillRect, ctx.arc, ctx.createRadialGradient, ctx.roundRect.

Collision Detection: Axis-Aligned Bounding Box (AABB) logic for platforms and enemies.

Game Loop & Animation: requestAnimationFrame.

Audio API: Play, pause, currentTime manipulation.
