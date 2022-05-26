let canvas;
let ctx;
let gBArrayHeight = 15; // Number of cells in array height
let gBArrayWidth = 12; // Number of cells in array width
let startX = 4; // Starting X position for Tetromino
let startY = 0; // Starting Y position for Tetromino
let score = 0; // Tracks the score
let recordScore = localStorage.getItem("records") ?? 0;
let winOrLose = "Playing";
let height = 0;
let sum;
let difficulty = parseInt(localStorage.getItem("difficulty")) || 10;
let time = parseInt(localStorage.getItem("time")) || 50;
let operation = localStorage.getItem("operation") ?? "addition";
let level = difficulty / 10; // Tracks current level
// Used as a look up table where each value in the array
// contains the x & y position we can use to draw the
// box on the canvas
let countDownTimer = new Date().getTime();
let minutesPassed = time;
let rightAudio = new Audio("rightAnswer.mp3");
let wrongAudio = new Audio("failure.mp3");
let levelWon = new Audio("LevelWon.mp3");
let levelLost = new Audio("LevelLost.mp3");
let coordinateArray = [...Array(gBArrayHeight)].map((e) =>
  Array(gBArrayWidth).fill(0)
);

let curTetromino = [0, 0];

// 3. Holds current Tetromino color
let curTetrominoColor = "cyan";

// 4. Create gameboard array so we know where other squares are
let gameBoardArray = [...Array(15)].map((e) => Array(12).fill(0));

// 4. Created to track the direction I'm moving the Tetromino
// so that I can stop trying to move through walls
let DIRECTION = {
  IDLE: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};
let direction;

