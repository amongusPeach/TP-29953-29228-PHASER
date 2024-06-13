import TutorialScene from './tutorial.js';

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('menuBg', 'assets/background/wallpaperflare.com_wallpaper.jpg');
    }

    create() {
        this.add.image(-1800, -1200, 'menuBg').setOrigin(0).setScale(0.9);
    }
}
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player1 = null;
        this.player2 = null;
        this.groundY = 750;
        this.jumpForce = -15;
        this.onGroundPlayer1 = true;
        this.onGroundPlayer2 = true;
        this.obstacles = [];
        this.topColliders = [];
        this.grabDistance = 100;
    }

    preload() {
        this.load.spritesheet('playerA', 'assets/player/ChikBoy_idle.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerB', 'assets/player/ChikBoy_run.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerC', 'assets/player2/ChikBoy_idle.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerD', 'assets/player2/ChikBoy_run.png', { frameWidth: 32, frameHeight: 32 });

        this.load.image('background4', 'assets/background/the end.jpg');
        this.load.image('background3', 'assets/background/Escada para o céu _ Foto Premium.jpg');
        this.load.image('background', 'assets/background/wallpaperflare.com_wallpaper.jpg');
        this.load.image('background2', 'assets/background/2205_w015_n001_820a_p30_820.jpg');
        this.load.image('obstacle', 'assets/background/vecteezy_platform-with-desert-for-game-level-interface_15008353.png');
        this.load.image('wall', 'assets/background/wall.jpg');
    }

    create() {
        this.add.image(0, -1200, 'background').setOrigin(0).setScale(1);
        this.add.image(0, -2200, 'background3').setOrigin(0).setScale(6);

        this.ground = this.matter.add.image(700, this.groundY + 125, 'background2').setScale(1.1);
        this.ground.setStatic(true);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('playerA', { start: 0, end: 5 }),
            frameRate: 3,
            repeat: -1
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('playerB', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle2',
            frames: this.anims.generateFrameNumbers('playerC', { start: 0, end: 5 }),
            frameRate: 3,
            repeat: -1
        });

        this.anims.create({
            key: 'run2',
            frames: this
            .anims.generateFrameNumbers('playerD', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        const player1Category = this.matter.world.nextCategory();
        const player2Category = this.matter.world.nextCategory();

        this.player1 = this.matter.add.sprite(300, 500, 'playerA').setScale(2);
        this.player2 = this.matter.add.sprite(400, 500, 'playerA').setScale(2);

        this.player1.setCollisionCategory(player1Category);
        this.player1.setCollidesWith([0xFFFFFFFF ^ player2Category]);

        this.player2.setCollisionCategory(player2Category);
        this.player2.setCollidesWith([0xFFFFFFFF ^ player1Category]);

        this.player1.play('idle');
        this.player2.play('idle');

        this.player1.setFixedRotation();
        this.player2.setFixedRotation();

        this.corda = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });

        this.teclas = this.input.keyboard.addKeys('W,A,S,D,E');
        this.cursors = this.input.keyboard.createCursorKeys();

        const obstaclePositions = [
            { x: 500, y: this.groundY - 400 },
            { x: 700, y: this.groundY - 650 },
            { x: 1000, y: this.groundY - 600 },
            { x: 1300, y: this.groundY - 500 },
            { x: 1600, y: this.groundY - 600 },
            { x: 1900, y: this.groundY - 550 },
            { x: 2200, y: this.groundY - 600 },
            { x: 2000, y: this.groundY - 800 },
            { x: 1700, y: this.groundY - 900 },
            { x: 1600, y: this.groundY - 1050 },
            { x: 1500, y: this.groundY - 1150 },
            { x: 1000, y: this.groundY - 1050 },
            { x: 400, y: this.groundY - 1050 },
            { x: 1500, y: this.groundY - 1650 },
            { x: 1500, y: this.groundY - 1950 },
        ];

        obstaclePositions.forEach(pos => {
            let obstacle = this.matter.add.image(pos.x, pos.y, 'obstacle').setScale(0.5);
            obstacle.setStatic(true);
            this.obstacles.push(obstacle);

            let topCollider = this.matter.add.rectangle(obstacle.x, obstacle.y - obstacle.displayHeight / 2, obstacle.displayWidth, 10, {
                isStatic: true,
                label: 'topCollider'
            });
            this.topColliders.push(topCollider);
        });

        this.wall = this.matter.add.image(700, this.groundY - 1200, 'wall').setScale(0.6).setStatic(true);

        this.cameras.main.setBounds(0, this.game.config.height - 3600, 3000, 3600);
        this.matter.world.setBounds(0, this.game.config.height - 3600, 3000, 3600);

        this.matter.world.on('collisionactive', (event, bodyA, bodyB) => {
            if ((bodyA === this.player1.body && (bodyB === this.ground.body || this.topColliders.includes(bodyB))) ||
                (bodyB === this.player1.body && (bodyA === this.ground.body || this.topColliders.includes(bodyA)))) {
                this.onGroundPlayer1 = true;
            }
            if ((bodyA === this.player2.body && (bodyB === this.ground.body || this.topColliders.includes(bodyB))) ||
                (bodyB === this.player2.body && (bodyA === this.ground.body || this.topColliders.includes(bodyA)))) {
                this.onGroundPlayer2 = true;
            }
        });

        this.matter.world.on('collisionend', (event, bodyA, bodyB) => {
            if ((bodyA === this.player1.body && (bodyB === this.ground.body || this.topColliders.includes(bodyB))) ||
                (bodyB === this.player1.body && (bodyA === this.ground.body || this.topColliders.includes(bodyA)))) {
                this.onGroundPlayer1 = false;
            }
            if ((bodyA === this.player2.body && (bodyB === this.ground.body || this.topColliders.includes(bodyB))) ||
                (bodyB === this.player2.body && (bodyA === this.ground.body || this.topColliders.includes(bodyA)))) {
                this.onGroundPlayer2 = false;
            }
        });
    }

    update() {
        this.corda.clear();
        this.corda.lineStyle(2, 0xff0000);
        this.corda.beginPath();
        this.corda.moveTo(this.player1.x, this.player1.y);
        this.corda.lineTo(this.player2.x, this.player2.y);
        this.corda.strokePath();

        const midPointX = (this.player1.x + this.player2.x) / 2;
        const midPointY = (this.player1.y + this.player2.y) / 2;
        this.cameras.main.startFollow({ x: midPointX, y: midPointY });

        const distance = Phaser.Math.Distance.Between(this.player1.x, this.player1.y, this.player2.x, this.player2.y);
        const maxDistance = 200;

        if (distance > maxDistance) {
            const forceMagnitude = 0.00009;
            if (this.onGroundPlayer1 && !this.onGroundPlayer2) {
                const forceX = (this.player1.x - this.player2.x) * forceMagnitude;
                const forceY = (this.player1.y - this.player2.y) * forceMagnitude;
                this.player2.applyForce({ x: forceX, y: forceY });
            } else if (this.onGroundPlayer2 && !this.onGroundPlayer1) {
                const forceX = (this.player2.x - this.player1.x) * forceMagnitude;
                const forceY = (this.player2.y - this.player1.y) * forceMagnitude;
                this.player1.applyForce({ x: forceX, y: forceY });
            } else {
                const forceX = (this.player2.x - this.player1.x) * forceMagnitude;
                const forceY = (this.player2.y - this.player1.y) * forceMagnitude;
                this.player1.applyForce({ x: forceX, y: forceY });
                this.player2.applyForce({ x: -forceX, y: -forceY });
            }
        }

        if (this.teclas.A.isDown) {
            this.player1.setVelocityX(-2);
            this.player1.play('run', true);
            this.player1.setFlipX(true);
        } else if (this.teclas.D.isDown) {
            this.player1.setVelocityX(2);
            this.player1.play('run', true);
            this.player1.setFlipX(false);
        } else {
            this.player1.setVelocityX(0);
            this.player1.play('idle', true);
        }

        if (this.teclas.S.isDown) {
            this.player1.setVelocityY(2);
        }

        if (this.cursors.left.isDown) {
            this.player2.setVelocityX(-2);
            this.player2.play('run2', true);
            this.player2.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player2.setVelocityX(2);
            this.player2.play('run2', true);
            this.player2.setFlipX(false);
        } else {
            this.player2.setVelocityX(0);
            this.player2.play('idle2', true);
        }

        if (this.cursors.down.isDown) {
            this.player2.setVelocityY(2);
        }

        if (Phaser.Input.Keyboard.JustDown(this.teclas.W) && this.onGroundPlayer1) {
            this.player1.setVelocityY(this.jumpForce);
            this.onGroundPlayer1 = false;
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.onGroundPlayer2) {
            this.player2.setVelocityY(this.jumpForce);
            this.onGroundPlayer2 = false;
        }

        if (Phaser.Input.Keyboard.JustDown(this.teclas.E)) {
            if (this.isNearWall(this.player1)) {
                this.grabbingPlayer1 = !this.grabbingPlayer1;
                if (this.grabbingPlayer1) {
                    this.player1.setStatic(true);
                } else {
                    this.player1.setStatic(false);
                }
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.shift)) {
            if (this.isNearWall(this.player2)) {
                this.grabbingPlayer2 = !this.grabbingPlayer2;
                if (this.grabbingPlayer2) {
                    this.player2.setStatic(true);
                } else {
                    this.player2.setStatic(false);
                }
            }
        }
    }

    isNearWall(player) {
        const distance = Phaser.Math.Distance.Between(player.x, player.y, this.wall.x, this.wall.y);
        return distance < this.grabDistance;
    }
}


const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 650,
    scene: [MenuScene, GameScene, TutorialScene],
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0.8 },
            bounds: {
                x: 0,
                y: 0,
                width: 3000,
                height: 8000
            }
        }
    },
};

const game = new Phaser.Game(config);