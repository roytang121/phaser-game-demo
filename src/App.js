import React, { Component } from 'react';

export default class App extends Component {
  constructor(props) {
    super(props)

    this.game = null

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

    this.game.add.sprite(0, 0, 'star');
  }

  update() {

  }

  render() {
    return (
      <h1>Comp 4441</h1>
    );
  }
}
