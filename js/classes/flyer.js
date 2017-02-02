var TowerDefense = TowerDefense || {};

TowerDefense.Flyer = function (parentState, posX, posY) {
    TowerDefense.Enemy.call(this, parentState, posX, posY, 'runnerAir', 1, 200, 25);

    // this.parentState = parentState;
    this.randomEndY;
    this.endX = this.parentState.tileDimensions * 41;
}

TowerDefense.Flyer.prototype = Object.create(TowerDefense.Enemy.prototype);
TowerDefense.Flyer.prototype.constructor = TowerDefense.Flyer;

TowerDefense.Flyer.prototype.update = function () {

  this.game.physics.arcade.moveToXY(this, this.endX, this.randomEndY, this.currentSpeed);

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

      if(this.x >= this.endX) {
          this.destroy();
          this.parentState.life--;
          if(this.parentState.life > 0) {
              this.parentState.lifeText.text = "Life: " + this.parentState.life;
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
