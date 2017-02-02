var TowerDefense = TowerDefense || {};


TowerDefense.TeslaTower = function (parentState, posX, posY) {
      // parentState, posX, posY, range, fireRate, dmg, bulletspeed, image
      TowerDefense.Tower.call(this, parentState, posX, posY, 'tesla-tower', parentState.tileDimensions * 3.5, 1, .5, 300, 'lightning');

}

TowerDefense.TeslaTower.prototype = Object.create(TowerDefense.Tower.prototype);
TowerDefense.TeslaTower.prototype.constructor = TowerDefense.TeslaTower;


//Tesla EXPLOSION
TowerDefense.TeslaTower.prototype.getExplosion = function(x, y) {
  var explosion = this.explosionGroup.getFirstDead();
  if (explosion === null) {
    explosion = this.game.add.sprite(0, 0, 'explosion-lighting');
    explosion.anchor.setTo(0.5, 0.5);

    var animation = explosion.animations.add('boom', [0,1,2,3,4,7,9,10,11,12,13,14,15,], 20, false);
    animation.killOnComplete = true;

    this.explosionGroup.add(explosion);
  }
  explosion.revive();
  // Move the explosion to the given coordinates
  explosion.x = x;
  explosion.y = y;
  // Set rotation of the explosion at random for a little variety
  explosion.angle = this.game.rnd.integerInRange(0, 360);
  explosion.animations.play('boom');
  // Return the explosion itself in case we want to do anything else with it
  return explosion;
};
