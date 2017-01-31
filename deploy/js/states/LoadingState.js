var PathfindingExample = PathfindingExample || {};

PathfindingExample.LoadingState = function () {
    "use strict";
    Phaser.State.call(this);
};

PathfindingExample.LoadingState.prototype = Object.create(Phaser.State.prototype);
PathfindingExample.LoadingState.prototype.constructor = PathfindingExample.LoadingState;

PathfindingExample.LoadingState.prototype.init = function (next_state) {
    "use strict";
    this.next_state = next_state;
};

PathfindingExample.LoadingState.prototype.preload = function () {
    "use strict";
    this.game.load.image('ground_1x1', '../assets/tilemaps/tiles/ground_1x1.png');
    this.game.load.image('car', '../assets/car90.png');
};

PathfindingExample.LoadingState.prototype.create = function () {
    "use strict";
    this.game.state.start(this.next_state, true, false);
};
