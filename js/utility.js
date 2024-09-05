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
