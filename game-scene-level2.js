var platforms;
var player;
var cursors;
var spaceBar;
var scoreText;
var gameOver = false;
var deathSound;
var lastFired = 0;
var lastFiredEnemy = 0;
var bullet;
var bullets;
var bulletTime = 0;
var staticEnemies;
var enemyBullets3;
var enemyBullets4;
var enemyBullets5;
var enemyBullets1;
var enemyFiring;
var enemyFiring2;
var enemy3;
var enemyEliminatedCountLevel2 = 0;
var levelText;

var SceneGameLevel2 = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { 'key': 'SceneGameLevel2' });
  },
  init: function (data) {
    this.score = data.score;
  },
  preload: function () {
    this.load.image('spaceBackground', 'assets/spaceBackground.png');
    this.load.image('enemy1', 'assets/enemyShip.png');
    this.load.image('enemy2', 'assets/enemyShip2.png');
    this.load.image('bullet', 'assets/bullet0.png');
    this.load.image('bullet2', 'assets/bullet2.png');
    this.load.image('bullet3', 'assets/bullet03.png');
    this.load.image('playerShip', 'assets/playerShip.png');
    this.load.spritesheet('explode1', 'assets/explode1.png', { frameWidth: 130, frameHeight: 120 });
    this.load.audio('shootShip', 'assets/audio/audioShoot1.wav');
    this.load.audio('death', 'assets/audio/player_death.wav');
    this.load.audio('deathEnemy', 'assets/audio/deathEnemy.wav');
  },
  create: function (data) {
    this.add.image(400, 300, 'spaceBackground');
    shootShipSound = this.sound.add('shootShip')
    deathSound = this.sound.add('death')
    deathEnemySound = this.sound.add('deathEnemy');
    console.log("nivel 2??: ", data.level)
    level = data.level;
    var Bullet = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,
      initialize:

      function Bullet (scene)
      {
          Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

          this.speed = Phaser.Math.GetSpeed(400, 1);
      },

      fire: function (x, y)
      {
          this.setPosition(x, y - 50);

          this.setActive(true);
          this.setVisible(true);
      },

      update: function (time, delta)
      {
          this.y -= this.speed * delta;

          if (this.y < -50)
          {
              this.setActive(false);
              this.setVisible(false);
          }
      }

    });

    var EnemyBullet = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,
      initialize:

      function Bullet (scene)
      {
          Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet2');

          const speed = level > 2 ? 400 + level * 10 : 400;

          this.speed = Phaser.Math.GetSpeed(speed, 1);
      },

      fire: function (x, y)
      {
          this.setPosition(x, y );

          this.setActive(true);
          this.setVisible(true);
      },

      update: function (time, delta)
      {
          this.y += this.speed * delta;
          if (this.y > 600)
          {
              this.setActive(false);
              this.setVisible(false);
          }
      }

    });

    player = this.physics.add.sprite(data.playerX, 550, 'playerShip');
    player.setBounce(0.3);
    player.body.allowGravity = false;
    player.setCollideWorldBounds(true);
    this.anims.create({
      key: 'playerDead',
      frames: this.anims.generateFrameNumbers('explode1', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true,
      enableBody: true,
      allowGravity: false,
    });

    enemyBullets1 = this.physics.add.group({
      classType: EnemyBullet,
      maxSize: 10,
      runChildUpdate: true,
      enableBody: true,
      allowGravity: false,
    });

    enemyBullets3 = this.physics.add.group({
      name: "enemyBullets3",
      collideWorldBounds: false,
      enable: false,
      createCallback: createBullet
    });
    enemyBullets3.createMultiple({
      quantity: 500,
      key: "bullet3",
      active: false,
      visible: false
    });

    enemyBullets4 = this.physics.add.group({
      name: "enemyBullets4",
      collideWorldBounds: false,
      enable: false,
      createCallback: createBullet
    });
    enemyBullets4.createMultiple({
      quantity: 500,
      key: "bullet3",
      active: false,
      visible: false
    });

    enemyBullets5 = this.physics.add.group({
      name: "enemyBullets5",
      collideWorldBounds: false,
      enable: false,
      createCallback: createBullet
    });
    enemyBullets5.createMultiple({
      quantity: 500,
      key: "bullet3",
      active: false,
      visible: false
    });

    staticEnemies = this.physics.add.group({
      key: 'enemy1',
      repeat: 4,
      setXY: { x: 40, y: 100, stepX: 160 },
      allowGravity: false,
      enableBody: true,
    });

    staticEnemies.children.iterate(function (child) {
      child.setBounce(Phaser.Math.FloatBetween(0.4, 0, 8));
    });

    enemyFiring = this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: fireBulletFromEnemyStatic
    });

    enemy3 = this.physics.add.sprite(100, 250, 'enemy2');
    enemy3.setBounce(0.3);
    enemy3.body.allowGravity = false;
    enemy3.setCollideWorldBounds(true);

    enemyMoving = this.tweens.add({
      targets: enemy3.body.velocity,
      props: {
        x: { from: 100, to: -50, duration: 4000 },
        y: { from: 50, to: -50, duration: 2000 }
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });


    enemy4 = this.physics.add.sprite(500, 150, 'enemy2');
    enemy4.setBounce(0.3);
    enemy4.body.allowGravity = false;
    enemy4.setCollideWorldBounds(true);

    enemy4Moving = this.tweens.add({
      targets: enemy4.body.velocity,
      props: {
        x: { from: 150, to: 50, duration: 4000 },
        y: { from: -70, to: 70, duration: 2000 }
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });

    enemy5 = this.physics.add.sprite(500, 250, 'enemy2');
    enemy5.setBounce(0.3);
    enemy5.body.allowGravity = false;
    enemy5.setCollideWorldBounds(true);

    enemy5Moving = this.tweens.add({
      targets: enemy5.body.velocity,
      props: {
        x: { from: 100, to: -50, duration: 4000 },
        y: { from: -120, to: 120, duration: 2000 }
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });

    //FIRE ENEMIES
    enemyFiring2 = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: fireBulletFromEnemy3
    });

    enemyFiring4 = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: fireBulletFromEnemy4
    });

    enemyFiring5 = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: fireBulletFromEnemy5
    });

    cursors = this.input.keyboard.createCursorKeys();
    spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.physics.add.collider(player, staticEnemies);
    this.physics.add.collider(bullets, staticEnemies);
    this.physics.add.collider(bullets, enemy3);
    this.physics.add.collider(bullets, enemy4);
    this.physics.add.collider(bullets, enemy5);
    this.physics.add.overlap(player, enemyBullets3, endGame, null, this);
    this.physics.add.overlap(player, enemyBullets4, endGame, null, this);
    this.physics.add.overlap(player, enemyBullets5, endGame, null, this);
    this.physics.add.overlap(player, enemyBullets1, endGame, null, this);
    this.physics.add.overlap(bullets, staticEnemies, destroyEnemyStatic, null, this);
    this.physics.add.overlap(bullets, enemy3, destroyEnemy3, null, this);
    this.physics.add.overlap(bullets, enemy4, destroyEnemy4, null, this);
    this.physics.add.overlap(bullets, enemy5, destroyEnemy5, null, this);

    setScore(this.scene);
    scoreText = this.add.text(15, 15, 'Score:' + score, { fontSize: '32px', fill: '#00e676' })
    levelText = this.add.text(550, 15, 'Level:' + data.level, { fontSize: '32px', fill: '#00e676' })
  },

  update: function (time) {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (gameOver) {
      gameOver = false;
      this.time.addEvent({
        delay: 2000,
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
    }
    else if (cursors.right.isDown) {
      player.setVelocityX(350);
    }
    else if(spaceBar.isDown && time > lastFired){
      var bullet = bullets.get();

        if (bullet)
        {
            shootShipSound.play();
            bullet.fire(player.x, player.y);
            lastFired = time + 80;
        }
    }
    else {
      player.setVelocityX(0);
    }

    screenControlEnemy3(enemy3, this.tweens);
    screenControlEnemy4(enemy4, this.tweens);
    screenControlEnemy5(enemy5, this.tweens);

    if(enemyEliminatedCountLevel2 >= 4) {
      enemyEliminatedCountLevel2 = 0;
      console.log("NIVEL TERMINADO!")
      this.scene.start('SceneGameLevel3',
      {'score': score,
      'playerX' : player.x,
      "level": level + 1})
    }
  }
})

