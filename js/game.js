"use strict";

//timer
var timerInterval;
var elapsedSeconds = 0;
var isTimerRunning = false;
// Constants and Variables
const EGG = "🥚";
const EMPTY = "";
const FLAGGED = "🚩";
var EGG_IMG = '<img src="img/brocken egg.png">';
var FLAGGED_IMG = '<img src="img/egg_flag.png">';

const gLevel1 = { SIZE: 4, MINES: 2 };
const gLevel2 = { SIZE: 8, MINES: 4 };
const gLevel3 = { SIZE: 12, MINES: 8 };

var gBoard = [];
var gCounter = 0;

function onLoad() {
  resetTimer();
  console.log("Loaded");
  gBoard = buildBoard();
  renderBoard(gBoard);
}

function onInit() {
  gCounter = 0;
  gBoard = [];
  onLoad();
}
function newGameButton() {
  onInit();
}

function buildBoard() {
  const size = gLevel1.SIZE;
  const board = [];
  gCounter = gLevel1.SIZE ** 2 - gLevel1.MINES;
  renderCounter();
  for (var i = 0; i < size; i++) {
    board.push([]);

    for (var j = 0; j < size; j++) {
      // ! two mines to place for development and testing purposes
      // if (i === 0 && j < 2) {
      //   board[i][j] = {
      //     minesAroundCount: 4,
      //     isShown: false,
      //     isMine: true,
      //     isFlagged: false,
      //   };
      // } else
      board[i][j] = {
        minesAroundCount: 4,
        isShown: false,
        isMine: false,
        isFlagged: false,
      };
    }
  }
  // console.log(board);
  return board;
}

function addMines(board, mineCount, firstI, firstJ) {
  const size = board.length;

  // Place the mines randomly
  var placedMines = 0;
  while (placedMines < mineCount) {
    var randomI = getRandomIntInclusive(0, size - 1);
    var randomJ = getRandomIntInclusive(0, size - 1);

    var cell = board[randomI][randomJ];

    // Place the mine only if the cell is not already a mine and not shown
    if (randomI === firstI && randomJ === firstJ) continue; // the first clicked cell is skipped
    if (!cell.isMine && !cell.isShown) {
      cell.isMine = true;
      placedMines++;
    }
  }

  return board;
}

// count neighbor all over the board
function gCountNeg(board) {
  const size = board.length;
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      board[i][j].minesAroundCount = countNegsFormula(board, i, j, true);
    }
  }
}

function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j];
      var cellClass = `cell cell-${i}-${j}`;
      // if (!cell.isShown) cellClass = "cell";

      if (cell.isMine && cell.isShown) cellClass += " mine";
      if (cell.isFlagged) cellClass += " flagged";
      if (cell.isShown) cellClass += " shown";

      strHTML += `<td class="${cellClass}" onclick="cellClicked(${i}, ${j})"oncontextmenu="flagCell(event, ${i}, ${j})">`;

      if (cell.isShown) strHTML += EMPTY;
      if (cell.isMine && cell.isShown) strHTML += EGG_IMG;
      if (cell.isFlagged) strHTML += FLAGGED_IMG;
      if (cell.minesAroundCount && cell.isShown && !cell.isMine)
        strHTML += cell.minesAroundCount;

      strHTML += "</td>";
    }
    strHTML += "</tr>";
  }
  const elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
  console.log(board);
}

function cellClicked(i, j) {
  const cell = gBoard[i][j];

  if (cell.isShown || cell.isFlagged) return;
  if (gCounter === gLevel1.SIZE ** 2 - gLevel1.MINES) {
    // first click on the board generate mines (when the counter is showing maximum number only)
    addMines(gBoard, gLevel1.MINES, i, j);
    gCountNeg(gBoard);
    startTimer();
    isTimerRunning = true;
  }
  // Reveal the clicked cell
  cell.isShown = true;
  if (cell.isMine && isTimerRunning) {
    renderCell({ i, j }, EGG);
    renderBoard(gBoard);
    stopTimer();
  }
  if (!cell.isMine && !cell.minesAroundCount && isTimerRunning) {
    revealNegsCells(gBoard, i, j); // reveal all neighbor empty cells
    renderBoard(gBoard);
  }
  if (!cell.isMine && isTimerRunning) {
    renderCell({ i, j }, EMPTY);
    renderBoard(gBoard);
    gCounter--;
    renderCounter();
  }
}

function flagCell(event, i, j) {
  event.preventDefault(); // Prevent the right-click menu from appearing

  const cell = gBoard[i][j];
  if (!isTimerRunning) return;
  // If the cell is already shown, do nothing
  if (cell.isShown) return;

  // Toggle flag on or off
  if (cell.isFlagged) {
    cell.isFlagged = false;
    gCounter++; // Increment counter when flag is removed
  } else {
    cell.isFlagged = true;
    gCounter--; // Decrement counter when flag is placed
  }

  renderBoard(gBoard); // Re-render the board to show the updated flag state
  renderCounter(); // Update the flag counter
}
