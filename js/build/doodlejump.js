var Doodle = Doodle || {};
Doodle.BootState = {
    init: function () {
        (this.game.stage.disableVisibilityChange = !0),
            (this.game.stage.backgroundColor = "#fff"),
            (this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL),
            (this.scale.pageAlignHorizontally = !0),
            (this.scale.pageAlignVertically = !0),
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
    },
    preload: function () {
        this.load.image("loadingscreen", "assets/images/Preloader2.png"), this.load.image("cloudgameslogo", "assets/images/Preloader21.png"), this.load.image("limaskylogo", "assets/images/Preloader22.png");
    },
    create: function () {
        this.state.start("Preload");
    },
};
var Doodle = Doodle || {};
Doodle.CalibrateState = {
    init: function () {
        this.calibratedValue = localStorage.getItem("DJ_calibrated") || 0;
    },
    create: function () {
        (this.jumpSound = this.add.audio("jump")),
            (this.background = this.add.sprite(0, 0, "atlas2", "background")),
            (this.info = this.add.sprite(this.world.game.width / 2, this.world.game.height / 2, "atlas2", "calibrateInfo")),
            this.info.anchor.setTo(0.5),
            (this.doneButton = new Phaser.Sprite(this.game, 370, 840, "atlas2", "donebtn")),
            (this.doneButton.inputEnabled = !0),
            this.doneButton.events.onInputOut.add(function () {
                this.doneButton.loadTexture("atlas2", "donebtn");
            }, this),
            this.doneButton.events.onInputUp.add(function () {
                14 == this.doneButton.frame && (this.state.start("Settings"), this.doneButton.loadTexture("atlas2", "donebtn"));
            }, this),
            this.doneButton.events.onInputDown.add(function () {
                this.doneButton.loadTexture("atlas2", "donebtn2");
            }, this),
            this.add.existing(this.doneButton),
            (this.setButton = new Phaser.Sprite(this.game, 130, 840, "atlas2", "setbtn")),
            (this.setButton.inputEnabled = !0),
            this.setButton.events.onInputOut.add(function () {
                this.setButton.loadTexture("atlas2", "setbtn");
            }, this),
            this.setButton.events.onInputUp.add(function () {
                16 == this.setButton.frame && (this.calibrateSet(), this.setButton.loadTexture("atlas2", "setbtn"));
            }, this),
            this.setButton.events.onInputDown.add(function () {
                this.setButton.loadTexture("atlas2", "setbtn2");
            }, this),
            this.add.existing(this.setButton),
            (this.player = this.add.sprite(this.game.world.centerX, this.game.world.height - 200, "player0")),
            this.player.anchor.setTo(0.5),
            this.game.physics.arcade.enable(this.player),
            this.player.body.setSize(60, 90, 0, 20),
            (this.player.body.velocity.y = -1080),
            (this.optionsLogo = this.add.sprite(30, 50, "atlas2", "optionsLogo")),
            (this.platformPool = this.add.group());
        for (var a = 0; 5 > a; a++)
            (platform = new Phaser.Sprite(this.game, 0 + 140 * a, this.game.world.height - 180 - (a % 2) * 30, "atlas", "platform0")),
                this.game.physics.arcade.enableBody(platform),
                this.platformPool.add(platform),
                (platform.body.allowGravity = !1),
                (platform.body.immovable = !0),
                platform.anchor.setTo(0, 0);
        var b,
            c = new FULLTILT.getDeviceOrientation({ type: "world" }),
            d = this;
        -1 != navigator.userAgent.indexOf("AppleWebKit"), /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        c
            .then(function (a) {
                b = a;
            })
            ["catch"](function (a) {
                console.error(a);
            }),
            (function e() {
                if (b) {
                    var a = b.getScreenAdjustedEuler();
                    d.cursorContr ||
                        d.game.paused ||
                        !d.player.alive ||
                        ((d.player.body.velocity.x = 40 * a.gamma * Math.cos((a.beta * Math.PI) / 180) + d.calibratedValue),
                        40 * a.gamma * Math.cos((a.beta * Math.PI) / 180) > 0 ? d.player.frame < 2 && d.player.scale.setTo(-1, 1) : d.player.frame < 2 && d.player.scale.setTo(1, 1));
                }
                requestAnimationFrame(e);
            })();
    },
    calibrateSet: function (a) {
        (this.calibratedValue -= this.player.body.velocity.x), localStorage.setItem("DJ_calibrated", this.calibratedValue);
    },
    update: function () {
        this.game.physics.arcade.overlap(this.player, this.platformPool, this.collide, null, this),
            this.player.x > this.game.world.width && (this.player.x -= this.game.world.width),
            this.player.x < 0 && (this.player.x += this.game.world.width);
    },
    collide: function (a, b) {
        a.body.velocity.y > 0 && this.jumpSound.play(), (a.body.velocity.y = -1080);
    },
    initIOScontrol: function () {
        var a = -1 != navigator.userAgent.indexOf("AppleWebKit"),
            b = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
            c = this;
        if (a && b) {
            console.log("game", "register message listener");
            var d = window.addEventListener ? "addEventListener" : "attachEvent",
                e = window[d],
                f = "attachEvent" == d ? "onmessage" : "message";
            e(f, function (a) {
                var b = a.message ? "message" : "data",
                    d = a[b];
                console.log("game", d),
                    d.mssg &&
                        "deviceorientation" == d.mssg &&
                        "Calibrate" == Doodle.game.state.current &&
                        (console.log(d.event.alpha, d.event.beta, d.event.gamma),
                        c.cursorContr ||
                            c.game.paused ||
                            !c.player.alive ||
                            ((c.player.body.velocity.x = d.event.gamma * c.GYRO_SENSE * Math.cos((d.event.beta * Math.PI) / 180) + c.calibratedValue),
                            c.player.body.velocity.x > 0 ? c.player.frame < 2 && c.player.scale.setTo(-1, 1) : c.player.frame < 2 && c.player.scale.setTo(1, 1)));
            });
        }
    },
};
var Doodle = Doodle || {};
Doodle.GameState = {
    init: function (a) {
        (this.adTriggered = !1),
            (this.dontPlaysound = !1),
            this.game.world.setBounds(0, 0, 640, 960),
            (this.widthPlat = 114),
            (this.stats = JSON.parse(localStorage.getItem("DJ_stats")) || JSON.parse(this.game.cache.getText("stats"))),
            (this.stats.stats[15][1] = 0),
            (this.stats.achievements[0][2] = 0),
            (this.stats.achievements[1][2] = 0),
            (this.stats.achievements[2][2] = 0),
            (this.stats.achievements[3][2] = 0),
            (this.stats.achievements[4][2] = 0),
            (this.stats.achievements[5][2] = 0),
            (this.stats.achievements[6][2] = 0),
            (this.stats.achievements[7][2] = 0),
            (this.stats.achievements[8][2] = 0),
            (this.stats.achievements[9][2] = 0),
            (this.stats.achievements[10][2] = 0),
            (this.stats.achievements[12][2] = 0),
            (this.stats.achievements[13][2] = 0),
            (this.stats.achievements[14][2] = 0),
            (this.achievementsOrder = []),
            (this.death = this.death || 0),
            (this.localTopScores = JSON.parse(localStorage.getItem("DJ_localTopScores")) || []),
            (this.directionalShootingValue = localStorage.getItem("DJ_directionalShooting") || "true"),
            this.localTopScores.length > 10 && (this.localTopScores.length = 10),
            (this.name = localStorage.getItem("DJ_Doodle_name") || "Doodler"),
            (this.calibratedValue = +localStorage.getItem("DJ_calibrated") || 0),
            (document.getElementById("highscore").value = this.name),
            (this.propellerAppear = 9e3 * Math.random() + 1e3),
            (this.jetpackAppear = 9500 * Math.random() + 2500),
            (this.JETPACK_TIMES = 3),
            (this.game.physics.arcade.OVERLAP_BIAS = 16),
            (this.cursorContr = !1),
            (this.cursors = this.game.input.keyboard.createCursorKeys()),
            (this.inputNameListener = !1),
            (this.score = 0),
            (this.scoreMarkPool = this.add.group()),
            (this.platformPool = this.add.group()),
            (this.bonusPool = this.add.group()),
            (this.obstaclePool = this.add.group()),
            (this.bulletPool = this.add.group()),
            (this.bulletPool.enableBody = !0),
            (this.game.physics.arcade.gravity.y = 1728),
            (this.scenes0 = JSON.parse(this.game.cache.getText("scenes0"))),
            (this.scenes0.easyScenes = Phaser.ArrayUtils.shuffle(this.scenes0.easyScenes)),
            (this.scenes0.hardScenes = Phaser.ArrayUtils.shuffle(this.scenes0.hardScenes)),
            (this.easyScenesIndex = 0),
            (this.hardScenesIndex = 0),
            (this.ACCELERATION = +this.game.net.getQueryString("accel") || 50),
            (this.MAX_ACCELERATION = +this.game.net.getQueryString("maxaccel") || 600),
            (this.GYRO_SENSE = +this.game.net.getQueryString("gyrosense") || 40),
            "{}" == JSON.stringify(Doodle.GameState.ACCELERATION) && (this.ACCELERATION = 60),
            "{}" == JSON.stringify(Doodle.GameState.MAX_ACCELERATION) && (this.MAX_ACCELERATION = 700),
            "{}" == JSON.stringify(Doodle.GameState.GYRO_SENSE) && (this.GYRO_SENSE = 40);
    },
    create: function () {
        (enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)),
            enterKey.onDown.add(function () {
                document.getElementById("highscore").blur();
            }, this),
            (spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)),
            spaceBar.onDown.add(this.playerShoot, this);
        (this.gameOverStats = this.add.bitmapText(150, 500, "DoodleFont", "0", 60)),
            (this.gameOverStats1 = this.add.bitmapText(100, 420, "DoodleFont", "", 60)),
            (this.gameOverStats2 = this.add.bitmapText(190, 370, "DoodleFont", "", 60)),
            this.gameOverStats.anchor.setTo(0, 0.5),
            (this.gameOverGroup = this.add.group()),
            (this.gameOverText = new Phaser.Sprite(this.game, this.game.width / 2, 300, "atlas", "gameOver")),
            this.gameOverText.anchor.setTo(0.5),
            (this.appstore = new Phaser.Sprite(this.game, 10, 760, "appstore")),
            (this.appstore.inputEnabled = !0),
            this.appstore.events.onInputUp.add(function () {
                window.open("https://itunes.apple.com/us/app/doodle-jump-free-be-warned/id456355158?utm_source=web%20game&utm_medium=online&utm_campaign=html5_pilot", "_blank");
            }, this),
            (this.googleplay = new Phaser.Sprite(this.game, 10, 690, "googleplay")),
            (this.googleplay.inputEnabled = !0),
            this.googleplay.events.onInputUp.add(function () {
                window.open("https://play.google.com/store/apps/details?id=com.lima.doodlejump&utm_source=web%20game&utm_medium=online&utm_campaign=html5_pilot", "_blank");
            }, this),
            (this.menuButton = new Phaser.Sprite(this.game, 400, 700, "atlas", "menu_01")),
            (this.playAgainButton = new Phaser.Sprite(this.game, 360, 640, "atlas", "playAgain_01")),
            this.playAgainButton.anchor.setTo(0.5),
            (this.bottomGO = new Phaser.Sprite(this.game, 0, 830, "atlas", "bottom")),
            this.gameOverGroup.add(this.gameOverStats),
            this.gameOverGroup.add(this.gameOverStats1),
            this.gameOverGroup.add(this.gameOverStats2),
            this.gameOverGroup.add(this.appstore),
            this.gameOverGroup.add(this.googleplay),
            this.gameOverGroup.add(this.bottomGO),
            this.gameOverGroup.add(this.gameOverText),
            this.gameOverGroup.add(this.playAgainButton),
            this.gameOverGroup.add(this.menuButton),
            (this.gameOverGroup.visible = !1),
            (this.tapToChange = new Phaser.Sprite(this.game, 410, 510, "atlas", "tapToChange")),
            this.gameOverGroup.add(this.tapToChange),
            (this.playAgainButton.inputEnabled = !0),
            this.playAgainButton.events.onInputOut.add(function () {
                this.playAgainButton.loadTexture("atlas", "playAgain_01");
            }, this),
            this.playAgainButton.events.onInputUp.add(function () {
                7 == this.playAgainButton.frame && (this.adTriggered ? (this.state.start("Game"), this.playAgainButton.loadTexture("atlas", "playAgain_01"), this.writeScore()) : this.adTriggered = 0);
            }, this),
            this.playAgainButton.events.onInputDown.add(function () {
                this.playAgainButton.loadTexture("atlas", "playAgain_02");
            }, this),
            (this.overlay = this.add.bitmapData(300, 50)),
            (this.inputNamePole = new Phaser.Sprite(this.game, 330, 470, this.overlay)),
            (this.inputNamePole.inputEnabled = !0),
            this.inputNamePole.events.onInputUp.add(function () {
                this.inputTextSchedule(), document.getElementById("highscore").focus(), document.getElementById("highscore").setSelectionRange(1e3, 1e3), (this.inputNameListener = !0);
            }, this),
            this.gameOverGroup.add(this.inputNamePole),
            (this.menuButton.inputEnabled = !0),
            this.menuButton.events.onInputOut.add(function () {
                this.menuButton.loadTexture("atlas", "menu_01");
            }, this),
            this.menuButton.events.onInputUp.add(function () {
                5 == this.menuButton.frame && (this.adTriggered ? (this.state.start("Menu"), this.menuButton.loadTexture("atlas", "menu_01"), this.writeScore()) : this.adTriggered = 0);
            }, this),
            this.menuButton.events.onInputDown.add(function () {
                this.menuButton.loadTexture("atlas", "menu_02");
            }, this),
            (this.panel = this.add.sprite(0, -23, "atlas", "top")),
            (this.panel.fixedToCamera = !0),
            (this.panel.alpha = 0.55);
        (this.coinsCountLabel = this.add.bitmapText(15, 5, "DoodleFont", "0", 60)),
            (this.coinsCountLabel.fixedToCamera = !0),
            (this.coinsCountLabel.fontWeight = "bold"),
            (this.background = this.add.sprite(0, 0, "atlas2", "background")),
            (this.background.fixedToCamera = !0),
            this.game.world.sendToBack(this.background),
            (this.precedingPlatform = { x: this.game.world.centerX, y: this.game.world.height - 30, hasBonusObject: -1 }),
            (this.player = this.add.sprite(this.game.world.centerX, this.game.world.height - 200, "player0")),
            this.player.anchor.setTo(0.5),
            this.game.physics.arcade.enable(this.player),
            this.player.body.setSize(60, 90, this.player.width / 2 - 30, this.player.height / 2 - 45 + 20),
            (this.player.body.velocity.y = -1080),
            (this.player.playerTimer = this.game.time.create(!1)),
            this.player.playerTimer.start(),
            (this.trunk = new Phaser.Sprite(this.game, 0, 0, "atlas", "trunk")),
            this.trunk.anchor.setTo(0.5),
            this.player.addChild(this.trunk),
            (this.trunk.visible = !1),
            (this.pauseButton = this.add.sprite(this.game.width - 50, 30, "atlas", "pause")),
            (this.pauseButton.inputEnabled = !0),
            this.pauseButton.events.onInputDown.add(this.pauseGame, this),
            (this.pauseButton.fixedToCamera = !0),
            (this.pauseButton.hitArea = new Phaser.Rectangle(-15, -15, 53, 60)),
            (this.pausePanelGroup = this.add.group()),
            (this.pausePanelGroup.y = this.game.height),
            (this.pauseCover = new Phaser.Sprite(this.game, 0, 0, "atlas3", "pauseCover")),
            (this.pauseCover.fixedToCamera = !0),
            (this.resumeButton = new Phaser.Sprite(this.game, 300, 800, "atlas", "resume_01")),
            (this.resumeButton.fixedToCamera = !0),
            this.pausePanelGroup.add(this.pauseCover),
            this.pausePanelGroup.add(this.resumeButton),
            (this.sounds = {}),
            (this.sounds.jump = this.add.audio("jump")),
            (this.sounds.beake_platfrom = this.add.audio("beake_platfrom")),
            (this.sounds.shoot = this.add.audio("shoot")),
            (this.sounds.shoot2 = this.add.audio("shoot2")),
            (this.sounds.spring = this.add.audio("spring")),
            (this.sounds.falling = this.add.audio("falling")),
            (this.sounds.jetpack = this.add.audio("jetpack")),
            (this.sounds.propeller = this.add.audio("propeller")),
            (this.sounds.monster_warning = this.add.audio("monster_warning")),
            (this.sounds.monster_warning.loop = !0),
            (this.sounds.monster_kill = this.add.audio("monster_kill")),
            (this.sounds.monster_hit = this.add.audio("monster_hit")),
            (this.sounds.jumponmonster = this.add.audio("jumponmonster")),
            (this.sounds.ufo_kill = this.add.audio("ufo_kill")),
            (this.sounds.ufo_warning = this.add.audio("ufo_warning")),
            (this.sounds.ufo_abduct = this.add.audio("ufo_abduct")),
            (this.sounds.black_hole = this.add.audio("black_hole")),
            (this.sounds.white = this.add.audio("white")),
            this.loadScoreMarks();
        var a,
            b = (-1 != navigator.userAgent.indexOf("AppleWebKit"), /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, new FULLTILT.getDeviceOrientation({ type: "world" })),
            c = this;
        b
            .then(function (b) {
                a = b;
            })
            ["catch"](function (a) {
                console.error(a);
            }),
            (function d() {
                if (a) {
                    var b = a.getScreenAdjustedEuler();
                    c.cursorContr ||
                        c.game.paused ||
                        !c.player.alive ||
                        ((c.player.body.velocity.x = b.gamma * c.GYRO_SENSE * Math.cos((b.beta * Math.PI) / 180) + c.calibratedValue),
                        b.gamma * c.GYRO_SENSE * Math.cos((b.beta * Math.PI) / 180) + c.calibratedValue > 0 ? c.player.frame < 2 && c.player.scale.setTo(-1, 1) : c.player.frame < 2 && c.player.scale.setTo(1, 1));
                }
                requestAnimationFrame(d);
            })(),
            this.cursors.up.onDown.add(this.playerShoot, this),
            this.game.input.onTap.add(function () {
                "true" == this.directionalShootingValue ? this.playerShoot(1) : this.playerShoot();
            }, this),
            this.game.input.onUp.add(function () {
                this.game.paused && (this.resumeButton.getBounds().contains(this.game.input.x, this.game.input.y) && this.unPauseGame(), this.resumeButton.loadTexture("atlas", "resume_01"));
            }, this),
            this.game.input.onDown.add(function () {
                this.game.paused && this.resumeButton.getBounds().contains(this.game.input.x, this.game.input.y) && this.resumeButton.loadTexture("atlas", "resume_02");
            }, this),
            this.loadLevel();
    },
    update: function () {
        this.player.y > 2400 && !this.adTriggered,
            this.player.alive &&
                (this.cursors.left.isDown
                    ? ((this.cursorContr = !0),
                      this.player.body.velocity.x >= 0
                          ? (this.player.body.velocity.x = -this.ACCELERATION)
                          : ((this.player.body.velocity.x -= this.ACCELERATION), this.player.body.velocity.x < -this.MAX_ACCELERATION && (this.player.body.velocity.x = -this.MAX_ACCELERATION)),
                      this.player.frame < 2 && this.player.scale.setTo(1, 1))
                    : this.cursors.right.isDown
                    ? ((this.cursorContr = !0),
                      this.player.body.velocity.x <= 0
                          ? (this.player.body.velocity.x = this.ACCELERATION)
                          : ((this.player.body.velocity.x += this.ACCELERATION), this.player.body.velocity.x > this.MAX_ACCELERATION && (this.player.body.velocity.x = this.MAX_ACCELERATION)),
                      this.player.frame < 2 && this.player.scale.setTo(-1, 1))
                    : !this.cursors.right.isDown &&
                      !this.cursors.left.isDown & (0 != this.player.body.velocity.x) &&
                      (Math.abs(this.player.body.velocity.x) > this.ACCELERATION
                          ? (this.player.body.velocity.x -= (this.player.body.velocity.x / Math.abs(this.player.body.velocity.x)) * this.ACCELERATION)
                          : (this.player.body.velocity.x = 0))),
            this.player.body.velocity.y > 1080 && (this.player.body.velocity.y = 1080),
            this.player.y < 0.48 * this.game.world.height && this.player.alive && this.moveScreen(this.player.y - 0.48 * this.game.world.height),
            this.precedingPlatform.y + 2 * this.score > 0 && (this.score > 5e3 && !this.player.withBonus && Math.random() > 0.95 ? this.loadScene() : this.loadLevel()),
            this.player.alive &&
                (this.platformPool.forEach(function (a) {
                    a.top >= this.game.world.height - this.platformPool.y && a.kill();
                }, this),
                this.bonusPool.forEach(function (a) {
                    a.top >= this.game.world.height - this.bonusPool.y && ("bonus2" == a.type && !a.used && a.alive && ((this.stats.achievements[10][2] += 1), this.stats.achievements[10][2] >= 3 && this.achieveMentUnlock(10)), a.kill());
                }, this),
                this.obstaclePool.forEach(function (a) {
                    a.top >= this.game.world.height - this.obstaclePool.y &&
                        (a.alive &&
                            4 != a.type &&
                            ((this.stats.achievements[4][2] += 1), (this.stats.achievements[5][2] += 1), this.stats.achievements[4][2] >= 10 && this.achieveMentUnlock(4), this.stats.achievements[5][2] >= 30 && this.achieveMentUnlock(5)),
                        a.kill());
                }, this)),
            this.game.physics.arcade.overlap(this.player, this.platformPool, this.jumpState, null, this),
            this.game.physics.arcade.overlap(this.player, this.bonusPool, this.bonusActivate, this.bonusNotActivate, this),
            this.game.physics.arcade.overlap(this.player, this.obstaclePool, this.obstacleUSE, null, this),
            this.game.physics.arcade.overlap(this.bulletPool, this.obstaclePool, this.enemyKill, this.enemyCheck, this),
            this.player.x > this.game.world.width && (this.player.x -= this.game.world.width),
            this.player.x < 0 && (this.player.x += this.game.world.width),
            this.player.y > this.game.world.height && 2400 != this.game.world.bounds.height && this.gameOver(0, null),
            this.inputNameListener &&
                ("highscore" != document.activeElement.id && (this.player.playerTimer.remove(this.player.inputTimer), (this.gameOverStats.text = "your name:" + this.name), (this.inputNameListener = !1)),
                document.getElementById("highscore").value != this.name &&
                    ((document.getElementById("highscore").value = document.getElementById("highscore").value.replace(/\W/g, "")),
                    (this.name = document.getElementById("highscore").value),
                    (this.gameOverStats.text = "your name:" + this.name)));
    },
    gameOver: function (a, b) {
        if ("fearless" != this.name) {
            if (((this.player.alive = !1), 0 == a)) {
                if (((self = this), this.death++, this.death % 5 === 0)) {
                    (this.popUPMenu = this.add.sprite(this.game.width / 2, 2880, "popupAtlas", "blank")),
                        this.popUPMenu.anchor.setTo(0.5),
                        (this.popUPMenu.close = this.add.sprite(353 - this.popUPMenu.width / 2, 378 - this.popUPMenu.height / 2, "popupAtlas", "close")),
                        this.popUPMenu.close.anchor.setTo(0.5),
                        (this.popUPMenu.close.inputEnabled = !0),
                        this.popUPMenu.close.events.onInputDown.add(function () {
                            this.add.tween(this.popUPMenu).to({ y: 2880 }, 1e3).start();
                        }, this),
                        this.popUPMenu.addChild(this.popUPMenu.close),
                        (this.popUPMenu.playNow = this.add.sprite(160 - this.popUPMenu.width / 2, 385 - this.popUPMenu.height / 2, "popupAtlas", "playNow")),
                        this.popUPMenu.playNow.anchor.setTo(0.5),
                        (this.popUPMenu.playNow.inputEnabled = !0),
                        this.popUPMenu.playNow.events.onInputUp.add(function () {
                            this.game.device.android
                                ? window.open("https://play.google.com/store/apps/details?id=com.lima.doodlejump&utm_source=web%20game&utm_medium=online&utm_campaign=html5_pilot", "_blank")
                                : this.game.device.iOS
                                ? window.open("https://itunes.apple.com/us/app/doodle-jump-free-be-warned/id456355158?utm_source=web%20game&utm_medium=online&utm_campaign=html5_pilot", "_blank")
                                : this.game.device.iOS ||
                                  (Math.random() > 0.5
                                      ? window.open("https://play.google.com/store/apps/details?id=com.lima.doodlejump&utm_source=web%20game&utm_medium=online&utm_campaign=html5_pilot", "_blank")
                                      : window.open("https://itunes.apple.com/us/app/doodle-jump-free-be-warned/id456355158?utm_source=web%20game&utm_medium=online&utm_campaign=html5_pilot", "_blank"));
                        }, this),
                        this.popUPMenu.addChild(this.popUPMenu.playNow);
                    var c = [];
                    this.game.device.android ? (c = [1]) : this.game.device.iOS ? (c = [0]) : this.game.device.iOS || (c = [0, 1]);
                    for (var d = 0, e = 0; e < c.length; e++) {
                        switch (c[e]) {
                            case 0:
                                var f = "appstore",
                                    g = "https://itunes.apple.com/us/app/doodle-jump-free-be-warned/id456355158?utm_source=web%20game&utm_medium=online&utm_campaign=html5_pilot";
                                break;
                            case 1:
                                var f = "googleplay",
                                    g = "https://play.google.com/store/apps/details?id=com.lima.doodlejump&utm_source=web%20game&utm_medium=online&utm_campaign=html5_pilot";
                        }
                        var h = 140 * d - 70 * (c.length - 1);
                        d++;
                        var i = this.popUPMenu["image" + c[e]];
                        (i = this.add.sprite(h, 290 - this.popUPMenu.height / 2, "popupAtlas", f)),
                            i.anchor.setTo(0.5),
                            (i.inputEnabled = !0),
                            (i.link = g),
                            i.events.onInputUp.add(function (a) {
                                window.open(a.link, "_blank");
                            }, this),
                            this.popUPMenu.addChild(i);
                    }
                    this.add.tween(this.popUPMenu).to({ y: 1920 }, 1e3).start();
                }
                this.achievementName && this.achievementName.destroy(),
                    this.achievementHolder && this.achievementHolder.destroy(),
                    this.player.playerTimer.running &&
                        ((this.stats.stats[4][1] += Math.round(this.player.playerTimer.seconds)),
                        this.stats.stats[5][1] < Math.round(this.player.playerTimer.seconds) && (this.stats.stats[5][1] = Math.round(this.player.playerTimer.seconds)),
                        (this.stats.stats[6][1] = Math.round(this.player.playerTimer.seconds)),
                        0 == a && (this.stats.stats[23][1] += 1)),
                    this.dontPlaysound || this.sounds.falling.play(),
                    (this.scoreMarkPool.x += this.game.width),
                    this.platformPool.forEach(function (a) {
                        a.animations.currentAnim && a.kill();
                    }, this),
                    this.obstaclePool.forEach(function (a) {
                        a.kill();
                    }, this),
                    this.bonusPool.forEach(function (a) {
                        a.kill();
                    }, this),
                    this.game.device.android ? ((this.appstore.visible = !1), (this.googleplay.y = 725)) : this.game.device.iOS && ((this.googleplay.visible = !1), (this.appstore.y = 725)),
                    this.game.world.setBounds(0, 0, 640, 2400),
                    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.2, 0.2),
                    (this.gameOverGroup.y = 1440),
                    (this.gameOverGroup.visible = !0),
                    this.setHighScore(),
                    (this.gameOverStats.text = "your name:" + this.name),
                    (this.gameOverStats1.text = "your high score: " + this.localTopScores[0][1]),
                    (this.gameOverStats2.text = "your score: " + Math.round(this.score));
            }
            2 == a &&
                (this.player.body.velocity.y < 0 && (this.player.body.velocity.y = 0),
                (stars = new Phaser.Sprite(this.game, -40, -60, "atlas", "stars_01")),
                stars.animations.add("stars", ["atlas", "stars_01", "stars_02", "stars_03"], 24, !0),
                stars.play("stars"),
                this.player.addChild(stars),
                this.game.world.bringToTop(this.player)),
                1 == a &&
                    ((offsetX = 0),
                    (offsetY = 0),
                    (offsetTime = 0),
                    6 == b.type && b.animations.currentAnim ? ((offsetX = 0), (offsetY = -80)) : 4 == b.type && ((offsetX = 0), (offsetY = -25), (offsetTime = 400)),
                    (b.suckYou = !0),
                    (this.player.allowGravity = !1),
                    (tween = this.game.add.tween(this.player).to({ x: b.x + offsetX, y: b.y + this.obstaclePool.y + offsetY }, 1e3 - offsetTime, Phaser.Easing.Linear.None)),
                    (tween2 = this.game.add.tween(this.player.scale).to({ x: 0, y: 0 }, 1e3 - offsetTime, Phaser.Easing.Linear.None)),
                    tween2.onComplete.addOnce(function () {
                        this.gameOver(0, null), (this.player.y = this.game.height), (this.player.allowGravity = !0);
                    }, this),
                    tween.start(),
                    (this.dontPlaysound = !0),
                    tween2.start());
        } else 0 == a && (this.player.body.velocity.y = -2080);
    },
    distanceBtwPlatforms: function (a) {
        if (null == a) {
            var b = 25 + Math.random() * ((150 + this.score) / 150);
            b > 90 && (b = 90), 2 == this.precedingPlatform.type && b > 50 && (b = 50);
        } else var b = 0;
        if (-1 != this.precedingPlatform.hasBonusObject) {
            b += 15;
            var c = 30 + Math.random() * ((50 + this.score) / 50);
            2 == this.precedingPlatform.hasBonusObject && (b += 10), c > 70 && (c = 70), (b += c);
        }
        return b;
    },
    loadLevel: function () {
        for (; this.precedingPlatform.y + 2 * this.score > -100; ) {
            this.foundY = this.precedingPlatform.y - 2 * this.distanceBtwPlatforms();
            var a = this.spawnPlatform(this.game, Math.random() * (this.game.world.width - this.widthPlat) + this.widthPlat / 2, this.foundY, "platform0", this.precedingPlatform, this.score);
            2 != a.type &&
                (this.jetpackAppear < 0 && this.JETPACK_TIMES > 0
                    ? (this.JETPACK_TIMES--, (a.hasBonusObject = 2), (this.jetpackAppear = 1e4 * Math.random() + 1e4), this.spawnBonus(2, a))
                    : this.propellerAppear < 0
                    ? ((a.hasBonusObject = 3), (this.propellerAppear = 1e4 * Math.random() + 1e4), this.spawnBonus(3, a))
                    : Math.random() > 0.9 && ((a.hasBonusObject = 0), this.spawnBonus(0, a))),
                (this.precedingPlatform = a);
        }
    },
    jumpState: function (a, b) {
        a.alive &&
            b.alive &&
            b.y + b.height / 2 + this.platformPool.y > a.bottom &&
            a.body.velocity.y > 0 &&
            (2 == b.type &&
                ((b.body.velocity.x = 0),
                (b.body.allowGravity = !0),
                b.animations.add("breake", ["atlas", "platform2", "platformSheet_02", "platformSheet_03", "platformSheet_04"], 24, !1),
                b.play("breake"),
                (this.stats.achievements[14][2] += 1),
                this.stats.achievements[14][2] >= 50 && this.achieveMentUnlock(14),
                (this.stats.achievements[15][2] += 1),
                this.stats.achievements[15][2] >= 1e3 && this.achieveMentUnlock(15),
                (b.alive = !1),
                this.sounds.beake_platfrom.play()),
            2 != b.type &&
                ((0 != a.frame && 2 != a.frame) ||
                    ((a.frame += 1),
                    this.player.playerTimer.add(
                        (20 * Phaser.Timer.SECOND) / 60,
                        function () {
                            a.frame -= 1;
                        },
                        this
                    )),
                3 == b.type ? this.sounds.white.play() : this.sounds.jump.play(),
                (a.body.velocity.y = -1080),
                0 == b.type && ((this.stats.achievements[12][2] += 1), this.stats.achievements[12][2] >= 200 && this.achieveMentUnlock(12)),
                1 == b.type && ((this.stats.achievements[13][2] += 1), this.stats.achievements[13][2] >= 100 && this.achieveMentUnlock(13)),
                (this.stats.stats[13][1] += 1),
                (this.stats.stats[15][1] += 1),
                (this.stats.achievements[0][2] = 0),
                (this.stats.achievements[1][2] = 0)),
            3 == b.type && b.kill());
    },
    bonusActivate: function (a, b) {
        a.alive && !b.used && b.bonusAction(a, b, this.bonusPool);
    },
    bonusNotActivate: function (a, b) {
        return a.alive && !b.used ? (b.top + b.bottom) / 2 + this.bonusPool.y > a.top : void 0;
    },
    obstacleUSE: function (a, b) {
        a.alive &&
            !a.withBonus &&
            b.alive &&
            (b.y + b.height / 2 + this.obstaclePool.y > a.bottom && a.body.velocity.y > 0 && 4 != b.type
                ? ((b.body.allowGravity = !0),
                  (a.body.velocity.y = -1080),
                  (b.body.velocity.y = 360),
                  (b.alive = !1),
                  (this.stats.achievements[2][2] += 1),
                  (this.stats.achievements[3][2] += 1),
                  this.stats.achievements[2][2] >= 10 && this.achieveMentUnlock(2),
                  this.stats.achievements[3][2] >= 30 && this.achieveMentUnlock(3),
                  6 == b.type && this.achieveMentUnlock(17),
                  6 == b.type ? (this.stats.stats[11][1] += 1) : (this.stats.stats[9][1] += 1),
                  this.sounds.jumponmonster.play())
                : 4 == b.type || 6 == b.type
                ? (6 == b.type && (b.sounds.ufo_abduct.play(), (this.stats.stats[25][1] += 1)), 4 == b.type && (b.sounds.black_hole.play(), (this.stats.stats[26][1] += 1)), this.gameOver(1, b))
                : (this.gameOver(2, b), this.sounds.monster_hit.play(), (this.stats.stats[24][1] += 1))),
            a.alive && a.withBonus && b.alive && 4 != b.type && 3 == a.bonusType && (b.kill(), this.achieveMentUnlock(16));
    },
    moveScreen: function (a) {
        (this.player.y -= a),
            (this.platformPool.y -= a),
            (this.bonusPool.y -= a),
            (this.scoreMarkPool.y -= a),
            (this.obstaclePool.y -= a),
            (this.score -= a / 2),
            (this.jetpackAppear += a / 2),
            (this.propellerAppear += a / 2),
            this.score > 1e5 && 1 != this.stats.achievements[18][3] && this.achieveMentUnlock(18),
            (this.coinsCountLabel.text = Math.round(this.score));
    },
    spawnBonus: function (a, b) {
        var c = this.bonusPool.getFirstExists(!1);
        c ? c.reset(b.x, b.top + 5, "bonus" + a, b, this.score) : ((c = new Doodle.Bonus(this.game, b.x, b.top + 5, "bonus" + a, b, this.score, this.sounds, this.stats)), this.bonusPool.add(c));
    },
    spawnPlatform: function (a, b, c, d, e, f, g) {
        var h = this.platformPool.getFirstExists(!1);
        return h ? h.reset(b, c, d, e, f, g) : ((h = new Doodle.Platform(a, b, c, d, e, f, g)), this.platformPool.add(h)), h;
    },
    spanwObstacle: function (a, b, c, d) {
        var e = this.obstaclePool.getFirstExists(!1);
        return e ? e.reset(b, c, d) : ((e = new Doodle.Obstacle(a, b, c, d, this.sounds, this.stats, this.obstaclePool)), this.obstaclePool.add(e)), e;
    },
    loadScene: function () {
        var a = this.precedingPlatform.y - 2 * this.distanceBtwPlatforms(1);
        this.score >= 15e3 ? ((index = this.hardScenesIndex), (array = this.scenes0.hardScenes), this.hardScenesIndex++) : ((index = this.easyScenesIndex), (array = this.scenes0.easyScenes), this.easyScenesIndex++),
            array[index].forEach(function (b, c) {
                if (b.type < 4) {
                    var d = this.spawnPlatform(this.game, 2 * b.x, a - 2 * b.y, "platform0", this.precedingPlatform, this.score, b.type);
                    this.last = d;
                } else if (5 == b.type) {
                    var d = this.spawnPlatform(this.game, 2 * b.x, a - 2 * b.y, "platform0", this.precedingPlatform, this.score, 0);
                    this.spawnBonus(0, d), (this.last = d);
                } else {
                    this.spanwObstacle(this.game, 2 * b.x, a - 2 * b.y, b.type);
                }
            }, this),
            (this.precedingPlatform = this.last),
            this.easyScenesIndex >= this.scenes0.easyScenes.length && (this.easyScenesIndex = 0),
            this.hardScenesIndex >= this.scenes0.hardScenes.length && (this.hardScenesIndex = 0);
    },
    playerShoot: function (a) {
        this.game.paused ||
            ((velx = 0),
            (offsetX = 0),
            (this.trunk.angle = 0),
            this.player.alive &&
                !this.player.withBonus &&
                (Math.random() > 0.5 ? this.sounds.shoot2.play() : this.sounds.shoot.play(),
                this.player.frame < 2 && ((this.player.frame += 2), (this.trunk.visible = !0)),
                1 == a &&
                    ((velx = (1e3 * (this.game.input.activePointer.position.x - this.game.world.width / 2)) / (this.game.world.width / 2)),
                    (this.trunk.angle = this.player.scale.x * (Math.acos((-1 * velx) / Math.sqrt(Math.pow(-1e3, 2) + Math.pow(velx, 2))) * (180 / Math.PI) - 90)),
                    (offsetX = this.player.scale.x * ((this.trunk.height / 2) * Math.sin(this.trunk.angle * (Math.PI / 180))))),
                this.spawnBullet(this.game, this.trunk.x + this.player.x + offsetX, this.trunk.top + this.player.y, "bullet", velx),
                this.player.playerTimer.remove(this.player.shootTimer),
                (this.player.shootTimer = this.player.playerTimer.add(
                    (20 * Phaser.Timer.SECOND) / 60,
                    function () {
                        (this.player.frame -= 2), this.player.body.velocity.x < 0 ? this.player.scale.setTo(1, 1) : this.player.scale.setTo(-1, 1), (this.trunk.visible = !1), this.player.playerTimer.remove(this.player.shootTimer);
                    },
                    this
                ))));
    },
    spawnBullet: function (a, b, c, d, e) {
        var f = this.bulletPool.getFirstExists(!1);
        f ? f.reset(b, c, d) : ((f = new Doodle.Bullet(a, b, c, d, this.stats)), this.bulletPool.add(f)), (f.body.velocity.y = -1920), (f.body.allowGravity = !1), (f.body.velocity.x = e);
    },
    enemyCheck: function (a, b) {
        return 6 == b.type && b.animations.currentAnim ? ((hz = a.y + 40 < b.y + this.obstaclePool.y), hz && this.enemyKill(a, b), !1) : void 0;
    },
    enemyKill: function (a, b) {
        4 != b.type &&
            (b.suckYou && (tween.stop(), tween2.stop(), this.player.scale.setTo.x <= 0 ? this.player.scale.setTo(-1, 1) : this.player.scale.setTo(1, 1), (this.player.alive = !0), this.achieveMentUnlock(11)), b.damage(1), a.kill());
    },
    pauseGame: function () {
        this.player.alive && ((this.game.paused = !0), (this.pausePanelGroup.y = 0));
    },
    unPauseGame: function () {
        (this.game.paused = !1), (this.pausePanelGroup.y = this.game.height);
    },
    setHighScore: function () {
        function a(a, b) {
            return a[1] === b[1] ? 0 : a[1] < b[1] ? 1 : -1;
        }
        this.localTopScores.push(["findIndex", Math.round(this.score)]), this.localTopScores.sort(a);
        for (var b = 0; 11 > b; b++)
            if ("findIndex" == this.localTopScores[b][0]) {
                (this.setScoreName = b), (this.localTopScores[b][0] = this.name);
                break;
            }
        if ("object" == typeof localStorage)
            try {
                localStorage.setItem("DJ_localTopScores", JSON.stringify(this.localTopScores));
            } catch (c) {
                console.log("Progress not saved");
            }
    },
    loadScoreMarks: function () {
        this.localTopScores.forEach(function (a) {
            (scoreMark = new Phaser.Sprite(this.game, 640, 960 - 2 * a[1] - 0.48 * this.game.world.height, "atlas", "scoreMark")), this.scoreMarkPool.add(scoreMark), scoreMark.anchor.setTo(1);
            (this.nameMark = this.add.bitmapText(630, 960 - 2 * a[1] - 0.48 * this.game.world.height - 5, "DoodleFont", a[0], 24)), this.nameMark.anchor.setTo(1), this.scoreMarkPool.add(this.nameMark);
        }, this);
    },
    inputTextSchedule: function (a) {
        this.player.inputTimer = this.player.playerTimer.add(
            (20 * Phaser.Timer.SECOND) / 60,
            function () {
                null == a && ((this.gameOverStats.text = "your name:" + this.name + "|"), this.inputTextSchedule("|")), "|" == a && ((this.gameOverStats.text = "your name:" + this.name), this.inputTextSchedule());
            },
            this
        );
    },
    writeScore: function () {
        if (
            ((this.stats.stats[2][1] = Math.round(this.score)),
            (this.stats.stats[0][1] += 1),
            (this.stats.stats[1][1] = this.localTopScores[0][1]),
            (this.stats.stats[3][1] = Math.round((this.stats.stats[3][1] * (this.stats.stats[0][1] - 1) + Math.round(this.score)) / this.stats.stats[0][1])),
            this.stats.stats[14][1] < this.stats.stats[15][1] && (this.stats.stats[14][1] = this.stats.stats[15][1]),
            (this.stats.stats[16][1] = Math.round((this.stats.stats[16][1] * (this.stats.stats[0][1] - 1) + this.stats.stats[15][1]) / this.stats.stats[0][1])),
            document.getElementById("highscore").blur(),
            "" == this.name && (this.name = "unnamed"),
            (this.localTopScores[this.setScoreName][0] = this.name),
            "object" == typeof localStorage)
        )
            try {
                localStorage.setItem("DJ_localTopScores", JSON.stringify(this.localTopScores)), localStorage.setItem("DJ_stats", JSON.stringify(this.stats)), localStorage.setItem("DJ_Doodle_name", this.name);
            } catch (a) {
                console.log("Progress not saved");
            }
    },
    achieveMentUnlock: function (a, b) {
        if (1 != this.stats.achievements[a][3] && (b || this.achievementsOrder.push(a), null == this.achievementsOrder[1])) {
            this.achievementsGroup = this.add.group();
            (this.achievementName = this.add.bitmapText(this.game.world.width / 2, 1015, "DoodleFont2", this.stats.achievements[a][0], 60)),
                this.achievementName.anchor.setTo(0.5),
                (this.achievementHolder = this.add.sprite(this.game.world.width / 2, 1002, "atlas2", "achievementHolder")),
                this.achievementHolder.anchor.setTo(0.5),
                this.achievementsGroup.add(this.achievementHolder),
                this.achievementsGroup.add(this.achievementName),
                (this.stats.achievements[a][3] = 1),
                (tween1 = this.game.add.tween(this.achievementsGroup).to({ y: -84 }, 1e3, Phaser.Easing.Linear.None)),
                (tween12 = this.game.add.tween(this.achievementsGroup).to({ y: 0 }, 1e3, Phaser.Easing.Linear.None)),
                tween1.onComplete.addOnce(function () {
                    setTimeout(function () {
                        tween12.start();
                    }, 1e3);
                }, this),
                tween12.onComplete.addOnce(function () {
                    this.achievementsGroup.destroy(), this.achievementsOrder.shift(), this.achievementsOrder.length > 0 && this.achieveMentUnlock(this.achievementsOrder[0], !0);
                }, this),
                tween1.start();
        }
    },
    initIOScontrol: function () {
        var a = -1 != navigator.userAgent.indexOf("AppleWebKit"),
            b = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
            c = this;
        if (a && b) {
            console.log("game", "register message listener");
            var d = window.addEventListener ? "addEventListener" : "attachEvent",
                e = window[d],
                f = "attachEvent" == d ? "onmessage" : "message";
            e(f, function (a) {
                var b = a.message ? "message" : "data",
                    d = a[b];
                console.log("game", d),
                    d.mssg &&
                        "deviceorientation" == d.mssg &&
                        "Game" == Doodle.game.state.current &&
                        (console.log(d.event.alpha, d.event.beta, d.event.gamma),
                        c.cursorContr ||
                            c.game.paused ||
                            !c.player.alive ||
                            ((c.player.body.velocity.x = d.event.gamma * c.GYRO_SENSE * Math.cos((d.event.beta * Math.PI) / 180) + c.calibratedValue),
                            c.player.body.velocity.x > 0 ? c.player.frame < 2 && c.player.scale.setTo(-1, 1) : c.player.frame < 2 && c.player.scale.setTo(1, 1)));
            });
        }
    },
};
var Doodle = Doodle || {};
Doodle.MenuState = {
    init: function () {},
    create: function () {
        (this.jumpSound = this.add.audio("jump")), this.game.world.setBounds(0, 0, 640, 960), (this.game.physics.arcade.gravity.y = 1728), (this.bgMenu = this.add.sprite(0, 0, "atlas3", "bgMenu"));
        var a = [];
        this.game.device.android ? (a = [1]) : this.game.device.iOS ? (a = [0]) : this.game.device.iOS || (a = [0, 1]);
        for (var b = 0; b < a.length; b++) {
            switch (a[b]) {
                case 0:
                    var c = "appstore",
                        d = "https://itunes.apple.com/us/app/doodle-jump-free-be-warned/id456355158?utm_source=web%20game&utm_medium=online&utm_campaign=html5_pilot";
                    break;
                case 1:
                    var c = "googleplay",
                        d = "https://play.google.com/store/apps/details?id=com.lima.doodlejump&utm_source=web%20game&utm_medium=online&utm_campaign=html5_pilot";
            }
            var e = 85 + 140 * b,
                f = this["imageLink" + a[b]];
            (f = this.add.sprite(e, 900, "popupAtlas", c)),
                f.anchor.setTo(0.5),
                (f.inputEnabled = !0),
                (f.link = d),
                f.events.onInputUp.add(function (a) {
                    window.open(a.link, "_blank");
                }, this);
        }
        (this.platform = this.add.sprite(60, 750, "atlas", "platform0")),
            this.game.physics.arcade.enable(this.platform),
            (this.platform.body.allowGravity = !1),
            (this.platform.body.immovable = !0),
            (this.player = this.add.sprite(115, this.game.world.height + 100, "player0")),
            this.player.anchor.setTo(0.5),
            this.game.physics.arcade.enable(this.player),
            this.player.body.setSize(60, 90, 0, 20),
            (this.player.body.velocity.y = -2100),
            this.player.scale.setTo(-1, 1),
            (this.ufo = new Doodle.Obstacle(this.game, 500, 150, "6")),
            this.ufo.animations.add("beam", ["atlas", "ufo_01", "ufo_02"], 24, !0),
            this.ufo.play("beam"),
            this.add.existing(this.ufo),
            (this.game.sound.volume = 0.3),
            (this.playButton = this.add.sprite(130, 230, "atlas", "Play_01")),
            (this.playButton.inputEnabled = !0),
            this.playButton.events.onInputUp.add(function () {
                11 == this.playButton.frame &&
                    (this.camera.fade("#000000"),
                    this.camera.onFadeComplete.add(function () {
                        this.state.start("Game"), this.playButton.loadTexture("atlas", "Play_01");
                    }, this));
            }, this),
            this.playButton.events.onInputDown.add(function () {
                this.playButton.loadTexture("atlas", "Play_02");
            }, this),
            this.playButton.events.onInputOut.add(function () {
                this.playButton.loadTexture("atlas", "Play_01");
            }, this),
            (this.optionsButton = this.add.sprite(this.world.game.width - 140, this.world.game.height - 240, "atlas2", "opt")),
            (this.optionsButton.inputEnabled = !0),
            this.optionsButton.events.onInputUp.add(function () {
                29 == this.optionsButton.frame && this.state.start("Settings");
            }, this),
            this.optionsButton.events.onInputDown.add(function () {
                this.optionsButton.loadTexture("atlas2", "opt1");
            }, this),
            this.optionsButton.events.onInputOut.add(function () {
                this.optionsButton.loadTexture("atlas2", "opt");
            }, this),
            (this.scoresButton = this.add.sprite(this.world.game.width - 260, this.world.game.height - 240, "atlas2", "opt2")),
            (this.scoresButton.inputEnabled = !0),
            this.scoresButton.events.onInputUp.add(function () {
                32 == this.scoresButton.frame && this.state.start("Scores");
            }, this),
            this.scoresButton.events.onInputDown.add(function () {
                this.scoresButton.loadTexture("atlas2", "opt3");
            }, this),
            this.scoresButton.events.onInputOut.add(function () {
                this.scoresButton.loadTexture("atlas2", "opt2");
            }, this),
            (this.soundToggleValue = localStorage.getItem("DJ_soundToggle") || !0),
            "false" == this.soundToggleValue ? (this.game.sound.mute = !0) : (this.game.sound.mute = !1);
    },
    update: function () {
        this.game.physics.arcade.overlap(this.player, this.platform, this.collide, null, this);
    },
    collide: function (a, b) {
        a.body.velocity.y > 0 && this.jumpSound.play(), (a.body.velocity.y = -1080);
    },
};
var Doodle = Doodle || {};
Doodle.PreloadState = {
    preload: function () {
        var a = (this.game.add.image(0, 0, "loadingscreen"), this.game.add.image(320, 581, "limaskylogo"));
        a.anchor.setTo(0.5), a.scale.setTo(4.63), (a.alpha = 0);
        var b = this.game.add.image(320, 332, "cloudgameslogo");
        b.anchor.setTo(0.5), b.scale.setTo(5), (b.alpha = 0);
        var c = this.game.add.tween(b).to({ alpha: 0.28 }, 146, Phaser.Easing.Linear.None).start(),
            d = this.game.add.tween(b.scale).to({ x: 3.8, y: 3.8 }, 146, Phaser.Easing.Linear.None).start(),
            e = this.game.add.tween(b).to({ alpha: 1 }, 374, Phaser.Easing.Linear.None),
            f = this.game.add.tween(b.scale).to({ x: 0.8, y: 0.8 }, 374, Phaser.Easing.Linear.None),
            g = this.game.add.tween(b.scale).to({ x: 1, y: 1 }, 280, Phaser.Easing.Linear.None);
        c.chain(e), d.chain(f, g);
        var h = this.game.add.tween(a).to({ alpha: 0 }, 146, Phaser.Easing.Linear.None).start(),
            i = this.game.add.tween(a.scale).to({ x: 4.63, y: 4.63 }, 146, Phaser.Easing.Linear.None).start(),
            j = this.game.add.tween(a).to({ alpha: 1 }, 520, Phaser.Easing.Linear.None),
            k = this.game.add.tween(a.scale).to({ x: 0.66, y: 0.66 }, 520, Phaser.Easing.Linear.None),
            l = this.game.add.tween(a.scale).to({ x: 1, y: 1 }, 278, Phaser.Easing.Linear.None);
        h.chain(j),
            i.chain(k, l),
            this.game.load.atlas("atlas", "assets/images/atlas.png", "assets/images/atlas.json"),
            this.game.load.atlas("atlas2", "assets/images/atlas2.png", "assets/images/atlas2.json"),
            this.game.load.atlas("atlas3", "assets/images/atlas3.png", "assets/images/atlas3.json"),
            this.game.load.atlas("popupAtlas", "assets/images/popupAtlas.png", "assets/images/popupAtlas.json"),
            this.load.spritesheet("player0", "assets/images/playerSheet.png", 124, 120, 4),
            this.load.image("appstore", "assets/images/appstore.png"),
            this.load.image("googleplay", "assets/images/googleplay.png"),
            this.load.audio("white", ["assets/audio/white.mp3", "assets/audio/white.ogg"]),
            this.load.audio("ufo_warning", ["assets/audio/ufo_warning.mp3", "assets/audio/ufo_warning.ogg"]),
            this.load.audio("ufo_kill", ["assets/audio/ufo_kill.mp3", "assets/audio/ufo_kill.ogg"]),
            this.load.audio("ufo_abduct", ["assets/audio/ufo_abduct.mp3", "assets/audio/ufo_abduct.ogg"]),
            this.load.audio("spring", ["assets/audio/spring.mp3", "assets/audio/spring.ogg"]),
            this.load.audio("shoot2", ["assets/audio/shoot2.mp3", "assets/audio/shoot2.ogg"]),
            this.load.audio("shoot", ["assets/audio/shoot.mp3", "assets/audio/shoot.ogg"]),
            this.load.audio("propeller", ["assets/audio/propeller.mp3", "assets/audio/propeller.ogg"]),
            this.load.audio("monster_warning", ["assets/audio/monster_warning.mp3", "assets/audio/monster_warning.ogg"]),
            this.load.audio("monster_kill", ["assets/audio/monster_kill.mp3", "assets/audio/monster_kill.ogg"]),
            this.load.audio("monster_hit", ["assets/audio/monster_hit.mp3", "assets/audio/monster_hit.ogg"]),
            this.load.audio("jumponmonster", ["assets/audio/jumponmonster.mp3", "assets/audio/jumponmonster.ogg"]),
            this.load.audio("jump", ["assets/audio/jump.mp3", "assets/audio/jump.ogg"]),
            this.load.audio("jetpack", ["assets/audio/jetpack.mp3", "assets/audio/jetpack.ogg"]),
            this.load.audio("falling", ["assets/audio/falling.mp3", "assets/audio/falling.ogg"]),
            this.load.audio("black_hole", ["assets/audio/black_hole.mp3", "assets/audio/black_hole.ogg"]),
            this.load.audio("beake_platfrom", ["assets/audio/beake_platfrom.mp3", "assets/audio/beake_platfrom.ogg"]),
            this.load.bitmapFont("DoodleFont", "assets/fonts/bitmapFont_0.png", "assets/fonts/bitmapFont.fnt"),
            this.load.bitmapFont("DoodleFont2", "assets/fonts/bitmapFont2_0.png", "assets/fonts/bitmapFont2.fnt"),
            this.load.text("scenes0", "assets/data/skin0Scenes.json"),
            this.load.text("stats", "assets/data/statachieve.json"),
            (this.startGame = !1),
            this.game.time.events.add(
                1.4 * Phaser.Timer.SECOND,
                function () {
                    this.startGame && this.state.start("Menu"), (this.startGame = !0);
                },
                this
            ),
            this.game.load.onLoadComplete.add(function () {
                this.startGame && this.state.start("Menu"), (this.startGame = !0);
            }, this);
    },
    create: function () {},
};
var Doodle = Doodle || {};
Doodle.ScoresState = {
    init: function () {
        (this.localTopScores = JSON.parse(localStorage.getItem("DJ_localTopScores")) || []),
            this.localTopScores.length > 10 && (this.localTopScores.length = 10),
            (this.followScroll = !1),
            (this.startTouchY = 0),
            (this.scrollLimit = -318),
            (this.scrollLimit2 = -230);
    },
    create: function () {
        function a(a) {
            b.backgroundScores.getBounds().contains(b.game.input.x, b.game.input.y) &&
                b.scrollMenu.visible &&
                b.scrollMenu.y <= 0 &&
                b.scrollMenu.y >= b.scrollLimit &&
                ((b.scrollMenu.y += 40 * b.game.input.mouse.wheelDelta), b.scrollMenu.y > 0 && (b.scrollMenu.y = 0), b.scrollMenu.y < b.scrollLimit && (b.scrollMenu.y = b.scrollLimit), (b.textElements.y = b.scrollMenu.y)),
                b.backgroundScores2.getBounds().contains(b.game.input.x, b.game.input.y) &&
                    b.scrollMenu2.visible &&
                    b.scrollMenu2.y <= 0 &&
                    b.scrollMenu2.y >= b.scrollLimit2 &&
                    ((b.scrollMenu2.y += 40 * b.game.input.mouse.wheelDelta), b.scrollMenu2.y > 0 && (b.scrollMenu2.y = 0), b.scrollMenu2.y < b.scrollLimit2 && (b.scrollMenu2.y = b.scrollLimit2), (b.textElements.y = b.scrollMenu2.y));
        }
        this.game.input.mouse.mouseWheelCallback = a;
        var b = this,
            c = "unnamed",
            d = 0;
        if (
            (this.localTopScores.length > 0 ? ((c = this.localTopScores[0][0]), (d = this.localTopScores[0][1]), (this.compare = this.submittedValue != this.localTopScores[0][1])) : (this.compare = !1),
            null == this.dataTest || this.compare)
        ) {
            var b = this;
        }
        (this.stats = JSON.parse(localStorage.getItem("DJ_stats")) || JSON.parse(this.game.cache.getText("stats"))),
            (this.backgroundScores = this.add.tileSprite(100, 268, 620, 810, "atlas2", "bgScores")),
            (this.backgroundScores.inputEnabled = !0),
            this.backgroundScores.events.onInputDown.add(function () {
                (this.followScroll = !0), (this.startTouchY = this.input.y);
            }, this),
            this.backgroundScores.events.onInputUp.add(function () {
                this.followScroll = !1;
            }, this),
            (this.backgroundScores2 = this.add.tileSprite(100, 185, 620, 810, "atlas2", "bgScores")),
            (this.backgroundScores2.inputEnabled = !0),
            this.backgroundScores2.events.onInputDown.add(function () {
                (this.followScroll2 = !0), (this.startTouchY2 = this.input.y);
            }, this),
            this.backgroundScores2.events.onInputUp.add(function () {
                this.followScroll2 = !1;
            }, this),
			(this.scrollMenu = this.add.group()),
            (this.scrollMenu2 = this.add.group()),
            (this.textElements = this.add.group()),
            (this.achievementsGroup = this.add.group()),
            (this.scoresBtn = this.add.sprite(100, 180, "atlas2", "scoresBtn")),
            (this.scoresBtn.inputEnabled = !0),
            this.scoresBtn.events.onInputDown.add(function () {
                this.setState("score");
            }, this),
            (this.statsBtn = this.add.sprite(248, 180, "atlas2", "statsBtn")),
            (this.statsBtn.inputEnabled = !0),
            this.statsBtn.events.onInputDown.add(function () {
                this.setState("stats");
            }, this),
            (this.achievementsBtn = this.add.sprite(374, 180, "atlas2", "achievementsBtn")),
            (this.achievementsBtn.inputEnabled = !0),
            this.achievementsBtn.events.onInputDown.add(function () {
                this.setState("achievements");
            }, this),
            this.stats.achievements.forEach(function (a, b) {
                0 == a[3] ? (icon = this.add.sprite(115, 285 + 105 * b, "atlas2", "ach")) : (icon = this.add.sprite(115, 285 + 105 * b, "atlas2", "ach" + b)), this.achievementsGroup.add(icon);
            }, this),
            this.scrollMenu.add(this.backgroundScores),
            this.scrollMenu.add(this.scoresBtn),
            this.scrollMenu.add(this.statsBtn),
            this.scrollMenu.add(this.achievementsBtn),
            this.scrollMenu.add(this.achievementsGroup),
            this.scrollMenu2.add(this.backgroundScores2),
            (this.achievementsGroup.visible = !1),
            (this.background = this.add.sprite(0, 0, "atlas3", "scores")),
            (this.globalButton = this.add.sprite(460, 755, "atlas2", "globalBtn")),
            (this.globalButton.inputEnabled = !0),
            this.globalButton.events.onInputDown.add(function () {
                this.setLoad("global");
            }, this),
            (this.localButton = this.add.sprite(320, 755, "atlas2", "localBtn")),
            (this.localButton.inputEnabled = !0),
            this.localButton.events.onInputDown.add(function () {
                this.setLoad("local");
            }, this),
            (this.menuButton = new Phaser.Sprite(this.game, 370, 860, "atlas", "menu_01")),
            (this.menuButton.inputEnabled = !0),
            this.menuButton.events.onInputOut.add(function () {
                this.menuButton.loadTexture("atlas", "menu_01");
            }, this),
            this.menuButton.events.onInputUp.add(function () {
                5 == this.menuButton.frame && (this.state.start("Menu"), this.menuButton.loadTexture("atlas", "menu_01"));
            }, this),
            this.menuButton.events.onInputDown.add(function () {
                this.menuButton.loadTexture("atlas", "menu_02");
            }, this),
            this.add.existing(this.menuButton),
            this.setLoad("local");
    },
    update: function () {
        this.followScroll &&
            this.input.y != this.startTouchY &&
            this.scrollMenu.y <= 0 &&
            this.scrollMenu.y >= this.scrollLimit &&
            ((this.scrollMenu.y += this.input.y - this.startTouchY),
            this.scrollMenu.y > 0 && (this.scrollMenu.y = 0),
            this.scrollMenu.y < this.scrollLimit && (this.scrollMenu.y = this.scrollLimit),
            (this.startTouchY = this.input.y),
            (this.textElements.y = this.scrollMenu.y)),
            this.followScroll2 &&
                this.input.y != this.startTouchY2 &&
                this.scrollMenu2.y <= 0 &&
                this.scrollMenu2.y >= this.scrollLimit2 &&
                ((this.scrollMenu2.y += this.input.y - this.startTouchY2),
                this.scrollMenu2.y > 0 && (this.scrollMenu2.y = 0),
                this.scrollMenu2.y < this.scrollLimit2 && (this.scrollMenu2.y = this.scrollLimit2),
                (this.startTouchY2 = this.input.y),
                (this.textElements.y = this.scrollMenu2.y));
    },
    spawnText: function (a, b, c, d, e, f, g) {
        var h = this.textElements.getFirstExists(!1);
        return h ? (h.reset(b, c), (h.text = d), (h.fontSize = e)) : ((h = this.add.bitmapText(b, c, "DoodleFont", d, e)), (h.text = d), this.textElements.add(h)), (h.align = f), h.anchor.setTo(g.x, g.y), h;
    },
    setState: function (a) {
        this.scoresBtn.loadTexture("atlas2", "scoresBtn"),
            this.statsBtn.loadTexture("atlas2", "statsBtn"),
            this.achievementsBtn.loadTexture("atlas2", "achievementsBtn"),
            (this.achievementsGroup.visible = !1),
            (this.scrollMenu.y = 0),
            (this.textElements.y = 0),
            this.textElements.forEachAlive(function (a) {
                a.kill();
            }, this),
            "score" == a
                ? ((this.backgroundScores.height = 810),
                  (this.scrollLimit = -318),
                  (this.backgroundScores.scale.y = 1),
                  this.localTopScores.forEach(function (a, b) {
                      this.spawnText(this, 120, 280 + 81 * b, b + 1 + ". " + a[0], 60, "left", { x: 0, y: 0 }), this.spawnText(this, 620, 280 + 81 * b, a[1], 60, "right", { x: 1, y: 0 });
                  }, this),
                  this.scoresBtn.loadTexture("atlas2", "scoresBtn1"))
                : "stats" == a
                ? (this.statsBtn.loadTexture("atlas2", "statsBtn1"),
                  (this.backgroundScores.height = 2187),
                  (this.scrollLimit = -1695),
                  (this.backgroundScores.scale.y = 1),
                  this.stats.stats.forEach(function (a, b) {
                      4 == b || 5 == b || 6 == b ? this.spawnText(this, 620, 280 + 81 * b, this.convertToHHMMSS(a[1]), 60, "right", { x: 1, y: 0 }) : this.spawnText(this, 620, 280 + 81 * b, a[1], 60, "right", { x: 1, y: 0 }),
                          this.spawnText(this, 120, 280 + 81 * b, a[0], 60, "left", { x: 0, y: 0 });
                  }, this))
                : "achievements" == a &&
                  ((this.achievementsGroup.visible = !0),
                  this.achievementsBtn.loadTexture("atlas2", "achievementsBtn1"),
                  (this.backgroundScores.height = 2187),
                  (this.scrollLimit = -1508),
                  (this.backgroundScores.scale.y = 1.3),
                  this.stats.achievements.forEach(function (a, b) {
                      this.spawnText(this, 195, 280 + 105 * b, a[0], 48, "left", { x: 0, y: 0 }), this.spawnText(this, 195, 315 + 105 * b, a[1], 35, "right", { x: 0, y: 0 });
                  }, this));
    },
    convertToHHMMSS: function (a) {
        (hours = Math.floor(a / 3600)), (minutes = Math.floor(a / 60) % 60), (a %= 60);
        var b = "";
        return 0 != hours && (b += hours + "h:"), 0 != minutes && (b += minutes + "m:"), (b += a + "s");
    },
    setLoad: function (a) {
        this.globalButton.loadTexture("atlas2", "globalBtn"),
            this.localButton.loadTexture("atlas2", "localBtn"),
            (this.scrollMenu.visible = !1),
            (this.scrollMenu2.visible = !1),
            this.textElements.forEachAlive(function (a) {
                a.kill();
            }, this),
            "local" == a && (this.localButton.loadTexture("atlas2", "localBtn1"), (this.scrollMenu.visible = !0), this.setState("score")),
            "global" == a &&
                (this.globalButton.loadTexture("atlas2", "globalBtn1"),
                (this.scrollMenu2.visible = !0),
                this.dataTest &&
                    this.dataTest.forEach(function (a, b) {
                        this.spawnText(this, 120, 199 + 81 * b, b + 1 + ". " + a[0], 60, "left", { x: 0, y: 0 }), this.spawnText(this, 620, 199 + 81 * b, a[1], 60, "right", { x: 1, y: 0 });
                    }, this));
    },
};
var Doodle = Doodle || {};
Doodle.SettingsState = {
    init: function () {
        (this.soundToggleValue = localStorage.getItem("DJ_soundToggle") || !0),
            (this.directionalShootingValue = localStorage.getItem("DJ_directionalShooting") || !1),
            (this.calibrateValue = localStorage.getItem("DJ_calibrate") || "AUTO"),
            (this.calibratedValue = localStorage.getItem("DJ_calibrated") || 0);
    },
    create: function () {
        (this.background = this.add.sprite(0, 0, "atlas2", "background")),
            (this.menuButton = new Phaser.Sprite(this.game, 370, 800, "atlas", "menu_01")),
            (this.menuButton.inputEnabled = !0),
            this.menuButton.events.onInputOut.add(function () {
                this.menuButton.loadTexture("atlas", "menu_01");
            }, this),
            this.menuButton.events.onInputUp.add(function () {
                5 == this.menuButton.frame && (this.state.start("Menu"), this.menuButton.loadTexture("atlas", "menu_01"));
            }, this),
            this.menuButton.events.onInputDown.add(function () {
                this.menuButton.loadTexture("atlas", "menu_02");
            }, this),
            this.add.existing(this.menuButton),
            (this.soundToggler = new Phaser.Sprite(this.game, 360, 460, "atlas2", "soundToggle")),
            this.soundToggler.anchor.setTo(0.5),
            this.add.existing(this.soundToggler),
            (this.soundButton = new Phaser.Sprite(this.game, 360, 500, "atlas2", "ONoff1")),
            this.soundButton.anchor.setTo(0.5),
            (this.soundButton.inputEnabled = !0),
            this.soundButton.events.onInputUp.add(function () {
                this.soundButton.over && (25 == this.soundButton.frame ? this.toggleSound(!1) : this.toggleSound(!0));
            }, this),
            this.soundButton.events.onInputDown.add(function () {
                this.soundButton.over = !0;
            }, this),
            this.soundButton.events.onInputOut.add(function () {
                this.soundButton.over = !1;
            }, this),
            this.add.existing(this.soundButton),
            "false" == this.soundToggleValue && ((this.game.sound.mute = !0), this.soundButton.loadTexture("atlas2", "onOFF")),
            (this.dirShoot = new Phaser.Sprite(this.game, 300, 240, "atlas2", "dirShoot")),
            this.dirShoot.anchor.setTo(0.5),
            this.add.existing(this.dirShoot),
            (this.dirShootButton = new Phaser.Sprite(this.game, 300, 280, "atlas2", "ONoff1")),
            this.dirShootButton.anchor.setTo(0.5),
            (this.dirShootButton.inputEnabled = !0),
            this.dirShootButton.events.onInputUp.add(function () {
                this.dirShootButton.over && (25 == this.dirShootButton.frame ? this.toggleShooting(!1) : this.toggleShooting(!0));
            }, this),
            this.dirShootButton.events.onInputDown.add(function () {
                this.dirShootButton.over = !0;
            }, this),
            this.dirShootButton.events.onInputOut.add(function () {
                this.dirShootButton.over = !1;
            }, this),
            this.add.existing(this.dirShootButton),
            "false" == this.directionalShootingValue && this.dirShootButton.loadTexture("atlas2", "onOFF"),
            (this.calibrate = new Phaser.Sprite(this.game, 300, 660, "atlas2", "calibrate")),
            this.calibrate.anchor.setTo(0.5),
            this.add.existing(this.calibrate),
            (this.calibrateButton = new Phaser.Sprite(this.game, 300, 700, "atlas2", "AUTOman1")),
            this.calibrateButton.anchor.setTo(0.5),
            (this.calibrateButton.inputEnabled = !0),
            this.calibrateButton.events.onInputUp.add(function () {
                this.calibrateButton.over && (12 == this.calibrateButton.frame ? this.calibrateSet("MANUAL") : this.calibrateSet("AUTO"));
            }, this),
            this.calibrateButton.events.onInputDown.add(function () {
                this.calibrateButton.over = !0;
            }, this),
            this.calibrateButton.events.onInputOut.add(function () {
                this.calibrateButton.over = !1;
            }, this),
            this.add.existing(this.calibrateButton),
            "MANUAL" == this.calibrateValue && this.calibrateButton.loadTexture("atlas2", "autoMAN"),
            (this.optionsLogo = this.add.sprite(30, 50, "atlas2", "optionsLogo"));
    },
    toggleSound: function (a) {
        if (a) {
            if (((this.soundToggle = !0), "object" == typeof localStorage))
                try {
                    localStorage.setItem("DJ_soundToggle", this.soundToggle);
                } catch (b) {
                    console.log("Progress not saved");
                }
            this.soundButton.loadTexture("atlas2", "ONoff1"), (this.game.sound.mute = !1);
        } else {
            if (((this.soundToggle = !1), "object" == typeof localStorage))
                try {
                    localStorage.setItem("DJ_soundToggle", this.soundToggle);
                } catch (b) {
                    console.log("Progress not saved");
                }
            this.soundButton.loadTexture("atlas2", "onOFF"), (this.game.sound.mute = !0);
        }
    },
    toggleShooting: function (a) {
        if (a) {
            if (((this.directionalShootingValue = !0), "object" == typeof localStorage))
                try {
                    localStorage.setItem("DJ_directionalShooting", this.directionalShootingValue);
                } catch (b) {
                    console.log("Progress not saved");
                }
            this.dirShootButton.loadTexture("atlas2", "ONoff1");
        } else {
            if (((this.directionalShootingValue = !1), "object" == typeof localStorage))
                try {
                    localStorage.setItem("DJ_directionalShooting", this.directionalShootingValue);
                } catch (b) {
                    console.log("Progress not saved");
                }
            this.dirShootButton.loadTexture("atlas2", "onOFF");
        }
    },
    calibrateSet: function (a) {
        if ("AUTO" == a) {
            if (((this.calibratedValue = 0), "object" == typeof localStorage))
                try {
                    localStorage.setItem("DJ_calibrated", this.calibratedValue);
                } catch (b) {
                    console.log("Progress not saved");
                }
            this.calibrateButton.loadTexture("atlas2", "AUTOman1");
        } else this.calibrateButton.loadTexture("atlas2", "autoMAN"), this.state.start("Calibrate");
        if ("object" == typeof localStorage)
            try {
                localStorage.setItem("DJ_calibrate", a);
            } catch (b) {
                console.log("Progress not saved");
            }
    },
};
var Doodle = Doodle || {};
(Doodle.Bonus = function (a, b, c, d, e, f, g, h) {
    (this.stats = h),
        Phaser.Sprite.call(this, a, b, c, "atlas", d),
        (this.bonusAction = function (a, b, c) {
            (this.bonusPool = c),
                (this.playerTimer = this.game.time.create(!1)),
                this.playerTimer.start(),
                b.y + b.height / 2 + this.bonusPool.y > a.bottom &&
                    a.body.velocity.y > 0 &&
                    ("bonus0" != b.type ||
                        b.used ||
                        ((b.used = !0),
                        b.loadTexture("atlas", "bonus01"),
                        (0 != a.frame && 2 != a.frame) ||
                            ((a.frame += 1),
                            a.playerTimer.add(
                                (20 * Phaser.Timer.SECOND) / 60,
                                function () {
                                    a.frame -= 1;
                                },
                                this
                            )),
                        g.spring.play(),
                        (this.stats.achievements[0][2] += 1),
                        (this.stats.achievements[1][2] += 1),
                        this.stats.achievements[0][2] >= 3 && Doodle.GameState.achieveMentUnlock(0),
                        this.stats.achievements[1][2] >= 5 && Doodle.GameState.achieveMentUnlock(1),
                        (a.body.velocity.y = -1800))),
                "bonus3" != b.type ||
                    b.used ||
                    a.withBonus ||
                    ((this.stats.stats[19][1] += 1),
                    (this.stats.achievements[8][2] += 1),
                    this.stats.achievements[8][2] >= 3 && Doodle.GameState.achieveMentUnlock(8),
                    g.propeller.play(),
                    a.addChild(b),
                    (a.frame = 1),
                    (b.x = 0),
                    (b.y = -10),
                    (b.used = !0),
                    b.animations.add("prop", ["atlas", "propeller_03", "propeller_02", "propeller_04"], 24, !0),
                    b.play("prop"),
                    (a.withBonus = !0),
                    (a.bonusType = 3),
                    (a.body.velocity.y = -250),
                    (a.body.gravity.y = -2448),
                    (b.body.velocity.x = 0),
                    this.playerTimer.add(
                        (80 * Phaser.Timer.SECOND) / 60,
                        function () {
                            a.body.gravity.y = -1728;
                        },
                        this
                    ),
                    this.playerTimer.add(
                        (170 * Phaser.Timer.SECOND) / 60,
                        function () {
                            a.body.gravity.y = -1008;
                        },
                        this
                    ),
                    this.playerTimer.add(
                        (195 * Phaser.Timer.SECOND) / 60,
                        function () {
                            b.animations.stop(null, !0), b.loadTexture("atlas", "bonus3");
                        },
                        this
                    ),
                    this.playerTimer.add(
                        (200 * Phaser.Timer.SECOND) / 60,
                        function () {
                            (b.maxVel = 600),
                                (a.frame = 0),
                                (a.body.gravity.y = 0),
                                (a.bonusType = null),
                                (a.withBonus = !1),
                                a.removeChildren,
                                this.bonusPool.add(b),
                                (b.x = a.x + 13 * a.scale.x),
                                (b.y = a.y - this.bonusPool.y - 10),
                                (b.body.allowGravity = !0),
                                (b.body.velocity.y = a.body.velocity.y - 360),
                                (b.body.gravity.y = 1800),
                                (b.body.velocity.x = 180 * a.scale.x),
                                (b.body.gravity.x = -180 * a.scale.x),
                                (b.body.angularVelocity = 180 * -a.scale.x);
                        },
                        this
                    )),
                "bonus2" != b.type ||
                    b.used ||
                    a.withBonus ||
                    ((this.stats.stats[18][1] += 1),
                    (this.stats.achievements[9][2] += 1),
                    this.stats.achievements[9][2] >= 3 && Doodle.GameState.achieveMentUnlock(9),
                    g.jetpack.play(),
                    a.addChild(b),
                    b.loadTexture("atlas", "bonus2anim_01"),
                    (b.x = 42),
                    (b.y = 110),
                    (b.used = !0),
                    b.animations.add("anim0", ["atlas", "bonus2anim_01", "bonus2anim_02", "bonus2anim_03"], 24, !0),
                    b.animations.add("anim1", ["atlas", "bonus2anim_04", "bonus2anim_05", "bonus2anim_06"], 24, !0),
                    b.animations.add("anim2", ["atlas", "bonus2anim_07", "bonus2anim_08", "bonus2anim_09"], 24, !0),
                    b.play("anim0"),
                    (a.withBonus = !0),
                    (b.body.velocity.x = 0),
                    (a.body.velocity.y = -1080),
                    (a.body.gravity.y = -2952),
                    this.playerTimer.add(
                        (30 * Phaser.Timer.SECOND) / 60,
                        function () {
                            b.play("anim1");
                        },
                        this
                    ),
                    this.playerTimer.add(
                        (60 * Phaser.Timer.SECOND) / 60,
                        function () {
                            a.body.gravity.y = -1728;
                        },
                        this
                    ),
                    this.playerTimer.add(
                        (120 * Phaser.Timer.SECOND) / 60,
                        function () {
                            a.body.gravity.y = -864;
                        },
                        this
                    ),
                    this.playerTimer.add(
                        (170 * Phaser.Timer.SECOND) / 60,
                        function () {
                            b.play("anim2");
                        },
                        this
                    ),
                    this.playerTimer.add(
                        (180 * Phaser.Timer.SECOND) / 60,
                        function () {
                            (b.maxVel = 600),
                                b.animations.stop(null, !0),
                                b.loadTexture("atlas", "bonus2anim_10"),
                                (a.body.gravity.y = 0),
                                (a.withBonus = !1),
                                a.removeChildren,
                                this.bonusPool.add(b),
                                (b.x = a.x + 55 * a.scale.x),
                                (b.y = a.y - this.bonusPool.y + 110),
                                (b.body.allowGravity = !0),
                                (b.body.velocity.y = a.body.velocity.y - 360),
                                (b.body.gravity.y = 3600),
                                (b.body.velocity.x = 180 * a.scale.x),
                                (b.body.gravity.x = -180 * a.scale.x),
                                (b.body.angularVelocity = 120 * a.scale.x);
                        },
                        this
                    ));
        }),
        this.reset(b, c, d, e, f);
}),
    (Doodle.Bonus.prototype = Object.create(Phaser.Sprite.prototype)),
    (Doodle.Bonus.prototype.constructor = Doodle.Bonus),
    (Doodle.Bonus.prototype.kill = function () {
        this.playerTimer && this.playerTimer.stop(), Phaser.Sprite.prototype.kill.call(this);
    }),
    (Doodle.Bonus.prototype.reset = function (a, b, c, d, e) {
        Phaser.Sprite.prototype.reset.call(this, a, b),
            (this.maxVel = 0),
            this.loadTexture("atlas", c),
            (this.angle = 0),
            (this.type = c),
            this.game.physics.arcade.enableBody(this),
            this.body.setSize(this.width, this.height, 0, 0),
            (this.body.velocity.x = 0),
            (this.body.angularVelocity = 0),
            (this.body.velocity.y = 0),
            (this.body.allowGravity = !1),
            (this.body.immovable = !0),
            this.anchor.setTo(0.5, 1),
            (this.used = !1),
            0 != d.body.velocity.x && ((this.body.velocity.x = d.body.velocity.x), (d.child = this));
        var f = Math.random() * (d.width - this.width - 10) - (d.width - this.width - 10) / 2;
        this.x -= f;
    }),
    (Doodle.Bonus.prototype.update = function () {
        600 == this.maxVel && this.alive && this.body.velocity.y > this.maxVel && (this.body.velocity.y = 600);
    });
