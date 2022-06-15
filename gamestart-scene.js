var SceneGameStart = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { 'key': 'SceneGameStart' });
  },
  init: function () {},
  preload: function () {},
  create: function () {
    var text = this.add.text(
      640,
      360,
      "Bienvenido al Juego",
      {
        fontSize: 50,
        color: '#ff1744',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      loop: false,
      callback: () => {
        this.scene.start('SceneGame')
      }
    })

  },
  update: function () {}
});
