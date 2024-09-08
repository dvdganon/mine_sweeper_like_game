"use strict";

//timer
var isDarkMode = false;
var timerInterval;
var elapsedSeconds = 0;
var isTimerRunning = false;
var blockPress = false;
// Constants and Variables
var EGG = "🍳";
var EMPTY = "";
var FLAGGED = "🥵";
// var EGG_IMG = '<img src="img/brocken egg.png">';
// var FLAGGED_IMG = '<img src="img/egg_flag.png">';

var gLevel1 = { SIZE: 4, MINES: 2 };
var gLevel2 = { SIZE: 8, MINES: 4 };
var gLevel3 = { SIZE: 12, MINES: 8 };
var ChosenLevel = gLevel2;
var gLives = 3;
var gBoard = [];
var gCounter = 0;
var hint1 = false;
var hint2 = false;
var hint3 = false;
var gHintId = "";
var gActiveHint = false;
var gRandomHintCount = 3;
var gRandomSafeCell = [];
var gGameHistory = [];
var gMegaHint = false;
var gMegaArea = [];
var megaHintDepleted = false;

function onLoad() {
  gGameHistory = [];
  gLives = 3;
  resetHintParameters();
  renderRandomHint();
  renderLives();
  resetTimer();
  gBoard = buildBoard();
  renderBoard(gBoard);
  console.log("Loaded");
}

function onInit() {
  gCounter = 0;
  gBoard = [];
  onLoad();
}
function newGameButton() {
  onInit();
}

function chooseLevel(level) {
  if (level === 1) ChosenLevel = gLevel1;
  if (level === 2) ChosenLevel = gLevel2;
  if (level === 3) ChosenLevel = gLevel3;
  onInit();
}

function buildBoard() {
  const size = ChosenLevel.SIZE;
  const board = [];
  gCounter = size ** 2;
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
        i,
        j,
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
  happy.play();
  happy.volume = 0.2;
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
      if (board[i][j].isMine) board[i][j].minesAroundCount = 0;
      board[i][j].minesAroundCount = countNegsFormula(board, i, j);
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
      if (cell.isShown && cell.minesAroundCount > 0)
        cellClass += " shown-with-count";

      strHTML += `<td class="${cellClass}" onclick="cellClicked(${i}, ${j})"oncontextmenu="flagCell(event, ${i}, ${j})">`;

      if (cell.isShown) strHTML += EMPTY;
      if (cell.isMine && cell.isShown) strHTML += EGG;
      if (cell.isFlagged) strHTML += FLAGGED;
      if (cell.minesAroundCount && cell.isShown && !cell.isMine)
        strHTML += cell.minesAroundCount;

      strHTML += "</td>";
    }
    strHTML += "</tr>";
  }
  const elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
  // console.log(board);
}

function cellClicked(i, j) {
  const cell = gBoard[i][j];
  if (gMegaHint) {
    ActivateMegaHint(cell);
    return;
  }
  if (blockPress) return;
  if (cell.isShown || cell.isFlagged) return;
  if (gCounter === ChosenLevel.SIZE ** 2 && !isTimerRunning) {
    // first click on the board generate mines (when the counter is showing maximum number only)
    addMines(gBoard, ChosenLevel.MINES, i, j);
    gCountNeg(gBoard);
    startTimer();
    isTimerRunning = true;
  }
  console.log("jjj");
  //hint action
  if (gActiveHint) {
    gActiveHint = false;
    activateHint(gBoard, i, j, gHintId);
    return;
  }
  // Reveal the clicked cell
  cell.isShown = true;
  if (cell.isMine && isTimerRunning) {
    renderCell({ i, j }, EGG);
    renderBoard(gBoard);
    gLives--;
    scream.play();
    renderLives();
    checkLose();
  }
  if (!cell.isMine && !cell.minesAroundCount && isTimerRunning) {
    wow.play();
    revealNegsCells(gBoard, i, j); // reveal all neighbor empty cells
    renderBoard(gBoard);
  }
  if (!cell.isMine && isTimerRunning) {
    renderCell({ i, j }, EMPTY);
    renderBoard(gBoard);
    gCounter--;
    renderCounter();
  }
  checkWon();
  gGameHistory.push(cell);
  // console.log(gGameHistory);
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

function checkWon() {
  const board = gBoard;
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j];
      if (!cell.isShown && !cell.isMine) {
        return;
      } else {
        continue;
      }
    }
  }
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j];
      if (!cell.isFlagged && cell.isMine && !cell.isShown) {
        cell.isFlagged = true;
        gCounter--;
      }
    }
  }

  stopTimer();
  renderBoard(gBoard);
  renderCounter();
  renderLives(true);
  happy.pause();
  starMan.play();
}

