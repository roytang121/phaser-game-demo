import React, { Component } from 'react';
import leftpad from 'left-pad';
import Beat from './Beat';
import getUserMedia from 'getusermedia';
import Parser from './Parser';

let game = null;
let player = null;
let groundHeight = 25;
let totalPointText = null;
let totalPoint = 0;
let comboCount = 0;

let gameTime = 0; // in ms
let gameStartTimestamp = null;
// let kGameTimeInterval = 100;
// let gameTimer = null;
let gameShouldStart = false;
let gameShouldEnd = false;

let startGameTime = 0; // in ms
let kStartGameCounterInterval = 1500;
let kStartGameCounterShouldEndAtTime = kStartGameCounterInterval * 3
let startGameCounter = null;
let beats = [];
let beatSprites = [];

let tempo = 5;

let self = null;

let audioFile = null;

import style from './style.css';

export default class App extends Component {
  constructor(props) {
    super(props)

    self = this;

    this.game = null;
    this.player = null;
    this.platforms = null;
    this.cursors = null;
  }

  componentDidMount() {
    console.log("onComponentDidMount");

    // setupUserMedia
    this.setupUserMedia();

    // 4th argument is the DOM id to be inserted in, default appending to body
    this.game = new Phaser.Game(800, 470, Phaser.AUTO, '', {
      preload: this.preload.bind(this),
      create: this.create.bind(this),
      update: this.update.bind(this)
    });

    game = this.game;

  }

  preload() {
    console.log("onPreload");

    this.game.load.image('sky', 'assets/img/sky.png');
    this.game.load.image('ground', 'assets/img/bottombar.png');
    this.game.load.image('star', 'assets/img/star.png');
    this.game.load.spritesheet('dude', 'assets/img/rat_run.png', 45, 46);
    this.game.load.image('markbar', 'assets/img/markbar.png');
    this.game.load.image('bottombg', 'assets/img/bottombg.png');
    this.game.load.image('topbg', 'assets/img/topbg.png');
    this.game.load.image('beat', 'assets/img/beat.png');
    this.game.load.image('beat-placeholder', 'assets/img/beat_placeholder.png');
    this.game.load.spritesheet('nyancat', 'assets/img/nyancat_run_sheet.png', 272, 168);

    // font
    // this.game.load.bitmapFont('riit', 'assets/font/riit.otf', null);
  }

  create() {
    console.log("onCreate");

    var platforms = null;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'sky');

    game.add.sprite(0, game.world.height - 25);

    game.add.sprite(0, 0, 'topbg');

    var cat = game.add.sprite(-30, 15, 'nyancat');
    cat.animations.add('run', null, 10, true);
    cat.scale.setTo(0.8,0.8);
    cat.angle = -10;

    cat.play('run');

    game.add.sprite(0, 117, 'markbar');

    game.add.sprite(0, 117 * 2, 'bottombg');


    platforms = game.add.group();
    this.platforms = platforms

    platforms.enableBody = true
    //
    var ground = platforms.create(0, game.world.height - groundHeight, 'ground');
    // ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    //
    // var ledge = platforms.create(400, 400, 'ground');
    // ledge.body.immovable = true;
    //
    // ledge = platforms.create(-150, 250, 'ground');
    //
    // ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(game.world.width / 2 - 22.5, game.world.height - 46 - groundHeight, 'dude');
    this.player = player

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 800;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    // player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [0, 1, 2, 3], 10, true);

    this.cursors = game.input.keyboard.createCursorKeys();

    // Text
    totalPointText = game.add.text(30 , 121, '00000');
    totalPointText.font = 'Riit';
    totalPointText.fontSize = 36;
    totalPointText.addColor("#ffffff", 0);


    // add beats to canvas

