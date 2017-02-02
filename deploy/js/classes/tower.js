var TowerDefense = TowerDefense || {};

TowerDefense.Tower = function (parentState, posX, posY, sprite, range, fireRate, damage, bulletSpeed, bulletSprite) {
    Phaser.Sprite.call(this, game, posX, posY, sprite);
    this.collisionEnabled = false;
    this.game.physics.arcade.enable(this, true);
    this.anchor.setTo(0.5, 0.5);
    this.body.setSize(16, 16);
    this.NUMBER_OF_BULLETS = 20;
    //KEEP WITHINRADIUS UPDATED
    this.withinRadius = [];
    // this.body.immovable = true;
    this.parentState = parentState;

    this.price = 5;

    this.targetRadius = range || 96;
    this.shotDelay = fireRate; // milliseconds (10 bullets/second)
    this.bulletSpeed = bulletSpeed; // pixels/second
    this.damageDealt = damage;
    this.explosionGroup = this.game.add.group();
    this.bulletLifespan = range/(bulletSpeed/1000);

    this.bulletPool = this.game.add.group();
    for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
      var bullet = this.game.add.sprite(0, 0, bulletSprite);
      bullet.lifespan = this.bulletLifespan;
      this.bulletPool.add(bullet);
      // Set its pivot point to the center of the bullet origin
      bullet.anchor.setTo(0.5, 0.5);
      this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
      bullet.kill();
    }
}

TowerDefense.Tower.price = 5;

TowerDefense.Tower.prototype = Object.create(Phaser.Sprite.prototype);
TowerDefense.Tower.prototype.constructor = TowerDefense.Tower;

// TowerDefense.Tower.prototype.create = function() {
//     // Create Group for Explosion
//
//     // Create Gun
//     this = this.game.add.sprite(40, 400, 'arrow');
//     }
// };

//BULLET SHOOT
TowerDefense.Tower.prototype.shootBullet = function() {
    // Enforce a short delay between shots by recording the time that each bullet is shot and testing if the amount of time since the last shot is more than the required delay.
    if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
    if (this.game.time.now - this.lastBulletShotAt < this.shotDelay) return;
    this.lastBulletShotAt = this.game.time.now;
    // Get a dead bullet from the pool
    var bullet = this.bulletPool.getFirstDead();
    // If there aren't any bullets available then don't shoot
    if (bullet === null || bullet === undefined) return;
    // This makes the bullet "alive"
    bullet.revive();
    bullet.lifespan = this.bulletLifespan;
    // Bullets should kill themselves when they leave the world.
    // Phaser takes care of this for me by setting this flag
    // but you can do it yourself by killing the bullet if
    // its x,y coordinates are outside of the world.
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;

    // Set the bullet position to the gun position.
    bullet.reset(this.x, this.y);
    bullet.rotation = this.rotation;
    // Shoot it in the right direction
    bullet.body.velocity.x = Math.cos(bullet.rotation) * this.bulletSpeed;
    bullet.body.velocity.y = Math.sin(bullet.rotation) * this.bulletSpeed;
};

//BULLET KILLED PER HEALTH
TowerDefense.Tower.prototype.update = function() {

  //MONSTER DAMAGE
  this.game.physics.arcade.collide(this.bulletPool, this.parentState.monsters, function(bullet, monster) {
      this.getExplosion(bullet.x, bullet.y);
      bullet.kill();
        if (monster.maxHealth > 0) {
          monster.maxHealth = monster.maxHealth - this.damageDealt;
        }

        if (monster.maxHealth <= 0) {
          var index = this.withinRadius.indexOf(monster)
          if(index >= 0) {
            this.withinRadius.splice(index, 1);
          }
        //   monster.kill();
            this.parentState.gold += monster.gold;
            this.parentState.goldText.text = "$" + this.parentState.gold;
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

//BULLET EXPLOSION
TowerDefense.Tower.prototype.getExplosion = function(x, y) {
    var explosion = this.explosionGroup.getFirstDead();
    if (explosion === null) {
        explosion = this.game.add.sprite(0, 0, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);

        var animation = explosion.animations.add('boom', [0,1,2,3,4,5,6,8,9,10,12,13,15,16,18], 30, false);
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
