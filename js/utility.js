"use strict";

const soundNoHelp = new Audio("sound/300-bucks.mp3");
const soundHelp = new Audio("sound/funny-indian-man.mp3");
const happy = new Audio("sound/happy.mp3");
const loseSong = new Audio("sound/sad-meow-song.mp3");
const wow = new Audio("sound/anime-wow-sound-effect.mp3");
const scream = new Audio("sound/snag-scream.mp3");
const starMan = new Audio("sound/starman-superman.mp3");
function countNegsFormula(board, rowIdx, colIdx) {
  var count = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (i < 0 || i >= board.length || j < 0 || j >= board[i].length) continue;
      if (board[i][j].isMine) count++;
    }
  }
  // console.log(count);
  return count;
}

function activateHint(board, rowIdx, colIdx, hintId) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      // Check if we're within the bounds of the board
      if (i < 0 || i >= board.length || j < 0 || j >= board[i].length) continue;
      var cell = board[i][j];
      if (cell.isShown) continue;
      if (!cell.isMine) renderCellHint({ i, j }, EMPTY);
      if (cell.isMine) renderCellHint({ i, j }, "🍳");
    }
  }
  //return to hide, after 1 sec
  (function (i, j) {
    setTimeout(function () {
      for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
          // Check if we're within the bounds of the board
          if (i < 0 || i >= board.length || j < 0 || j >= board[i].length)
            continue;
          var cell = board[i][j];
          if (cell.isShown) continue;
          renderCellReverseHint({ i, j }, EMPTY);
        }
      }
    }, 1000);
  })(i, j);

  document.getElementById(hintId).innerText = ``;
}

function activateRandomHint(gRandomSafeCell) {
  renderCellHint(gRandomSafeCell, EMPTY);
  setTimeout(() => {
    renderCellReverseHint(gRandomSafeCell, EMPTY);
  }, 1000);
  renderRandomHint();
}

function renderCell(location, value) {
  const cellSelector = "." + getClassName(location);
  const elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

function renderCellHint(location, value) {
  console.log("value2", location);
  const cellSelector = "." + getClassName(location);
  const elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
  if (value === "🍳") elCell.classList.add("mine");
  if (value === "") elCell.classList.add("shown");
  console.log("val", value);
}

function renderCellReverseHint(location, value) {
  const cellSelector = "." + getClassName(location);
  const elCell = document.querySelector(cellSelector);
  elCell.classList.remove("shown", "mine", "shown-with-count");
  elCell.innerHTML = value;
  console.log("val", value);
}

function getClassName(location) {
  const cellClass = `cell-${location.i}-${location.j}`;
  // console.log(cellClass);
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
        // !board[i][j].minesAroundCount &&  //this was a condition in past version because i was confused about the rules of the game.
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

function renderLives(value) {
  if (gLives === 0) document.getElementById("lives").innerText = `💀`;
  if (gLives === 1) document.getElementById("lives").innerText = `🫀`;
  if (gLives === 2) document.getElementById("lives").innerText = `🫀🫀`;
  if (gLives === 3) document.getElementById("lives").innerText = `🫀🫀🫀`;
  if (gLives > 3) document.getElementById("lives").innerText = `☠️`; //ERROR INDICATION FOR DEVELOPER
  if (value === true) document.getElementById("lives").innerText = `🐣`;
}

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(function () {
    elapsedSeconds++;
    document.getElementById("game-timer").innerText = `🍳${elapsedSeconds}`;
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
  document.getElementById("game-timer").innerText = `🍳0`;
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

function resetHintParameters() {
  hint1 = false;
  hint2 = false;
  hint3 = false;
  gActiveHint = false;
  document.getElementById("hint1").innerText = `🆘`;
  document.getElementById("hint2").innerText = `🆘`;
  document.getElementById("hint3").innerText = `🆘`;
  gRandomHintCount = 3;
}

function renderRandomHint() {
  document.getElementById("random-hint-txt").innerText = gRandomHintCount;
}

function redo() {
  // If no history exists, return early
  if (gGameHistory.length === 0) return;

  var cell = gGameHistory.pop();

  var location = { i: cell.i, j: cell.j };
  cell.isShown = false;
  renderCellReverseHint(location, EMPTY);
  gCounter++;
  renderCounter();
  // console.log(location);
  // console.log(gGameHistory);
}
