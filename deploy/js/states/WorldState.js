var TowerDefense = TowerDefense || {};

TowerDefense.WorldState = function () {
    "use strict";
    Phaser.State.call(this);

    // this.prefab_classes = {
    //     "player": TowerDefense.Player.prototype.constructor
    // };
};

TowerDefense.WorldState.prototype = Object.create(Phaser.State.prototype);
TowerDefense.WorldState.prototype.constructor = TowerDefense.WorldState;

TowerDefense.WorldState.prototype.init = function () {
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
    this.monsters;
    // to hold monsters members so we can check them
    this.monsterArrays = [];
    this.car_path = [];
    this.car_path_step = -1;
    this.startX;
    this.startY;
    this.carLastOrientation = 0;

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

TowerDefense.WorldState.prototype.create = function () {
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
    // create maze
    for(var i = 0; i < 25;i++) {
      for(var j = 0; j < 20;j++) {

            //create boundaries
            if(i === 0) {
                this.map.putTile(4, i, j, this.layer2);
            }
            if(i === 24) {
                this.map.putTile(4, i, j, this.layer2);
            }
            if(j === 0) {
                this.map.putTile(4, i, j, this.layer2);
            }
            if(j === 19) {
                this.map.putTile(4, i, j, this.layer2);
            }
            if(i === 3 && j !== 1) {
                this.map.putTile(4, i, j, this.layer2);
            }
            if(i === 5 && j !== 18) {
                this.map.putTile(4, i, j, this.layer2);
            }
            if(i === 7 && j !== 1) {
                this.map.putTile(4, i, j, this.layer2);
            }
            if(i === 13 && j !== 18) {
                this.map.putTile(4, i, j, this.layer2);
            }

        this.map.putTile(0, i, j, this.layer1);
      }
    }

    this.map.putTile(4, 12, 17, this.layer2);
    this.map.putTile(4, 11, 17, this.layer2);
    this.map.putTile(4, 10, 17, this.layer2);
    this.map.putTile(4, 9, 17, this.layer2);
    this.map.putTile(4, 8, 15, this.layer2);
    this.map.putTile(4, 9, 15, this.layer2);
    this.map.putTile(4, 10, 15, this.layer2);
    this.map.putTile(4, 10, 15, this.layer2);
    this.map.putTile(4, 11, 15, this.layer2);
    this.map.putTile(4, 11, 15, this.layer2);
    this.map.putTile(4, 12, 13, this.layer2);
    this.map.putTile(4, 11, 13, this.layer2);
    this.map.putTile(4, 10, 13, this.layer2);
    this.map.putTile(4, 10, 13, this.layer2);
    this.map.putTile(4, 9, 13, this.layer2);
    this.map.putTile(4, 8, 11, this.layer2);
    this.map.putTile(4, 9, 11, this.layer2);
    this.map.putTile(4, 10, 11, this.layer2);
    this.map.putTile(4, 11, 11, this.layer2);
    this.map.putTile(4, 12, 9, this.layer2);
    this.map.putTile(4, 11, 9, this.layer2);
    this.map.putTile(4, 11, 9, this.layer2);
    this.map.putTile(4, 10, 9, this.layer2);
    this.map.putTile(4, 9, 9, this.layer2);
    this.map.putTile(4, 8, 2, this.layer2);
    this.map.putTile(4, 9, 2, this.layer2);
    this.map.putTile(4, 9, 2, this.layer2);
    this.map.putTile(4, 10, 2, this.layer2);
    this.map.putTile(4, 11, 2, this.layer2);
    this.map.putTile(4, 9, 4, this.layer2);
    this.map.putTile(4, 9, 4, this.layer2);
    this.map.putTile(4, 10, 4, this.layer2);
    this.map.putTile(4, 10, 4, this.layer2);
    this.map.putTile(4, 11, 4, this.layer2);
    this.map.putTile(4, 11, 4, this.layer2);
    this.map.putTile(4, 12, 4, this.layer2);
    this.map.putTile(4, 12, 4, this.layer2);
    this.map.putTile(4, 8, 7, this.layer2);
    this.map.putTile(4, 9, 7, this.layer2);
    this.map.putTile(4, 9, 5, this.layer2);
    this.map.putTile(4, 9, 5, this.layer2);
    this.map.putTile(4, 10, 7, this.layer2);
    this.map.putTile(4, 10, 7, this.layer2);
    this.map.putTile(4, 11, 7, this.layer2);
    this.map.putTile(4, 11, 7, this.layer2);
    this.map.putTile(4, 11, 6, this.layer2);

    this.currentLayer = this.layer2;
    this.map.setCollision(this.obstacleTile);

    //  Create our tile selector at the top of the screen
    this.createTileSelector();

    this.game.input.addMoveCallback(this.updateMarker, this);

    // set grid for pathing
    var walkables = [-1, 0];
    this.pathfinder.setGrid(this.map.layers[1].data, walkables);

    // add sprites
    this.monsters = this.game.add.group();
    var _this = this;
    this.game.time.events.loop(250, function(){
      var newEnemy = new TowerDefense.Enemy(TowerDefense, 48, 48, 'car');
      _this.monsters.add(newEnemy);
      _this.monsters.forEach(function(monster) { _this.monsterArrays.push(monster) });
    });
    // var newEnemy = new TowerDefense.Enemy(TowerDefense, 48, 48, 'car');
    // this.monsters.add(newEnemy);
    // var _this = this;
    // this.monsters.forEach(function(monster) { _this.monsterArrays.push(monster) });
    // create groups
    this.groups = {};
    this.prefabs = {};

    // add input and keybindings
    this.cursors = game.input.keyboard.createCursorKeys();

    this.moveCarXY = game.input.keyboard.addKey(Phaser.Keyboard.T);
    this.moveCarXY.onDown.add(this.keyPress, this);
};

TowerDefense.WorldState.prototype.keyPress = function(key) {

    switch (key.keyCode)
    {
        case Phaser.Keyboard.T:
        //find path
            this.marker.x = this.layer2.getTileX(this.game.input.activePointer.worldX) * 32;
            this.marker.y = this.layer2.getTileY(this.game.input.activePointer.worldY) * 32;

            this.startX = (this.layer2.getTileX(48) * 32);
            this.startY = (this.layer2.getTileY(48) * 32);
            this.blocked = true;
            this.findPathTo(this.layer2.getTileX(this.startX), this.layer2.getTileY(this.startY), this.layer2.getTileX(this.marker.x), this.layer2.getTileY(this.marker.y));

            // this.moveCarAlongXY();
            break;
    }
}

TowerDefense.WorldState.prototype.createTileSelector = function() {

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

TowerDefense.WorldState.prototype.pickTile = function(sprite, pointer) {

    this.currentTile = this.game.math.snapToFloor(pointer.x, 32) / 32;
}

TowerDefense.WorldState.prototype.updateMarker = function() {

    this.marker.x = this.currentLayer.getTileX(this.game.input.activePointer.worldX) * 32;
    this.marker.y = this.currentLayer.getTileY(this.game.input.activePointer.worldY) * 32;

    if (this.game.input.mousePointer.isDown)
    {
        this.map.putTile(this.currentTile, this.currentLayer.getTileX(this.marker.x), this.currentLayer.getTileY(this.marker.y), this.currentLayer);
        this.pathfinder.updateGrid(this.map.layers[1].data);

        var xPlace = this.currentLayer.getTileX(this.marker.x);
        var yPlace = this.currentLayer.getTileY(this.marker.y)

        // map.fill(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), 4, 4, currentLayer);
    }
}

TowerDefense.WorldState.prototype.findPathTo = function(originx, originy, tilex, tiley) {
    var _this = this;
    this.pathfinder.setCallbackFunction(function(path) {
        path = path || [];
        for(var i = 0, ilen = path.length; i < ilen; i++) {
            _this.map.putTile(10, path[i].x, path[i].y, _this.layer1);
        }
        _this.car_path = path;
        _this.monsters.setAll('path', _this.car_path);
        _this.blocked = false;
    });

    this.pathfinder.preparePathCalculation([originx,originy], [tilex,tiley]);
    this.pathfinder.calculatePath();
}

TowerDefense.WorldState.prototype.update = function () {

}



// ENEMY STUFF from -- http://blog.intracto.com/create-fun-and-interactive-games-with-javascript-using-phaser.io

// this.monsters;
// function create() {
//     …
//
//     // Enemies
//     this.monsters = game.add.group();
//     game.time.events.loop(250, function(){
//         var enemy = new Enemy(game.world.randomX, game.world.randomY, 'enemy');
//         enemyGroup.add(enemy);
//     });
// }

// function update() {
//     …
//
//     // Collision detection
//     game.physics.arcade.overlap(character, enemyGroup, collisionHandler, null, this);
// }
// this.sprite = game.add.sprite(50, 50, 'car'); // standard car sprite
TowerDefense.Enemy = function (parentState, posX, posY, sprite) {
    Phaser.Sprite.call(this, game, posX, posY, sprite);
    this.outOfBoundsKill = true;
    this.collisionEnabled = false;
    this.game.physics.arcade.enable(this, true);
    this.anchor.setTo(0.5, 0.5);
    this.body.setSize(16, 16);

    this.path = [];
    this.pathStep = -1;
    this.counter = 0;
    this.lastRotation = 0;
}

TowerDefense.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
TowerDefense.Enemy.prototype.constructor = TowerDefense.Enemy;

// TowerDefense.Enemy.prototype.create = function () {
//
// }

TowerDefense.Enemy.prototype.update = function () {
  //car variables
  var next_position;
  this.counter++;

  this.game.physics.arcade.collide(this, TowerDefense.layer2);

  //car movement trigger
  if (this.path.length > 0) {
      if(this.pathStep < 0)
      this.pathStep = 1;
      next_position = this.path[this.pathStep];

      if (!this.reachedXY(next_position)) {
          var moveX = (next_position.x * 32) + 16;
          var moveY = (next_position.y * 32) + 16;
          this.game.physics.arcade.moveToXY(this, moveX, moveY, 100);
      } else {
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;
          this.x = (next_position.x * 32) + 16;
          this.y = (next_position.y * 32) + 16;

          if (this.pathStep < this.path.length - 1) {
              this.pathStep += 1;
          } else {
              this.path = [];
              this.pathStep = -1;
          }
      }
  } else {
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
  }
  if(this.counter % 3 === 0) {
    if(this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.rotation = this.lastRotation;
    } else if(this.body.velocity.x > 20) {
      this.rotation = 0;
      this.lastRotation = 0;
    } else if(this.body.velocity.y > 20) {
      this.rotation = 1.57;
      this.lastRotation = 1.57;
    } else if(this.body.velocity.x < -20) {
      this.rotation = 3.14;
      this.lastRotation = 3.14;
    } else if(this.body.velocity.y < -20) {
      this.rotation = 4.71;
      this.lastRotation = 4.71;
    } else {
      this.rotation = 0;
    }
  }
}

TowerDefense.Enemy.prototype.moveAlongXY = function() {
    "use strict";
    if (this.path !== null) {
        this.pathStep = 1;
    } else {
        this.path = [];
    }
};

TowerDefense.Enemy.prototype.reachedXY = function(position){
    "use strict";
    if (this.game.physics.arcade.distanceToXY(this, (position.x * 32)+16, (position.y * 32)+16) <= 3) {
        return true;
    } else {
        return false;
    }
};
