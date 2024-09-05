"use strict";

/*
 * Utility Functions for Matrix Manipulation
 */

/**
 * Creates a matrix (2D array) with the specified number of rows and columns.
 * Each cell is initialized with an empty string.
 */
function createMat(ROWS, COLS) {
  const mat = [];
  for (var i = 0; i < ROWS; i++) {
    const row = [];
    for (var j = 0; j < COLS; j++) {
      row.push("");
    }
    mat.push(row);
  }
  return mat;
}

/**
 * Counts the number of specific neighbors around a given cell in the matrix.
 * Useful for games where you need to know how many items are around a specific position.
 */
function countNeighbors(mat, rowIdx, colIdx, targetValue) {
  var count = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= mat[i].length) continue;
      if (mat[i][j] === targetValue) count++;
    }
  }
  return count;
}

/**
 * Sums the values of both diagonals in the matrix.
 */
function matDiagonalsSums(mat) {
  var sumOfDiagonalLeft = 0;
  var sumOfDiagonalRight = 0;
  for (var i = 0; i < mat.length; i++) {
    sumOfDiagonalLeft += mat[i][i];
    sumOfDiagonalRight += mat[i][mat.length - 1 - i];
  }
  return [sumOfDiagonalLeft, sumOfDiagonalRight];
}

/**
 * Sums the values of a specific row in the matrix.
 */
function sumRow(mat, rowIdx) {
  var sumRow = 0;
  for (var i = 0; i < mat[0].length; i++) {
    sumRow += mat[rowIdx][i];
  }
  return sumRow;
}

/**
 * Sums the values of a specific column in the matrix.
 */
function sumCol(mat, colIdx) {
  var sumCol = 0;
  for (var i = 0; i < mat.length; i++) {
    sumCol += mat[i][colIdx];
  }
  return sumCol;
}

/**
 * Finds all empty locations in a matrix (for placing new items).
 */
function findEmptyLocations(mat, EMPTY_VALUE) {
  const emptyLocations = [];
  for (var i = 0; i < mat.length; i++) {
    for (var j = 0; j < mat[i].length; j++) {
      if (mat[i][j] === EMPTY_VALUE) {
        emptyLocations.push({ i, j });
      }
    }
  }
  return emptyLocations;
}

/**
 * Finds empty cells and places a new item at a random empty location.
 */
function addItem(mat, item, EMPTY_VALUE) {
  const emptyCells = findEmptyLocations(mat, EMPTY_VALUE);
  if (emptyCells.length === 0) return;
  const itemPos = emptyCells.splice(
    getRandomIntInclusive(0, emptyCells.length - 1),
    1
  )[0];
  mat[itemPos.i][itemPos.j] = item;
  renderCell(itemPos, item);
}

/**
 * Adds an item temporarily at a random empty cell for a set duration.
 */
function addTemporaryItem(mat, item, EMPTY_VALUE, duration = 3000) {
  const emptyCells = findEmptyLocations(mat, EMPTY_VALUE);
  if (emptyCells.length === 0) return;
  const itemPos = emptyCells.splice(
    getRandomIntInclusive(0, emptyCells.length - 1),
    1
  )[0];
  mat[itemPos.i][itemPos.j] = item;
  renderCell(itemPos, item);

  setTimeout(() => {
    mat[itemPos.i][itemPos.j] = EMPTY_VALUE;
    renderCell(itemPos, "");
  }, duration);
}

/*
 * Utility Functions for Randomization
 */

