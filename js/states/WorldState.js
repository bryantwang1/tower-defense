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
    this.lifeText;
    this.life = 20;
    this.placedWalls = [];
    this.canPlaceWall = false;

    this.marker;
    this.tileDimensions = 48;
    this.currentTile = 0;
    this.currentLayer;

    this.currentControl = 0;

    this.counter = 0;
    this.tickSpawnRate = 15; // standard spawn rate in ticks

    this.cursors;
    this.blocked = false;
    this.monsters;
    // to hold monsters members so we can check them
    this.monsterPath = [];
    this.startX;
    this.startY;
    this.towers;

    // round management properties
    this.roundCounter = 0;
    this.combatPhase = false;
    this.buildPhase = true;

    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 0;

    this.game.stage.backgroundColor = '#2d2d2d';

    // create map and set tileset
    this.map = this.game.add.tilemap();
    this.map.addTilesetImage('tempGround', null, 48, 48, 0, 0, 0);
    this.map.addTilesetImage('tempWall', null, 48, 48, 0, 0, 1);

    // initialize pathfinding
    // this.tileDimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);
    this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);

    // property/variable to hold which gid should be collidable
    this.obstacleTile = 1;
};

TowerDefense.WorldState.prototype.create = function () {
    "use strict";
    //  Creates a new blank layer and sets the map dimensions.
    this.layer1 = this.map.create('level1', 40, 22, 48, 48);
    for(var i = 0; i < 40;i++) {
      for(var j = 0; j < 20;j++) {
        this.map.putTile(0, i, j, this.layer1);
      }
    }

    //  Resize the world
    this.layer1.resizeWorld();

    // Create collision/obstacle layer; extra long X to let enemies go off screen
    this.layer2 = this.map.createBlankLayer('level2', 42, 22, 48, 48);
    // create maze
    for(var i = 0; i < 40;i++) {
      for(var j = 0; j < 20;j++) {

            //create boundaries
            if(i === 0) {
                this.map.putTile(1, i, j, this.layer2);
            }
            if(i === 39) {
                this.map.putTile(1, i, j, this.layer2);
            }
            if(j === 0) {
                this.map.putTile(1, i, j, this.layer2);
            }
            if(j === 19) {
                this.map.putTile(1, i, j, this.layer2);
            }
            if(i === 3 && j !== 1) {
                this.map.putTile(1, i, j, this.layer2);
            }
            if(i === 5 && j !== 18) {
                this.map.putTile(1, i, j, this.layer2);
            }
            if(i === 7 && j !== 1) {
                this.map.putTile(1, i, j, this.layer2);
            }
            if(i === 13 && j !== 18) {
                this.map.putTile(1, i, j, this.layer2);
            }

        // this.map.putTile(0, i, j, this.layer1);
      }
    }

    this.map.putTile(1, 12, 17, this.layer2);
    this.map.putTile(1, 11, 17, this.layer2);
    this.map.putTile(1, 10, 17, this.layer2);
    this.map.putTile(1, 9, 17, this.layer2);
    this.map.putTile(1, 8, 15, this.layer2);
    this.map.putTile(1, 9, 15, this.layer2);
    this.map.putTile(1, 10, 15, this.layer2);
    this.map.putTile(1, 10, 15, this.layer2);
    this.map.putTile(1, 11, 15, this.layer2);
    this.map.putTile(1, 11, 15, this.layer2);
    this.map.putTile(1, 12, 13, this.layer2);
    this.map.putTile(1, 11, 13, this.layer2);
    this.map.putTile(1, 10, 13, this.layer2);
    this.map.putTile(1, 10, 13, this.layer2);
    this.map.putTile(1, 9, 13, this.layer2);
    this.map.putTile(1, 8, 11, this.layer2);
    this.map.putTile(1, 9, 11, this.layer2);
    this.map.putTile(1, 10, 11, this.layer2);
    this.map.putTile(1, 11, 11, this.layer2);
    this.map.putTile(1, 12, 9, this.layer2);
    this.map.putTile(1, 11, 9, this.layer2);
    this.map.putTile(1, 11, 9, this.layer2);
    this.map.putTile(1, 10, 9, this.layer2);
    this.map.putTile(1, 9, 9, this.layer2);
    this.map.putTile(1, 8, 2, this.layer2);
    this.map.putTile(1, 9, 2, this.layer2);
    this.map.putTile(1, 9, 2, this.layer2);
    this.map.putTile(1, 10, 2, this.layer2);
    this.map.putTile(1, 11, 2, this.layer2);
    this.map.putTile(1, 9, 4, this.layer2);
    this.map.putTile(1, 9, 4, this.layer2);
    this.map.putTile(1, 10, 4, this.layer2);
    this.map.putTile(1, 10, 4, this.layer2);
    this.map.putTile(1, 11, 4, this.layer2);
    this.map.putTile(1, 11, 4, this.layer2);
    this.map.putTile(1, 12, 4, this.layer2);
    this.map.putTile(1, 12, 4, this.layer2);
    this.map.putTile(1, 8, 7, this.layer2);
    this.map.putTile(1, 9, 7, this.layer2);
    this.map.putTile(1, 9, 5, this.layer2);
    this.map.putTile(1, 9, 5, this.layer2);
    this.map.putTile(1, 10, 7, this.layer2);
    this.map.putTile(1, 10, 7, this.layer2);
    this.map.putTile(1, 11, 7, this.layer2);
    this.map.putTile(1, 11, 7, this.layer2);
    this.map.putTile(1, 11, 6, this.layer2);
    this.map.putTile(-1, 39, 18, this.layer2);
    this.map.putTile(-1, 0, 1, this.layer2);

    var _this = this;
    this.map.layers[1].data.forEach(function(row) {
        row.forEach(function(tile) {
            if(tile.index === 1) {
                var newPoint = new Phaser.Point(tile.x, tile.y);
                _this.placedWalls.push(newPoint);
            }
        });
    });

    this.currentLayer = this.layer2;
    this.map.setCollision(this.obstacleTile);

    // set starting points for path
    this.startX = this.layer2.getTileX(this.tileDimensions*1.5) * this.tileDimensions;
    this.startY = this.layer2.getTileY(this.tileDimensions*1.5) * this.tileDimensions;
    // set ending points for path
    this.endX = this.layer2.getTileX(this.tileDimensions*1.5 + 1920) * this.tileDimensions;
    this.endY = this.layer2.getTileY(this.tileDimensions*1.5 + 816) * this.tileDimensions;

    //  Create our tile selector at the top of the screen
    this.createControlPanel();
    // this.createTileSelector();

    this.game.input.addMoveCallback(this.updateMarker, this);

    // set grid for pathing
    var walkables = [-1, 0];
    this.pathfinder.setGrid(this.map.layers[1].data, walkables);

    // generate path
    this.findPathTo(this.layer2.getTileX(this.startX), this.layer2.getTileY(this.startY), this.layer2.getTileX(this.endX), this.layer2.getTileY(this.endY));
    // add sprites
    this.monsters = this.game.add.group();
    var _this = this;



    // this.fliers = this.game.add.group()
    // // _this = this;
    // this.game.time.events.loop(1000, function(){
    //   var randomStartY = (Math.floor(Math.random() * 300)) + 200;
    //   var newFlyer = new TowerDefense.Flyer(_this, 48, randomStartY, 'star');
    //   newFlyer.randomEndY = (Math.floor(Math.random() * 300)) + 200;
    //
    //   _this.monsters.add(newFlyer);
    // });
    // var newEnemy = new TowerDefense.Enemy(TowerDefense, 48, 48, 'car');
    // this.monsters.add(newEnemy);
    // var _this = this;
    // this.monsters.forEach(function(monster) { _this.monsterArrays.push(monster) });
    // create groups

    //  make towers
    this.towers = this.game.add.group()

    for(var i=0; i < 2; i++) {
        var newTower = new TowerDefense.Tower(this, this.tileDimensions * 4 - this.tileDimensions/2, this.tileDimensions * 4 + i * this.tileDimensions*2 - this.tileDimensions/2, 'machine-tower', this.tileDimensions * 4, 1000, 3, 600, 'bullet');

        this.towers.add(newTower);
    }


    this.lifeText = game.add.text(16, 16, 'Life: 20', { fontSize: '32px', fill: '#000' });

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
            this.marker.x = this.layer2.getTileX(this.game.input.activePointer.worldX) * this.tileDimensions;
            this.marker.y = this.layer2.getTileY(this.game.input.activePointer.worldY) * this.tileDimensions;

            this.blocked = true;

            // this.moveCarAlongXY();
            break;
    }
}

