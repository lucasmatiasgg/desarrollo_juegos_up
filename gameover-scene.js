var cursors;

var SceneGameOver = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { 'key': 'SceneGameOver' });
  },
  init: function (data) {
    this.highscore = data.highscore;
  },
  preload: function () {
    this.load.image('gameOver', 'assets/gameOver3.png');
  },
  create: function () {
    this.add.image(400, 300, 'gameOver');
    var text = this.add.text(
      400,
      500,
      "Score: " + this.highscore,
      {
        fontSize: 30,
        color: '#FF0000',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

  },

  update: function () {
  }
})
