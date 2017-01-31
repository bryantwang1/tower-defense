"use strict";
window.Pathfinding.state.menu = {
    create: function() {
        //create objects
        this.tiles = mt.create("tiles");
        this.ball = mt.create("ball");

        var wallTiles = 2; //index of tiles which are considered as walls
        this.tileWidth = this.tiles.map.tileWidth; //tilemap grid cell width
        this.tileHeight = this.tiles.map.tileHeight; //tilemap grid cell height
        this.x = 0; //x coordinates for moving the ball
        this.y = 0; //y coordinates for moving the ball
        this.temp; //variable for storing the next tile to move towards
        this.drawList;
        this.isMoving = false;

        //converts Phaser tilemap data into a 2D array usable by the A* algorithm, e.g.
        //[1,1,1,1,1]
        //[1,1,0,1,1]
        //[1,1,0,1,1]
        //[1,1,0,1,1]
        //[1,1,1,1,1]
        //where 0=wall and 1=walkable node
        var data = this.tiles.map.layer.data;
        var rawGrid = [];
        for (var i = 0; i < data.length; i++) {
            rawGrid[i] = [];
            for (var j = 0; j < data[i].length; j++) {
                if (data[i][j].index === wallTiles) rawGrid[i][j] = 0;
                else rawGrid[i][j] = 1;
            }
        }

        this.graph = new Graph(rawGrid); //creates a graph for the a* algorithm

        //on mouse click moves the ball to the clicked tile
        this.input.onDown.add(function() {
            if (this.isMoving) {
                this.stopPath(this.ball);
                this.erasePath();
            }
            this.getPath(this.ball, this.input.activePointer);
        }, this);
    },


    update: function() {
        //if movement flag is true, the ball continues to move
        if (this.isMoving) {
            this.traversePath(this.ball);
        }
    },

    //calculates shortest available path and gives the result as an array of tile coordinates
    getPath: function(sprite, mouse) {
        var start = this.graph.grid[Math.floor(sprite.y / this.tileHeight)][Math.floor(sprite.x / this.tileWidth)];
        var end = this.graph.grid[Math.floor(mouse.y / this.tileHeight)][Math.floor(mouse.x / this.tileWidth)];
        this.result = astar.search(this.graph, start, end);
        this.drawPath();
        this.isMoving = true;
    },

    traversePath: function(sprite) {
        //if this is the first time calling this function for the current path or one tile has already been traversed,
        //gets the coordinates of the next tile with result.shift() as in a FIFO structure
        //if the result array has been emptied, stops the pathwalking
        if (!this.temp || this.game.physics.arcade.distanceToXY(sprite, this.x, this.y) <= 4) {
            if (!this.result.length) {
                this.stopPath(sprite);
                this.erasePath();
                return;
            } else {
                this.temp = this.result.shift();

                //calculates the x and y coordinates towards which to move the ball
                this.x = this.temp.y * this.tileWidth + this.tileWidth / 2;
                this.y = this.temp.x * this.tileHeight + this.tileHeight / 2;
            }
        }
        //moves the ball
        //the ball DOES NOT stop moving once it has reached its goal, hence the distanceToXY()<=4 above
        //moveToXY(object to move, where to move X, where to move Y, speed);
        this.game.physics.arcade.moveToXY(sprite, this.x, this.y, 300);
    },

    //empties the temp variable and flags movement as false, thus preventing the execution of other functions
    stopPath: function(sprite) {
        this.isMoving = false;
        this.temp = null;
        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;
    },

    //draws the path by creating sprites within an array (for more convenient destroying
    drawPath: function() {
        this.drawList = [];
        for (var i = 0, l = this.result.length - 1; i <= l; i++) {
            if (i < l) this.drawList.push(this.game.add.sprite(this.result[i].y * this.tileHeight, this.result[i].x * this.tileWidth, '/pathPoint.png'));
            else this.drawList.push(this.game.add.sprite(this.result[i].y * this.tileHeight, this.result[i].x * this.tileWidth, '/pathFinish.png'));

        }
        this.ball.bringToTop();
    },

    //destroys path visuals
    erasePath: function() {
        for (var i = 0; i < this.drawList.length; i++) {
            this.drawList[i].destroy();
        }
        this.list = null;
	}
};