// TowerDefense.WorldState.prototype.createTileSelector = function() {
//
//     //  Our tile selection window
//     var tileSelector = this.game.add.group();
//
//     var tileSelectorBackground = this.game.make.graphics();
//     tileSelectorBackground.beginFill(0x000000, 0.5);
//     tileSelectorBackground.drawRect(0, 640, 800, 34);
//     tileSelectorBackground.endFill();
//
//     tileSelector.add(tileSelectorBackground);
//
//     var tileStrip = tileSelector.create(1, 641, 'ground_1x1');
//     tileStrip.inputEnabled = true;
//     tileStrip.events.onInputDown.add(this.pickTile, this);
//
//     tileSelector.fixedToCamera = true;
//
//     //  Our painting marker
//     this.marker = this.game.add.graphics();
//     this.marker.lineStyle(2, 0x000000, 1);
//     this.marker.drawRect(0, 0, 32, 32);
//
// }

TowerDefense.WorldState.prototype.createControlPanel = function() {
    var controlPanel = this.game.add.group();

    var controlPanelBackground = this.game.make.graphics();
    controlPanelBackground.beginFill(0x999999, 1);
    controlPanelBackground.drawRect(0, this.tileDimensions*20, 1920, this.tileDimensions*2);
    controlPanelBackground.endFill();

    controlPanel.add(controlPanelBackground);

    controlPanelBackground.inputEnabled = true;
    controlPanelBackground.events.onInputDown.add(this.pickControl, this);


    controlPanel.fixedToCamera = true;

    this.marker = this.game.add.graphics();
    this.marker.lineStyle(2, 0x000000, 1);
    this.marker.drawRect(0, 0, this.tileDimensions, this.tileDimensions);

    var machineGun = controlPanel.create(0 -2, this.tileDimensions*20, 'machine-tower');
    var rocketTower = controlPanel.create(this.tileDimensions -2, this.tileDimensions*20, 'rocket-tower');
    var rocketTower = controlPanel.create(this.tileDimensions*2 -2, this.tileDimensions*20, 'freeze-tower');
    var rocketTower = controlPanel.create(this.tileDimensions*3 -2, this.tileDimensions*20, 'tesla-tower');
}

