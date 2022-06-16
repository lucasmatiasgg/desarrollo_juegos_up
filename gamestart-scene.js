var cursors;

var SceneGameStart = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { 'key': 'SceneGameStart' });
  },
  init: function () {},
  preload: function () {},
  create: function () {
    var text = this.add.text(
      400,
      300,
      "War Ship",
      {
        fontSize: 50,
        color: '#ff1744',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    var text = this.add.text(
      400,
      400,
      "Presioná Enter para comenzar",
      {
        fontSize: 25,
        color: '#ff1744',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);
    enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    // this.time.addEvent({
    //   delay: 1000,
    //   loop: false,
    //   callback: () => {
    //     this.scene.start('SceneGame')
    //   }
    // })

  },
  update: function () {

    if (enterKey.isDown) {
      this.scene.start('SceneGame')
    }
  }
});
