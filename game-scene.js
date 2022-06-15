var platforms;
var player;
var enemy;
var cursors;
var spaceBar;
// var bombs;
// var stars;
var score = 0;
var scoreText;
var gameOver = false;
var takestarSound;
var deathSound;

var bullet;
var bullets;
var bulletTime = 0;

var SceneGame = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { 'key': 'SceneGame' });
  },
  init: function () { },
  preload: function () {
    this.load.image('spaceBackground', 'assets/spaceBackground.png');
    // this.load.image('ground', 'assets/platform.png');
    // this.load.image('star', 'assets/star.png');
    this.load.image('enemy1', 'assets/resize_enemyShip.png');
    this.load.image('bullet', 'assets/bullet0.png');
    this.load.image('playerShip', 'assets/resize_playerShip.png');
    // this.load.spritesheet('playerShip', 'assets/playerShip.png', { frameWidth: 32, frameHeight: 48 });

    this.load.audio('shootShip', 'assets/audio/pickup.wav');
    this.load.audio('death', 'assets/audio/player_death.wav');
  },
  create: function () {

    // takestarSound = this.sound.add('takestar')
    // deathSound = this.sound.add('death')

    //BULLETS
    bullets = this.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    // bullets.createMultiple(10, 'bullet');
    // bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetBullet, this);
    // bullets.setAll('checkWorldBounds', true);


    this.add.image(400, 300, 'spaceBackground');

    enemy = this.physics.add.staticGroup();

    // platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    enemy.create(100, 100, 'enemy1');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 550, 'playerShip')
    player.setBounce(0.3);
    player.setCollideWorldBounds(true);

    // stars = this.physics.add.group({
    //   key: 'star',
    //   repeat: 11,
    //   setXY: { x: 15, y: 0, stepX: 70 }
    // })

    // stars.children.iterate(function (child) {
    //   child.setBounce(Phaser.Math.FloatBetween(0.4, 0, 8));
    // });

    // bombs = this.physics.add.group();

    this.physics.add.collider(player, enemy);
    // this.physics.add.collider(bullet, enemy);
    // this.physics.add.collider(bombs, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.SPACEBAR);

    // this.anims.create({
    //   key: 'left',
    //   frames: this.anims.generateFrameNumbers('playerShip', { start: 0, end: 3 }),
    //   frameRate: 10,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'stand',
    //   frames: [{ key: 'dude', frame: 4 }],
    //   frameRate: 10
    // });
    // this.anims.create({
    //   key: 'right',
    //   frames: this.anims.generateFrameNumbers('playerShip', { start: 5, end: 8 }),
    //   frameRate: 10,
    //   repeat: -1
    // });

    // this.physics.add.overlap(player, stars, collectStar, null, this);

    // this.physics.add.collider(player, bombs, hitBomb, null, this);

    scoreText = this.add.text(15, 15, 'Score: 0', { fontSize: '32px', fill: '#00e676' })
  },
  update: function () {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (gameOver) {
      this.time.addEvent({
        delay: 4000,
        loop: false,
        callback: () => {
          this.scene.start('SceneGameOver', {
            'highscore': score
          })
        }
      })
      return;
    }

    if (cursors.left.isDown) {
      player.setVelocityX(-350);
      // player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
      player.setVelocityX(350);
      // player.anims.play('right', true);
    }
    else if (spaceBar.isDown) {
      fireBullet();
      console.log('Shoot');
    }
    else {
      player.setVelocityX(0);
      // player.anims.play('stand', true);
    }

    // if (cursors.up.isDown && player.body.touching.down) {
    //   player.setVelocityY(-330);
    // }
  }
})

// function collectStar(player, star) {
//   star.disableBody(true, true);

//   takestarSound.play();

//   score += 10;
//   scoreText.setText('Score: ' + score);

//   if (stars.countActive(true) === 0) {
//     stars.children.iterate(function (child) {
//       child.enableBody(true, child.x, 0, true, true);
//     })

//     var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

//     var bomb = bombs.create(x, 16, 'bomb');
//     bomb.setBounce(1);
//     bomb.setCollideWorldBounds(true);
//     bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
//     bomb.allowGravity = false;
//   }
// }

// function hitBomb(player, bomb) {
//   this.physics.pause();

//   deathSound.play();
  
//   player.setTint(0xff0000);
//   player.anims.play('turn');

//   gameOver = true;
// }

function fireBullet () {

  if (this.time.now > bulletTime)
  {
      bullet = bullets.getFirstExists(false);

      if (bullet)
      {
          bullet.reset(sprite.x + 6, sprite.y - 8);
          bullet.body.velocity.y = -300;
          bulletTime = game.time.now + 250;
      }
  }

}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {
  bullet.kill();
}