    game.add.sprite(240, 117.5, 'beat-placeholder');
    // this.constructBeats();
  }

  update() {
    //  Collide the player and the stars with the platforms

    this.game.physics.arcade.collide(this.player, this.platforms);

    this.player.animations.play('right');

    totalPointText.text = leftpad(totalPoint.toString(), 5, 0);

    if (gameShouldStart) {
      if (gameStartTimestamp === null) {
        gameStartTimestamp = Date.now();
      }

      gameTime = Math.abs(Date.now() - gameStartTimestamp);
      // console.log(gameTime);
      // totalPoint += 1;
      this.computeBeats();

      if (beatSprites.length <= 0) {
        gameShouldStart = false;
        gameShouldEnd = true;
      }
    }

    if (gameShouldEnd) {

    }
    // if (!this.cursors) return;
    //
    // var cursors = this.cursors;
    //
    //  Reset the players velocity (movement)
    // player.body.velocity.x = 0;
    //
    // if (cursors.left.isDown)
    // {
    //     //  Move to the left
    //     player.body.velocity.x = -150;
    //
    //     player.animations.play('left');
    // }
    // else if (cursors.right.isDown)
    // {
    //     //  Move to the right
    //     player.body.velocity.x = 150;
    //
    //     player.animations.play('right');
    // }
    // else
    // {
    //     //  Stand still
    //     player.animations.stop();
    //
    //     player.frame = 4;
    // }
    //
    // //  Allow the player to jump if they are touching the ground.
    // if (cursors.up.isDown && player.body.touching.down)
    // {
    //     player.body.velocity.y = -350;
    // }
  }

  startgameCounterUpdate() {
    // console.log(startGameTime);

    let time = 3 - (startGameTime / kStartGameCounterShouldEndAtTime * 3)
    console.log(time);

    startGameTime += kStartGameCounterInterval;

    // defer
    if (startGameTime >= kStartGameCounterShouldEndAtTime) {
      clearInterval(startGameCounter);

      // start Game Timer
      gameShouldStart = true;

      // play the audio file
      var audio = new Audio(audioFile.name);
      audio.play();
    }
  }

  constructBeats() {
    let originX = 240;
    let originY = 117.5; 
    var sprites = [];
    for (var beat of beats) {
      var s = game.add.sprite(originX + beat.startTime * 60 * tempo, originY, 'beat');
      sprites.push(s);
    }

    beatSprites = sprites
  }

  computeBeats() {
    let sprites = beatSprites;
    for (var sprite of sprites) {
      sprite.x -= 1 * tempo;

      if (sprite.x < 240) {
        beatSprites.shift();
        beats.shift();
        sprite.destroy();
      }
    }
  }

  didTriggerClap() {
    console.log("clap");
    if (beats.length <= 0 || beatSprites.length <= 0) {
      console.error('[Error] didTriggerClap but beats / beatSprites length <= 0');
      return;
    }

    let firstBeat = beats[0];
    let firstBeatSprite = beatSprites[0];

    if (firstBeat.startTime * 1000 - gameTime < 800) {
      // add points
      totalPoint += 1000
    }
  }

  // @Author Middle
  setupUserMedia() {
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var lock = false;

    getUserMedia({audio:true}, (err, stream) => {
      if (err) {
        console.log(err);
      } else {
        console.log('got s stream', stream);

        var source = audioContext.createMediaStreamSource(stream);
        var node = audioContext.createScriptProcessor(256, 1,1);
        node.onaudioprocess = function(e){
          var data = e.inputBuffer.getChannelData(0);
          if (lock==false){
            for (var i =0 ; i<256; i++){
              if (Math.abs(data[i])>0.9){
                // console.log("up");
                self.didTriggerClap();

                lock=true;
                break;
              }
            }
          }else{
            if (Math.abs(e.inputBuffer.getChannelData(0)[100])<0.001){
              // console.log("down");

              lock=false;
            }
          }
        }
        source.connect(node);
        node.connect(audioContext.destination);
      }
    });

    // audio file
    $("document").ready(function() {
      $('#audio_file').change(function() {

        audioFile = this.files[0];
        console.log(audioFile);
        var parser = new Parser(this.files[0], (peaks) => {
          // console.log(peaks);
          for (var peak of peaks) {
            beats.push(new Beat(peak/1000));
          }

          self.constructBeats();

          // count 3 seconds to start game
          startGameCounter = setInterval(self.startgameCounterUpdate.bind(self), kStartGameCounterInterval);
        });
      });
    });
  }

  render() {
    return (
      <div>
        <input id="audio_file" type="file" accept="audio/*"></input>
        <h1>Comp 4441</h1>
      </div>
    );
  }
}
