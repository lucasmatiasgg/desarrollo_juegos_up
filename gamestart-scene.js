var cursors;
var lastScore = 0;
var maxScore = 0;

var SceneGameStart = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { 'key': 'SceneGameStart' });
  },
  init: function () {
    console.log("PREVIOUS", this.scene);
    this.scene.stop("SceneGameLevel2")
    console.log("AFTER", this.scene);
  },
  preload: function () {},
  create: function () {
    this.add.text(
      400,
      200,
      "War Ship",
      {
        fontSize: 50,
        color: '#ff1744',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.add.text(
      400,
      300,
      "Presioná Enter para comenzar",
      {
        fontSize: 25,
        color: '#ff1744',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.add.text(
      400,
      350,
      "Presioná la letra C para ver los controles",
      {
        fontSize: 20,
        color: '#00c853',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.add.text(
      400,
      400,
      "Presioná la letra R para resetear los scores",
      {
        fontSize: 20,
        color: '#00c853',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    resetKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    controlKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

    maxScore = this.add.text(
      400,
      450,
      "Máximo score:" + getScore('maxScore'),
      {
        fontSize: 20,
        color: '#00c853',
      }
    ).setOrigin(0.5);

    lastScore = this.add.text(
      400,
      500,
      "Último score:" + getScore('score'),
      {
        fontSize: 20,
        color: '#00c853',
      }
    ).setOrigin(0.5);

    if(localStorage.getItem('maxScore') === 0){
      localStorage.setItem('maxScore', 0);
    }

  },
  update: function () {

    if (enterKey.isDown) {
      localStorage.setItem('score', 0);
      this.scene.start('SceneGame')
    } else if(resetKey.isDown) {
      localStorage.setItem('maxScore', 0);
      localStorage.setItem('score', 0);
      lastScore.setText("Último score:" + getScore('score'));
      maxScore.setText("Máximo score:" + getScore('maxScore'));
    } else if(controlKey.isDown){
      this.scene.start('SceneControl')
    }
  }
});

function getScore (key) {
  return parseInt(localStorage.getItem(key)) || 0;
};