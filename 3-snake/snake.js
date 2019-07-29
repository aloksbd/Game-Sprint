var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var row = 50;
var column = 30;
var boxSize = 15;

var width = (row) * boxSize;
var height = ((column) * boxSize) + 30;

canvas.width = width;
canvas.height = height;
ctx.fillStyle = "#111111";
ctx.fillRect(0,0,width,height);
ctx.font = 25 + "px Arial";

var food = [];
var snake = [];
var score = 0;
var velocity = [1,0];
var createSnake = function(){
    for (i = 2 ; i >= 0; i--){
        snake.push([i,Math.floor(column/2)]);
    }
}
var createFood = function(){
    while (true){
        var x = Math.floor(Math.random() * row);
        var y = Math.floor(Math.random() * column);
        var duplicate = false;
        for (i = 0; i < snake.length; i ++){
            if (snake[i][0] == x && snake[i][1] == y){
                duplicate = true;
                break;
            }
        }
        if (!duplicate){
            food = [x,y];
            break;
        }
    }
}

var drawFood = function (){
    ctx.fillStyle = "#ee3333";
    ctx.fillRect(food[0] * boxSize,food[1] * boxSize,boxSize,boxSize);
}
createSnake();
createFood();
var drawSnake = function(){
    for(i in snake){
        ctx.fillStyle = "#33ee33";
        ctx.fillRect(snake[i][0] * boxSize,snake[i][1] * boxSize,boxSize,boxSize);
        ctx.strokeStyle = "#3333ee";
        ctx.strokeRect(snake[i][0] * boxSize,snake[i][1] * boxSize,boxSize,boxSize);
    }
}

var gameover = false;
var gameLoop = function(){
    if(!gameover){
        ctx.fillStyle = "#111111";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        var newHead = [snake[0][0] + velocity[0], snake[0][1] + velocity[1]];
        if (newHead[0] == row){
            newHead[0] = 0;
        }
        if (newHead[0] == -1){
            newHead[0] = row - 1;
        }
        if (newHead[1] == column){
            newHead[1] = 0;
        }
        if (newHead[1] == -1){
            newHead[1] = column - 1;
        }
        var temp = snake[snake.length-1];
        for (i = snake.length - 1; i > 0; i--){
            snake[i] = snake[i - 1];
            if(newHead[0] == snake[i][0] && newHead[1] == snake[i][1]){
                console.log('gameover');
                gameover = true;
                setTimeout(() => {
                    gameover = false;
                    snake = [];
                    velocity = [1,0];
                    score = 0;
                    createSnake();
                    createFood();
                }, 2000);
            }
        }
        snake[0] = newHead;
        if (snake[0][0] == food[0] && snake[0][1] == food[1]){
            snake.push(temp);
            createFood();
            score += 10
        }
        drawFood();
        drawSnake();
        ctx.fillStyle = "#eeeeee";
        
        ctx.fillText(score,width/2,height - 3);

        ctx.strokeStyle = "#eeeeee";
        ctx.beginPath();
        ctx.moveTo(0, height - 30);
        ctx.lineTo(width, height - 30);
        ctx.stroke();
    }
}

setInterval(gameLoop,1000/10);

document.onkeydown = function(keyEvent){
    if  (keyEvent.keyCode == 87){
        if (velocity[1] == 0){
            velocity[1] = -1;
            velocity[0] = 0;
        }
    }
    if  (keyEvent.keyCode == 83){
        if (velocity[1] == 0){
            velocity[1] = 1;
            velocity[0] = 0;
        }
    }
    if  (keyEvent.keyCode == 65){
        if (velocity[0] == 0){
            velocity[0] = -1;
            velocity[1] = 0;
        }
    }
    if  (keyEvent.keyCode == 68){
        if (velocity[0] == 0){
            velocity[0] = 1;
            velocity[1] = 0;
        }
    }
}