/**
 * Returns a random integer between min and max, inclusive.
 */
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffles an array randomly.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getRandomIntInclusive(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Draws a random number from an array and removes it from the array.
 */
function drawNum(array) {
  const idx = getRandomIntInclusive(0, array.length - 1);
  return array.splice(idx, 1)[0];
}

/*
 * Utility Functions for DOM Manipulation
 */

/**
 * Converts a matrix cell position to a unique class name for identifying DOM elements.
 */
function getClassName(location) {
  return "cell-" + location.i + "-" + location.j;
}

/**
 * Renders a value in a matrix cell by its position.
 */
function renderCell(location, value) {
  const cellSelector = "." + getClassName(location);
  const elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

/**
 * Shows an element by removing the 'hide' class.
 */
function showElement(selector) {
  document.querySelector(selector).classList.remove("hide");
}

/**
 * Hides an element by adding the 'hide' class.
 */
function hideElement(selector) {
  document.querySelector(selector).classList.add("hide");
}

/*
 * Utility Functions for Game Management
 */

/**
 * Updates the score by adding or subtracting a value, and updates the score display.
 */
function updateScore(diff) {
  gGame.score += diff;
  document.querySelector("span.score").innerText = gGame.score;
}

/**
 * Starts a game timer and updates the displayed time every 10ms.
 */
function startTimer() {
  gStartTime = Date.now();
  gTimerInterval = setInterval(updateTimer, 10);
}

/**
 * Stops the game timer.
 */
function stopTimer() {
  clearInterval(gTimerInterval);
}

/**
 * Updates the displayed timer on the screen.
 */
function updateTimer() {
  var elapsedTime = Date.now() - gStartTime;
  document.getElementById("timer").innerText = formatTime(elapsedTime);
}

/**
 * Formats time in milliseconds to a readable format (mm:ss:ms).
 */
function formatTime(time) {
  var ms = time % 1000;
  var s = Math.floor((time / 1000) % 60);
  var m = Math.floor((time / (1000 * 60)) % 60);

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(
    ms
  ).padStart(3, "0")}`;
}

/*
 * Utility Functions for Date and Time
 */

/**
 * Gets the current date in the format 'YYYY-MM-DD'.
 */
function getCurrentDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Gets the current time in the format 'HH:MM:SS'.
 */
function getCurrentTime() {
  const today = new Date();
  const hh = String(today.getHours()).padStart(2, "0");
  const mm = String(today.getMinutes()).padStart(2, "0");
  const ss = String(today.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

/**
 * Gets a timestamp string in the format 'YYYY-MM-DD HH:MM:SS'.
 */
function getTimestamp() {
  return `${getCurrentDate()} ${getCurrentTime()}`;
}

/**
 * Generates a random HEX color code.
 */
function generateColor() {
  const hexArray = "0123456789ABCDEF";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += hexArray[Math.floor(Math.random() * 16)];
  }
  return `#${code}`;
}

/*
 * Miscellaneous Utility Functions
 */

/**
 * Checks if a value is a number.
 */
function isNumber(value) {
  return typeof value === "number";
}

/**
 * Checks if a number is even.
 */
function isEven(num) {
  return num % 2 === 0;
}

/**
 * Returns the larger of two numbers.
 */
function getBiggerNum(num1, num2) {
  return num1 > num2 ? num1 : num2;
}

/**
 * Gets the factorial of a number.
 */
function getFactorial(num) {
  if (num === 0 || num === 1) return 1;
  return num * getFactorial(num - 1);
}

/**
 * Converts a character to its ASCII code.
 */
function toAscii(char) {
  return char.charCodeAt(0);
}

/**
 * Converts an ASCII code to its corresponding character.
 */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 * Miscellaneous Utility Functions
 */

/**
 * Checks if a value is a number.
 */
function isNumber(value) {
  return typeof value === "number";
}

/**
 * Checks if a number is even.
 */
function isEven(num) {
  return num % 2 === 0;
}

/**
 * Returns the larger of two numbers.
 */
function getBiggerNum(num1, num2) {
  return num1 > num2 ? num1 : num2;
}

/**
 * Gets the factorial of a number.
 */
function getFactorial(num) {
  if (num === 0 || num === 1) return 1;
  return num * getFactorial(num - 1);
}

/**
 * Converts a character to its ASCII code.
 */
function toAscii(char) {
  return char.charCodeAt(0);
}

/**
 * Converts an ASCII code to its corresponding character.
 */
function fromAscii(code) {
  return String.fromCharCode(code);
}

/**
 * Moves the player based on keyboard input (arrow keys).
 */
function getNextLocation(eventKeyboard, player) {
  const nextLocation = {
    i: player.location.i,
    j: player.location.j,
  };

  switch (eventKeyboard) {
    case "ArrowUp":
      nextLocation.i--;
      break;
    case "ArrowRight":
      nextLocation.j++;
      break;
    case "ArrowDown":
      nextLocation.i++;
      break;
    case "ArrowLeft":
      nextLocation.j--;
      break;
  }

  return nextLocation;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 * Miscellaneous Utility Functions
 */

/**
 * Checks if a value is a number.
 */
function isNumber(value) {
  return typeof value === "number";
}

/**
 * Checks if a number is even.
 */
function isEven(num) {
  return num % 2 === 0;
}

/**
 * Returns the larger of two numbers.
 */
function getBiggerNum(num1, num2) {
  return num1 > num2 ? num1 : num2;
}

/**
 * Gets the factorial of a number.
 */
function getFactorial(num) {
  if (num === 0 || num === 1) return 1;
  return num * getFactorial(num - 1);
}

/**
 * Converts a character to its ASCII code.
 */
function toAscii(char) {
  return char.charCodeAt(0);
}

/**
 * Converts an ASCII code to its corresponding character.
 */
function fromAscii(code) {
  return String.fromCharCode(code);
}

/**
 * Moves the player based on keyboard input (arrow keys).
 */
function getNextLocation(eventKeyboard, player) {
  const nextLocation = {
    i: player.location.i,
    j: player.location.j,
  };

  switch (eventKeyboard) {
    case "ArrowUp":
      nextLocation.i--;
      break;
    case "ArrowRight":
      nextLocation.j++;
      break;
    case "ArrowDown":
      nextLocation.i++;
      break;
    case "ArrowLeft":
      nextLocation.j--;
      break;
  }

  return nextLocation;
}
