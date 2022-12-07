const CART_WORLDCHANGERS={
    name:"WC",
    fps:60,
    frameSkip:5,
    resourcesPrefix:"carts/",
    case:"case.svg",
    display:"worldchangers/graphics/display.svg",
    wallpaper:"worldchangers/graphics/wallpaper.png",
    background:"worldchangers/graphics/cloth.png",
    audio:[
        {id:"step",file:"worldchangers/audio/step"},
        {id:"hit",file:"worldchangers/audio/hit"},
        {id:"fire",file:"worldchangers/audio/fire"},
        {id:"pickup",file:"worldchangers/audio/pickup"},
        {id:"music",file:"worldchangers/audio/music"},
        {id:"music2",file:"worldchangers/audio/music2"},
        {id:"music3",file:"worldchangers/audio/music3"},
    ],
    buttons:{
        up:{
            labelColor:"#ffffff",
            label:[""]
        },
        down:{
            labelColor:"#ffffff",
            label:[""]
        },
        left:{
            labelColor:"#ffffff",
            label:[""]
        },
        right:{
            labelColor:"#ffffff",
            label:[""]
        },
        A:{
            labelColor:"#ffffff",
            label:["FIRE"]
        },
        B:{
            labelColor:"#ffffff",
            label:["RELOAD"]
        },
        button1:{
            labelColor:"#ffffff",
            label:["","OFF"]
        },
        button2:{
            labelColor:"#ffffff",
            label:["","SOUND"]
        },
        button3:{
            labelColor:"#ffffff",
            label:["","PAUSE"]
        },
        button4:{
            labelColor:"#ffffff",
            label:["ON/","START"]
        },
        ACL:{
            labelColor:"#ffffff",
            label:["","ACL"]
        }
    },
    leds:{
        player:[
            "player0","player1","player2","player3"
        ],
        playerFire:[
            "playerfire0","playerfire1","playerfire2","playerfire3"
        ],
        diamond:[
            "diamond0","diamond1","diamond2","diamond3","diamond4"
        ],
        walls:[
            [ "wall00","wall10","wall20","wall30" ],
            [ "wall01","wall11","wall21","wall31" ],
            [ "wall02","wall12","wall22","wall32" ],
            [ "wall03","wall13","wall23","wall33" ],
        ],
        bullets:[
            0,
            [ "bullet01","bullet11","bullet21","bullet31"],
            [ "bullet02","bullet12","bullet22","bullet32"],
            [ "bullet03","bullet13","bullet23","bullet33"],
        ],
        enemies:[
            0,
            [ "enemy01","enemy11","enemy21","enemy31"],
            [ "enemy02","enemy12","enemy22","enemy32"],
            [ "enemy03","enemy13","enemy23","enemy33"],
        ],
        road:[
            [ "road0l","road0r" ],
            [ "road1l","road1r" ],
            [ "road2l","road2r" ],
            [ "road3l","road3r" ]
        ],
        ammo:[
            "ammo0","ammo1","ammo2","ammo3","ammo4"
        ],
        reload:[
            [ "reload0u","reload0d" ],
            [ "reload1u","reload1d" ],
            [ "reload2u","reload2d" ],
            [ "reload3u","reload3d" ],
            [ "reload4u","reload4d" ],
        ],
        lives:[
            "life0",
            "life1"
        ],
        boss:{
            sprite:"boss",
            explosion:["bossexplosionl","bossexplosionr"]
        },
        labels:{
            score:"labelscore",
            ammo:"labelammo",
            reload:"labelreload",
            gameOver:"labelgameover",
            toPeace:"labeltopeace",
            time:"labeltime",
            go:["goarrow","gomessage"],
            hi:"labelhi",
            paused:"labelpaused",
            stage:"labelstage"
        },
        score:[
            [ "score00", "score01", "score02", "score03", "score04", "score05", "score06"],
            [ "score10", "score11", "score12", "score13", "score14", "score15", "score16"],
            [ "score20", "score21", "score22", "score23", "score24", "score25", "score26"],
            [ "score30", "score31", "score32", "score33", "score34", "score35", "score36"],
            [         0,         0, "score42",         0,         0, "score45" ],
        ],
        toPeace:[
            [ "peace00", "peace01", "peace02", "peace03", "peace04", "peace05", "peace06"],
            [ "peace10", "peace11", "peace12", "peace13", "peace14", "peace15", "peace16"],
        ],
        time:[
            [ "time00", "time01", "time02", "time03", "time04", "time05", "time06"],
            [ "time10", "time11", "time12", "time13", "time14", "time15", "time16"],
        ]
    },
    system:{
        onStart:(G,S)=>{
            G.highScore=G.loadData("highscore")||0;
            G.aclHold=0;
        },
        onLogic:(G,S)=>{
            if (G.state !== G.states.off) {

                if (G.controlIsDown(G.controls.ACL)) {
                    if (G.aclHold>=0) {
                        G.aclHold++;
                        if (G.aclHold>G.FPS) {
                            G.setState(G.states.acl);
                            G.aclHold=-1;
                        }
                    }
                } else G.aclHold=0;

                if (G.state !== G.states.default) {
                    if (G.controlIsHit(G.controls.button3)) {
                        G.togglePaused();
                        G.setLed(G.leds.labels.paused,G.paused);
                    }
                }

                if (G.controlIsHit(G.controls.button2)) {
                    G.setAudioEnabled(!G.audioEnabled);
                    G.playSingleAudio(G.audio.pickup);
                }

                if (G.controlIsHit(G.controls.button1)) {
                    G.stopAllAudio();
                    G.setState(G.states.off);
                }
            
            }
        }
    },
    states:{
        off:{
            onEnter:(G,S)=>{
                S.off=true;
                G.setPaused(false);
                G.resetBlinks();
                G.setAllLeds(false);
            },
            onLogic:(G,S)=>{
                if (S.off)
                    S.off=false;
                else
                    if (G.controlIsHit(G.controls.button4))
                        G.setState(G.states.default);
            }
        },
        acl:{
            onEnter:(G,S)=>{
                S.timer=G.FPS*3;
                G.setPaused(false);
                G.resetBlinks();
                G.setAllLeds(true);  
            },
            onLogic:(G,S)=>{
                if (S.timer)
                    S.timer--;
                else
                    G.setState(G.states.default);
            }
        },
        default:{
            onEnter:(G,S)=>{

                S.timer=G.FPS;
                S.roadY=0;
                S.playerX=0;
                S.playerXSide=true;
                S.walls=[];

                G.setAllLeds(false);
                G.resetBlinks();

                G.setLed(G.leds.labels.score,true);
                G.setLed(G.leds.labels.hi,true);
                G.setLedNumber(G.leds.score,G.highScore);
            },
            createWalls:(G,S,y,count)=>{
                let
                    places=[0,1,2,3];

                for (let i=0;i<count;i++) {
                    let pos=places.splice(G.randomInt(places.length),1)[0];
                    S.walls.push({ x:pos, y:y })
                }
            },
            onLogic:(G,S)=>{

                if (S.timer)
                    S.timer--;
                else {
                    S.timer=G.FPS;
                    if (S.playerXSide)
                        S.playerX++;
                    else
                        S.playerX--;
                    if (S.playerX<0) {
                        S.playerX=1;
                        S.playerXSide=true;
                    }
                    if (S.playerX>3) {
                        S.playerX=2;
                        S.playerXSide=false;
                    }

                    let
                        playerBlocked=false;

                    S.walls.forEach(wall=>{
                        if ((wall.y==0)&&(wall.x==S.playerX)) playerBlocked=true;
                    })

                    if (!playerBlocked) {
                        S.roadY=(S.roadY+1)%3;

                        S.walls=S.walls.filter(wall=>{
                            wall.y--;
                            return wall.y>=0;
                        });
                        
                        if (S.roadY%2)
                            S.createWalls(G,S,3,G.randomInt(4))

                    }

                    G.setLed(G.leds.labels.gameOver,!G.leds.labels.gameOver.state);
                }

                if (G.controlIsHit(G.controls.button4))
                    G.setState(G.states.play);

            },
            onRender:(G,S)=>{

                for (let i=0;i<4;i++)
                    G.setLed(G.leds.road[i],((i+S.roadY)%3)<2);

                G.setLed(G.leds.walls,0);
                S.walls.forEach(wall=>{
                    G.setLed(G.leds.walls[wall.y][wall.x],true);
                });


                G.setLedId(G.leds.player,S.playerX);

            }
        },
        play:{
            advanceEnemyBullet:(G,S,bullet)=>{
                let keep=true;
                if (bullet.y == 1) {
                    S.walls=S.walls.filter(wall=>{
                        if (keep && (wall.x==bullet.x) && (wall.y==0)) {
                            keep=false;
                            return false;
                        } else
                            return true;
                    });
                    if (keep && !S.playerKilled && (bullet.x == S.playerX)) {
                        G.playSingleAudio(G.audio.hit);
                        S.playerKilled=G.FPS*3;
                        G.blink(G.leds.player[S.playerX],false,G.FPS/4,100);
                        G.blink(G.leds.bullets[bullet.y][bullet.x],false,G.FPS/4,100);
                        keep=false;
                    }
                }
                if (keep) {
                    bullet.y--;
                    return bullet.y>0;
                } else return false;
            },
            resetStage:(G,S)=>{
                S.secondTimer=0;
                S.roadY=0;

                S.enemyBullets=[];
                S.enemies=[];
                S.walls=[];

                S.diamondCounter=0;
                S.diamondX=0;
                S.diamond=false;
                S.diamondTimer=0;

                S.bossFireTimer=0;
                S.bossBlink=0;

                S.playerX=0;
                S.ammo=5;
                S.playerReloading=0;
                S.playerReloadTarget=0;
                S.playerReloadMark=0;
                S.playerReloadTimer=0;
                S.playerReloadSide=false;
                S.playerReloadBlink=-1;
                S.playerKilled=0;
                S.playerCleared=0;
                S.playerFireBlink=-1;
                S.playerBullet=false;
                S.playerBulletX=0;
                S.playerBulletY=0;
                S.playerBulletTimer=0;

                G.resetBlinks();
            },
            pickDiamond:(G,S)=>{
                G.playSingleAudio(G.audio.pickup);
                S.diamond=false;
                G.score+=5+S.stage;
            },
            clearStage:(G,S)=>{
                G.playSingleAudio(G.audio.music2);

                S.playerCleared=G.FPS*3;
                S.enemies=[];
                S.walls=[];
                S.enemyBullets=[];
                S.playerBullet=false;
                S.diamond=false;
                G.resetBlinks();
                if (S.bossStage) {
                    G.blink(G.leds.boss.sprite,false,G.FPS/4,100);
                    G.blink(G.leds.boss.explosion,false,G.FPS/4,100);
                } else
                    G.blink(G.leds.road,false,G.FPS/4,100);
                G.blink(G.leds.labels.toPeace,false,G.FPS/4,100);
            },
            startNextStage:(G,S)=>{
                S.stage++;

                S.sceneEnemySpeed=Math.max(1,60-G.every(S.stage,2)*5);
                S.sceneEnemyFireSpeed=Math.max(1,180-G.every(S.stage+1,2)*5);
                S.sceneEnemyBulletSpeed=Math.max(1,50-G.every(S.stage+2,2)*5);
                S.scenePlayerBulletSpeed=Math.max(1,10);
                S.sceneBossFireSpeed=Math.max(1,80-G.every(S.stage,5)*5);
                S.sceneDiamondEvery=Math.max(1,8-G.every(S.stage,2));
                S.sceneDiamondTimer=G.FPS*3;
                S.bossStage=(S.stage%4)==3;
                S.toPeace=10+G.every(S.stage,2);

                S.bossFireTimer=S.sceneBossFireSpeed;

                S.time=60-G.every(S.stage,5)*5;
                S.intro=G.FPS*3;

                S.resetStage(G,S);
                if (S.bossStage) {
                    S.boss++;
                    let boss=S.bossMaps[Math.min(S.bossMaps.length-1,S.boss)];
                    S.toPeace=boss[0];
                    S.createWalls(G,S,2,boss[1]);
                    S.walls.forEach(wall=>{
                        wall.y=1+G.randomInt(3);
                    })
                    S.createWalls(G,S,0,boss[2]);
                }

                G.setLed(G.leds.labels.score,true);
                G.setLed(G.leds.labels.time,true);
                G.setLed(G.leds.labels.toPeace,true);

                G.playSingleAudio(G.audio.music);

            },
            createWalls:(G,S,y,count)=>{
                let
                    places=[0,1,2,3];

                for (let i=0;i<count;i++) {
                    let pos=places.splice(G.randomInt(places.length),1)[0];
                    S.walls.push({ x:pos, y:y })
                }
            },
            onEnter:(G,S)=>{

                G.setAllLeds(false);

                G.score=0;
                S.lives=2;
                S.stage=0;
                S.boss=-1;
                S.bossMaps=[
                    [10, 0, 4 ],
                    [12, 0, 3 ],
                    [14, 1, 2 ],
                    [16, 2, 1 ],
                    [18, 3, 0 ],
                    [20, 3, 0 ],
                    [25, 3, 0 ],
                    [30, 3, 0 ],
                    [40, 3, 0 ]
                ];

                S.startNextStage(G,S);
            },
            onLogic:(G,S)=>{

                let
                    scroll=false,
                    playerBlocked=false;

                S.enemies.forEach(enemy=>{
                    if (enemy.y==1) playerBlocked=true;
                })

                S.walls.forEach(wall=>{
                    if ((wall.y==0)&&(wall.x==S.playerX)) playerBlocked=true;
                })

                if (S.intro) {

                    S.intro--;
                    if (!S.intro && !S.bossStage)
                        G.blink(G.leds.labels.go,false,G.FPS/4,8);


                } else if (S.playerCleared) {

                    S.playerCleared--;
                    if (S.time) {
                        S.time--;
                        G.score++;
                    }
                    if (!S.playerCleared)
                        S.startNextStage(G,S);

                } else if (S.playerKilled) {

                    S.playerKilled--;
                    if (!S.playerKilled) {
                        if (S.lives) {
                            S.lives--;
                            S.resetStage(G,S);
                        } else return G.setState(G.states.gameOver);
                    }
                    
                } else {

                    // Player controls

                    if (G.controlIsHit(G.controls.right)) {
                        S.playerX++;
                        if (S.diamond && (S.diamondX==S.playerX))
                            S.pickDiamond(G,S);
                        if (S.playerX>3) S.playerX=3;
                    } else if (G.controlIsHit(G.controls.left)) {
                        if (S.diamond && (S.diamondX==S.playerX))
                            S.pickDiamond(G,S);
                        S.playerX--;
                        if (S.playerX<0) S.playerX=0;
                    }

                    if (S.playerReloading) {
                        if (S.playerReloadTimer)
                            S.playerReloadTimer--;
                        else {
                            S.playerReloadTimer=10;
                            if (S.playerReloadSide)
                                S.playerReloadMark++;
                            else
                                S.playerReloadMark--;
                            if (S.playerReloadMark<0) {
                                S.playerReloadMark=1;
                                S.playerReloadSide=true;
                            }
                            if (S.playerReloadMark>4) {
                                S.playerReloadMark=3;
                                S.playerReloadSide=false;
                            }
                        }
                    }

                    if (!S.bossStage && !playerBlocked && G.controlIsHit(G.controls.up))
                        scroll = true;

                    if (!S.playerBullet && !S.playerReloading && G.controlIsHit(G.controls.A)) {
                        if (S.ammo) {
                            G.playSingleAudio(G.audio.fire);
                            S.ammo--;
                            G.removeBlink(S.playerFireBlink);
                            S.playerFireBlink = G.blink(G.leds.playerFire[S.playerX],false,5,4);
                            S.playerBullet=true;
                            S.playerBulletX=S.playerX;
                            S.playerBulletY=0;
                            S.playerBulletTimer=S.scenePlayerBulletSpeed;
                        } else {
                            G.removeBlink(S.playerReloadBlink);
                            S.playerReloadBlink=G.blink(G.leds.labels.reload,false,5,4);
                        }
                    } else if (G.controlIsHit(G.controls.B)) {
                        if (S.playerReloading) {
                            console.log(S.playerReloadMark,S.playerReloadTarget);
                            if (S.playerReloadMark+1==S.playerReloadTarget) {
                                G.playSingleAudio(G.audio.fire);
                                S.ammo=5;
                            } else {
                                G.playSingleAudio(G.audio.hit);
                                S.ammo=1;
                            }
                            G.removeBlink(S.playerReloadBlink);
                            S.playerReloadBlink=G.blink(G.leds.labels.ammo,true,5,4);
                            S.playerReloading=false;
                        } else {
                            G.removeBlink(S.playerReloadBlink);
                            S.playerReloading=true;
                            S.playerReloadTarget=G.randomInt(5)+1;
                            S.playerReloadMark=G.randomInt(5);
                            S.playerReloadTimer=0;
                            S.playerReloadSide=G.randomBool();
                        }
                    }

                    // Move enemies

                    S.enemies.forEach(enemy=>{
                        if (enemy.timer)
                            enemy.timer--;
                        else {
                            enemy.timer=S.sceneEnemySpeed;
                            if (enemy.side) {
                                if (enemy.x==3) enemy.side=false;
                                else enemy.x++;
                            } else {
                                if (enemy.x==0) enemy.side=true;
                                else enemy.x--;
                            }
                        }

                        if (enemy.fireTimer)
                            enemy.fireTimer--;
                        else {
                            enemy.fireTimer=S.sceneEnemyFireSpeed;
                            S.enemyBullets.push({x:enemy.x,y:enemy.y,timer:S.sceneEnemyBulletSpeed});
                        }
                    });

                    if (S.bossStage) {
                        if (S.bossFireTimer)
                            S.bossFireTimer--;
                        else {
                            S.bossFireTimer=S.sceneBossFireSpeed;
                            S.enemyBullets.push({x:G.randomInt(4),y:3,timer:S.sceneEnemyBulletSpeed});
                        }
                    }

                    // Scroll

                    if (scroll) {

                        G.playSingleAudio(G.audio.step);

                        // Scroll diamond

                        S.diamond=false;

                        // Scroll road

                        S.roadY++;

                        // Scroll enemies

                        S.enemies=S.enemies.filter(enemy=>{
                            enemy.y--;
                            return enemy.y>=0;
                        });

                        // Scroll walls

                        S.walls=S.walls.filter(wall=>{
                            wall.y--;
                            return wall.y>=0;
                        });

                        // Scroll enemy bullets

                        S.enemyBullets=S.enemyBullets.filter(bullet=>{
                            return S.advanceEnemyBullet(G,S,bullet);
                        });

                        // Spawn new walls

                        if (S.roadY%2)
                            S.createWalls(G,S,3,G.randomInt(4))

                        // Spawn new enemy

                        if (G.randomBool())
                            S.enemies.push({
                                x:G.randomInt(4),
                                y:3,
                                side:G.randomBool(),
                                timer:G.randomInt(S.sceneEnemySpeed),
                                fireTimer:G.randomInt(S.sceneEnemyFireSpeed)
                            });

                    }

                    // Manage diamond

                    if (S.diamond)
                        if (S.diamondTimer)
                            S.diamondTimer--;
                        else
                            S.diamond=false;

                    // Move enemy bullets

                    S.enemyBullets=S.enemyBullets.filter(bullet=>{
                        if (bullet.timer) {
                            bullet.timer--;
                            return true;
                        } else {
                            bullet.timer = S.sceneEnemyBulletSpeed;
                            return S.advanceEnemyBullet(G,S,bullet);
                        }
                    });

                    // Move player bullet

                    if (S.playerBullet) {
                        if (S.playerBulletTimer)
                            S.playerBulletTimer--;
                        else {
                            S.enemies=S.enemies.filter(enemy=>{
                                if ((enemy.x == S.playerBulletX) && (enemy.y == S.playerBulletY)) {
                                    G.blink(G.leds.enemies[enemy.y][enemy.x],false,5,4);
                                    S.playerBullet=false;
                                    G.score+=1+S.ammo+enemy.y;
                                    G.playSingleAudio(G.audio.hit);
                                    if (S.toPeace) {
                                        S.toPeace--;
                                        if (S.toPeace==0)
                                            S.clearStage(G,S);
                                        else {
                                            S.diamondCounter++;
                                            if (S.diamondCounter>=S.sceneDiamondEvery) {
                                                S.diamondCounter=0;
                                                S.diamond=true;
                                                S.diamondX=G.randomInt(5);
                                                S.diamondTimer=S.sceneDiamondTimer;
                                            }
                                        }
                                    }
                                    return false;
                                } else return true;
                            })
                            if (S.playerCleared)
                                S.enemies=[];
                            else {
                                if (S.playerBulletY>0)
                                    S.walls.forEach(wall=>{
                                        if ((wall.x==S.playerBulletX)&&(wall.y==S.playerBulletY))
                                            S.playerBullet=false;
                                    });
                                if (S.playerBullet) {
                                    S.playerBulletTimer=S.scenePlayerBulletSpeed;
                                    S.playerBulletY++;
                                    if (S.playerBulletY>3) {
                                        S.playerBullet=false;
                                        if (S.bossStage) {
                                            S.toPeace--;
                                            G.score+=1+S.ammo;
                                            G.removeBlink(S.bossBlink);
                                            S.bossBlink=G.blink(G.leds.boss.sprite,true,G.FPS/8,4);
                                            if (S.toPeace==0)
                                                S.clearStage(G,S);
                                            else
                                                G.playSingleAudio(G.audio.hit);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    // Stage timer

                    S.secondTimer++;
                    if (S.secondTimer==G.FPS) {
                        S.secondTimer=0;
                        if (S.time)
                            S.time--;
                        else
                            return G.setState(G.states.gameOver);
                    }

                }

            },
            onRender:(G,S)=>{
                
                // Show road

                if (S.bossStage)
                    G.setLed(G.leds.road,true);
                else
                    for (let i=0;i<4;i++)
                        G.setLed(G.leds.road[i],((i+S.roadY)%3)<2);

                // Show bullets

                G.setLed(G.leds.bullets,0);
                S.enemyBullets.forEach(bullet=>{
                    G.setLed(G.leds.bullets[bullet.y][bullet.x],true);
                });
                if (S.playerBullet)
                    G.setLed(G.leds.bullets[S.playerBulletY][S.playerBulletX],true);

                // Show enemies

                G.setLed(G.leds.enemies,0);
                S.enemies.forEach(enemy=>{
                    G.setLed(G.leds.enemies[enemy.y][enemy.x],true);
                });
                G.setLed(G.leds.boss.sprite,S.bossStage);

                // Show walls

                G.setLed(G.leds.walls,0);
                S.walls.forEach(wall=>{
                    G.setLed(G.leds.walls[wall.y][wall.x],true);
                });

                // Show diamond
                G.setLed(G.leds.diamond,0);
                if (S.diamond)
                    G.setLed(G.leds.diamond[S.diamondX],true);

                // Show player

                G.setLedId(G.leds.player,S.playerX);

                // Show counters

                if (S.intro) {
                    
                    G.setLedNumber(G.leds.score,S.stage);
                    G.setLed(G.leds.labels.score,false);
                    G.setLed(G.leds.labels.stage,true);

                    G.setLed(G.leds.time,false);
                    G.setLed(G.leds.toPeace,false);
                    G.setLed(G.leds.lives,false);
                    G.setLed(G.leds.labels.toPeace,false);
                    G.setLed(G.leds.labels.time,false);

                } else {

                    G.setLedNumber(G.leds.score,G.score);
                    G.setLed(G.leds.labels.score,true);
                    G.setLed(G.leds.labels.stage,false);

                    G.setLed(G.leds.labels.time,true);
                    G.setLedNumber(G.leds.time,S.time);
                    G.setLed(G.leds.labels.toPeace,true);
                    G.setLedNumber(G.leds.toPeace,S.toPeace);
                    G.setLedGauge(G.leds.lives,S.lives);

                }


                if (S.intro || S.playerCleared) {
                    G.setLed(G.leds.reload,false);
                    G.setLed(G.leds.ammo,false);
                    G.setLed(G.leds.labels.ammo,false);
                    G.setLed(G.leds.labels.reload,false);
                } else if (S.playerReloading) {
                    G.setLedId(G.leds.reload,S.playerReloadMark);
                    G.setLedGauge(G.leds.ammo,S.playerReloadTarget);
                    G.setLed(G.leds.labels.ammo,false);
                    G.setLed(G.leds.labels.reload,true);
                } else {
                    G.setLed(G.leds.reload,false);
                    G.setLedGauge(G.leds.ammo,S.ammo);
                    G.setLed(G.leds.labels.ammo,true);
                    G.setLed(G.leds.labels.reload,false);
                }

            }
        },
        gameOver:{
            onEnter:(G,S)=>{
                S.timer=G.FPS*5;
                G.resetBlinks();
                G.setLed(G.leds.player,false);
                G.setLed(G.leds.lives,false);
                G.setLed(G.leds.time,false);
                G.setLed(G.leds.toPeace,false);
                G.setLed(G.leds.labels.toPeace,false);
                G.setLed(G.leds.labels.time,false);
                G.setLed(G.leds.labels.gameOver,true);
                G.setLed(G.leds.reload,false);
                G.setLed(G.leds.ammo,false);
                G.setLed(G.leds.labels.ammo,false);
                G.setLed(G.leds.labels.reload,false);
                if (G.score > G.highScore) {
                    G.highScore = G.score;
                    G.saveData("highscore",G.highScore);
                    G.blink(G.leds.labels.hi,true,G.FPS/4,100);
                }
                G.playSingleAudio(G.audio.music3);
            },
            onLogic:(G,S)=>{
                if (S.timer)
                    S.timer--;
                else
                    G.setState(G.states.default);
            }
        }
    }
}