class Coordinates {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Execute SetupCanvas when page loads
document.addEventListener("DOMContentLoaded", SetupCanvas);

// Creates the array with square coordinates [Lookup Table]
// [0,0] Pixels X: 11 Y: 9, [1,0] Pixels X: 34 Y: 9, ...
function CreateCoordArray() {
  let xR = 0,
    yR = 19;
  let i = 0,
    j = 0;
  for (let y = 9; y <= 334; y += 23) {
    // 12 * 23 = 276 - 12 = 264 Max X value
    for (let x = 11; x <= 264; x += 23) {
      coordinateArray[i][j] = new Coordinates(x, y);
      i++;
    }
    j++;
    i = 0;
  }
}
function createStackRows(height) {
  let randomIndex = Math.floor(Math.random() * 12);
  for (let i = 1; i <= height + 1; i++) {
    for (let j = 0; j < gBArrayWidth; j++) {
      // 4. Put Tetromino shape in the gameboard array
      gameBoardArray[j][gBArrayHeight - i] = 1;
      let coorX = coordinateArray[j][gBArrayHeight - i].x;
      let coorY = coordinateArray[j][gBArrayHeight - i].y;
      if (i > height) {
        ctx.fillStyle = "palegreen";
        ctx.fillRect(coorX, coorY, 21, 21);
        ctx.fillStyle = "black";
        ctx.font = "10px Arial";
        if (j !== randomIndex) {
          let randomNum = Math.floor(Math.random() * difficulty + difficulty);
          gameBoardArray[j][gBArrayHeight - i] = randomNum;
          ctx.fillText(randomNum, coorX + 6, coorY + 13);
        } else {
          gameBoardArray[j][gBArrayHeight - i] = sum;
          ctx.fillText(sum, coorX + 9, coorY + 13);
        }
      } else {
        ctx.fillStyle = "beige";
        ctx.fillRect(coorX, coorY, 21, 21);
      }
    }
  }
}
function randomCalc(difficulty, operation) {
  let num1 = Math.floor(Math.random() * difficulty + difficulty);

  let num2 = Math.floor(Math.random() * difficulty + difficulty);
  // while (num1 % num2 !== 0) {
  //   num2 = Math.floor(Math.random() * difficulty + difficulty);
  // }
  switch (operation) {
    case "addition":
      sum = num1 + num2;
      return `${num1}+${num2}`;
      break;
    case "subtraction":
      sum = num1 - num2;
      return `${num1}-${num2}`;
      break;
    case "division":
      if (num1 > num2) {
        sum = num1 % num2;
        return `${num1}%${num2}`;
        break;
      } else {
        sum = num2 % num1;
        return `${num2}%${num1}`;
        break;
      }

    default:
      console.log("something went wrong");
  }
}

function SetupCanvas() {
  canvas = document.getElementById("my-canvas");
  ctx = canvas.getContext("2d");
  canvas.width = 936;
  canvas.height = 717;

  // Double the size of elements to fit the screen
  ctx.scale(2, 2);

  // Draw Canvas background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw gameboard rectangle
  ctx.strokeStyle = "black";
  ctx.strokeRect(8, 8, 280, 346);

  // Set font for calculation label text and draw
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Calculate:", 300, 28);

  // Draw calculation rectangle
  ctx.strokeRect(300, 38, 161, 20);

  // Draw calculation
  ctx.fillText(randomCalc(difficulty, operation), 310, 53);

  // Set font for score label text and draw
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("SCORE", 300, 80);

  // Draw score rectangle
  ctx.strokeRect(300, 88, 161, 20);

  // Draw score
  ctx.fillText(score.toString(), 310, 105);

  // Draw level label text
  ctx.fillText("LEVEL", 300, 132);

  // Draw level rectangle
  ctx.strokeRect(300, 142, 161, 20);

  // Draw level
  ctx.fillText(level.toString(), 310, 157);

  // Draw next label text
  ctx.fillText("WIN / LOSE", 300, 184);
  // Draw playing condition rectangle
  ctx.strokeRect(300, 194, 161, 20);
  // Draw playing condition
  ctx.fillText(winOrLose, 310, 209);

  // Draw next label text
  ctx.fillText("TIME TO LAST", 300, 236);
  // Draw playing condition rectangle
  ctx.strokeRect(300, 246, 161, 20);
  // Draw playing condition
  ctx.fillText(`${time} seconds`, 310, 261);

  // Draw controls label text
  ctx.fillText("CONTROLS", 300, 288);

  // Draw controls rectangle
  ctx.strokeRect(300, 298, 161, 55);

  // Draw controls text
  ctx.font = "16px Arial";
  ctx.fillText("Left arrow:Left", 305, 313);
  ctx.fillText("Right arrow:Right", 305, 330);
  ctx.fillText("Down arrow:Down", 305, 345);

  // 2. Handle keyboard presses
  document.addEventListener("keydown", HandleKeyPress);

  // Create the rectangle lookup table
  CreateCoordArray();
  DrawTetromino();
  createStackRows(height);
}

function DrawTetromino() {
  // Move the Tetromino x & y values to the tetromino
  // shows in the middle of the gameboard
  let x = curTetromino[0] + startX;
  let y = curTetromino[1] + startY;

  // 4. Put Tetromino shape in the gameboard array
  gameBoardArray[x][y] = 1;

  // Look for the x & y values in the lookup table
  let coorX = coordinateArray[x][y].x;
  let coorY = coordinateArray[x][y].y;

  // 1. Draw a square at the x & y coordinates that the lookup
  // table provides
  ctx.fillStyle = curTetrominoColor;
  ctx.fillRect(coorX, coorY, 21, 21);
}

// ----- 2. Move & Delete Old Tetrimino -----
// Each time a key is pressed we change the either the starting
// x or y value for where we want to draw the new Tetromino
// We also delete the previously drawn shape and draw the new one
function HandleKeyPress(key) {
  if (winOrLose != "Game Over") {
    // a keycode (LEFT)
    if (key.keyCode === 37) {
      // 4. Check if I'll hit the wall
      direction = DIRECTION.LEFT;
      if (!HittingTheWall()) {
        DeleteTetromino();
        startX--;
        DrawTetromino();
      }

      // d keycode (RIGHT)
    } else if (key.keyCode === 39) {
      // 4. Check if I'll hit the wall
      direction = DIRECTION.RIGHT;
      if (!HittingTheWall()) {
        DeleteTetromino();
        startX++;
        DrawTetromino();
      }

      // s keycode (DOWN)
    } else if (key.keyCode === 40) {
      MoveTetrominoDown();
    }
  }
}

function MoveTetrominoDown() {
  // 4. Track that I want to move down
  direction = DIRECTION.DOWN;

  // 5. Check for a vertical collision
  if (!CheckForVerticalCollison()) {
    DeleteTetromino();
    startY++;
    DrawTetromino();
  }
}

// 10. Automatically calls for a Tetromino to fall every half second
window.setInterval(function () {
  if (height >= 13 || minutesPassed > time) {
    if (minutesPassed > time) {
      winOrLose = "Time is up";
      levelWon.play();
    } else {
      winOrLose = "Game Over";
      levelLost.play();
    }
    ctx.fillStyle = "white";
    ctx.font = "21px Arial";
    ctx.fillRect(310, 242, 140, 30);
    ctx.font = "45px Arial";
    ctx.fillStyle = "lightgreen";
    ctx.fillText(winOrLose, 45, 150);
    if (recordScore < score) {
      recordScore = score;
      localStorage.setItem("records", recordScore);
    }
    setTimeout(() => {
      history.back();
    }, 2000);
  }
}, 500);
window.setInterval(function () {
  let now = new Date().getTime();
  minutesPassed = Math.abs(Math.floor((now - countDownTimer) / 1000));
  let timer = document.querySelector("#timer");

  timer.innerHTML = `Time elapsed: ${minutesPassed} seconds`;
  timer.strokeStyle = "white";
  if (winOrLose != "Game Over") {
    MoveTetrominoDown();
  }
}, 1000);

// Clears the previously drawn Tetromino
// Do the same stuff when we drew originally
// but make the square white this time
function DeleteTetromino() {
  let x = curTetromino[0] + startX;
  let y = curTetromino[1] + startY;

  // 4. Delete Tetromino square from the gameboard array
  gameBoardArray[x][y] = 0;

  // Draw white where colored squares used to be
  let coorX = coordinateArray[x][y].x;
  let coorY = coordinateArray[x][y].y;
  ctx.fillStyle = "white";
  ctx.fillRect(coorX, coorY, 21, 21);
}

// 4. Check if the Tetromino hits the wall
// If they are also moving in a direction that would be off
// the board stop movement
function HittingTheWall() {
  let newX = curTetromino[0] + startX;
  if (newX <= 0 && direction === DIRECTION.LEFT) {
    return true;
  } else if (newX >= 11 && direction === DIRECTION.RIGHT) {
    return true;
  }

  return false;
}

// 5. Check for vertical collison
function CheckForVerticalCollison() {
  // Make a copy of the tetromino so that I can move a fake
  // Tetromino and check for collisions before I move the real
  // Tetromino
  let square = curTetromino;
  // Move into position based on the changing upper left
  // hand corner of the entire Tetromino shape
  let x = square[0] + startX;
  let y = square[1] + startY;

  // If I'm moving down increment y to check for a collison
  if (direction === DIRECTION.DOWN) {
    y++;
  }

  if (gameBoardArray[x][y] === sum) {
    rightAudio.play();
    score = score + 10;
    DeleteTetromino();
    direction = DIRECTION.IDLE;
    startX = 4;
    startY = 0;
    DrawTetromino();
    SetupCanvas();
    createStackRows(height);
  } else if (gameBoardArray[x][y] !== sum && gameBoardArray[x][y] > 0) {
    wrongAudio.play();
    height++;
    DeleteTetromino();
    direction = DIRECTION.IDLE;
    startX = 4;
    startY = 0;
    SetupCanvas();
    DrawTetromino();
    createStackRows(height);
  }

  if (winOrLose === "Game Over") {
    ctx.fillStyle = "white";
    ctx.fillRect(310, 242, 140, 20);
    ctx.fillStyle = "black";
    ctx.fillText(winOrLose, 310, 261);
  }
}