function checkLose() {
  if (gLives === 0) {
    stopTimer();
    happy.pause();
    loseSong.play();
  }
}

function hintButtonPressed(hintId) {
  if (!isTimerRunning && gCounter !== ChosenLevel.SIZE ** 2) return;
  if (gCounter === ChosenLevel.SIZE ** 2) return;
  if (
    (hintId === "hint1" && hint1) ||
    (hintId === "hint2" && hint2) ||
    (hintId === "hint3" && hint3)
  ) {
    soundNoHelp.play();
    return;
  }

  if (hintId === "hint1" && !hint1) {
    hint1 = true;
    hintSound1.play();
  }
  if (hintId === "hint2" && !hint2) {
    hint2 = true;
    hintSound2.play();
  }
  if (hintId === "hint3" && !hint3) {
    hint3 = true;
    hintSound1.play();
  }
  gHintId = hintId;
  gActiveHint = true;
  document.getElementById(hintId).innerText = `👆`;
}

function randomHint() {
  if (gRandomHintCount === 0) {
    soundNoHelp.play();
    return;
  } // No hints left, return
  if (!isTimerRunning) return;
  soundHelp.play();
  var randomSafeCell = null;

  while (!randomSafeCell) {
    var randomI = getRandomIntInclusive(0, ChosenLevel.SIZE - 1);
    var randomJ = getRandomIntInclusive(0, ChosenLevel.SIZE - 1);

    var cell = gBoard[randomI][randomJ];

    if (cell.isMine || cell.isShown) continue;
    if (
      gRandomSafeCell &&
      gRandomSafeCell.randomI === randomI &&
      gRandomSafeCell.randomJ === randomJ
    )
      continue;
    var i = randomI;
    var j = randomJ;
    randomSafeCell = { i, j };
    console.log("random", randomSafeCell);
  }

  gRandomSafeCell = randomSafeCell; // Store the new random safe cell
  console.log("grandom", gRandomSafeCell);

  gRandomHintCount--; // Decrement the number of available hints
  activateRandomHint(gRandomSafeCell); // Use the hint
}

function megaHintPressed() {
  if (megaHintDepleted) return;
  if (!isTimerRunning) return;
  gMegaHint = true;
  megaHintDepleted = true;
  console.log("mega-true");
}

function ActivateMegaHint(cell) {
  console.log("mega-activated");
  gMegaArea.push(cell);
  if (gMegaArea.length === 2) {
    console.log(gMegaArea);
    document.getElementById("mega-hint").innerText = ``;
    /////////////////////////////////////////////////////////

    for (var i = gMegaArea[0].i; i <= gMegaArea[1].i; i++) {
      for (var j = gMegaArea[0].j; j <= gMegaArea[1].j; j++) {
        var cell = gBoard[i][j];
        if (cell.isShown) continue;
        if (!cell.isMine) renderCellHint({ i, j }, EMPTY);
        if (cell.isMine) renderCellHint({ i, j }, "🍳");
      }
    }
    ///////////////////////////////////////////////////////////////
    //return to hide, after 1 sec
    setTimeout(function () {
      for (var i = gMegaArea[0].i; i <= gMegaArea[1].i; i++) {
        for (var j = gMegaArea[0].j; j <= gMegaArea[1].j; j++) {
          var cell = gBoard[i][j];
          if (cell.isShown) continue;
          renderCellReverseHint({ i, j }, EMPTY);
        }
      }
    }, 2000);

    ///////////////////////////////////////////////////////////////
  } else return;
  setTimeout(function () {
    gMegaArea = [];
    gMegaHint = false;

    console.log("mega-deactivated");
  }, 3000);
}
