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
    this.groundTile = 2;
    this.wallTile = 5;
    this.pathfinder;
    this.placedWalls = [];
    this.canPlaceWall = false;

    this.lifeText;
    this.life = 20;
    this.goldText;
    this.gold = 100;

    this.marker;
    this.tileDimensions = 48;
    this.currentTile = 0;
    this.currentLayer;

    this.controlPanel;
    this.currentControl = 0;
    this.markerContent;
    this.invalidTile;
    this.tileIsInvalid;

    this.counter = 0;
    this.tickSpawnRate = 60; // standard spawn rate in ticks
    this.waves;

    this.cursors;
    this.blocked = false;
    this.towers;
    this.monsters;
    // to hold monsters members so we can check them
    this.monsterPath = [];
    this.startX;
    this.startY;

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
    this.map.addTilesetImage('ground_1x1', null, 48, 48);

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
        this.map.putTile(this.groundTile, i, j, this.layer1);
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
                this.map.putTile(this.wallTile, i, j, this.layer2);
            }
            if(i === 39) {
                this.map.putTile(this.wallTile, i, j, this.layer2);
            }
            if(j === 0) {
                this.map.putTile(this.wallTile, i, j, this.layer2);
            }
            if(j === 19) {
                this.map.putTile(this.wallTile, i, j, this.layer2);
            }
            // if(i === 3 && j !== 1) {
            //     this.map.putTile(this.wallTile, i, j, this.layer2);
            // }
            // if(i === 5 && j !== 18) {
            //     this.map.putTile(this.wallTile, i, j, this.layer2);
            // }
            // if(i === 7 && j !== 1) {
            //     this.map.putTile(this.wallTile, i, j, this.layer2);
            // }
            // if(i === 13 && j !== 18) {
            //     this.map.putTile(this.wallTile, i, j, this.layer2);
            // }

        // this.map.putTile(0, i, j, this.layer1);
      }
    }

    // this.map.putTile(this.wallTile, 12, 17, this.layer2);
    // this.map.putTile(this.wallTile, 11, 17, this.layer2);
    // this.map.putTile(this.wallTile, 10, 17, this.layer2);
    // this.map.putTile(this.wallTile, 9, 17, this.layer2);
    // this.map.putTile(this.wallTile, 8, 15, this.layer2);
    // this.map.putTile(this.wallTile, 9, 15, this.layer2);
    // this.map.putTile(this.wallTile, 10, 15, this.layer2);
    // this.map.putTile(this.wallTile, 10, 15, this.layer2);
    // this.map.putTile(this.wallTile, 11, 15, this.layer2);
    // this.map.putTile(this.wallTile, 11, 15, this.layer2);
    // this.map.putTile(this.wallTile, 12, 13, this.layer2);
    // this.map.putTile(this.wallTile, 11, 13, this.layer2);
    // this.map.putTile(this.wallTile, 10, 13, this.layer2);
    // this.map.putTile(this.wallTile, 10, 13, this.layer2);
    // this.map.putTile(this.wallTile, 9, 13, this.layer2);
    // this.map.putTile(this.wallTile, 8, 11, this.layer2);
    // this.map.putTile(this.wallTile, 9, 11, this.layer2);
    // this.map.putTile(this.wallTile, 10, 11, this.layer2);
    // this.map.putTile(this.wallTile, 11, 11, this.layer2);
    // this.map.putTile(this.wallTile, 12, 9, this.layer2);
    // this.map.putTile(this.wallTile, 11, 9, this.layer2);
    // this.map.putTile(this.wallTile, 11, 9, this.layer2);
    // this.map.putTile(this.wallTile, 10, 9, this.layer2);
    // this.map.putTile(this.wallTile, 9, 9, this.layer2);
    // this.map.putTile(this.wallTile, 8, 2, this.layer2);
    // this.map.putTile(this.wallTile, 9, 2, this.layer2);
    // this.map.putTile(this.wallTile, 9, 2, this.layer2);
    // this.map.putTile(this.wallTile, 10, 2, this.layer2);
    // this.map.putTile(this.wallTile, 11, 2, this.layer2);
    // this.map.putTile(this.wallTile, 9, 4, this.layer2);
    // this.map.putTile(this.wallTile, 9, 4, this.layer2);
    // this.map.putTile(this.wallTile, 10, 4, this.layer2);
    // this.map.putTile(this.wallTile, 10, 4, this.layer2);
    // this.map.putTile(this.wallTile, 11, 4, this.layer2);
    // this.map.putTile(this.wallTile, 11, 4, this.layer2);
    // this.map.putTile(this.wallTile, 12, 4, this.layer2);
    // this.map.putTile(this.wallTile, 12, 4, this.layer2);
    // this.map.putTile(this.wallTile, 8, 7, this.layer2);
    // this.map.putTile(this.wallTile, 9, 7, this.layer2);
    // this.map.putTile(this.wallTile, 9, 5, this.layer2);
    // this.map.putTile(this.wallTile, 9, 5, this.layer2);
    // this.map.putTile(this.wallTile, 10, 7, this.layer2);
    // this.map.putTile(this.wallTile, 10, 7, this.layer2);
    // this.map.putTile(this.wallTile, 11, 7, this.layer2);
    // this.map.putTile(this.wallTile, 11, 7, this.layer2);
    // this.map.putTile(this.wallTile, 11, 6, this.layer2);
    this.map.putTile(-1, 39, 18, this.layer2);
    this.map.putTile(-1, 0, 1, this.layer2);

    var _this = this;
    this.map.layers[1].data.forEach(function(row) {
        row.forEach(function(tile) {
            if(tile.index === _this.wallTile) {
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
    var walkables = [-1, this.groundTile];
    this.pathfinder.setGrid(this.map.layers[1].data, walkables);

    // generate path
    this.findPathTo(this.layer2.getTileX(this.startX), this.layer2.getTileY(this.startY), this.layer2.getTileX(this.endX), this.layer2.getTileY(this.endY));
    // add groups
    this.towers = this.game.add.group()
    this.monsters = this.game.add.group();
    var _this = this;

    // for(var i=0; i < 2; i++) {
    //     var newTower = new TowerDefense.Tower(this, this.tileDimensions * 4 - this.tileDimensions/2, this.tileDimensions * 4 + i * this.tileDimensions*2 - this.tileDimensions/2, 'machine-tower', this.tileDimensions * 4, 1000, 3, 600, 'bullet');
    //
    //     this.towers.add(newTower);
    // }

    this.invalidTile = this.game.add.image(-100, -100, 'red');

    this.goldText = game.add.text(this.tileDimensions * 10, this.tileDimensions * 20, '$' + this.gold, { fontSize: '32px', fill: '#000' });
    this.lifeText = game.add.text(this.tileDimensions * 15, this.tileDimensions * 20, '' + this.life, { fontSize: '32px', fill: '#000' });
    this.roundCounterText = game.add.text(this.tileDimensions * 20, this.tileDimensions * 20, 'Round ' + this.roundCounter, { fontSize: '32px', fill: '#000' });

    // Tower Prices
    this.gunTowerText = game.add.text(this.tileDimensions - 32 , this.tileDimensions * 21, TowerDefense.Tower.price, { fontSize: '24px', fill: '#000' });
    this.rocketTowerText = game.add.text(this.tileDimensions + 8, this.tileDimensions * 21, TowerDefense.RocketTower.price, { fontSize: '24px', fill: '#000' });
    this.freezeTowerText = game.add.text(this.tileDimensions *  2 + 8, this.tileDimensions * 21, TowerDefense.FreezeTower.price, { fontSize: '24px', fill: '#000' });
    this.teslaTowerText = game.add.text(this.tileDimensions * 3, this.tileDimensions * 21, TowerDefense.TeslaTower.price, { fontSize: '24px', fill: '#000' });

    this.wallText = game.add.text(this.tileDimensions * 4 + 16, this.tileDimensions * 21, "2", { fontSize: '24px', fill: '#000' });


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
    this.controlPanel = this.game.add.group();

    var controlPanelBackground = this.game.make.graphics();
    controlPanelBackground.beginFill(0x999999, 1);
    controlPanelBackground.drawRect(0, this.tileDimensions*20, 1920, this.tileDimensions*2);
    controlPanelBackground.endFill();

    this.controlPanel.add(controlPanelBackground);

    controlPanelBackground.inputEnabled = true;
    controlPanelBackground.events.onInputDown.add(this.pickControl, this);


    this.controlPanel.fixedToCamera = true;

    this.marker = this.game.add.graphics();
    this.marker.lineStyle(2, 0x000000, 1);
    this.marker.drawRect(0, 0, this.tileDimensions, this.tileDimensions);

    var machineTower = this.controlPanel.create(0 -2, this.tileDimensions*20, 'machine-tower');
    var rocketTower = this.controlPanel.create(this.tileDimensions -2, this.tileDimensions*20, 'rocket-tower');
    var freezeTower = this.controlPanel.create(this.tileDimensions*2 -2, this.tileDimensions*20, 'freeze-tower');
    var teslaTower = this.controlPanel.create(this.tileDimensions*3 -2, this.tileDimensions*20, 'tesla-tower');
    var roundStart = this.controlPanel.create(this.tileDimensions*5 -2, this.tileDimensions*20, 'play');
    var wall = this.controlPanel.create(this.tileDimensions*4 -2, this.tileDimensions*20, 'wall');
    var life = this.controlPanel.create(this.tileDimensions*14 -2, this.tileDimensions*20, 'life');
    var coin = this.controlPanel.create(this.tileDimensions*9 -2, this.tileDimensions*20, 'coin');
    var dollar = this.controlPanel.create(this.tileDimensions*6-2, this.tileDimensions*20, 'gold');
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

    if(this.gold >= newTower.price) {
        this.gold -= newTower.price;
        this.goldText.text = "$" + this.gold;
        this.towers.add(newTower);
    }
}

TowerDefense.WorldState.prototype.pickControl = function(sprite, pointer) {

    var controlX = this.game.math.snapToFloor(pointer.x, this.tileDimensions) / this.tileDimensions;
    var controlY = this.game.math.snapToFloor(pointer.y, this.tileDimensions) / this.tileDimensions;
    this.currentControl = new Phaser.Point(controlX, controlY);
    //Possibly add Y
    console.log(this.currentControl);
    if(this.currentControl.x === 5 && !this.combatPhase && this.buildPhase) {
        this.counter = 0;
        this.monsters.removeAll(true, true);
        this.roundCounter++;
        this.findPathTo(this.layer2.getTileX(this.startX), this.layer2.getTileY(this.startY), this.layer2.getTileX(this.endX), this.layer2.getTileY(this.endY));
        this.combatPhase = true;
        this.buildPhase = false;
        console.log("round: " +  this.roundCounter);
          this.roundCounterText.text ='Round ' + this.roundCounter;
    }

    if(this.markerContent !== undefined) {
      this.markerContent.destroy();
    }

    if(this.currentControl.x === 0 && this.currentControl.y === 20) {
      // this.markerContent = new Phaser.Image(this.game, 500, 500, 'machine-tower');
      this.markerContent = this.game.add.image(this.marker.x, this.marker.y, 'machine-tower');
    } else if(this.currentControl.x === 1) {
      // this.markerContent.destroy();
      this.markerContent = this.game.add.image(this.marker.x, this.marker.y, 'rocket-tower');
    } else if(this.currentControl.x === 2) {
      // this.markerContent.destroy();
      this.markerContent = this.game.add.image(this.marker.x, this.marker.y, 'freeze-tower');
    } else if(this.currentControl.x === 3) {
      // this.markerContent.destroy();
      this.markerContent = this.game.add.image(this.marker.x, this.marker.y, 'tesla-tower');
  } else if(this.currentControl.x === 4) {
      this.markerContent = this.game.add.image(this.marker.x, this.marker.y, 'wall');
  } else if(this.currentControl.x === 6) {
      this.markerContent = this.game.add.image(this.marker.x, this.marker.y, 'gold');
  }
}

TowerDefense.WorldState.prototype.updateMarker = function() {

    var tileX = this.currentLayer.getTileX(this.game.input.activePointer.worldX);
    var tileY =  this.currentLayer.getTileY(this.game.input.activePointer.worldY);

    this.marker.x = tileX * this.tileDimensions;
    this.marker.y = tileY * this.tileDimensions;

    if(this.markerContent !== undefined) {
      this.markerContent.x = this.marker.x;
      this.markerContent.y = this.marker.y;

      if(this.markerContent.y > this.tileDimensions * 19) {
        this.markerContent.x = -100;
        this.markerContent.y = -100;
      }
    }
    // WHY DOESNT THIS WORK BRO
    // if(this.currentControl.x === 0 && this.currentControl.y === 21) {
    //     // this.map.putTile(-2, tileX, tileY, this.layer2);
    //     this.pathfinder.updateGridXY(this.map.layers[1].data, tileX, tileY, this.wallTile, false);
    //
    //     this.findPathTo(this.layer2.getTileX(this.startX), this.layer2.getTileY(this.startY), this.layer2.getTileX(this.endX), this.layer2.getTileY(this.endY));
    //
    //     console.log(this.monsterPath.length);
    //     //restore original tile
    //     this.pathfinder.updateGridXY(this.map.layers[1].data, tileX, tileY, this.wallTile, true);
    //
    //     if(this.monsterPath.length <= 0) {
    //         this.tileIsInvalid = true;
    //     } else {
    //         this.tileIsInvalid = false;
    //     }
    // }

    if (this.game.input.mousePointer.isDown && this.buildPhase && !this.combatPhase && this.marker.y < this.tileDimensions * 20) {
        var placeX = this.marker.x + this.tileDimensions/2;
        var placeY = this.marker.y + this.tileDimensions/2;

        var towerCheck = false;
        var wallCheck = true;
        this.placedWalls.forEach(function(point) {
            if(point.x === tileX) {
                if(point.y === tileY) {
                    towerCheck = true;
                    wallCheck = false;
                }
            }
        });

        var _this = this;
        this.towers.forEach(function(tower) {
            if(tower.body.x === _this.marker.x) {
                if(tower.body.y === _this.marker.y) {
                    towerCheck = false;
                }
            }
        });

        if(this.currentControl.x === 4 && this.currentControl.y === 20 && wallCheck) {
            if(this.gold >= 2) {
                this.gold -= 2;
                this.goldText.text = "$ " + this.gold;
                this.map.putTile(-2, tileX, tileY, this.layer2);
                this.pathfinder.updateGrid(this.map.layers[1].data);
                this.findPathTo(this.layer2.getTileX(this.startX), this.layer2.getTileY(this.startY), this.layer2.getTileX(this.endX), this.layer2.getTileY(this.endY));

                if(this.monsterPath.length <= 0) {
                    //restore original tile
                    this.map.putTile(this.groundTile, tileX, tileY, this.layer2);
                    this.pathfinder.updateGrid(this.map.layers[1].data);
                } else {
                    this.map.putTile(this.wallTile, tileX, tileY, this.layer2);
                    this.pathfinder.updateGrid(this.map.layers[1].data);
                    var newPoint = new Phaser.Point(tileX, tileY);
                    this.placedWalls.push(newPoint);
                }
                console.log("moo");
            }
        } else if(this.currentControl.x >= 0 && this.currentControl.x < 4 && this.currentControl.y === 20 && towerCheck) {
            console.log("boo");
            this.createTower(this.currentControl.x, placeX, placeY);
        } else if(this.currentControl.x === 6) {
            var isTower = false;
            this.towers.forEach(function(tower) {
                if(tower.body.x === _this.marker.x) {
                    if(tower.body.y === _this.marker.y) {
                        isTower = true;
                        _this.gold += Math.floor(tower.price/2);
                        _this.goldText.text = "$" + _this.gold;
                        tower.destroy();
                    } else {
                        isTower = false;
                    }
                } else {
                    isTower = false;
                }
            });

            if(!isTower) {
                if(tileX !== 0 && tileX !== 39 && tileY !== 0 && tileY !== 19) {
                    this.map.putTile(this.groundTile, tileX, tileY, this.layer2);
                    this.pathfinder.updateGrid(this.map.layers[1].data);
                    for(var i=0;i < this.placedWalls.length;i++) {
                        var wall = this.placedWalls[i];
                        if(wall.x === tileX && wall.y === tileY) {
                            this.placedWalls.splice(i, 1);
                            this.gold++;
                            this.goldText.text = "$" + this.gold;
                        }
                    }
                }
            }
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


this.waves = [];
TowerDefense.WorldState.prototype.generateWaves = function() {
    var modifiedSpawn = this.tickSpawnRate/(this.roundCounter/4);
    if(modifiedSpawn < 10) {
        modifiedSpawn = 10;
    }
    var spawnIntervalCheck = this.counter % modifiedSpawn === 0;
    var tankSpawnInterval = this.counter % (modifiedSpawn/2) === 0;
    var waveLength = 100 * this.roundCounter/2;
    var waveGap = 100 * this.roundCounter/2;

    if(this.counter > 1 && this.counter < waveGap + waveLength){
        if(spawnIntervalCheck) {
            var newEnemy = new TowerDefense.Enemy(this, 0, this.tileDimensions*1.5, 'runnerBasic_2', 1, 200, 25);

            newEnemy.setPath(this.monsterPath);
            this.monsters.add(newEnemy);

            newEnemy.animations.add('run', [0,1,2,3,4], false);
            newEnemy.animations.play('run', 10, true);

        }
    }
    if(this.counter > waveGap*1.2 && this.counter < waveGap*1.2+ waveLength){
        if(tankSpawnInterval) {
            var newEnemy = new TowerDefense.Enemy(this, 0, this.tileDimensions*1.5, 'runnerTank', 5, 100, 75);
            newEnemy.setPath(this.monsterPath);
            this.monsters.add(newEnemy);

            newEnemy.animations.add('run', [0,1,2], false);
            newEnemy.animations.play('run', 7, true);
        }
    }

    // _this = this;
    if(this.counter > waveGap*1.1 && this.counter < waveGap*1.1 + waveLength) {
        if(spawnIntervalCheck) {
            var randomStartY = (Math.floor(Math.random() * 250)) + 50;
            var newFlyer = new TowerDefense.Flyer(this, 48, randomStartY);
            newFlyer.randomEndY = (Math.floor(Math.random() * 250)) + 600;

            this.monsters.add(newFlyer);

            newFlyer.animations.add('run', [0,1,2], false);
            newFlyer.animations.play('run', 10, true);
        }
    };

}

TowerDefense.WorldState.prototype.generateWaves2 = function () {
    var modifiedSpawn = this.tickSpawnRate - this.roundCounter*2;
    if(modifiedSpawn < 15) {
        modifiedSpawn = 15;
    }
    var spawnIntervalCheck = this.counter % modifiedSpawn === 0;
    var tankSpawnInterval = this.counter % (modifiedSpawn*2) === 0;
    var waveLength = 100 + this.roundCounter * 50;
    var waveGap = 200 + this.roundCounter * 20;
    var healthBonus = this.roundCounter * 5 + this.roundCounter;

    if(this.counter > 1 && this.counter < waveGap + waveLength){
        if(spawnIntervalCheck) {
            var newEnemy = new TowerDefense.Enemy(this, 0, this.tileDimensions*1.5, 'runnerBasic_2', 1, 200, 25 + healthBonus);

            newEnemy.setPath(this.monsterPath);
            this.monsters.add(newEnemy);

            newEnemy.animations.add('run', [0,1,2,3,4], false);
            newEnemy.animations.play('run', 10, true);

        }
    }
    if(this.counter > waveGap + 200 && this.counter < waveGap + 200 + waveLength){
        if(tankSpawnInterval) {
            var newEnemy = new TowerDefense.Enemy(this, 0, this.tileDimensions*1.5, 'runnerTank', 5, 100, 75 + healthBonus);
            newEnemy.setPath(this.monsterPath);
            this.monsters.add(newEnemy);

            newEnemy.animations.add('run', [0,1,2], false);
            newEnemy.animations.play('run', 7, true);
        }
    }

    // _this = this;
    if(this.counter > waveGap + 100 && this.counter < waveGap + 100 + waveLength && this.roundCounter > 5) {
        if(tankSpawnInterval) {
            var randomStartY = (Math.floor(Math.random() * 250)) + 50;
            var newFlyer = new TowerDefense.Flyer(this, 48, randomStartY);
            newFlyer.randomEndY = (Math.floor(Math.random() * 250)) + 600;

            this.monsters.add(newFlyer);

            newFlyer.animations.add('run', [0,1,2], false);
            newFlyer.animations.play('run', 10, true);
        }
    };
}

TowerDefense.WorldState.prototype.update = function () {

    if(this.combatPhase && !this.buildPhase) {
        this.counter++;
        // seems to run ~60 tickets per second
        var _this = this;
        this.generateWaves2();

        if(this.counter > 500) {
            if(this.monsters.length <= 0) {
                this.gold += this.roundCounter * 10;
                this.goldText.text = "$ " + this.gold;
                this.combatPhase = false;
                this.buildPhase = true;
            }
        }
    }
    if(this.life <= 0) {
        this.combatPhase = false;
        this.buildPhase = false;
        this.lifeText.text = "Game Over!";
    }

    // console.log(this.tileIsInvalid);
    // if (!this.combatPhase && this.buildPhase) {
    //   if(!this.tileIsInvalid) {
    //     this.invalidTile.x = -100;
    //     this.invalidTile.y = -100;
    //   } else {
    //     this.invalidTile.x = this.marker.x;
    //     this.invalidTile.y = this.marker.y;
    //   }
    // }
    // this.monsters.callAll('animations.play', 'animations', 'run');
    // if(this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {

    // }
}
