var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('ground_1x1', '../assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('car', '../assets/car90.png');

}

var map;
var layer1;
var layer2;
// var layer3;
var pathfinder;
var sprite;

 var tileWidth = 32; //tilemap grid cell width
 var tileHeight = 32; //tilemap grid cell height

var marker;
var currentTile = 0;
var currentLayer;
var counter = 0;

var cursors;
var showLayersKey;
var layer1Key;
var layer2Key;
var findPathKey;
var blocked = false;
var car_path = [];
var car_path_step = -1;
var car_x;
var car_y;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#2d2d2d';

    //  Creates a blank tilemap
    map = game.add.tilemap();

    //  Add a Tileset image to the map
    map.addTilesetImage('ground_1x1');

    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
    layer1 = map.create('level1', 25, 20, 32, 32);
    for(var i = 0; i < 25;i++) {
      for(var j = 0; j < 20;j++) {
        map.putTile(0, i, j, layer1);
      }
    }


    //  Resize the world
    layer1.resizeWorld();

    layer2 = map.createBlankLayer('level2', 25, 20, 32, 32);
    map.putTile(4, 5, 5, layer2);
    map.putTile(4, 6, 5, layer2);
    map.putTile(4, 5, 6, layer2);
    map.putTile(4, 5, 7, layer2);
    map.putTile(4, 7, 5, layer2);
    map.putTile(4, 8, 6, layer2);

    // layer3 = map.createBlankLayer('level3', 25, 20, 32, 32);

    currentLayer = layer2;

    map.setCollision(4);
    //  Create our tile selector at the top of the screen
    createTileSelector();

    game.input.addMoveCallback(updateMarker, this);

    cursors = game.input.keyboard.createCursorKeys();

    showLayersKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    layer1Key = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    layer2Key = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    findPathKey = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    moveCar = game.input.keyboard.addKey(Phaser.Keyboard.F);
    moveCarXY = game.input.keyboard.addKey(Phaser.Keyboard.T);

    showLayersKey.onDown.add(keyPress, this);
    layer1Key.onDown.add(keyPress, this);
    layer2Key.onDown.add(keyPress, this);
    findPathKey.onDown.add(keyPress, this);
    moveCar.onDown.add(keyPress, this);
    moveCarXY.onDown.add(keyPress, this);

    console.log(layer1.index);
    console.log(layer2.index);
    // console.log(map.layers); // map.createLayer automatically adds it to a property layers apparently.
    // console.log(layer3.index);
    var walkables = [-1]; // -1 because we're using a layer with no other tiles, so any tile could be an obstacle

    pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    pathfinder.setGrid(map.layers[1].data, walkables); // pass in layer2's data because it's the grid

    sprite = game.add.sprite(50, 50, 'car');
    sprite.anchor.setTo(0.5, 0.5);
    game.physics.enable(sprite);
    sprite.body.setSize(16, 16);

    game.camera.follow(sprite);
}

function keyPress(key) {

    switch (key.keyCode)
    {
        case Phaser.Keyboard.SPACEBAR:
            layer1.alpha = 1;
            layer2.alpha = 1;
            // layer3.alpha = 1;
            break;

        case Phaser.Keyboard.ONE:
            layer1.alpha = 1;
            layer2.alpha = 0.2;
            // layer3.alpha = 0.2;
            break;

        case Phaser.Keyboard.TWO:
            layer1.alpha = 0.2;
            layer2.alpha = 1;
            // layer3.alpha = 0.2;
            break;

        case Phaser.Keyboard.THREE:
            marker.x = layer2.getTileX(game.input.activePointer.worldX) * 32;
            marker.y = layer2.getTileY(game.input.activePointer.worldY) * 32;
            spritex = layer2.getTileX(sprite.x) * 32;
            spritey = layer2.getTileY(sprite.y) * 32;

            blocked = true;
            findPathTo(layer2.getTileX(spritex), layer2.getTileY(spritey), layer2.getTileX(marker.x), layer2.getTileY(marker.y));
            break;

        case Phaser.Keyboard.F:
            marker.x = layer2.getTileX(game.input.activePointer.worldX) * 32;
            marker.y = layer2.getTileY(game.input.activePointer.worldY) * 32;
            blocked = true;
            break;

        case Phaser.Keyboard.T:
            marker.x = layer2.getTileX(game.input.activePointer.worldX) * 32;
            marker.y = layer2.getTileY(game.input.activePointer.worldY) * 32;


            car_x = (layer2.getTileX(sprite.x) * 32);
            car_y = (layer2.getTileY(sprite.y) * 32);
            blocked = true;
            findPathTo(layer2.getTileX(car_x), layer2.getTileY(car_y), layer2.getTileX(marker.x), layer2.getTileY(marker.y));

            moveCarAlongXY();
            break;

        //
        // case Phaser.Keyboard.THREE:
        //     currentLayer = layer3;
        //     layer1.alpha = 0.2;
        //     layer2.alpha = 0.2;
        //     layer3.alpha = 1;
        //     break;
    }

}

function pickTile(sprite, pointer) {

    currentTile = game.math.snapToFloor(pointer.x, 32) / 32;
    console.log(currentTile);
}

