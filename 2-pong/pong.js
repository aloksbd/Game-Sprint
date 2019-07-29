var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var width = 800, height = 500;

canvas.width = width;
canvas.height = height;
ctx.fillStyle = "#111111";
ctx.fillRect(0,0,width,height);
ctx.font = 50 + "px Arial";

var peddleWidth = 10;
var peddleHeight = 80;
var ballRadius = 10;

var positions = [{x:10,y:height/2 - peddleHeight/2},{x: width-20,y:height/2 - peddleHeight/2},{x:width/2,y:height/2}];
var ballVelocity = {x: 15,y: 0};
var peddleVelocity = 10;
var moveUp = false;
var moveDown = false;

var gameover = false;
var score = [0,0];

var gameLoop = function(){
    if (!gameover){
        ctx.fillStyle = "#111111";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "#eeeeee";
        ctx.strokeStyle = "#eeeeee";
        ctx.beginPath();
        ctx.moveTo(width/2, 30);
        ctx.lineTo(width/2, height - 30);
        ctx.stroke();
        ctx.fillText(score[0],width/4, height/2);
        ctx.fillText(score[1],3 * width/4, height/2);
        for (i in positions){
            var pos = positions[i];
            if (i < 2){
                ctx.fillStyle = "#33ee33"
                ctx.fillRect(pos.x,pos.y,peddleWidth,peddleHeight)
                if(i == 1){
                    if (positions[2].y < pos.y || pos.y + peddleHeight < positions[2].y){
                        if (pos.y + peddleHeight/2 - positions[2].y > 0){
                            pos.y -= peddleVelocity;
                        }else{
                            pos.y += peddleVelocity;
                        }
                    }
                }
                if (i == 0){
                    if (moveUp){
                        pos.y -= peddleVelocity;
                    }
                    if (moveDown){
                        pos.y += peddleVelocity;
                    }
                }
                if (pos.y < 30){
                    pos.y = 30;
                }
                if (pos.y > height - 105){
                    pos.y = height - 105;
                }
            }else{
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, ballRadius, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#ee7733';
                ctx.fill();
                pos.x += ballVelocity.x;
                pos.y += ballVelocity.y; 
                if (positions[i-1].x <= pos.x || positions[i-2].x + 10 >= pos.x){
                    if (ballVelocity.x < 0){
                        if(positions[0].y > pos.y || pos.y > positions[0].y + peddleHeight){
                            console.log('gameover');
                            pos.x = width/2;
                            pos.y = height/2;
                            ballVelocity = {x: 15,y: 0};
                            setTimeout(() => {
                                gameover = true;
                            }, 1000/30);
                            score[1] += 1;
                            setTimeout(() => {
                                gameover = false;
                            }, 1000);
                        }else{
                            ballVelocity.y = (pos.y - (positions[0].y + peddleHeight/2))/2
                        }
                    }else{
                        if(positions[1].y > pos.y || pos.y > positions[1].y + peddleHeight){
                            console.log('gameover');
                            pos.x = width/2;
                            pos.y = height/2;
                            ballVelocity = {x: -15,y: 0};
                            setTimeout(() => {
                                gameover = true;
                            }, 1000/30);
                            score[0] += 1;
                            setTimeout(() => {
                                gameover = false;
                            }, 1000);
                        }else{
                            ballVelocity.y = (pos.y - (positions[1].y + peddleHeight/2))/2
                        }
                    }
                    ballVelocity.x = -ballVelocity.x;
                    pos.x += ballVelocity.x;
                }
                if (30 >= pos.y || height - 30 <= pos.y){
                    ballVelocity.y = -ballVelocity.y;
                    pos.y += ballVelocity.y;
                }
            }
        }
    }
}

setInterval(gameLoop,1000/30);

document.onkeydown = function(keyEvent){
    if  (keyEvent.keyCode == 87){
        moveUp = true;
    }
    if  (keyEvent.keyCode == 83){
        moveDown = true;
    }
}

document.onkeyup = function(keyEvent){
    if  (keyEvent.keyCode == 87){
        moveUp = false;
    }
    if (keyEvent.keyCode == 83){
        moveDown = false;
    }
}
