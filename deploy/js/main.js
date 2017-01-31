var PathfindingExample = PathfindingExample || {};

var game = new Phaser.Game(800, 600, Phaser.AUTO);
game.state.add("BootState", new PathfindingExample.BootState());
game.state.add("LoadingState", new PathfindingExample.LoadingState());
game.state.add("WorldState", new PathfindingExample.WorldState());
game.state.start("BootState", true, false, "WorldState");
