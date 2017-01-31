var PathfindingExample = PathfindingExample || {};

PathfindingExample.BootState = function () {
    "use strict";
    Phaser.State.call(this);
};

PathfindingExample.BootState.prototype = Object.create(Phaser.State.prototype);
PathfindingExample.BootState.prototype.constructor = PathfindingExample.BootState;

PathfindingExample.BootState.prototype.init = function (next_state) {
    "use strict";
    this.next_state = next_state;
};

PathfindingExample.BootState.prototype.preload = function () {
    "use strict";
};

PathfindingExample.BootState.prototype.create = function () {
    "use strict";
    this.game.state.start("LoadingState", true, false, this.next_state);
};