// TowerDefense.WorldState.prototype.pickTile = function(sprite, pointer) {
//
//     this.currentTile = this.game.math.snapToFloor(pointer.x, this.tileDimensions) / this.tileDimensions;
// }

TowerDefense.WorldState.prototype.createTower = function(controlID, towerX, towerY) {
    var newTower;
    if(controlID === 0) {
        newTower = new TowerDefense.Tower(this, towerX, towerY, 'machine-tower', this.tileDimensions * 4, 1000, 3, 600, 'bullet');
    } else if(controlID === 1) {
        newTower = new TowerDefense.RocketTower(this, towerX, towerY);
    } else if(controlID === 2) {
        newTower = new TowerDefense.FreezeTower(this, towerX, towerY);
    } else if(controlID === 3) {
        newTower = new TowerDefense.TeslaTower(this, towerX, towerY);
    }
    this.towers.add(newTower);
}

TowerDefense.WorldState.prototype.pickControl = function(sprite, pointer) {

    var controlX = this.game.math.snapToFloor(pointer.x, this.tileDimensions) / this.tileDimensions;
    var controlY = this.game.math.snapToFloor(pointer.y, this.tileDimensions) / this.tileDimensions;
    this.currentControl = new Phaser.Point(controlX, controlY);
    //Possibly add Y
    console.log(this.currentControl);
    if(this.currentControl.x === 4) {
        this.counter = 0;
        this.monsters.removeAll(true, true);
        this.roundCounter++;
        this.findPathTo(this.layer2.getTileX(this.startX), this.layer2.getTileY(this.startY), this.layer2.getTileX(this.endX), this.layer2.getTileY(this.endY));
        this.combatPhase = true;
        this.buildPhase = false;
        console.log("round: " +  this.roundCounter);
    } else if (this.currentControl.x === 5) {

        // debugging control
        // var alivers = [];
        // this.monsters.forEachAlive(function(monster) { alivers.push(monster) });
        // console.log(alivers.length);
        // var alls = [];
        // this.monsters.forEach(function(monster) { alls.push(monster) });
        // console.log("alls: " + alls.length);
    }
}

