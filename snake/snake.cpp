#include "globals.h"
#include "snake.h"

enum SnakeDir {
    DIR_UP,
    DIR_DOWN,
    DIR_LEFT,
    DIR_RIGHT
};

struct Point {
    int x;
    int y;
};

std::vector<Point> snakeBody;
Point foodPos;
SnakeDir currentDir = DIR_RIGHT;
SnakeDir nextDir = DIR_RIGHT;
bool gameOver = false;
int score = 0;
unsigned long lastMoveTime = 0;
const int moveInterval = 120;

#define GRID_W 30
#define GRID_H 11
#define CELL_SIZE 8
#define Y_OFFSET 30

void spawnFood() {
    bool valid = false;
    while (!valid) {
        foodPos.x = random(0, GRID_W);
        foodPos.y = random(0, GRID_H);
        valid = true;
        for (auto &part : snakeBody) {
            if (part.x == foodPos.x && part.y == foodPos.y) {
                valid = false;
                break;
            }
        }
    }
}

void startSnakeGame() {
    currentState = STATE_SNAKE;
    snakeBody.clear();
    snakeBody.push_back({10, 5});
    snakeBody.push_back({9, 5});
    snakeBody.push_back({8, 5});

    currentDir = DIR_RIGHT;
    nextDir = DIR_RIGHT;
    score = 0;
    gameOver = false;
    lastMoveTime = millis();

    spawnFood();
    drawSnakeGame();
}

void updateSnakeGame() {
    if (currentState != STATE_SNAKE || gameOver) return;

    if (millis() - lastMoveTime >= moveInterval) {
        lastMoveTime = millis();
        currentDir = nextDir;

        Point head = snakeBody[0];
        if (currentDir == DIR_UP) head.y--;
        else if (currentDir == DIR_DOWN) head.y++;
        else if (currentDir == DIR_LEFT) head.x--;
        else if (currentDir == DIR_RIGHT) head.x++;

        if (head.x < 0 || head.x >= GRID_W || head.y < 0 || head.y >= GRID_H) {
            gameOver = true;
            drawSnakeGame();
            return;
        }

        for (auto &part : snakeBody) {
            if (part.x == head.x && part.y == head.y) {
                gameOver = true;
                drawSnakeGame();
                return;
            }
        }

        snakeBody.insert(snakeBody.begin(), head);

        if (head.x == foodPos.x && head.y == foodPos.y) {
            score += 10;
            spawnFood();
        } else {
            snakeBody.pop_back();
        }

        drawSnakeGame();
    }
}

void drawSnakeGame() {
    canvas.fillScreen(BLACK);

    drawTopBar();

    canvas.fillRect(0, 14, 240, 14, DARK_PURPLE);
    canvas.setTextColor(WHITE, DARK_PURPLE);
    canvas.setCursor(2, 15);
    canvas.print("Snake Game | Score: " + String(score));

    canvas.fillRect(0, 120, 240, 15, LIGHT_PURPLE);
    canvas.setTextColor(BLACK, LIGHT_PURPLE);
    canvas.setCursor(2, 121);
    if (gameOver) {
        canvas.print("GAME OVER! Enter:Play | Esc");
    } else {
        canvas.print("^v<>:Move | Esc:Quit");
    }

    if (gameOver) {
        canvas.setCursor(60, 55);
        canvas.setTextColor(YELLOW, BLACK);
        canvas.print("GAME OVER!");
        canvas.setCursor(45, 73);
        canvas.setTextColor(WHITE, BLACK);
        canvas.print("Final Score: " + String(score));
        canvas.pushSprite(0, 0);
        return;
    }

    int foodPx = foodPos.x * CELL_SIZE + (CELL_SIZE / 2);
    int foodPy = Y_OFFSET + foodPos.y * CELL_SIZE + (CELL_SIZE / 2);
    canvas.fillCircle(foodPx, foodPy, 3, RED);

    for (size_t i = 0; i < snakeBody.size(); i++) {
        int px = snakeBody[i].x * CELL_SIZE;
        int py = Y_OFFSET + snakeBody[i].y * CELL_SIZE;
        uint16_t color = (i == 0) ? LIGHT_PURPLE : GREEN;
        canvas.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2, color);
    }

    canvas.pushSprite(0, 0);
}

void handleSnakeInput(Keyboard_Class::KeysState status) {
    if (isEscPressed(status)) {
        currentState = STATE_TERMINAL;
        redrawTerminal();
        return;
    }

    if (gameOver) {
        if (status.enter) {
            startSnakeGame();
        }
        return;
    }

    for (char c : status.word) {
        if (!status.fn) {
            if (c == ';' && currentDir != DIR_DOWN) nextDir = DIR_UP;
            else if (c == '.' && currentDir != DIR_UP) nextDir = DIR_DOWN;
            else if (c == ',' && currentDir != DIR_RIGHT) nextDir = DIR_LEFT;
            else if (c == '/' && currentDir != DIR_LEFT) nextDir = DIR_RIGHT;
        }
    }
}
