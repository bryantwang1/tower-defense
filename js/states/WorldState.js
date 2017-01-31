var PathfindingExample = PathfindingExample || {};

PathfindingExample.WorldState = function () {
    "use strict";
    Phaser.State.call(this);

    // this.prefab_classes = {
    //     "player": PathfindingExample.Player.prototype.constructor
    // };
};

PathfindingExample.WorldState.prototype = Object.create(Phaser.State.prototype);
PathfindingExample.WorldState.prototype.constructor = PathfindingExample.WorldState;

PathfindingExample.WorldState.prototype.init = function () {
    "use strict";
    // list properties we'll need
    this.map;
    this.layer1;
    this.layer2;
    this.pathfinder;
    this.sprite;

    this.marker;
    this.tileDimensions = 32;
    this.currentTile = 0;
    this.currentLayer;
    this.counter = 0;

    this.cursors;
    this.blocked = false;
    this.car_path = [];
    this.car_path_step = -1;
    this.car_x;
    this.car_y;

    // load assets
    // this.game.load.image('ground_1x1', '../assets/tilemaps/tiles/ground_1x1.png');
    // this.game.load.image('car', '../assets/car90.png');

    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 0;

    this.game.stage.backgroundColor = '#2d2d2d';

    // create map and set tileset
    this.map = this.game.add.tilemap();
    this.map.addTilesetImage('ground_1x1');

    // initialize pathfinding
    // this.tileDimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);
    this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);

    // property/variable to hold which gid should be collidable
    this.obstacleTile = 4;
};

PathfindingExample.WorldState.prototype.create = function () {
    "use strict";
    //  Creates a new blank layer and sets the map dimensions.
    this.layer1 = this.map.create('level1', 25, 20, 32, 32);
    for(var i = 0; i < 25;i++) {
      for(var j = 0; j < 20;j++) {
        this.map.putTile(0, i, j, this.layer1);
      }
    }

    //  Resize the world
    this.layer1.resizeWorld();

    // Create collision/obstacle layer
    this.layer2 = this.map.createBlankLayer('level2', 25, 20, 32, 32);
    // insert maze

    this.currentLayer = this.layer2;
    this.map.setCollision(this.obstacleTile);

    //  Create our tile selector at the top of the screen
    this.createTileSelector();

    this.game.input.addMoveCallback(this.updateMarker, this);

    // set grid for pathing
    var walkables = [-1];
    this.pathfinder.setGrid(this.map.layers[1].data, walkables);

    // add sprite
    this.sprite = game.add.sprite(50, 50, 'car');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.sprite);
    this.sprite.body.setSize(32, 32);

    this.game.camera.follow(this.sprite);

    // create groups
    this.groups = {};
    this.prefabs = {};

    // add input and keybindings
    this.cursors = game.input.keyboard.createCursorKeys();

    this.moveCarXY = game.input.keyboard.addKey(Phaser.Keyboard.T);
    this.moveCarXY.onDown.add(this.keyPress, this);
};

PathfindingExample.WorldState.prototype.keyPress = function(key) {

    switch (key.keyCode)
    {
        case Phaser.Keyboard.T:
            this.marker.x = this.layer2.getTileX(this.game.input.activePointer.worldX) * 32;
            this.marker.y = this.layer2.getTileY(this.game.input.activePointer.worldY) * 32;


            this.car_x = (this.layer2.getTileX(this.sprite.x) * 32);
            this.car_y = (this.layer2.getTileY(this.sprite.y) * 32);
            this.blocked = true;
            this.findPathTo(this.layer2.getTileX(this.car_x), this.layer2.getTileY(this.car_y), this.layer2.getTileX(this.marker.x), this.layer2.getTileY(this.marker.y));

            this.moveCarAlongXY();
            break;
    }
}

PathfindingExample.WorldState.prototype.createTileSelector = function() {

    //  Our tile selection window
    var tileSelector = this.game.add.group();

    var tileSelectorBackground = this.game.make.graphics();
    tileSelectorBackground.beginFill(0x000000, 0.5);
    tileSelectorBackground.drawRect(0, 0, 800, 34);
    tileSelectorBackground.endFill();

    tileSelector.add(tileSelectorBackground);

    var tileStrip = tileSelector.create(1, 1, 'ground_1x1');
    tileStrip.inputEnabled = true;
    tileStrip.events.onInputDown.add(this.pickTile, this);

    tileSelector.fixedToCamera = true;

    //  Our painting marker
    this.marker = this.game.add.graphics();
    this.marker.lineStyle(2, 0x000000, 1);
    this.marker.drawRect(0, 0, 32, 32);

}

PathfindingExample.WorldState.prototype.pickTile = function(sprite, pointer) {

    this.currentTile = this.game.math.snapToFloor(pointer.x, 32) / 32;
    console.log(this.currentTile);
}

PathfindingExample.WorldState.prototype.updateMarker = function() {

    this.marker.x = this.currentLayer.getTileX(this.game.input.activePointer.worldX) * 32;
    this.marker.y = this.currentLayer.getTileY(this.game.input.activePointer.worldY) * 32;

    if (this.game.input.mousePointer.isDown)
    {
        this.map.putTile(this.currentTile, this.currentLayer.getTileX(this.marker.x), this.currentLayer.getTileY(this.marker.y), this.currentLayer);
        this.pathfinder.updateGrid(this.map.layers[1].data);
        // map.fill(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), 4, 4, currentLayer);
    }
}

PathfindingExample.WorldState.prototype.findPathTo = function(originx, originy, tilex, tiley) {
    var _this = this;
    this.pathfinder.setCallbackFunction(function(path) {
        path = path || [];
        for(var i = 0, ilen = path.length; i < ilen; i++) {
            _this.map.putTile(10, path[i].x, path[i].y, _this.layer1);
        }
        _this.car_path = path;
        _this.blocked = false;
    });

    this.pathfinder.preparePathCalculation([originx,originy], [tilex,tiley]);
    this.pathfinder.calculatePath();
}

PathfindingExample.WorldState.prototype.update = function () {
    //car variables
    var next_position;

    this.game.physics.arcade.collide(this.sprite, this.layer2);

    //car movement trigger
    if (this.car_path.length > 0) {
        next_position = this.car_path[this.car_path_step];

        if (!this.reachedXY(next_position)) {
            var moveX = (next_position.x * 32) + 16;
            var moveY = (next_position.y * 32) + 16;
            this.game.physics.arcade.moveToXY(this.sprite, moveX, moveY);
        } else {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            this.sprite.x = (next_position.x * 32) + 16;
            this.sprite.y = (next_position.y * 32) + 16;

            if (this.car_path_step < this.car_path.length - 1) {
                this.car_path_step += 1;
            } else {
                this.car_path = [];
                this.car_path_step = -1;
            }
        }
    }
}

PathfindingExample.WorldState.prototype.moveCarAlongXY = function() {
    "use strict";
    if (this.car_path !== null) {
        this.car_path_step = 1;

    } else {
        this.car_path = [];
    }
};

PathfindingExample.WorldState.prototype.reachedXY = function(position){
    "use strict";
    if (this.game.physics.arcade.distanceToXY(this.sprite, (position.x * 32)+16, (position.y * 32)+16) <= 2) {
        return true;
    } else {
        return false;
    }
};