TowerDefense.WorldState.prototype.updateMarker = function() {

    var tileX = this.currentLayer.getTileX(this.game.input.activePointer.worldX);
    var tileY =  this.currentLayer.getTileY(this.game.input.activePointer.worldY);

    this.marker.x = tileX * this.tileDimensions;
    this.marker.y = tileY * this.tileDimensions;

    if (this.game.input.mousePointer.isDown && this.buildPhase && !this.combatPhase && this.marker.y < this.tileDimensions * 20) {
        var placeX = this.marker.x + this.tileDimensions/2;
        var placeY = this.marker.y + this.tileDimensions/2;

        var searchCheck = false;
        this.placedWalls.forEach(function(point) {
            if(point.x === tileX) {
                if(point.y === tileY) {
                    searchCheck = true;
                }
            }
        });

        var _this = this;
        this.towers.forEach(function(tower) {
            if(tower.body.x === _this.marker.x) {
                if(tower.body.y === _this.marker.y) {
                    searchCheck = false;
                }
            }
        });


        if(this.currentControl.x === 0 && this.currentControl.y === 21) {
            this.map.putTile(-2, tileX, tileY, this.layer2);
            this.pathfinder.updateGrid(this.map.layers[1].data);
            this.findPathTo(this.layer2.getTileX(this.startX), this.layer2.getTileY(this.startY), this.layer2.getTileX(this.endX), this.layer2.getTileY(this.endY));

            if(this.monsterPath.length <= 0) {
                this.map.putTile(0, tileX, tileY, this.layer2);
                this.pathfinder.updateGrid(this.map.layers[1].data)
            } else {
                this.map.putTile(1, tileX, tileY, this.layer2);
                this.pathfinder.updateGrid(this.map.layers[1].data);
                var newPoint = new Phaser.Point(tileX, tileY);
                this.placedWalls.push(newPoint);
            }

            console.log("moo");
        } else if(this.currentControl.x >= 0 && this.currentControl.y === 20 && searchCheck) {
            console.log("boo");
            this.createTower(this.currentControl.x, placeX, placeY);
        }
    }
}

TowerDefense.WorldState.prototype.findPathTo = function(originx, originy, tilex, tiley) {
    var _this = this;
    this.pathfinder.setCallbackFunction(function(path) {
        path = path || [];
        // for(var i = 0, ilen = path.length; i < ilen; i++) {
        //     _this.map.putTile(10, path[i].x, path[i].y, _this.layer1);
        // }
        _this.monsterPath = path;
        _this.blocked = false;
    });

    this.pathfinder.preparePathCalculation([originx,originy], [tilex,tiley]);
    this.pathfinder.calculatePath();
}

TowerDefense.WorldState.prototype.update = function () {

    if(this.combatPhase && !this.buildPhase) {
        this.counter++;
        // seems to run ~60 tickets per second
        var _this = this;
        var spawnIntervalCheck = this.counter % this.tickSpawnRate === 0;

        if(this.counter > 0 && this.counter < 200){
            if(spawnIntervalCheck) {
                var newEnemy = new TowerDefense.Enemy(this, 0, this.tileDimensions*1.5, 'runnerBasic');
                newEnemy.setPath(this.monsterPath);
                this.monsters.add(newEnemy);
            }
        }
        if(this.counter > 300 && this.counter < 500){
            if(spawnIntervalCheck) {
                var newEnemy = new TowerDefense.Enemy(this, 0, this.tileDimensions*1.5, 'runnerTank');
                newEnemy.setPath(this.monsterPath);
                this.monsters.add(newEnemy);
            }
        }
        if(this.counter > 500) {
            if(this.monsters.length <= 0) {
                this.combatPhase = false;
                this.buildPhase = true;
            }
        }
    }
    if(this.life <= 0) {
        this.combatPhase = false;
        this.buildPhase = false;
        this.lifeText.text = "Game over, man, game over!";
    }
    // if (!this.combatPhase && this.buildPhase) {

    // }
    // this.monsters.callAll('animations.play', 'animations', 'run');
    // if(this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {

    // }
}