function updateMarker() {

    marker.x = currentLayer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = currentLayer.getTileY(game.input.activePointer.worldY) * 32;

    if (game.input.mousePointer.isDown)
    {
        map.putTile(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), currentLayer);
        pathfinder.updateGrid(map.layers[1].data);
        // map.fill(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), 4, 4, currentLayer);
    }

}

function findPathTo(originx, originy, tilex, tiley) {
    pathfinder.setCallbackFunction(function(path) {
        path = path || [];
        for(var i = 0, ilen = path.length; i < ilen; i++) {
            map.putTile(10, path[i].x, path[i].y, layer1);
        }
        car_path = path;
        blocked = false;
    });

    pathfinder.preparePathCalculation([originx,originy], [tilex,tiley]);
    pathfinder.calculatePath();
    // move_through_path(car_path);
}

function update() {

  //car variables
  var next_position, velocity;

  game.physics.arcade.collide(sprite, layer2);
  //
  // sprite.body.velocity.x = 0;
  // sprite.body.velocity.y = 0;
  // sprite.body.angularVelocity = 0;

  if (cursors.left.isDown)
  {
      sprite.body.angularVelocity = -200;
  }
  else if (cursors.right.isDown)
  {
      sprite.body.angularVelocity = 200;
  }

  if (cursors.up.isDown)
  {
      sprite.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(sprite.angle, 300));
  }
  //
  // if (game.input.mousePointer.isDown)
  // {
  //     blocked = true;
  //     findPathTo(layer2.getTileX(marker.x), layer2.getTileY(marker.y));
  // }

  //car movement trigger
  if (car_path.length > 0) {
        next_position = car_path[car_path_step];
        console.log(next_position);
        // if (!reached_target_position(next_position)) {
            if (!reachedXY(next_position)) {
                console.log(reachedXY(next_position));
            // var myNewX = (next_position.x*32 - sprite.x) + 16;
            // var myNewY = (next_position.y*32 - sprite.y) + 16;
            //
            // velocity = new Phaser.Point(myNewX, myNewY);
            // velocity.normalize();
            // console.log(velocity);
            //
            // var moveX = next_position.x * 32;
            // var moveY = next_position.y * 32;
            // sprite.body.velocity.x = velocity.x * 100;
            // sprite.body.velocity.y = velocity.y * 100;
            var moveX = next_position.x * tileWidth + tileWidth / 2;
            var moveY = next_position.y * tileHeight + tileHeight / 2;
            game.physics.arcade.moveToXY(sprite, moveX, moveY);
        } else {
            sprite.body.velocity.x = 0;
            sprite.body.velocity.y = 0;
            sprite.x = (next_position.x * 32) + 16;
            sprite.y = (next_position.y * 32) + 16;

            if (car_path_step < car_path.length - 1) {
                car_path_step += 1;
            } else {
                car_path = [];
                car_path_step = -1;
            }
        }
    }

  // if (car_path.length > 0) {
  //
  //       next_position = car_path[car_path_step];
  //       var moveX = next_position.y * tileWidth + tileWidth / 2;
  //       var moveY = next_position.x * tileHeight + tileHeight / 2;
  //       this.game.physics.arcade.moveToXY(sprite, moveX, moveY, 300);
  //       car_path_step += 1;
  //   } else {
  //       car_path = [];
  //       car_path_step = -1;
  //   }

}

function render() {

    game.debug.text('Current Layer: ' + currentLayer.name, 16, 550);
    game.debug.text('1-2 Switch Layers. SPACE = Show All. Cursors = Move Camera', 16, 570);

}

function createTileSelector() {

    //  Our tile selection window
    var tileSelector = game.add.group();

    var tileSelectorBackground = game.make.graphics();
    tileSelectorBackground.beginFill(0x000000, 0.5);
    tileSelectorBackground.drawRect(0, 0, 800, 34);
    tileSelectorBackground.endFill();

    tileSelector.add(tileSelectorBackground);

    var tileStrip = tileSelector.create(1, 1, 'ground_1x1');
    tileStrip.inputEnabled = true;
    tileStrip.events.onInputDown.add(pickTile, this);

    tileSelector.fixedToCamera = true;

    //  Our painting marker
    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, 32, 32);

}

reached_target_position = function (target_position) {
    "use strict";
    var distance;
    var newTarget = new Phaser.Point((target_position.x*32) + 16, (target_position.y*32) + 16);
    var spritePoint = new Phaser.Point(sprite.x, sprite.y);
    distance = spritePoint.distance(target_position);
    return distance < 16;
};

move_to = function (target_position) {

    "use strict";
    // pathfinding.find_path(spritePoint, target_position, move_through_path, this);
};

move_through_path = function (path) {
    "use strict";
    if (path !== null) {
        car_path = path;
        car_path_step = 1;
    } else {
        car_path = [];
    }
};

moveCarAlongXY = function() {
    "use strict";
    if (car_path !== null) {
        car_path_step = 1;

    } else {
        car_path = [];
    }
};

reachedXY = function(position){
    "use strict";
    console.log(game.physics.arcade.distanceToXY(sprite, (position.x * 32)+16, (position.y * 32)+16));
    if (game.physics.arcade.distanceToXY(sprite, (position.x * 32)+16, (position.y * 32)+16) <= 2) {
        return true;
    } else {
        return false;
    }
};
