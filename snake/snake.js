// snake.js - podOS Dynamic JavaScript App
var score = 0;
var snake = [{x: 10, y: 5}, {x: 9, y: 5}, {x: 8, y: 5}];
var dir = "RIGHT";
var food = {x: 15, y: 5};
var gameOver = false;

function spawnFood() {
    food.x = system.random(0, 30);
    food.y = system.random(0, 11);
}

function update() {
    if (gameOver) return;

    var head = {x: snake[0].x, y: snake[0].y};
    if (dir == "UP") head.y--;
    if (dir == "DOWN") head.y++;
    if (dir == "LEFT") head.x--;
    if (dir == "RIGHT") head.x++;

    // Wall Collision Check
    if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 11) {
        gameOver = true;
        return;
    }

    // Self Collision Check
    for (var i = 0; i < snake.length; i++) {
        if (snake[i].x == head.x && snake[i].y == head.y) {
            gameOver = true;
            return;
        }
    }

    snake.unshift(head);

    // Food Collision Check
    if (head.x == food.x && head.y == food.y) {
        score += 10;
        spawnFood();
    } else {
        snake.pop();
    }
}

function render() {
    gfx.clear("black");
    gfx.drawTopBar();
    gfx.fillRect(0, 14, 240, 14, "dark_purple");
    gfx.print(2, 15, "Snake.app | Score: " + score, "white");

    if (gameOver) {
        gfx.print(60, 55, "GAME OVER!", "yellow");
        gfx.print(45, 73, "Final Score: " + score, "white");
        gfx.update();
        return;
    }

    // Draw Food
    gfx.fillCircle(food.x * 8 + 4, 30 + food.y * 8 + 4, 3, "red");

    // Draw Snake
    for (var i = 0; i < snake.length; i++) {
        var color = (i == 0) ? "light_purple" : "green";
        gfx.fillRect(snake[i].x * 8 + 1, 30 + snake[i].y * 8 + 1, 6, 6, color);
    }

    gfx.update();
}

function onKey(key) {
    if (gameOver) {
        if (key == "enter") {
            score = 0;
            snake = [{x: 10, y: 5}, {x: 9, y: 5}, {x: 8, y: 5}];
            dir = "RIGHT";
            gameOver = false;
            spawnFood();
        }
        return;
    }

    if (key == ";" && dir != "DOWN") dir = "UP";
    if (key == "." && dir != "UP") dir = "DOWN";
    if (key == "," && dir != "RIGHT") dir = "LEFT";
    if (key == "/" && dir != "LEFT") dir = "RIGHT";
}

// App Initialization
spawnFood();

// Main Execution Loop
while (system.isRunning()) {
    var key = keyboard.getKey();
    if (key != "") {
        onKey(key);
    }
    update();
    render();
    system.sleep(200);
}
