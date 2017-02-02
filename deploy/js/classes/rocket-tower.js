var TowerDefense = TowerDefense || {};


TowerDefense.RocketTower = function (parentState, posX, posY) {
      // parentState, posX, posY, range, fireRate, dmg, bulletspeed, image
      TowerDefense.Tower.call(this, parentState, posX, posY, 'rocket-tower', parentState.tileDimensions * 10, 800, 5, 200, 'rocket');

      this.price = 15;
}

TowerDefense.RocketTower.price = 15;



TowerDefense.RocketTower.prototype = Object.create(TowerDefense.Tower.prototype);
TowerDefense.RocketTower.prototype.constructor = TowerDefense.RocketTower;
