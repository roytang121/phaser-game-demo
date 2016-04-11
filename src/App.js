import React, { Component } from 'react';

export default class App extends Component {
  constructor(props) {
    super(props)

    this.game = null;
    this.player = null;
    this.platforms = null;
    this.cursors = null;

  }
  componentDidMount() {
    console.log("onComponentDidMount");

    // 4th argument is the DOM id to be inserted in, default appending to body
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
      preload: this.preload.bind(this),
      create: this.create.bind(this),
      update: this.update.bind(this)
    });
  }

  preload() {
    console.log("onPreload");

    this.game.load.image('sky', 'assets/img/sky.png');
    this.game.load.image('ground', 'assets/img/platform.png');
    this.game.load.image('star', 'assets/img/star.png');
    this.game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
  }

  create() {
    console.log("onCreate");

    var game = this.game

    var platforms = null;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'sky');

    platforms = game.add.group();
    this.platforms = platforms

    platforms.enableBody = true

    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;

    // The player and its settings
    var player = game.add.sprite(32, game.world.height - 150, 'dude');
    this.player = player

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    this.cursors = game.input.keyboard.createCursorKeys();
  }

  update() {
    //  Collide the player and the stars with the platforms
    var player = this.player;
    var game = this.game;


    this.game.physics.arcade.collide(this.player, this.platforms);

    if (!this.cursors) return;

    var cursors = this.cursors;

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
  }

  render() {
    return (
      <h1>Comp 4441</h1>
    );
  }
}
