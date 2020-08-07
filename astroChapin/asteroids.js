var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

//Load in images
var character = new Image();
character.src = "images/character.png";

//Character move variables
var charX = (cvs.width / 2) - 20;
var charY = (cvs.height / 2) - 20;
var charSpeed = 10;
var charHitPoints = 1;
//Character Laserbeams
var laser = [];
var laserSpeed = 5;
var laserWidth = 40;
var laserHeight = 10;
//Enemy
var enemy = new Image();
enemy.src = "images/alien.png";
var enemys = [];
var enemySpeed = 5;
var score = 0;


draw();

function gameOver() {
    //   location.reload();
    laser = [];
    enemys = [];
    charHitPoints = 1;
    score = 0;
}

function draw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(character, charX, charY);
    if (charHitPoints > 0) {
        laserMove();
        spawnEnemies();
        enemyMove();
        enemyLaserSpawn();
        collision();
    } else {
        ctx.fillStyle = "red";
        ctx.font = "100px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", cvs.width / 2, cvs.height / 2);
        document.getElementById("restart").style.display = 'block';
    }

    document.getElementById("scoreText").innerHTML = "Score: " + score;
    ctx.stroke();
    ctx.restore();
    requestAnimationFrame(draw);
}

function collision() {
    for (let i = 0; i < laser.length; i++) {
        for (let y = 0; y < enemys.length; y++) {
            if (laser[i].safe && enemys[y].hitPoints > 0) {
                if ((laser[i].x < enemys[y].x && (laser[i].x + laserWidth) > enemys[y].x)
                    && (laser[i].y + (laserHeight / 2) >= enemys[y].y && (laser[i].y + laserHeight) <= (enemys[y].y) + enemy.height)) { // Laser left of enemy
                    enemys[y].hitPoints--;
                    score++;

                } else if ((laser[i].x + laserWidth > enemys[y].x + enemy.width && laser[i].x < enemys[y].x + enemy.width)
                    && (laser[i].y + (laserHeight / 2) >= enemys[y].y && (laser[i].y + laserHeight) <= (enemys[y].y) + enemy.height)) { // Laser right of enemy
                    enemys[y].hitPoints--;
                    score++;
                }
            }
            if (!laser[i].safe) {
                if ((laser[i].x < charX && (laser[i].x + laserWidth) > charX)
                    && (laser[i].y + (laserHeight / 2) >= charY && (laser[i].y + laserHeight) <= (charY) + character.height)) { // Laser left of enemy
                    charHitPoints--;

                } else if ((laser[i].x + laserWidth > charX + enemy.width && laser[i].x < charX + enemy.width)
                    && (laser[i].y + (laserHeight / 2) >= charY && (laser[i].y + laserHeight) <= (charY) + character.height)) { // Laser right of enemy
                    charHitPoints--;
                }
            }

        }
    }
}

function enemyMove() {
    if (enemys.length > 0) {
        for (let i = 0; i < enemys.length; i++) {
            if (enemys[i].hitPoints > 0) {
                ctx.drawImage(enemy, enemys[i].x, enemys[i].y);
                switch (enemys[i].dir) {
                    case 0:
                        enemys[i].x += enemySpeed;
                        break;
                    case 1:
                        enemys[i].x -= enemySpeed;
                        break;
                    case 2:
                        enemys[i].y += enemySpeed;
                        break;
                    case 3:
                        enemys[i].y -= enemySpeed;
                        break;
                }
                var keep = true;
                if (enemys[i].x < 0) {
                    while (keep) {
                        enemys[i].dir = Math.floor(Math.random() * 4);
                        if (enemys[i].dir !== 1) keep = false;
                    }
                } else if (enemys[i].x > cvs.width - enemy.width) {
                    while (keep) {
                        enemys[i].dir = Math.floor(Math.random() * 4);
                        if (enemys[i].dir !== 0) keep = false;
                    }
                } else if (enemys[i].y < 0) {
                    while (keep) {
                        enemys[i].dir = Math.floor(Math.random() * 4);
                        if (enemys[i].dir !== 3) keep = false;
                    }
                } else if (enemys[i].y > cvs.height - enemy.height) {
                    while (keep) {
                        enemys[i].dir = Math.floor(Math.random() * 4);
                        if (enemys[i].dir !== 2) keep = false;
                    }
                }
            }

        }
    }


}

