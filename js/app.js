 /*
  * GamePiece is the parent object for players, enemies, and items.
 */
var GamePiece = function() {};
GamePiece.prototype.render = function() {
  ctx.globalAlpha = 1.0;
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

 /*
  * Returns the y value in pixels for a row on the board. Rows are
  * zero-indexed.
  * @param row {num} Row number on the board
  * @return {num} Y value
  */
GamePiece.prototype.getYforRow = function(row) {
  return (83 * row) - 23;
};

 /*
  * Returns the x value in pixels for a column on the board.
  * Columns are zero-indexed.
  * @param col {num} Column number on the board
  * @return {num} X value
  */
GamePiece.prototype.getXforCol = function(col) {
  return 101 * col;
};

 /*
  * Returns true if the GamePiece is occupying the same space
  * as the passed in GamePiece.
  * @param collider {GamePiece} GamePiece to check against for collision
  * @return {boolean} Whether the GamePiece and collider collided
  */
GamePiece.prototype.hasCollidedWith = function(collider) {
  var hasCollided = false;
  if (collider.y === this.y) {
    if (collider.x + 100 > this.x && collider.x < this.x + 100) {
      hasCollided = true;
    }
  }
  return hasCollided;
};


 /*
  * Enemy objects. Enemies aren't actually destroyed when they reach the
  * end of the screen, just randomly reset.
  */
var Enemy = function() {
  this.reset();
};
Enemy.prototype = Object.create(GamePiece.prototype);
Enemy.prototype.constructor = Enemy;

 /* Update the enemy's position, required method for game.
  * @param dt {num} a time delta between ticks
  */
Enemy.prototype.update = function(dt) {
    if (this.x < ctx.canvas.width) {
      this.x = Math.round(this.x + (dt * this.velocity));
      if (this.hasCollidedWith(game.player)) {
        game.player.kill();
      }
    } else {
      this.reset();
    }
};

 /*
  * Resets the enemy to a new random enemy and puts
  * it back on the left of the screen.
  */
Enemy.prototype.reset = function() {
  var row = getRandomInt(1, 4);
  this.sprite = 'images/enemy-bug.png';
  this.velocity = getRandomInt(50, 180);
  this.x = getRandomInt(-150, -101); // Stagger randomly
  this.y = this.getYforRow(row);
};


 /*
  * Player class.
  */
var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.score = 0;
  this.lives = 5;
  this.resetPos();
};
Player.prototype = Object.create(GamePiece.prototype);
Player.prototype.constructor = Player;

 /*
  * If the player has been moved, update its x and y coordinates
  * based on its new row or column position.
  */
Player.prototype.update = function() {
  this.setXYValues();
  if (this.hasCollidedWith(game.gem)) {
    game.toasts.push(new Toast("+" + game.gem.value, this.x + 51, this.y + 63));
    this.score += game.gem.value;
    game.gem.destroySelf();
  }
};

 /*
  * Move the player one row or column based on input key. Don't move
  * player off board. Don't move if no lives left.
  */
Player.prototype.handleInput = function(inputKey) {
  if (this.lives > 0) {
    switch(inputKey) {
      case 'left':
        if (this.col > 0) {
          this.col--;
        }
        break;
      case 'right':
        if (this.col < 4) {
          this.col++;
        }
        break;
      case 'up':
        if (this.row > 1) {
          this.row--;
        }
        break;
      case 'down':
        if (this.row < 5) {
          this.row++;
        }
        break;
    }
  } else {
    game.reset();
  }
};

 /*
  * Resets the player to the bottom center of the screen.
  */
Player.prototype.resetPos = function() {
  this.row = 5;
  this.col = 2;
  this.setXYValues();
};

 /*
  * Sets the x and y value for player based on row and column.
  */
Player.prototype.setXYValues = function() {
  this.x = this.getXforCol(this.col);
  this.y = this.getYforRow(this.row);
};

 /*
  * Kills the player. Subtract a life and reset.
  */
Player.prototype.kill = function() {
  this.lives--;
  game.toasts.push(new Toast("Ouch!", this.x + 51, this.y + 118));
  if (this.lives === 0) {
    game.toasts.push(new Toast("GAME OVER", ctx.canvas.width/2, 300,
                               "large", -1));
    game.toasts.push(new Toast("Press any key", ctx.canvas.width/2, 350,
                               "medium", -1));
  }
  this.resetPos();
};

 /*
  * Returns the number of lives remaining.
  * @return {num} Lives remaining
  */
Player.prototype.getLives = function() {
  return this.lives;
};

 /*
  * Returns the player's score.
  * @return {num} Player's score
  */
Player.prototype.getScore = function() {
  return this.score;
};

 /*
  * Gem objects the player can collect for points. Gem objects
  * disappear after a certain time and appear in random spots on the
  * board.
  */
var Gem = function () {
  this.reset();
};
Gem.prototype = Object.create(GamePiece.prototype);
Gem.prototype.constructor = Gem;

 /*
  * Gem properties by type. Duration is milliseconds gem appears on screen.
  */
Gem.prototype.gemTypes = [{ 'color': 'blue',
                            'sprite': 'images/Gem Blue.png',
                            'value': 50,
                            'duration': 15000},
                          { 'color': 'green',
                            'sprite': 'images/Gem Green.png',
                            'value': 100,
                            'duration': 10000},
                          { 'color': 'orange',
                            'sprite': 'images/Gem Orange.png',
                            'value': 250,
                            'duration': 5000}];

 /*
  * Resets the gem to a random spot on the screen and sets properties
  * after choosing a random gem type.
  */
