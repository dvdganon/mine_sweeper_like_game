"use strict";

function countNegsFormula(board, rowIdx, colIdx, targetValue) {
  var count = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (i < 0 || i >= board.length || j < 0 || j >= board[i].length) continue;
      if (board[i][j].isMine === targetValue) count++;
    }
  }
  console.log(count);
  return count;
}

function renderCell(location, value) {
  const cellSelector = "." + getClassName(location);
  const elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
  console.log(value);
}

function getClassName(location) {
  const cellClass = `cell-${location.i}-${location.j}`;
  console.log(cellClass);
  return cellClass;
}

// Function to recursively reveal all neighbor empty cells
// ! i added a timeout to add a nice effect of revealing the board.
function revealNegsCells(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (i < 0 || i >= board.length || j < 0 || j >= board[i].length) continue;
      if (
        !board[i][j].isShown &&
        !board[i][j].minesAroundCount &&
        !board[i][j].isMine
      ) {
        (function (i, j) {
          setTimeout(function () {
            cellClicked(i, j);
          }, 50);
        })(i, j);
      }

      // cellClicked(i, j);
      // if cell is neighbor cell and have no mines around it. it will be clicked
      //and the cycle continue, until no cells left to reveal. (made it myself :)
      //this is unsure that the neighbors of the neighbors will be revealed also.
    }
  }
}

//! without added timeout-----------------------------------------------------------------------------------
// function revealNegsCells(board, rowIdx, colIdx) {
//   for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//     for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//       if (i === rowIdx && j === colIdx) continue;
//       if (i < 0 || i >= board.length || j < 0 || j >= board[i].length) continue;
//       if (
//         !board[i][j].isShown &&
//         !board[i][j].minesAroundCount &&
//         !board[i][j].isMine
//       )
//         cellClicked(i, j);
//     }
//   }
// }
// ! -------------------------------------------------------------------------------------------------------

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled; // The maximum is inclusive and the minimum is inclusive
}

function renderCounter() {
  const elSaved = document.querySelector("#counter-value");
  elSaved.innerText = gCounter;
}

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(function () {
    elapsedSeconds++;
    document.getElementById(
      "game-timer"
    ).innerText = `Time: ${elapsedSeconds}s`;
  }, 1000); // Increments every second
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
}

// Function to reset the timer
function resetTimer() {
  clearInterval(timerInterval);
  elapsedSeconds = 0;
  document.getElementById("game-timer").innerText = `Time: 0s`;
  isTimerRunning = false;
}

// Disable the default right-click menu
document.addEventListener(
  "contextmenu",
  function (e) {
    e.preventDefault();
  },
  false
);
