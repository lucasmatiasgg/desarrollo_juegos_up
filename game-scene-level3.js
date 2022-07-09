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
var enemy6;
var enemy7;
var enemy8;
var bulletTime = 0;
var enemiesStatic3;
var enemyBullets6;
var enemyBullets7;
var enemyBullets8;
var enemyBullets9;
var enemyFiring6;
var enemyFiring7;
var enemyFiring8;
var enemyFiring9;
var enemyEliminatedCount3 = 0;
var levelText;

var SceneGameLevel3 = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { 'key': 'SceneGameLevel3' });
  },
  init: function (data) {
    this.score = data.score;
  },
  preload: function () {
    this.load.image('spaceBackground', 'assets/spaceBackground.png');
    this.load.image('enemy1', 'assets/enemyShip.png');
    this.load.image('enemy2', 'assets/enemyShip2.png');
    this.load.image('enemy3', 'assets/enemyShip3.png');
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

          const speed = level > 3 ? 400 + level * 10 : 400;

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

    enemyBullets6 = this.physics.add.group({
      name: "enemyBullets6",
      collideWorldBounds: false,
      enable: false,
      createCallback: createBullet
    });
    enemyBullets6.createMultiple({
      quantity: 500,
      key: "bullet3",
      active: false,
      visible: false
    });

    enemyBullets7 = this.physics.add.group({
      name: "enemyBullets7",
      collideWorldBounds: false,
      enable: false,
      createCallback: createBullet
    });
    enemyBullets7.createMultiple({
      quantity: 500,
      key: "bullet3",
      active: false,
      visible: false
    });

    enemyBullets8 = this.physics.add.group({
      name: "enemyBullets8",
      collideWorldBounds: false,
      enable: false,
      createCallback: createBullet
    });
    enemyBullets8.createMultiple({
      quantity: 500,
      key: "bullet3",
      active: false,
      visible: false
    });

    enemyBullets9 = this.physics.add.group({
      name: "enemyBullets9",
      collideWorldBounds: false,
      enable: false,
      createCallback: createBullet
    });
    enemyBullets9.createMultiple({
      quantity: 500,
      key: "bullet3",
      active: false,
      visible: false
    });

    enemiesStatic3 = this.physics.add.group({
      key: 'enemy1',
      repeat: 6,
      setXY: { x: 40, y: 100, stepX: 120 },
      allowGravity: false,
      enableBody: true,
      collideWorldBounds: true,
    });

    enemiesStatic3.children.iterate(function (child) {
      child.setBounce(Phaser.Math.FloatBetween(0.4, 0, 8));
    });

    enemiesStatic3Firing = this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: fireBulletFromEnemiesStatic3
    });

    enemy6 = this.physics.add.sprite(0, 150, 'enemy3');
    enemy6.setBounce(0.3);
    enemy6.body.allowGravity = false;
    enemy6.setCollideWorldBounds(true);

    enemy6Moving = this.tweens.add({
      targets: enemy6.body.velocity,
      props: {
        x: { from: 0, to: 600, duration: 2000 },
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });


    enemy7 = this.physics.add.sprite(500, 250, 'enemy3');
    enemy7.setBounce(0.3);
    enemy7.body.allowGravity = false;
    enemy7.setCollideWorldBounds(true);

    enemy7Moving = this.tweens.add({
      targets: enemy7.body.velocity,
      props: {
        x: { from: 500, to: -500, duration: 5000 },
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });

    enemy8 = this.physics.add.sprite(500, 350, 'enemy3');
    enemy8.setBounce(0.3);
    enemy8.body.allowGravity = false;
    enemy8.setCollideWorldBounds(true);

    enemy8Moving = this.tweens.add({
      targets: enemy8.body.velocity,
      props: {
        x: { from: 0, to: 600, duration: 3000 },
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });

    enemy9 = this.physics.add.sprite(100, 250, 'enemy2');
    enemy9.setBounce(0.3);
    enemy9.body.allowGravity = false;
    enemy9.setCollideWorldBounds(true);

    enemy9Moving = this.tweens.add({
      targets: enemy9.body.velocity,
      props: {
        x: { from: 100, to: -50, duration: 4000 },
        y: { from: 50, to: -50, duration: 2000 }
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });

    //FIRE ENEMIES
    enemyFiring6 = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: fireBulletFromEnemy6
    });

    enemyFiring7 = this.time.addEvent({
      delay: 800,
      loop: true,
      callback: fireBulletFromEnemy7
    });

    enemyFiring8 = this.time.addEvent({
      delay: 1300,
      loop: true,
      callback: fireBulletFromEnemy8
    });

    enemyFiring9 = this.time.addEvent({
      delay: 500,
      loop: true,
      callback: fireBulletFromEnemy9
    });

    cursors = this.input.keyboard.createCursorKeys();
    spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.physics.add.collider(player, enemiesStatic3);
    this.physics.add.collider(bullets, enemiesStatic3);
    this.physics.add.collider(bullets, enemy6);
    this.physics.add.collider(bullets, enemy7);
    this.physics.add.collider(bullets, enemy8);
    this.physics.add.collider(bullets, enemy9);
    this.physics.add.overlap(player, enemyBullets6, endGame, null, this);
    this.physics.add.overlap(player, enemyBullets7, endGame, null, this);
    this.physics.add.overlap(player, enemyBullets8, endGame, null, this);
    this.physics.add.overlap(player, enemyBullets9, endGame, null, this);
    this.physics.add.overlap(player, enemyBullets1, endGame, null, this);
    this.physics.add.overlap(bullets, enemiesStatic3, destroyEnemyStatic3, null, this);
    this.physics.add.overlap(bullets, enemy6, destroyEnemy6, null, this);
    this.physics.add.overlap(bullets, enemy7, destroyEnemy7, null, this);
    this.physics.add.overlap(bullets, enemy8, destroyEnemy8, null, this);
    this.physics.add.overlap(bullets, enemy9, destroyEnemy9, null, this);

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

    if(enemy6){
      screenControlEnemy6(enemy6, this.tweens);
    }
    if(enemy7){
      screenControlEnemy7(enemy7, this.tweens);
    }
    if(enemy8){
      screenControlEnemy8(enemy8, this.tweens);
    }
    if(enemy9){
      screenControlEnemy9(enemy9, this.tweens);
    }

    if(enemyEliminatedCount3 >= 5) {
      enemyEliminatedCount3 = 0;
      console.log("NIVEL 3 TERMINADO!")
      this.scene.start('SceneGame', {
        'score': score,
        'playerX': player.x,
        'level': level + 1,
        "comeFromAnotherLevel": true})
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

function destroyEnemyStatic3(bullet, enemie) {
  deathEnemySound.play();
  bullet.destroy();
  enemie.disableBody(true, true);

  score += 100;
  updateScore(this.scene, score, 'score')
  scoreText.setText('Score: ' + score);

  if (enemiesStatic3.countActive(true) === 0) {
    enemyEliminatedCount3 += 1;
    console.log("enemyEliminatedCount3: ", enemyEliminatedCount3)
    enemiesStatic3.children.iterate(function (child) {
      child.enableBody(true, child.x, 100, true, true);
    })
  }

}

function destroyEnemy6(bullet, enemy6) {
  enemyEliminatedCount3 += 1;
  console.log("enemyEliminatedCount3: ", enemyEliminatedCount3)
  deathEnemySound.play();
  bullet.destroy();
  enemyFiring6.remove();
  enemy6.destroy();
  enemyBullets6.clear(true, true);
  score += 250;
  updateScore(this.scene, score, 'score')
  scoreText.setText('Score: ' + score);

}

function destroyEnemy7(bullet, enemy7) {
  enemyEliminatedCount3 =+ 1;
  console.log("enemyEliminatedCount3: ", enemyEliminatedCount3)
  deathEnemySound.play();
  bullet.destroy();
  enemyFiring7.remove();
  enemy7.destroy();
  enemyBullets7.clear(true, true);
  score += 250;
  updateScore(this.scene, score, 'score')
  scoreText.setText('Score: ' + score);

}

function destroyEnemy8(bullet, enemy8) {
  enemyEliminatedCount3 += 1;
  console.log("enemyEliminatedCount3: ", enemyEliminatedCount3)
  deathEnemySound.play();
  bullet.destroy();
  enemyFiring8.remove();
  enemy8.destroy();
  enemyBullets8.clear(true, true);
  score += 250;
  updateScore(this.scene, score, 'score')
  scoreText.setText('Score: ' + score);

}

function destroyEnemy9(bullet, enemy9) {
  enemyEliminatedCount3 += 1;
  console.log("enemyEliminatedCount3: ", enemyEliminatedCount3)
  deathEnemySound.play();
  bullet.destroy();
  enemyFiring9.remove();
  enemy9.destroy();
  enemyBullets9.clear(true, true);
  score += 200;
  updateScore(this.scene, score, 'score')
  scoreText.setText('Score: ' + score);

}

function createBullet(bullet) {
  bullet.body.onWorldBounds = true;
}

function fireBulletFromEnemiesStatic3() {

  for(i=0; i < enemiesStatic3.getChildren().length; i++){
    var bullet = enemyBullets1.get();

    if (bullet && enemiesStatic3.getChildren()[i].active)
    {
        bullet.fire(enemiesStatic3.getChildren()[i].x, enemiesStatic3.getChildren()[i].y);
        lastFiredEnemy = this.time + 80;
    }
  }
}

function fireBulletFromEnemy6() {
    fireBulletFromGroup(enemyBullets6, enemy6.x, enemy6.y + 32, 0, 150);
}

function fireBulletFromEnemy7() {
  fireBulletFromGroup(enemyBullets7, enemy7.x, enemy7.y + 32, 0, 150);
}

function fireBulletFromEnemy8() {
  fireBulletFromGroup(enemyBullets8, enemy8.x, enemy8.y + 32, 0, 150);
}

function fireBulletFromEnemy9() {
  fireBulletFromGroup(enemyBullets9, enemy9.x, enemy9.y + 32, 0, 150);
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

function screenControlEnemy6 (enemy6, tweens) {
    if(enemy6.x > 550){
      enemy6Moving = tweens.add({
        targets: enemy6.body.velocity,
        props: {
          x: { from: -30, to: 200, duration: 1000 },
        },
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1
      });
    } else if (enemy6.x < 80){
        enemy6Moving = tweens.add({
          targets: enemy6.body.velocity,
          props: {
            x: { from: 10, to: 300, duration: 1000 },
          },
          ease: "Sine.easeInOut",
          yoyo: true,
          repeat: -1
        });
    }
}

function screenControlEnemy7 (enemy7, tweens) {
  if(enemy7.x > 550){
    enemy7Moving = tweens.add({
      targets: enemy7.body.velocity,
      props: {
        x: { from: -100, to: 50, duration: 5000 },
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
  } else if (enemy7.x < 150){
    enemy7Moving = tweens.add({
      targets: enemy7.body.velocity,
      props: {
        x: { from: 100, to: 50, duration: 5000 },
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
  }
}

function screenControlEnemy8 (enemy8, tweens) {
  if(enemy8.x > 550){
    enemy8Moving = tweens.add({
      targets: enemy8.body.velocity,
      props: {
        x: { from: -200, to: 30, duration: 3000 },
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
  } else if (enemy8.x < 100){
    enemy8Moving = tweens.add({
      targets: enemy8.body.velocity,
      props: {
        x: { from: 200, to: 30, duration: 3000 },
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
  }
}

function screenControlEnemy9 (enemy9, tweens) {
  if(enemy9.x > 550){
    enemy9Moving = tweens.add({
      targets: enemy9.body.velocity,
      props: {
        x: { from: -100, to: 50, duration: 4000 },
        y: { from: -70, to: 70, duration: 2000 }
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
  } else if (enemy9.x < 150){
    enemy9Moving = tweens.add({
      targets: enemy9.body.velocity,
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