function laserMove() {
    //Lasers
    for (let i = 0; i < laser.length; i++) {
        if (laser[i].safe) {
            ctx.fillStyle = "#00ffff";
        } else {
            ctx.fillStyle = "#ff001a";

        }
        switch (laser[i].dir) {
            case 1:
                ctx.fillRect(laser[i].x + (character.width / 2), laser[i].y + (character.width / 2), laserWidth, laserHeight);
                laser[i].x += laserSpeed;
                break;
            case 0:
                ctx.fillRect(laser[i].x - (character.width / 2), laser[i].y + (character.width / 2), laserWidth, laserHeight);
                laser[i].x -= laserSpeed;
                break;
            case 2:
                ctx.fillRect(laser[i].x + (character.width / 2), laser[i].y - (character.width / 2), laserHeight, laserWidth);
                laser[i].y -= laserSpeed;
                break;
            case 3:
                ctx.fillRect(laser[i].x + (character.width / 2), laser[i].y + (character.width / 2), laserHeight, laserWidth);
                laser[i].y += laserSpeed;
                break;
        }
    }

}

function enemyLaserSpawn() {
    for (let i = 0; i < enemys.length; i++) {
        if (enemys[i].hitPoints > 0 && Math.floor(Math.random() * 10) === 1) {
            laser.push({
                x: enemys[i].x,
                y: enemys[i].y,
                dir: Math.floor(Math.random() * 4) + 1,
                safe: false,
            });
        }
    }
}

function spawnEnemies() {
    if (Math.floor(Math.random() * 100) === 4) {
        enemys.push({
            x: Math.random() * cvs.width,
            y: Math.random() * cvs.height,
            dir: Math.floor(Math.random() * 4),
            special: Math.floor(Math.random() * 20),
            hitPoints: 1,
            time: 0
        })
    }
}

window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);

var keys = [];

function keysPressed(e) {
    // store an entry for every key pressed
    keys[e.keyCode] = true;
    //   var key = e.keyCode ? e.keyCode : e.which;
    //  console.log([key]);
    //   e.preventDefault();
    if (keys[39] && keys[87]) { //R
        right();
        wKey();
    } else if (keys[39] && keys[65]) {
        right();
        aKey();
    } else if (keys[39] && keys[83]) {
        right();
        sKey();
    } else if (keys[39] && keys[68]) {
        right();
        dKey();
    }

    // -----------------
    else if (keys[38] && keys[87]) {
        up();
        wKey();
    } else if (keys[38] && keys[65]) {
        up();
        aKey();
    } else if (keys[38] && keys[83]) {
        up();
        sKey();
    } else if (keys[38] && keys[68]) {
        up();
        dKey();
    }
    //-----
    else if (keys[37] && keys[87]) {
        left();
        wKey();
    } else if (keys[37] && keys[65]) {
        left();
        aKey();
    } else if (keys[37] && keys[83]) {
        left();
        sKey();
    } else if (keys[37] && keys[68]) {
        left();
        dKey();
    }
    //---
    else if (keys[40] && keys[87]) {
        down();
        wKey();
    } else if (keys[40] && keys[65]) {
        down();
        aKey();
    } else if (keys[40] && keys[83]) {
        down();
        sKey();
    } else if (keys[40] && keys[68]) {
        down();
        dKey();
    }
    ///----
    else if (keys[40]) {
        down();
    } else if (keys[39]) {
        right();
    } else if (keys[38]) {
        up();
    } else if (keys[37]) {
        left();
    }
//---
    else if (keys[87]) {
        wKey();
    } else if (keys[65]) {
        aKey();
    } else if (keys[83]) {
        sKey()
    } else if (keys[68]) {
        dKey();
    } else if (keys[32] && charHitPoints <= 0) {
        console.log("test");
        gameOver();
    }


}

function keysReleased(e) {
    // mark keys that were released
    keys[e.keyCode] = false;
}


function right() {//39
    if (charX + character.width < cvs.width) charX += charSpeed;
}

function up() {//38
    if ((charY > 0)) charY -= charSpeed;

}

function left() { //37
    if (charX > 0) charX -= charSpeed;
}

function down() { //40
    if (charY + character.height < cvs.height) charY += charSpeed;
}

function wKey() {//87
    laser.push({
        x: charX,
        y: charY,
        dir: 2,
        safe: true,
    });
}

function aKey() {//65
    laser.push({
        x: charX,
        y: charY,
        dir: 0,
        safe: true,
    });
}

function sKey() { //83
    laser.push({
        x: charX,
        y: charY,
        dir: 3,
        safe: true,
    });
}

function dKey() { //68
    laser.push({
        x: charX,
        y: charY,
        dir: 1,
        safe: true,
    });
}