function endGame() {
  deathSound.play();
  player.anims.play('playerDead', true);
  if(score > getScore('maxScore')) {
    updateScore(this.scene, score, 'maxScore')
  }
  this.physics.pause();

  gameOver = true;
}

function destroyEnemyStatic(bullet, enemie) {
  deathEnemySound.play();
  bullet.destroy();
  enemie.disableBody(true, true);
  score += 100;
  updateScore(this.scene, score, 'score')
  scoreText.setText('Score: ' + score);

  if (staticEnemies.countActive(true) === 0) {
    enemyEliminatedCountLevel2 += 1;
    staticEnemies.children.iterate(function (child) {
      child.enableBody(true, child.x, 100, true, true);
    })
  }

}
function destroyEnemy3(bullet, enemy3) {
  deathEnemySound.play();
  bullet.destroy();
  enemyFiring2.remove();
  enemy3.destroy();
  enemyBullets3.clear(true, true);
  enemyEliminatedCountLevel2 += 1;

  score += 200;
  updateScore(this.scene, score, 'score')
  scoreText.setText('Score: ' + score);
}

function destroyEnemy4(bullet, enemy4) {
  deathEnemySound.play();
  bullet.destroy();
  enemyFiring4.remove();
  enemy4.destroy();
  enemyBullets4.clear(true, true);
  enemyEliminatedCountLevel2 += 1;

  score += 200;
  updateScore(this.scene, score, 'score')
  scoreText.setText('Score: ' + score);
}

