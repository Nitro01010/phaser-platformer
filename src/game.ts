// import Phaser from "phaser";
import gameScene from "./scene.js";
import startScreen from "./startScreen.js";
import endScreen from "./endScreen.js";
var config = {
	type: Phaser.AUTO,
	width: 960,
	maxLights: 50,
	height: 640,
	fps: {
		target: 20,
		setTimeout: true,
	},
	transparent: false,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 300 },
			debug: true,
		},
	},
	scene: [startScreen, gameScene, endScreen],
};

var game = new Phaser.Game(config);