var Doodle = Doodle || {};
(Doodle.Bullet = function (a, b, c, d, e) {
    (this.stats = e), Phaser.Sprite.call(this, a, b, c, "atlas", d), this.anchor.setTo(0.5), (this.checkWorldBounds = !0), (this.outOfBoundsKill = !0);
}),
    (Doodle.Bullet.prototype = Object.create(Phaser.Sprite.prototype)),
    (Doodle.Bullet.prototype.constructor = Doodle.Bullet),
    (Doodle.Bullet.prototype.kill = function () {
        Phaser.Sprite.prototype.kill.call(this), this._outOfBoundsFired && ((this.stats.achievements[6][2] = 0), (this.stats.achievements[7][2] = 0));
    });
var Doodle = Doodle || {};
(Doodle.Obstacle = function (a, b, c, d, e, f, g) {
    Phaser.Sprite.call(this, a, b, c, "atlas", "obstacle" + d), (this.sounds = e), (this.stats = f), this.reset(b, c, d), (this.pool = g);
}),
    (Doodle.Obstacle.prototype = Object.create(Phaser.Sprite.prototype)),
    (Doodle.Obstacle.prototype.constructor = Doodle.Obstacle),
    (Doodle.Obstacle.prototype.reset = function (a, b, c) {
        Phaser.Sprite.prototype.reset.call(this, a, b),
            (this.scale.x = 1),
            (this.type = c),
            this.loadTexture("atlas", "obstacle" + c),
            this.anchor.setTo(0.5, 0.5),
            this.game.physics.arcade.enableBody(this),
            this.body.setSize(this.width, this.height, 0, 0),
            (this.body.allowGravity = !1),
            (this.body.immovable = !0),
            (this.offsetXX = 0),
            (this.offsetYY = 0),
            (this.newOffsetX = 0),
            (this.newOffsetY = 0),
            (this.rangeX = 0),
            (this.rangeY = 0),
            (this.health = 1),
            this.sounds && (4 != this.type && 6 != this.type ? this.sounds.monster_warning.play() : 4 != this.type && this.sounds.ufo_warning.play()),
            11 == c && (this.health = 2),
            4 == c && (this.body.setSize(80, 80, this.width / 2 - 40, this.height / 2 - 40), this.game.world.sendToBack(this)),
            9 == c && ((this.body.velocity.x = 360), (this.scale.x *= -1)),
            6 == c &&
                ((this.animations.currentAnim = null),
                Math.random() > 0.33
                    ? (this.animations.add("beam", ["atlas", "ufo_01", "ufo_02"], 24, !0), this.play("beam"), this.body.setSize(this.width, this.height, 0, 0))
                    : this.body.setSize(160, 70, this.width / 2 - 80, this.height / 2 - 35)),
            10 == c && (this.animations.add("fly", ["atlas", "obstacle10", "but1", "but2", "but3", "but4", "but3", "but2", "but1", "obstacle10"], 24, !0), this.play("fly"));
    }),
    (Doodle.Obstacle.prototype.update = function () {
        this.alive &&
            9 == this.type &&
            (this.left >= this.game.world.width && this.body.velocity.x > 0 && ((this.scale.x *= -1), (this.body.velocity.x *= -1)),
            this.left <= 0 && this.body.velocity.x < 0 && ((this.scale.x *= -1), (this.body.velocity.x *= -1)),
            (this.newOffsetY = 20 * Math.sin((this.rangeY * Math.PI) / 180)),
            (this.y += this.newOffsetY - this.offsetYY),
            (this.offsetYY = this.newOffsetY),
            (this.rangeY += 8.5),
            this.rangeY >= 360 && (this.rangeY -= 360)),
            !this.alive ||
                (7 != this.type && 8 != this.type && 10 != this.type && 11 != this.type) ||
                ((this.newOffsetX = 20 * Math.sin((this.rangeX * Math.PI) / 180)),
                (this.newOffsetY = 10 * Math.sin((this.rangeY * Math.PI) / 180)),
                (this.x += this.newOffsetX - this.offsetXX),
                (this.y += this.newOffsetY - this.offsetYY),
                (this.offsetXX = this.newOffsetX),
                (this.offsetYY = this.newOffsetY),
                (this.rangeX += 14),
                (this.rangeY += 2.8),
                this.rangeX >= 360 && (this.rangeX -= 360),
                this.rangeY >= 360 && (this.rangeY -= 360)),
            this.alive &&
                6 == this.type &&
                !this.suckYou &&
                ((this.newOffsetX = 40 * Math.sin((this.rangeX * Math.PI) / 180)),
                (this.newOffsetY = 20 * Math.sin((this.rangeY * Math.PI) / 90)),
                (this.x += this.newOffsetX - this.offsetXX),
                (this.y += this.newOffsetY - this.offsetYY),
                (this.offsetXX = this.newOffsetX),
                (this.offsetYY = this.newOffsetY),
                (this.rangeX += 1),
                (this.rangeY += 1),
                this.rangeX >= 360 && (this.rangeX -= 360),
                this.rangeY >= 360 && (this.rangeY -= 360));
    }),
    (Doodle.Obstacle.prototype.damage = function (a) {
        Phaser.Sprite.prototype.damage.call(this, a),
            11 == this.type && (this.animations.add("bloody", ["atlas", "green0", "green1", "green2", "green3", "green2", "green1", "green0"], 24, !0), this.play("bloody")),
            this.alive ||
                (6 == this.type ? (this.sounds.ufo_kill.play(), (this.stats.stats[10][1] += 1)) : (this.sounds.monster_kill.play(), (this.stats.stats[8][1] += 1)),
                (this.stats.achievements[6][2] += 1),
                (this.stats.achievements[7][2] += 1),
                this.stats.achievements[6][2] >= 5 && Doodle.GameState.achieveMentUnlock(6),
                this.stats.achievements[7][2] >= 10 && Doodle.GameState.achieveMentUnlock(7));
    }),
    (Doodle.Obstacle.prototype.kill = function () {
        Phaser.Sprite.prototype.kill.call(this);
        var a = 0,
            b = 0;
        this.pool.forEachAlive(function (c) {
            6 == c.type && (a += 1), (7 != c.type && 8 != c.type && 9 != c.type && 10 != c.type && 11 != c.type) || (b += 1);
        }, this),
            0 == a && this.sounds.ufo_warning.stop(),
            0 == b && this.sounds.monster_warning.stop();
    });
