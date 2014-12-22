/*
* Character is the parent object for players and enemies
*/
var Character = function() {};
Character.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/*
* Returns the y value in pixels for a row on the board. Rows are
* zero-indexed.
* @param row {num} Row number on the board
* @return {num} Y value
*/
Character.prototype.getYforRow = function(row) {
  return (83 * row) - 23; // row 1 = 60; row 2 = 145; row 3 = 230
}

/*
* Returns the x value in pixels for a column on the board.
* Columns are zero-indexed.
* @param col {num} Column number on the board
* @return {num} X value
*/
Character.prototype.getXforCol = function(col) {
  return 101 * col;
}

/*
 * Returns true if the character is occupying the same space
 * as the passed in character.
 * @param collider {Character} Character to check against for collision
 * @return {boolean} Whether the character and collider collided
 */
Character.prototype.hasCollidedWith = function(collider) {
  var hascollided = false;
  if (collider.y === this.y) {
    if (collider.x + 100 > this.x && collider.x < this.x + 100) {
      hascollided = true;
    }
  }
  return hascollided;
}

// Enemies our player must avoid
var Enemy = function() {
  this.reset();
}
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Character;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.x < ctx.canvas.width) {
      this.x = Math.round(this.x + (dt * this.velocity));
      if (this.hasCollidedWith(player)) {
        console.log("Collision!");
        player.reset();
      }
    } else {
      this.reset();
    }
}

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
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.reset();
};
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Character;
Player.prototype.update = function() {
  this.x = this.getXforCol(this.col);
  this.y = this.getYforRow(this.row);
}
Player.prototype.handleInput = function(inputKey) {
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
}
Player.prototype.reset = function() {
  this.row = 5;
  this.col = 2;
  this.update();
  this.sprite = 'images/char-boy.png';
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var numEnemies = 3;
var allEnemies = [];
var player = new Player();
for (var i = 0; i < numEnemies; i++) {
  allEnemies.push(new Enemy());
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
