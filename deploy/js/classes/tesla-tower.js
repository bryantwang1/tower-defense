var TowerDefense = TowerDefense || {};


TowerDefense.TeslaTower = function (parentState, posX, posY) {
      // parentState, posX, posY, range, fireRate, dmg, bulletspeed, image
      TowerDefense.Tower.call(parentState, posX, posY, 'tesla-tower', 110, 800, 10, 200, 'diamond');

}

TowerDefense.TeslaTower.prototype = Object.create(TowerDefense.Enemy.prototype);
TowerDefense.TeslaTower.prototype.constructor = TowerDefense.TeslaTower;

TowerDefense.TeslaTower.prototype.update = function () {

}
