var SceneControl = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { 'key': 'SceneControl' });
  },
  init: function () {},
  preload: function () {},
  create: function () {
    this.add.text(
      400,
      200,
      "Controles",
      {
        fontSize: 50,
        color: '#ff1744',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.add.text(
      400,
      300,
      "Moverse a la izquierda: Flecha izquierda",
      {
        fontSize: 25,
        color: '#00c853',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.add.text(
      400,
      350,
      "Moverse a la derecha: Flecha derecha",
      {
        fontSize: 25,
        color: '#00c853',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.add.text(
      400,
      400,
      "Disparar: Barra espaciadora",
      {
        fontSize: 25,
        color: '#00c853',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.add.text(
      400,
      500,
      "Volver al Menú Principal: Escape",
      {
        fontSize: 20,
        color: '#03a9f4',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

  },
  update: function () {

    if (escapeKey.isDown) {
      this.scene.start('SceneGameStart')
    }
  }
});