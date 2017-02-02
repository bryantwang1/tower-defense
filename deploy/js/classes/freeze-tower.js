var TowerDefense = TowerDefense || {};


TowerDefense.FreezeTower = function (parentState, posX, posY) {
      // parentState, posX, posY, range, fireRate, dmg, bulletspeed, image
      TowerDefense.Tower.call(this, parentState, posX, posY, 'freeze-tower', 150, 800, 0, 300, 'freeze');


}

TowerDefense.FreezeTower.prototype = Object.create(TowerDefense.Tower.prototype);
TowerDefense.FreezeTower.prototype.constructor = TowerDefense.FreezeTower;

//FREEZE EXPLOSION
TowerDefense.FreezeTower.prototype.getExplosion = function(x, y) {
  var explosion = this.explosionGroup.getFirstDead();
  if (explosion === null) {
    explosion = this.game.add.sprite(0, 0, 'explosion-freeze');
    explosion.anchor.setTo(0.5, 0.5);

    var animation = explosion.animations.add('boom', [0,2,4,5,6,7,8,9,10,11,12], 30, false);
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
