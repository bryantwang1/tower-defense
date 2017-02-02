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
TowerDefense.Enemy = function (parentState, posX, posY, sprite, gold) {
    Phaser.Sprite.call(this, game, posX, posY, sprite);
    // this.outOfBoundsKill = true;
    // this.checkWorldBounds = true;
    this.collisionEnabled = false;
    this.game.physics.arcade.enable(this, true);
    this.anchor.setTo(0.5, 0.5);
    this.body.setSize(48, 48);
    this.maxHealth = 15;
    this.parentState = parentState;
    this.frozen = false;
    this.freezeCounter = 0;

    this.gold = gold || 1;

    this.defaultSpeed = 200;
    this.currentSpeed = this.defaultSpeed;
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
        var moveX = (next_position.x * this.parentState.tileDimensions) + this.parentState.tileDimensions/2;
        var moveY = (next_position.y * this.parentState.tileDimensions) + this.parentState.tileDimensions/2;
        this.game.physics.arcade.moveToXY(this, moveX, moveY, this.currentSpeed);
      } else {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.x = (next_position.x * this.parentState.tileDimensions) + this.parentState.tileDimensions/2;
        this.y = (next_position.y * this.parentState.tileDimensions) + this.parentState.tileDimensions/2;

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


  if(this.counter % 5 === 0) {
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

    if(this.path.length-1 === this.pathStep) {
        // this.kill();
        this.destroy();
        this.parentState.life--;
        if(this.parentState.life > 0) {
            this.parentState.lifeText.text = "Life: " + this.parentState.life;
        }
    }
  }

  if(this.frozen) {
      this.freezeCounter++;
      if(this.freezeCounter > 180) {
          this.currentSpeed = this.defaultSpeed;
          this.frozen = false;
      }
  }

}

TowerDefense.Enemy.prototype.freeze = function(freezeAmount) {
    this.currentSpeed = this.defaultSpeed * freezeAmount;
    this.freezeCounter = 0;
    this.frozen = true;
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
    if (this.game.physics.arcade.distanceToXY(this, (position.x * this.parentState.tileDimensions)+this.parentState.tileDimensions/2, (position.y * this.parentState.tileDimensions)+this.parentState.tileDimensions/2) <= 3) {
        return true;
    } else {
        return false;
    }
};

TowerDefense.Enemy.prototype.setPath = function(path) {
  this.path = path;
}
