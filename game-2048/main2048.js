var board = new Array();
var score = 0;

// 记录每个棋盘格是否已经发生碰撞
var hasConflicted = new Array();

$(document).ready(function(){
  newgame();
});

function newgame(){
  // 初始化棋盘
  init();
  // 在随机两个格子生成数字
  generateOneNumber();
  generateOneNumber();
}

function init() {
  for(var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var gridCell = $("#grid-cell-" + i + "-" + j);
      gridCell.css("top", getPosTop(i, j));
      gridCell.css("left", getPosLeft(i, j));
    }
  }

  for (var i = 0; i < 4; i++) {
    board[i] = new Array();
    hasConflicted[i] = new Array();
    for(var j = 0; j < 4; j++) {
      board[i][j] = 0;
      hasConflicted[i][j] = false;
    }
  }

  updateBoardView();
  score = 0;
}

function updateBoardView() {
  $(".number-cell").remove();
  for(var i = 0; i < 4; i++) {
    for(var j = 0; j < 4; j++) {
      $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
      var theNumberCell = $("#number-cell-" + i + "-" + j);

      if (board[i][j] == 0) {   // 不显示
        theNumberCell.css("width", "20px");
        theNumberCell.css("height", "30px");
        theNumberCell.css("top", getPosTop(i, j) + 50);
        theNumberCell.css("left", getPosLeft(i, j) + 50);
      }
      else {
        theNumberCell.css("width", "100px");
        theNumberCell.css("height", "100px");
        theNumberCell.css("top", getPosTop(i, j));
        theNumberCell.css("left", getPosLeft(i, j));
        theNumberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
        theNumberCell.css("color", getNumberColor(board[i][j]));
        theNumberCell.text(board[i][j]);
      }

      // 碰撞记录清除
      hasConflicted[i][j] = false;
    }
  }
}

function generateOneNumber() {
  if (noSpace(board)) {
    return false;
  }

  // 随机一个位置 (寻找 times 次，若仍未找到则按顺序指定)
  var randx = parseInt(Math.random(0, 4) * 4);
  var randy = parseInt(Math.random(0, 4) * 4);
  var  times = 0;
  while (times < 50) {
    if (board[randx][randy] == 0) {
      break;
    }
    var randx = parseInt(Math.random(0, 4) * 4);
    var randy = parseInt(Math.random(0, 4) * 4);
    times++;
  }
  if (times == 50) {
    for (var i = 0; i < 4; i++) {
      for (var j = 1; j < 4; j++) {
        if (board[i][j] == 0) {
          randx = i;
          randy = y;
        }
      }
    }
  }

  // 随机一个数字
  var randNumber = Math.random() < 0.5 ? 2 : 4;

  // 在随机位置显示随机数字
  board[randx][randy] = randNumber;
  showNumberWithAnimation(randx, randy, randNumber);

  return true;
}


$(document).keydown(function(event) {
  switch (event.keyCode) {
    case 37:  // left
      if (moveLeft()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isGameOver()", 300);
      }
      break;
    case 38:  // up
      if (moveUp()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isGameOver()", 300);
      }
      break;
    case 39:  // right
      if (moveRight()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isGameOver()", 300);
      }
      break;
    case 40:  // down
      if (moveDown()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isGameOver()", 300);
      }
      break;
    default :  // default
      break;
  }
});

function isGameOver() {
  if (noSpace(board) && noMove(board)) {
    gameOver();
  }
}

function gameOver() {
  alert("Game Over!");
}

function moveLeft() {
  if (!canMoveLeft(board)) {
    return false;
  }
  // moveLeft
  for (var i = 0; i < 4; i++) {
    for (var j = 1; j < 4; j++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < j; k++) {
          // 左边有空格子 且中间无障碍
          if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
            // move
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          // 和左边的格子中的数相同 且中间无障碍 且该位置没有发生过碰撞
          else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
            // move
            showMoveAnimation(i, j, i, k);
            // add
            board[i][k] += board[i][j];
            score += board[i][j];
            board[i][j] = 0;
            updateScore(score);
            // 记录碰撞
            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  }
  // 等待动画执行完毕再刷新面板
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveUp() {
  if (!canMoveUp(board)) {
    return false;
  }
  // moveUp
  for (var i = 1; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < i; k++) {
          // 上边有空格子 且中间无障碍
          if (board[k][j] == 0 && noBlockVertical(k, i, j, board)) {
            // move
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          // 和上边的格子中的数相同 且中间无障碍 且该位置没有发生过碰撞
          else if (board[k][j] == board[i][j] && noBlockVertical(k, i, j, board) && !hasConflicted[k][j]) {
            // move
            showMoveAnimation(i, j, k, j);
            // add
            board[k][j] += board[i][j];
            score += board[i][j];
            board[i][j] = 0;
            updateScore(score);
            // 记录碰撞
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  // 等待动画执行完毕再刷新面板
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveRight() {
  if (!canMoveRight(board)) {
    return false;
  }
  // moveRight
  for (var i = 0; i < 4; i++) {
    for (var j = 2; j >= 0; j--) {
      if (board[i][j] != 0) {
        for (var k = 3; k > j; k--) {
          // 右边有空格子 且中间无障碍
          if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
            // move
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          // 和右边的格子中的数相同 且中间无障碍 且该位置没有发生过碰撞
          else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
            // move
            showMoveAnimation(i, j, i, k);
            // add
            board[i][k] += board[i][j];
            score += board[i][j];
            board[i][j] = 0;
            updateScore(score);
            // 记录碰撞
            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  }
  // 等待动画执行完毕再刷新面板
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveDown() {
  if (!canMoveDown(board)) {
    return false;
  }
  // moveDown
  for (var i = 2; i >= 0; i--) {
    for (var j = 0; j < 4; j++) {
      if (board[i][j] != 0) {
        for (var k = 3; k > i; k--) {
          // 上边有空格子 且中间无障碍
          if (board[k][j] == 0 && noBlockVertical(i, k, j, board)) {
            // move
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          // 和上边的格子中的数相同 且中间无障碍 且该位置没有发生过碰撞
          else if (board[k][j] == board[i][j] && noBlockVertical(i, k, j, board) && !hasConflicted[k][j]) {
            // move
            showMoveAnimation(i, j, k, j);
            // add
            board[k][j] += board[i][j];
            score += board[i][j];
            board[i][j] = 0;
            updateScore(score);
            // 记录碰撞
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  // 等待动画执行完毕再刷新面板
  setTimeout("updateBoardView()", 200);
  return true;
}

