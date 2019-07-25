var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var row = 25;
var column = 15;
var mines = Math.floor(row * column / 10);
var boxSize = 25;

var width = (row) * boxSize;
var height = (column) * boxSize;

canvas.width = width;
canvas.height = height;
ctx.fillStyle = "#333333";
ctx.fillRect(0,0,width,height);
// canvas.style.border = '1px solid #110505';

var fontSize = 2 / 3 * boxSize;
ctx.font = fontSize + "px Arial";

var boxRow = [];

for (i = 0; i < row; i++ ){
    var boxColumn = [];
    for (j = 0; j < column; j++){
        boxColumn[j] = {item: ' ', state: 0};  //state: 0 = closed, 1 = opened, 2 = marked
        ctx.fillStyle = "#777777";
        ctx.fillRect(i * (boxSize),j * (boxSize),boxSize,boxSize);
        ctx.strokeStyle = "#222222";
        ctx.strokeRect(i * (boxSize),j * (boxSize),boxSize,boxSize);
    }
    boxRow[i] = boxColumn;
}

for(i = 0; i < mines; i++){
    var rndI = Math.floor(Math.random() * row);
    var rndJ = Math.floor(Math.random() * column);
    var ar = boxRow[rndI];
    while (ar[rndJ].item == 'Q'){
        var rndI = Math.floor(Math.random() * row);
        var rndJ = Math.floor(Math.random() * column);
        var ar = boxRow[rndI];
    }
    ar[rndJ] = {item: 'Q', state: 0};
    for (r = -1; r < 2; r++){
        for (c = -1; c < 2; c++){
            if (c + rndJ >= 0 && c + rndJ <= column - 1 && r + rndI >= 0 && r + rndI <= row - 1){
                var arr = boxRow[r + rndI]
                if (arr[c + rndJ].item != 'Q'){
                    if (arr[c + rndJ].item == ' '){
                        arr[c + rndJ].item = '0';
                    }
                    var n = Number(arr[c + rndJ].item);
                    arr[c + rndJ].item = n + 1;
                }
            }
        }
    }
}

console.log(boxRow);

var openBox = function(i,j,item){
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(i * (boxSize),j * (boxSize),boxSize,boxSize);
    ctx.strokeStyle = "#333333";
    ctx.strokeRect(i * (boxSize),j * (boxSize),boxSize,boxSize);

    ctx.fillStyle = "#333333";
    if(item == 'Q'){
        item = 'X';
    }
    ctx.fillText(item, i * (boxSize) + boxSize / 2 - fontSize/3,j * (boxSize) + boxSize / 2 + fontSize/3);
}

var drawB = function(){
    for (i = 0; i < row; i++ ){
        var boxColumn = boxRow[i];
        for (j = 0; j < column; j++){
            if (boxColumn[j].state == 0){
                ctx.fillStyle = "#ffffff";
                ctx.fillText('B', i * (boxSize) + boxSize / 2 - fontSize/3,j * (boxSize) + boxSize / 2 + fontSize/3);
            }
        }
    }
}

var drawBombs = function(){
    for (i = 0; i < row; i++ ){
        var boxColumn = boxRow[i];
        for (j = 0; j < column; j++){
            if (boxColumn[j].item == 'Q' && boxColumn[j].state != 1){
                ctx.fillStyle = "#ffffff";
                ctx.fillText('Q', i * (boxSize) + boxSize / 2 - fontSize/3,j * (boxSize) + boxSize / 2 + fontSize/3);
            }
        }
    }
}

var gameover = false;
var opened = row * column;
var check = function(i,j){
    console.log("=========================",i,j,"=============================");
    var ar = boxRow[i];
    var item = ar[j].item;
    console.log(item);
    openBox(i,j,item);
    ar[j].state = 1;
    if(item == 'Q'){
        console.log('you lost');
        gameover = true;
        drawBombs();
        return;
    }
    opened--;
    if (opened == mines){
        console.log("you win");
        gameover = true;
        drawB();
        return;
    }
    if (item != ' '){
        return;
    }
    for (r = 1; r >= -1; r--){
        for (c = 1; c >= -1; c--){
            console.log("====", i,j, "=====",r,c);
            if (c + j >= 0 && c + j <= column - 1 && r + i >= 0 && r + i <= row - 1){
                console.log(r,c, "====", i,j, "=====", r+i, c+j, boxRow[r + i][c + j]);
                var arr = boxRow[r + i];
                if (arr[c + j].state == 0){
                    // for some reason r and c are not same after calling check function
                    var t = r;
                    var y = c;
                    check (r + i, c + j);
                    console.log("boom","====", i,j, "=====",r,c,t,y);
                    r = t;
                    c = y; 
                }
            }
        }
    }
}

document.onclick = function(mouse){
    if (!gameover){
    var mouseX = mouse.clientX - canvas.getBoundingClientRect().left;
    var mouseY = mouse.clientY - canvas.getBoundingClientRect().top;
    var i = Math.floor(mouseX/boxSize);
    var j = Math.floor(mouseY/boxSize);
    if (i < width && j < height){
        check(i,j);
    }
    }
}

document.oncontextmenu = function(mouse){
    if (!gameover){
        var mouseX = mouse.clientX - canvas.getBoundingClientRect().left;
        var mouseY = mouse.clientY - canvas.getBoundingClientRect().top;
        var i = Math.floor(mouseX/boxSize);
        var j = Math.floor(mouseY/boxSize);
        if (i < width && j < height){
            if (boxRow[i][j].state == 0){
                ctx.fillStyle = "#ffffff";
                ctx.fillText('B', i * (boxSize) + boxSize / 2 - fontSize/3,j * (boxSize) + boxSize / 2 + fontSize/3);
                boxRow[i][j].state = 2
            }else if (boxRow[i][j].state == 2){
                ctx.fillStyle = "#777777";
                ctx.fillRect(i * (boxSize),j * (boxSize),boxSize,boxSize);
                ctx.strokeStyle = "#333333";
                ctx.strokeRect(i * (boxSize),j * (boxSize),boxSize,boxSize);
                boxRow[i][j].state = 0
            }
        }
        if(mouseX < canvas.width && mouseY < canvas.height){
            mouse.preventDefault();
        }
    }
}