function destroyEnemy5(bullet, enemy5) {
  deathEnemySound.play();
  bullet.destroy();
  enemyFiring5.remove();
  enemy5.destroy();
  enemyBullets5.clear(true, true);

  enemyEliminatedCountLevel2 += 1;
  score += 200;
  updateScore(this.scene, score, 'score')
  scoreText.setText('Score: ' + score);
}

function createBullet(bullet) {
  bullet.body.onWorldBounds = true;
}

function fireBulletFromEnemyStatic() {

  for(i=0; i < staticEnemies.getChildren().length; i++){
    var bullet = enemyBullets1.get();

    if (bullet && staticEnemies.getChildren()[i].active)
    {
        bullet.fire(staticEnemies.getChildren()[i].x, staticEnemies.getChildren()[i].y);
        lastFiredEnemy = this.time + 80;
    }
  }
}

function fireBulletFromEnemy3() {
    fireBulletFromGroup(enemyBullets3, enemy3.x, enemy3.y + 32, 0, 150);
}

function fireBulletFromEnemy4() {
  fireBulletFromGroup(enemyBullets4, enemy4.x, enemy4.y + 32, 0, 150);
}

function fireBulletFromEnemy5() {
  fireBulletFromGroup(enemyBullets5, enemy5.x, enemy5.y + 32, 0, 150);
}

function fireBulletFromGroup(group, x, y, velocityX, velocityY) {
  const bullet = group.getFirstDead(false);
  if (bullet) {
    fireBullet(bullet, x, y, velocityX, velocityY);
  }
}

function fireBulletFromGroup(group, x, y, velocityX, velocityY) {
  const bullet = group.getFirstDead(false);
  if (bullet) {
    fireBullet(bullet, x, y, velocityX, velocityY);
  }
}

function fireBullet(bullet, x, y, vx, vy) {
  bullet.enableBody(true, x, y, true, true);
  bullet.setVelocity(vx, vy);
}

function setScore (scene) {
  scene.score = parseInt(localStorage.getItem('score')) || 0;
};

function updateScore(scene, increment, key) {
  if('maxScore' === key){
    localStorage.setItem(key, increment);
  } else {
    localStorage.setItem(key, increment);
  }
};

function getScore (key) {
  return parseInt(localStorage.getItem(key)) || 0;
};

function screenControlEnemy3 (enemy3, tweens) {
  if(enemy3.x > 650){
    enemyMoving = tweens.add({
      targets: enemy3.body.velocity,
      props: {
        x: { from: -100, to: 50, duration: 4000 },
        y: { from: 50, to: -50, duration: 2000 }
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
  } else if (enemy3.x < 50){
      enemyMoving = tweens.add({
        targets: enemy3.body.velocity,
        props: {
          x: { from: 100, to: -50, duration: 4000 },
          y: { from: 50, to: -50, duration: 2000 }
        },
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1
      });
  }
}

function screenControlEnemy4 (enemy4, tweens) {
  if(enemy4.x > 550){
    enemy4Moving = tweens.add({
      targets: enemy4.body.velocity,
      props: {
        x: { from: -100, to: 50, duration: 4000 },
        y: { from: -70, to: 70, duration: 2000 }
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
  } else if (enemy4.x < 150){
    enemy4Moving = tweens.add({
      targets: enemy4.body.velocity,
      props: {
        x: { from: 100, to: -50, duration: 4000 },
        y: { from: 70, to: -70, duration: 2000 }
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
  }
}

function screenControlEnemy5 (enemy5, tweens) {
  if(enemy5.x > 600){
    enemy5Moving = tweens.add({
      targets: enemy5.body.velocity,
      props: {
        x: { from: -130, to: 90, duration: 4000 },
        y: { from: 50, to: -50, duration: 2000 }
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
  } else if (enemy5.x < 100 || enemy5.y < 0){
    enemy5Moving = tweens.add({
      targets: enemy5.body.velocity,
      props: {
        x: { from: 130, to: -90, duration: 4000 },
        y: { from: 50, to: -50, duration: 2000 }
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
  }
}
