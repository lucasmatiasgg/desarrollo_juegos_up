var SceneGameOver = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { 'key': 'SceneGameOver' });
  },
  init: function (data) {
    this.highscore = data.highscore;
  },
  preload: function () {},
  create: function () {
    var text = this.add.text(
      640,
      360,
      "Game Over: " + this.highscore,
      {
        fontSize: 50,
        color: '#FF0000',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);
  },
  update: function () {}
})
