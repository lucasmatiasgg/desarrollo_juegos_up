var counter;
var timedEvent;

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

    counter = this.add.text(
      400,
      450,
      "",
      {
        fontSize: 20,
        color: '#00c853',
      }
    ).setOrigin(0.5);

    timedEvent = this.time.addEvent({
      delay: 1000,
      loop: false,
      repeat: 4,
      callback: () => {}
    })

  },

  update: function () {
    counter.setText("Volviendo al menú principal: " + timedEvent.repeatCount);

    if(timedEvent.repeatCount === 0) {
      this.scene.start('SceneGameStart');
    }
  }
})
