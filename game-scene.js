var platforms;
var player;
var enemy;
var cursors;
var spaceBar;
var score = 0;
var scoreText;
var gameOver = false;
var deathSound;
var lastFired = 0;
var lastFiredEnemy = 0;
var bullet;
var bullets;
var bulletTime = 0;
var enemies;
var enemyBullets2;
var enemyBullets1;;
var enemyFiring;
var enemyFiring2;
var level = 1;
var levelText;
var enemyEliminatedCount = 0;

var SceneGame = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { 'key': 'SceneGame' });
  },
  init: function () {
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
    enemyEliminatedCount= 0
    this.add.image(400, 300, 'spaceBackground');

    if(!data.comeFromAnotherLevel){
      console.log("PRIMERA VEZ");
      score = 0;
      level = 1;
    } else {
      enemyEliminatedCount = 0;
      level = data.level;
      score = data.score;

      console.log("PEGAMOS LA VUELTA");
      console.log("LEVEL:", level);
    }
    shootShipSound = this.sound.add('shootShip')
    deathSound = this.sound.add('death')
    deathEnemySound = this.sound.add('deathEnemy');

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

          const speed = level > 1 ? 400 + level * 10 : 400;

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

    player = this.physics.add.sprite(100, 550, 'playerShip');
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

    enemyBullets2 = this.physics.add.group({
      name: "enemyBullets2",
      collideWorldBounds: false,
      enable: false,
      createCallback: createBullet
    });
    enemyBullets2.createMultiple({
      quantity: 200,
      key: "bullet3",
      active: false,
      visible: false
    });

    enemies = this.physics.add.group({
      key: 'enemy1',
      repeat: 4,
      setXY: { x: 40, y: 100, stepX: 160 },
      allowGravity: false,
      enableBody: true,
    });

    enemies.children.iterate(function (child) {
      child.setBounce(Phaser.Math.FloatBetween(0.4, 0, 8));
    });

    enemyFiring = this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: fireBulletFromEnemy1
    });

    enemy2 = this.physics.add.sprite(100, 250, 'enemy2');
    enemy2.setBounce(0.3);
    enemy2.body.allowGravity = false;
    enemy2.setCollideWorldBounds(true);

    enemyMoving = this.tweens.add({
      targets: enemy2.body.velocity,
      props: {
        x: { from: 100, to: -50, duration: 4000 },
        y: { from: 50, to: -50, duration: 2000 }
      },
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });

    enemyFiring2 = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: fireBulletFromEnemy2
    });

    cursors = this.input.keyboard.createCursorKeys();
    spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.physics.add.collider(player, enemies);
    this.physics.add.collider(bullets, enemies);
    this.physics.add.collider(bullets, enemy2);
    this.physics.add.overlap(player, enemyBullets2, endGame, null, this);
    this.physics.add.overlap(player, enemyBullets1, endGame, null, this);
    this.physics.add.overlap(bullets, enemies, destroyEnemy, null, this);
    this.physics.add.overlap(bullets, enemy2, destroyEnemy2, null, this);

    setScore(this.scene);
    scoreText = this.add.text(15, 15, 'Score:' + score, { fontSize: '32px', fill: '#00e676' })
    levelText = this.add.text(550, 15, 'Level:' + level, { fontSize: '32px', fill: '#00e676' })
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

    if(enemy2.x > 650){
      enemyMoving = this.tweens.add({
        targets: enemy2.body.velocity,
        props: {
          x: { from: -100, to: 50, duration: 4000 },
          y: { from: 50, to: -50, duration: 2000 }
        },
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1
      });
    } else if (enemy2.x < 50){
        enemyMoving = this.tweens.add({
          targets: enemy2.body.velocity,
          props: {
            x: { from: 100, to: -50, duration: 4000 },
            y: { from: 50, to: -50, duration: 2000 }
          },
          ease: "Sine.easeInOut",
          yoyo: true,
          repeat: -1
        });
    }

    if(enemyEliminatedCount >= 2) {
      console.log("NIVEL TERMINADO:", level)
      this.scene.start('SceneGameLevel2', {'score': score, 'playerX' : player.x, "level": level + 1})
      this.scene.stop('SceneGame');
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

function destroyEnemy(bullet, enemie) {
  deathEnemySound.play();
  bullet.destroy();
  enemie.disableBody(true, true);

  score += 100;
  updateScore(this.scene, score, 'score')
  scoreText.setText('Score: ' + score);

  if (enemies.countActive(true) === 0) {
    enemyEliminatedCount += 1;
    enemies.children.iterate(function (child) {
      child.enableBody(true, child.x, 100, true, true);
    })
  }

}
function destroyEnemy2(bullet, enemy2) {
  deathEnemySound.play();
  bullet.destroy();
  enemyFiring2.remove();
  enemy2.destroy();
  enemyBullets2.clear(true, true);

  enemyEliminatedCount += 1;
  console.log("_COUNT:", enemyEliminatedCount);
  score += 200;
  updateScore(this.scene, score, 'score')
  scoreText.setText('Score: ' + score);

}

function createBullet(bullet) {
  bullet.body.onWorldBounds = true;
}

function fireBulletFromEnemy1() {

  for(i=0; i < enemies.getChildren().length; i++){
    var bullet = enemyBullets1.get();

    if (bullet && enemies.getChildren()[i].active)
    {
        bullet.fire(enemies.getChildren()[i].x, enemies.getChildren()[i].y);
        lastFiredEnemy = this.time + 80;
    }
  }
}

function fireBulletFromEnemy2() {
    fireBulletFromGroup(enemyBullets2, enemy2.x, enemy2.y + 32, 0, 150);
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