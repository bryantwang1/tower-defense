var TowerDefense = TowerDefense || {};
// ENEMY STUFF from -- http://blog.intracto.com/create-fun-and-interactive-games-with-javascript-using-phaser.io

// this.monsters;
// function create() {
//     …
//
//     // Enemies
//     this.monsters = game.add.group();
//     game.time.events.loop(250, function(){
//         var enemy = new Enemy(game.world.randomX, game.world.randomY, 'enemy');
//         enemyGroup.add(enemy);
//     });
// }

// function update() {
//     …
//
//     // Collision detection
//     game.physics.arcade.overlap(character, enemyGroup, collisionHandler, null, this);
// }
// this.sprite = game.add.sprite(50, 50, 'car'); // standard car sprite
TowerDefense.Enemy = function (parentState, posX, posY, sprite) {
    Phaser.Sprite.call(this, game, posX, posY, sprite);
    this.outOfBoundsKill = true;
    this.collisionEnabled = false;
    this.game.physics.arcade.enable(this, true);
    this.anchor.setTo(0.5, 0.5);
    this.body.setSize(32, 32);
    this.maxHealth = 15;

    this.moveSpeed = 120;
    this.body.immovable = true;

    this.path = [];
    this.pathStep = -1;
    this.counter = 0;
    this.lastRotation = 0;
}

TowerDefense.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
TowerDefense.Enemy.prototype.constructor = TowerDefense.Enemy;

// TowerDefense.Enemy.prototype.create = function () {
//
// }

TowerDefense.Enemy.prototype.update = function () {
  if(this.type === "star") {
    this.game.physics.arcade.moveToXY(this, 752, this.randomEndY, this.moveSpeed);
  } else {
    //car variables
    var next_position;
    this.counter++;

    this.game.physics.arcade.collide(this, TowerDefense.layer2);

    //car movement trigger
    if (this.path.length > 0) {
      if(this.pathStep < 0) {
        this.pathStep = 0;
      }
      next_position = this.path[this.pathStep];

      if (!this.reachedXY(next_position)) {
        var moveX = (next_position.x * 32) + 16;
        var moveY = (next_position.y * 32) + 16;
        this.game.physics.arcade.moveToXY(this, moveX, moveY, this.moveSpeed);
      } else {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.x = (next_position.x * 32) + 16;
        this.y = (next_position.y * 32) + 16;

        if (this.pathStep < this.path.length - 1) {
          this.pathStep += 1;
        } else {
          this.path = [];
          this.pathStep = -1;
        }
      }
    } else {
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
    }

  }

  if(this.counter % 3 === 0) {
    if(this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.rotation = this.lastRotation;
    } else if(this.body.velocity.x > 20) {
      this.rotation = 0;
      this.lastRotation = 0;
    } else if(this.body.velocity.y > 20) {
      this.rotation = 1.57;
      this.lastRotation = 1.57;
    } else if(this.body.velocity.x < -20) {
      this.rotation = 3.14;
      this.lastRotation = 3.14;
    } else if(this.body.velocity.y < -20) {
      this.rotation = 4.71;
      this.lastRotation = 4.71;
    } else {
      this.rotation = 0;
    }
  }
}

TowerDefense.Enemy.prototype.moveAlongXY = function() {
    "use strict";
    if (this.path !== null) {
        this.pathStep = 1;
    } else {
        this.path = [];
    }
};

TowerDefense.Enemy.prototype.reachedXY = function(position){
    "use strict";
    if (this.game.physics.arcade.distanceToXY(this, (position.x * 32)+16, (position.y * 32)+16) <= 3) {
        return true;
    } else {
        return false;
    }
};

TowerDefense.Enemy.prototype.setPath = function(path) {
  this.path = path;
}
