var TowerDefense = TowerDefense || {};

TowerDefense.BootState = function () {
    "use strict";
    Phaser.State.call(this);
};

TowerDefense.BootState.prototype = Object.create(Phaser.State.prototype);
TowerDefense.BootState.prototype.constructor = TowerDefense.BootState;

TowerDefense.BootState.prototype.init = function (next_state) {
    "use strict";
    this.next_state = next_state;
};

TowerDefense.BootState.prototype.preload = function () {
    "use strict";
};

TowerDefense.BootState.prototype.create = function () {
    "use strict";
    this.game.state.start("LoadingState", true, false, this.next_state);
};
