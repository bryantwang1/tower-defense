var TowerDefense = TowerDefense || {};


TowerDefense.FreezeTower = function (parentState, posX, posY) {
      // parentState, posX, posY, range, fireRate, dmg, bulletspeed, image
      TowerDefense.Tower.call(this, parentState, posX, posY, 'freeze-tower', parentState.tileDimensions * 4, 800, 0, 300, 'freeze');

      this.freezeAmount = 0.2;
}

TowerDefense.FreezeTower.prototype = Object.create(TowerDefense.Tower.prototype);
TowerDefense.FreezeTower.prototype.constructor = TowerDefense.FreezeTower;

TowerDefense.FreezeTower.prototype.update = function() {

  //MONSTER DAMAGE
  this.game.physics.arcade.collide(this.bulletPool, this.parentState.monsters, function(bullet, monster) {
      this.getExplosion(bullet.x, bullet.y);
      bullet.kill();
        if (monster.maxHealth > 0) {
          monster.maxHealth = monster.maxHealth - this.damageDealt;
          monster.freeze(this.freezeAmount);
        }

        if (monster.maxHealth <= 0) {
          var index = this.withinRadius.indexOf(monster)
          if(index >= 0) {
            this.withinRadius.splice(index, 1);
          }
        //   monster.kill();
          monster.destroy();
        }
  }, null, this);


//BULLET TARGETING
    this.withinRadius = [];
    var tower = this;
    this.parentState.monsters.forEachExists(function(monster) {
        var distance = tower.game.physics.arcade.distanceBetween(tower, monster);
        if(distance <= tower.targetRadius) {
            if(tower.withinRadius.indexOf(monster) < 0) {
                tower.withinRadius.push(monster);
            }
            if(tower.withinRadius.length > 0) {
                tower.rotation = tower.game.physics.arcade.angleBetween(tower, tower.withinRadius[0]);
                tower.shootBullet();
            }
        }
    });
};
//FREEZE EXPLOSION
TowerDefense.FreezeTower.prototype.getExplosion = function(x, y) {
  var explosion = this.explosionGroup.getFirstDead();
  if (explosion === null) {
    explosion = this.game.add.sprite(0, 0, 'explosion-freeze');
    explosion.anchor.setTo(0.5, 0.5);

    var animation = explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 100, false);
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
