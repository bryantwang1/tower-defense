var TowerDefense = TowerDefense || {};

TowerDefense.LoadingState = function () {
    "use strict";
    Phaser.State.call(this);
};

TowerDefense.LoadingState.prototype = Object.create(Phaser.State.prototype);
TowerDefense.LoadingState.prototype.constructor = TowerDefense.LoadingState;

TowerDefense.LoadingState.prototype.init = function (next_state) {
    "use strict";
    this.next_state = next_state;
};

TowerDefense.LoadingState.prototype.preload = function () {
    "use strict";
    this.game.load.image('ground_1x1', '../assets/tilemaps/tiles/ground_1x1.png');
    this.game.load.image('tempGround', '../assets/tilemaps/tiles/ground_temp_tile48.png');
    this.game.load.image('tempWall', '../assets/tilemaps/tiles/tower_temp_tile48.png');
    this.game.load.image('car', '../assets/car90.png');
    this.game.load.image('star', '../assets/star.png');
    this.game.load.image('freeze', '../assets/freeze.png');
    this.game.load.image('diamond', '../assets/diamond.png');
    this.game.load.image('bullet', '../assets/bullet.png');
    this.game.load.image('rocket', '../assets/rocket.png');
    this.game.load.image('machine-tower', '../assets/machine-tower48.png');
    this.game.load.image('rocket-tower', '../assets/rocket-tower48.png');
    this.game.load.image('freeze-tower', '../assets/freeze-tower48.png');
    this.game.load.image('tesla-tower', '../assets/tesla-tower48.png');
    this.game.load.image('arrow', '../assets/cannon.png');
    // this.game.load.spritesheet('runner', '../assets/runner2.png', 57.6, 48);
    this.game.load.spritesheet('explosion', '../assets/ex1.png', 50, 50);
    this.game.load.spritesheet('explosion-lighting', '../assets/ex5.png', 50, 50);
    this.game.load.spritesheet('explosion-freeze', '../assets/freeze-explosion.png', 50, 50);
    // new images
    this.game.load.spritesheet('runnerBasic', '../assets/runnerBasic.png', 48, 48);
    this.game.load.spritesheet('runnerBasic_2', '../assets/runnerBasic_2.png', 48, 48);
    this.game.load.spritesheet('runnerTank', '../assets/runnerTank.png', 48, 48);
    this.game.load.spritesheet('runnerAir', '../assets/runnerAir.png', 48, 48);

    this.game.load.image("gold", "/assets/gold$.png");
    this.game.load.image("red", "/assets/red.png");
    this.game.load.image("life", "/assets/life.png");
    this.game.load.image("lightning", "/assets/lightning.png");
};

TowerDefense.LoadingState.prototype.create = function () {
    "use strict";
    this.game.state.start(this.next_state, true, false);
};
