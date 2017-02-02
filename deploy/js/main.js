var TowerDefense = TowerDefense || {};

var game = new Phaser.Game(800, 736, Phaser.AUTO);
game.state.add("BootState", new TowerDefense.BootState());
game.state.add("LoadingState", new TowerDefense.LoadingState());
game.state.add("WorldState", new TowerDefense.WorldState());
game.state.start("BootState", true, false, "WorldState");
