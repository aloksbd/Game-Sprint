var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var width = 600, height = 600;

canvas.width = width;
canvas.height = height;
ctx.fillStyle = "#111111";
ctx.fillRect(0,0,width,height);
ctx.font = 50 + "px Arial";


var ship = [width/2, height - 50];
var moveLeft = false;
var moveRight = false;

var shipBullet = [-10,-10];
var shipShooting = false;

var enemy = [];
var enemyVelocity = 20;
var enemyUpdateSpeed = 55;
var counter = 0;
var reverse = false;
var enemyRemaining = 50;

var enemyBullet = [-10,-10];

var createEnemy = function(){
    for (i = 0; i < 5; i++){
        var column = []
        for (j = 0; j < 10; j++){
            column.push([(j * 35) + 50,(i * 40) + 150]);
        }
        enemy.push(column);
    }
}

var drawEnemy = function(){
    for (i in enemy){
        var column = enemy [i];
        for (j in column){
            ctx.fillStyle = "#ee99ee";
            ctx.fillRect(column[j][0],column[j][1],20,20);
        }
    }
}

var drawEnemyBullet = function() {
    ctx.fillStyle = "#99ee66";
    ctx.fillRect(enemyBullet[0],enemyBullet[1],2,15);
}

var drawBullet = function(){
    ctx.fillStyle = "#ee9966";
    ctx.fillRect(shipBullet[0],shipBullet[1],2,15);
}
var drawShip = function(){
    ctx.fillStyle = "#6699ee";
    ctx.fillRect(ship[0] - 20,ship[1],40,20);
}

var newGame = function(){

    ship = [width/2, height - 50];
    moveLeft = false;
    moveRight = false;
    
    shipBullet = [-10,-10];
    shipShooting = false;
    
    enemy = [];
    createEnemy();

    enemyVelocity = 20;
    enemyUpdateSpeed = 55;
    counter = 0;
    reverse = false;
    enemyRemaining = 50;

    enemyBullet = [-10,-10];
}
newGame();
var gameover = false;
var gameLoop = function(){
    if(!gameover){
        ctx.fillStyle = "#111111";
        ctx.fillRect(0,0,width,height);
        ctx.strokeStyle = "#eeeeee";
        ctx.beginPath();
        ctx.moveTo(10, 100);
        ctx.lineTo(width - 10, 100);
        ctx.stroke();
        if (moveLeft){
            ship[0] -= 10;
            if (ship[0] < 30){
                ship[0] = 30;
            } 
        }
        if (moveRight){
            ship[0] += 10; 
            if (ship[0] > width - 30){
                ship[0] = width - 30;
            }
        }
        if (shipShooting){
            shipBullet[1] -= 15;
            for (i in enemy){
                var column = enemy[i]
                for (j in column){
                    if(shipBullet[0] + 2 > column[j][0] && shipBullet[0] < column[j][0] + 20 && shipBullet[1] + 15 > column[j][1] && shipBullet[1] < column[j][1] + 20){
                        shipShooting = false;
                        enemyRemaining -= 1;
                        column.splice(j,1);
                        if (enemyUpdateSpeed > enemy.length){
                            enemyUpdateSpeed -= 1;
                        }
                        if (enemyRemaining == 0){
                            comnsole.log('you win');
                            
                            gameover = true;
                            setTimeout(() => {
                                gameover = false;
                                newGame()
                            }, 2000);
                        }
                    }
                }
            }
            if(shipBullet[1] < 100){
                shipShooting = false;
            }else{
                drawBullet();
            }
        }
        enemyBullet[1] += 15;
        if (enemyBullet[1] >= ship[1]){
            if (enemyBullet[0] + 2 > ship[0] - 20 && enemyBullet[0] < ship[0] + 20){
                console.log('gameover');
                gameover = true;
                setTimeout(() => {
                    gameover = false;
                    newGame()
                }, 2000);
            }else{
                for (i in enemy){
                    var column = enemy [i];
                    var enemyShooting = false;
                    for (j in column){
                        if (i == 4 && j == column.length - 1){
                            enemyBullet = [column[j][0] + 10,column[j][1]];
                        }else{
                            var rnd = Math.floor(Math.random() * 10);
                            if (rnd == 1){
                                enemyBullet = [column[j][0] + 10,column[j][1]];
                                enemyShooting = true;
                                break;
                            }
                        }
                    }
                    if (enemyShooting){
                        break;
                    }
                }
            }
        }
        drawEnemyBullet();
        if (counter < enemy.length){
            console.log(counter);
            var column = enemy [counter];
            for (j in column){
                column[j][0] += enemyVelocity; 
                if (column[j][0] < 40 || column[j][0] > width - 60){
                    reverse = true;
                }
            }
            
        }else if (reverse){
            for(i in enemy){
                var column = enemy[i];
                for (j in column){
                    column[j][1] += 20; 
                    if (column[j][1] >= ship[1]){
                        console.log('gameover');
                        gameover = true;
                        setTimeout(() => {
                            gameover = false;
                            newGame()
                        }, 2000);
                    }
                }
            }
            enemyVelocity = - enemyVelocity;
            reverse = false;
        }
        drawShip();
        drawEnemy();

        ctx.fillStyle = "#eeeeee";
        ctx.fillText((50 - enemyRemaining) * 10,width/2,80);

        counter++;
        if (counter >= enemyUpdateSpeed){
            counter = 0;
        }
    }
}
setInterval(gameLoop,1000/24)

document.onkeydown = function(keyEvent){
    if  (keyEvent.keyCode == 65){
        moveLeft  = true;
    }
    if  (keyEvent.keyCode == 68){
        moveRight = true;
    }
    if  (keyEvent.keyCode == 32){
        if (!shipShooting){
            shipBullet = [ship[0],ship[1]];
            shipShooting = true;
        }
    }
    console.log(keyEvent.keyCode);
}

document.onkeyup = function(keyEvent){
    if  (keyEvent.keyCode == 65){
        moveLeft  = false;
    }
    if  (keyEvent.keyCode == 68){
        moveRight = false;
    }
}