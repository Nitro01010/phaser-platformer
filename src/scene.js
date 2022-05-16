import Phaser from "phaser";
var player,
	coins,
	platforms,
	cursors,
	score = 0,
	scoreText,
	acceleration = 750,
	jumpVelocity = -300,
	jumptimer = 0;

export default class gameScene extends Phaser.Scene {
	constructor() {
		super("gameScene");
	}
	preload() {
		this.load.setBaseURL(
			"https://digitherium.com/codepen/phaserplatformer/"
		);
		this.load.image("ground", "platform.jpg");
		this.load.image("coin", "coin.jpg");
		this.load.image("hero", "hero.jpg");
		this.load.image("logo", "digitherium-logo.jpg");
	}

	create() {
		platforms = this.physics.add.staticGroup();

		platforms.create(400, 400, "ground").setScale(2).refreshBody();
		platforms.create(50, 240, "ground");
		platforms.create(750, 140, "ground");

		player = this.physics.add.sprite(100, 350, "hero");

		player.setCollideWorldBounds(true);

		//Set bounce to 0, so our hero just lands directly
		player.setBounce(0);

		//Set top speeds
		player.body.maxVelocity.x = 200;
		player.body.maxVelocity.y = 500;

		//Set gravity
		player.body.setGravityY(300);

		this.physics.world.setBounds(0, 0, 1630, 400);

        this.cameras.main.setBounds(0, 0, 1630, 400);
		this.cameras.main.startFollow(player, true, 0.05, 0, -200, 120);

		cursors = this.input.keyboard.createCursorKeys();

		coins = this.physics.add.group({
			key: "coin",
			repeat: 11,
			setXY: {
				x: 12,
				y: 0,
				stepX: 70,
			},
		});

		coins.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});

		scoreText = this.add.text(16, 16, "score: 0", {
			fontSize: "24px",
			fill: "#fff",
		});

		this.physics.add.collider(player, platforms);
		this.physics.add.collider(coins, platforms);
		this.physics.add.overlap(player, coins, this.collectCoin, null, this);
	}

	update() {
		var standing = player.body.blocked.down || player.body.touching.down;
		//if left key is down then move left
		if (cursors.left.isDown) {
			//if hero is on ground then use full acceleration
			if (standing) {
				player.setAccelerationX(-acceleration);
			}
			//if hero is in the air then accelerate slower
			else {
				player.setAccelerationX(-acceleration / 3);
			}
		}
		//same deal but for right arrow
		else if (cursors.right.isDown) {
			if (standing) {
				player.setAccelerationX(acceleration);
			} else {
				player.setAccelerationX(acceleration / 3);
			}
		}
		//if neither left or right arrow is down then...
		else {
			//if hero is close to having no velocity either left or right then set velocity to 0. This stops jerky back and forth as the hero comes to a halt. i.e. as we slow hero down, below a certain point we just stop them moving altogether as it looks smoother
			if (
				Math.abs(player.body.velocity.x) < 10 &&
				Math.abs(player.body.velocity.x) > -10
			) {
				player.setVelocityX(0);
				player.setAccelerationX(0);
			}
			//if our hero isn't moving left or right then slow them down
			else {
				//this velocity.x check just works out whether we are setting a positive (going right) or negative (going left) number
				player.setAccelerationX(
					((player.body.velocity.x > 0 ? -1 : 1) * acceleration) / 2
				);
			}
		}

		//If player is touching floor and up key is pressed then jump
		if (cursors.up.isDown) {
			if (standing && jumptimer == 0) {
				jumptimer = 1;
				player.setVelocityY(jumpVelocity);
			} else if (jumptimer > 0 && jumptimer < 31) {
				jumptimer++;
				player.setVelocityY(jumpVelocity - jumptimer * 2);
			}
		} else {
			jumptimer = 0;
		}
	}

	collectCoin(player, coin) {
		coin.disableBody(true, true);
		score += 10;
		scoreText.setText("Score: " + score);
	}
}