var Doodle = Doodle || {};
(Doodle.Platform = function (a, b, c, d, e, f, g) {
    Phaser.Sprite.call(this, a, b, c, "atlas", d), this.reset(b, c, d, e, f, g);
}),
    (Doodle.Platform.prototype = Object.create(Phaser.Sprite.prototype)),
    (Doodle.Platform.prototype.constructor = Doodle.Platform),
    (Doodle.Platform.prototype.reset = function (a, b, c, d, e, f) {
        Phaser.Sprite.prototype.reset.call(this, a, b),
            this.loadTexture("atlas", "platform0"),
            (this.type = 0),
            (this.hasBonusObject = -1),
            (this.moving = !1),
            (this.child = null),
            this.anchor.setTo(0.5, 0),
            this.game.physics.arcade.enableBody(this),
            this.body.setSize(this.width, this.height, 0, 0),
            (this.body.allowGravity = !1),
            (this.body.immovable = !0),
            null == f &&
                (2 != d.type && Math.random() < 0.2 && ((this.type = 2), this.loadTexture("atlas", "platform2")),
                e > 5500 &&
                    100 * Math.random() < e / 400 &&
                    ((this.moving = !0),
                    2 != this.type && ((this.type = 1), this.loadTexture("atlas", "platform1")),
                    (this.setVelocity = 60 * (0.5 + 0.5 * Math.random() + e / 3e4) * 2),
                    this.setVelocity > 300 ? (this.body.velocity.x = 300) : (this.body.velocity.x = this.setVelocity))),
            null != f &&
                (this.loadTexture("atlas", "platform" + f),
                (this.type = f),
                1 == f && ((this.setVelocity = 60 * (0.5 + 0.5 * Math.random() + e / 3e4) * 2), this.setVelocity > 300 ? (this.body.velocity.x = 300) : (this.body.velocity.x = this.setVelocity)));
    }),
    (Doodle.Platform.prototype.update = function () {
        this.alive &&
            (this.right >= this.game.world.width && (this.body.velocity.x > 0 && (this.body.velocity.x *= -1), this.child && (this.child.body.velocity.x *= -1)),
            this.left <= 0 && (this.body.velocity.x < 0 && (this.body.velocity.x *= -1), this.child && (this.child.body.velocity.x *= -1)),
            this.body.allowGravity && this.body.velocity.y > 600 && (this.body.velocity.y = 600));
    });
