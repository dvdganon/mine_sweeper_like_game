"use strict";

// Constants and Variables
const EGG = "🥚";
const EMPTY = "";
const FLAG = "🚩";

const gLevel1 = { SIZE: 4, MINES: 2 };
const gLevel2 = { SIZE: 8, MINES: 4 };
const gLevel3 = { SIZE: 12, MINES: 8 };

var gBoard = [];

var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 };

// buildBoard(gBoard);
// renderBoard(gBoard);

function onLoad() {
  console.log("Loaded");
  gBoard = buildBoard();
  renderBoard(gBoard);
  countNegs(gBoard);
}

function onInit() {
  console.log("Re/Started");
  gGame.score = 0;
  clearInterval(gIntervalGhosts);
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
          isMarked: true,
        };
      } else
        board[i][j] = {
          minesAroundCount: 4,
          isShown: false,
          isMine: false,
          isMarked: true,
        };
    }
  }
  console.log(board);
  return board;
}

function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j];
      const className = `cell cell-${i}-${j}`;

      strHTML += `<td class="${className}">${cell}</td>`;
    }
    strHTML += "</tr>";
  }
  const elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
  console.log(board);
}

// count neighbor all over the board
function gCountNeg() {
  const size = gLevel1.SIZE;

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {}
  }
  console.log(board);
  return board;
}

// count neighbor cells
function countNegsFormula(posI, posj) {
  var negsCount = 0;
  for (var i = board.i - 1; i <= board.i + 1; i++) {
    for (var j = board.j - 1; j <= board.j + 1; j++) {
      if (board[i][j].isMine) negsCount++;
    }
  }
  console.log(negsCount);
  return negsCount;
}
