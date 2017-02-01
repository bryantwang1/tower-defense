var PathfindingExample = PathfindingExample || {};

PathfindingExample.Monster = function (game_state, name, position, properties) {
    "use strict";

    this.moveSpeed = 100;

    this.game_state.game.physics.arcade.enable(this);
    // change the size and position of the collision box
    this.body.setSize(12, 12, 0, 4);
    this.body.collideWorldBounds = true;

    // set anchor point to be the center of the collision box
    this.anchor.setTo(0.5, 0.75);

    this.path = [];
    this.path_step = -1;
};

PathfindingExample.Monster.prototype = Object.create(Phaser.Sprite.prototype);
PathfindingExample.Monster.prototype.constructor = PathfindingExample.Monster;

PathfindingExample.Monster.prototype.update = function () {
    "use strict";
    var next_position, velocity;
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);

    if (this.path.length > 0) {
        next_position = this.path[this.path_step];

        if (!this.reached_target_position(next_position)) {
            velocity = new Phaser.Point(next_position.x - this.position.x,
                                   next_position.y - this.position.y);
            velocity.normalize();
            this.body.velocity.x = velocity.x * this.walking_speed;
            this.body.velocity.y = velocity.y * this.walking_speed;
        } else {
            this.position.x = next_position.x;
            this.position.y = next_position.y;
            if (this.path_step < this.path.length - 1) {
                this.path_step += 1;
            } else {
                this.path = [];
                this.path_step = -1;
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }
        }
    }
};

PathfindingExample.Monster.prototype.reached_target_position = function (target_position) {
    "use strict";
    var distance;
    distance = Phaser.Point.distance(this.position, target_position);
    return distance < 1;
};

PathfindingExample.Monster.prototype.move_to = function (target_position) {
    "use strict";
    this.game_state.pathfinding.find_path(this.position, target_position, this.move_through_path, this);
};

PathfindingExample.Monster.prototype.move_through_path = function (path) {
    "use strict";
    if (path !== null) {
        this.path = path;
        this.path_step = 0;
    } else {
        this.path = [];
    }
};
