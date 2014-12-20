// Enemies our player must avoid
var Enemy = function() {
  this.reset();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.x < ctx.canvas.width) {
      this.x = this.x + (dt * this.velocity);
    } else {
      this.reset();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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

 /*
  * Returns the y value in pixels for a row on the board
  * @param row {num} Row number on the board
  * @return {num} Y value
  */
Enemy.prototype.getYforRow = function(row) {
  return (85 * row) - 25; // row 1 = 60; row 2 = 145; row 3 = 230
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  
};
Player.prototype.update = function() {};
Player.prototype.render = function() {};
Player.prototype.handleInput = function() {};

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