Gem.prototype.reset = function() {
  var row = getRandomInt(1, 4);
  var col = getRandomInt(0, 5);
  var properties = this.gemTypes[getRandomInt(0, this.gemTypes.length)];
  for (var propname in properties) {
    if (properties.hasOwnProperty(propname)) {
      this[propname] = properties[propname];
    }
  }
  this.x = this.getXforCol(col);
  this.y = this.getYforRow(row);
  this.destroytime = this.duration + Date.now();
};

 /*
  * Replaces gem with a placeholder if time for it to be destroyed.
  */
Gem.prototype.update = function() {
  if (Date.now() >= this.destroytime) {
    this.destroySelf();
  }
};

 /*
  * Replace self with a placeholder for a new gem.
  */
Gem.prototype.destroySelf = function() {
  game.gem = new Placeholder(function () {
    game.gem = new Gem();
  });
};


 /*
  * Placeholder object holds the place for any item object
  * such as a gem for a random time period then replaces it using
  * the callback function passed in at instantiation. We use a callback
  * function rather than an object because item objects need to set
  * destroy times at instantiation.
  * @param replaceCallback {function} Function used to replace an item called
  * at replacetime
  */
var Placeholder = function(replaceCallback) {
  this.replaceCallback = replaceCallback;
  this.replacetime = Date.now() + getRandomInt(0, 10000);
};

 /*
  * Runs the callback to replace the item.
  */
Placeholder.prototype.update = function() {
  if (Date.now() >= this.replacetime) {
    this.replaceCallback();
  }
};


 /*
  * Toasts are text that display briefly on the screen.
  * @param displayText {String} Text to display
  * @param opt_x {num} Optional x position, displays center by default
  * @param opt_Y {num} Optional y position, displays at 100px by default
  * @param opt_size {String} A value of small, medium, or large
  * @param opt_duration {num} Length of time in milliseconds for the toast to
  * display; pass -1 to display until the game is reset
  */
var Toast = function(displayText, opt_x, opt_y, opt_size, opt_duration) {
  var duration;
  this.displayText = displayText;
  /* Default destroy time is 200; if a duration of -1 or less is passed in
   * set destroy time to zero and don't destroy until game is reset. */
  duration = opt_duration || 2000;
  if (duration > 0) {
    this.destroytime = Date.now() + duration;
  } else {
    this.destroytime = 0;
  }
  this.x = opt_x || ctx.canvas.width/2;
  this.y = opt_y || 100;
  if (this.fontSizes.hasOwnProperty(opt_size)) {
    this.size = this.fontSizes[opt_size];
  } else {
    this.size = this.fontSizes.small;
  }
};

 /*
  * Removes after time limit.
  */
Toast.prototype.update = function() {
  if (this.destroytime !== 0 && Date.now() >= this.destroytime) {
    game.toasts.splice(game.toasts.indexOf(this), 1);
  }
};

 /*
  * Renders the toast on screen.
  */
Toast.prototype.render = function() {
  ctx.font = this.size;
  if (this.destroytime === 0 || this.destroytime - Date.now() > 1000) {
    ctx.globalAlpha = 1.0;
  } else {
    ctx.globalAlpha = (this.destroytime - Date.now()) / 1000;
  }
  ctx.textAlign = "center";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.strokeText(this.displayText, this.x, this.y);
  ctx.fillStyle = "white";
  ctx.fillText(this.displayText, this.x, this.y);
};

 /*
  * Toast font sizes.
  */
Toast.prototype.fontSizes = {
  "small": "bold 12pt Helvetica, Arial, sans-serif",
  "medium": "bold 24pt Helvetica, Arial, sans-serif",
  "large": "bold 48pt Helvetica, Arial, sans-serif"
};

 /*
  * Scoreboard object displays the score at the top of the screen.
  */
var Scoreboard = function(gameState) {
  this.gameState = gameState;
  this.score = {};
  this.freeze = false;
};

 /*
  * Updates the values for the scoreboard.
  */
Scoreboard.prototype.update = function() {
  if (!this.freeze) {
    this.score = this.gameState.getScoreboardValues();
  }
  if (this.score.livesRemaining === 0) {
    this.freeze = true;
  }
};

 /*
  * Renders the scoreboard.
  */
Scoreboard.prototype.render = function() {
  var output = "Score: " + this.score.score;
  output += "   Lives: " + this.score.livesRemaining;
  output += "   Time: " + this.score.elapsedTime;
  ctx.globalAlpha = 1.0;
  ctx.font = "bold 18pt Helvetica, Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, ctx.canvas.width, 50);
  ctx.lineWidth = 3;
  ctx.strokeText(output, 5, 40);
  ctx.fillStyle = "#9cf";
  ctx.fillText(output, 5, 40);
};


 /*
  * GameState object keeps track of global game properties.
  */
var GameState = function() {
  this.reset();
};

 /*
  * Sets the game state to the initial state.
  */
GameState.prototype.reset = function() {
  this.numEnemies = 3;
  this.gameStarted = Date.now();
  this.allEnemies = [];
  this.player = new Player();
  this.gem = new Gem();
  this.toasts = [];
  this.scoreboard = new Scoreboard(this);
  for (var i = 0; i < this.numEnemies; i++) {
    this.allEnemies.push(new Enemy());
  }
};
 /*
  * Returns an object contain data for the scoreboard.
  * @return {Object} Scoreboard values object
  */
GameState.prototype.getScoreboardValues = function() {
  return {
    "elapsedTime": Math.round((Date.now() - this.gameStarted) / 1000),
    "livesRemaining": this.player.getLives(),
    "score": this.player.getScore()
  };
};


// Instantiate game state.
var game = new GameState();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    game.player.handleInput(allowedKeys[e.keyCode]);
});
