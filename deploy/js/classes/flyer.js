var TowerDefense = TowerDefense || {};

TowerDefense.Flyer = function (parentState, posX, posY, sprite) {
    TowerDefense.Enemy.call(this, game, posX, posY, sprite);

    this.maxHealth = 25;
}

TowerDefense.Flyer.prototype = Object.create(TowerDefense.Enemy.prototype);
TowerDefense.Flyer.prototype.constructor = TowerDefense.Flyer;

TowerDefense.Flyer.prototype.update = function () {

  this.game.physics.arcade.moveToXY(this, 752, this.randomEndY, 100);


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
