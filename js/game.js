"use strict";

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

var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 };

// buildBoard(gBoard);
// renderBoard(gBoard);
// setInterval(onInit, 1000);
function onLoad() {
  console.log("Loaded");
  gBoard = buildBoard();
  gCountNeg(gBoard);
  renderBoard(gBoard);
}

function onInit() {
  console.log("Re/Started");
  gGame.score = 0;
  // clearInterval(gIntervalGhosts);
  gGame.isOn = false;
  gBoard = buildBoard();
  renderBoard(gBoard);
  gGame.isOn = true;
}

function buildBoard() {
  const size = gLevel1.SIZE;
  const board = [];

  for (var i = 0; i < size; i++) {
    board.push([]);

    for (var j = 0; j < size; j++) {
      if (i === 0 && j < 2) {
        board[i][j] = {
          minesAroundCount: 4,
          isShown: false,
          isMine: true,
          isFlagged: false,
        };
      } else
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

      strHTML += `<td class="${cellClass}" onclick="cellClicked(${i}, ${j})">`;

      if (cell.isShown) strHTML += EMPTY;
      if (cell.isMine && cell.isShown) strHTML += EGG;
      if (cell.isFlagged) strHTML += FLAGGED;

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

  // Reveal the clicked cell
  cell.isShown = true;
  if (cell.isMine) {
    renderCell({ i, j }, EGG);
    renderBoard(gBoard);
  }
  if (!cell.isMine) {
    renderCell({ i, j }, EMPTY);
    renderBoard(gBoard);
  }
  console.log(gBoard);
}
