/*
two friendly
two enemy
one friendly
one enemy

//original conception of logic
start at first row type present on board
if multiple rows intersect on blank, choose intersection
if one row intersects with one row from category below, choose intersection
if multiple rows intersect with type below, choose row that intersects with most rows of type below
if tie, choose row at random
choose cell at intersection, if multiple intersections choose most intersections then at random

//if opposite corners are chosen for the first player's first two moves, the above algorithm will fail
*/

function getRandomElement(arr) {
  return arr[Math.floor((Math.random() * arr.length))]
}

function TicTacToeGame(mode) {
  this.board = Array(9).fill(' ');
  this.history = [];
  this.friend = 'x';
  this.foe = 'o';
  this.mode = mode;
  this.rowPoints = {friend: 12, foe: 8, blank: 1, mixed: 0}
  console.clear();
  console.log(this.draw());
  if (this.mode === 'smackdown') {
    this.go();
  }
}

TicTacToeGame.prototype.reset = function() {
  this.board = Array(9).fill(' ');
  this.history = [];
  this.friend = 'x';
  this.foe = 'o';
  console.clear();
  console.log(this.draw());
  if (this.mode === 'smackdown') {
    this.go();
  }
}

TicTacToeGame.prototype.calculateRowScores = function() {

  let rowScores = [];
  let pointsBoard = this.board.map((cell) => {
    if (cell === this.friend) {return this.rowPoints.friend}
    if (cell === this.foe) {return this.rowPoints.foe}
    else {return this.rowPoints.blank}
  });
  //specific calculation for each row
  rowScores[0] = pointsBoard[0] * pointsBoard[1] * pointsBoard[2];
  rowScores[1] = pointsBoard[3] * pointsBoard[4] * pointsBoard[5];
  rowScores[2] = pointsBoard[6] * pointsBoard[7] * pointsBoard[8];
  rowScores[3] = pointsBoard[0] * pointsBoard[3] * pointsBoard[6];
  rowScores[4] = pointsBoard[1] * pointsBoard[4] * pointsBoard[7];
  rowScores[5] = pointsBoard[2] * pointsBoard[5] * pointsBoard[8];
  rowScores[6] = pointsBoard[0] * pointsBoard[4] * pointsBoard[8];
  rowScores[7] = pointsBoard[2] * pointsBoard[4] * pointsBoard[6];

  //don't count rows with both friend and foe
  for (let i = 0; i < rowScores.length; i++) {
    if (rowScores[i] === this.rowPoints.friend * this.rowPoints.foe) {
      rowScores[i] = this.rowPoints.mixed;
    }
  }
  return rowScores;
}

TicTacToeGame.prototype.calculateCellScores = function(rowScores) {
  //hardcoded edgecases
  let edgeCase0 = [this.rowPoints.mixed, this.rowPoints.blank, this.rowPoints.blank, this.rowPoints.foe, this.rowPoints.foe, this.rowPoints.foe, this.rowPoints.friend, this.rowPoints.friend]
  let edgeCase1 = [this.rowPoints.foe, this.rowPoints.foe, this.rowPoints.foe, this.rowPoints.foe, this.rowPoints.friend, this.rowPoints.friend, this.rowPoints.friend, this.rowPoints.foe * this.rowPoints.friend * this.rowPoints.foe]

  if (this.history.length === 2 && rowScores.slice().sort((a, b) => a - b).toString() === edgeCase0.toString()) {
    if (rowScores[6] === 0) {
      rowScores[6] += this.rowPoints.friend + this.rowPoints.foe
    } else {
      rowScores[7] += this.rowPoints.friend + this.rowPoints.foe
    }
  }
  if (this.history.length === 3 && rowScores.slice().sort((a, b) => a - b).toString() === edgeCase1.toString()) {
    rowScores[1] += this.rowPoints.friend
    rowScores[4] += this.rowPoints.friend
  }
  //list of rows that each cell is a part of
  let cellRows = [[0, 3, 6], [0, 4], [0, 5, 7], [1, 3],
    [1, 4, 6, 7], [1, 5], [2, 3, 7], [2, 4], [2, 5, 6]];

  return this.board.map(function(cell, index) {
    return cell === ' ' ? cellRows[index].reduce((total, item) => total + rowScores[item], 0) : -1;
  })
}

TicTacToeGame.prototype.calculateGameResult = function() {

  let message;
  let rowScores = this.calculateRowScores();

  if (rowScores.indexOf(Math.pow(this.rowPoints.friend, 3)) !== -1) {
    message = this.friend.toUpperCase() + ' Wins!';
  } else if (rowScores.indexOf(Math.pow(this.rowPoints.foe, 3)) !== -1) {
    message = this.foe.toUpperCase() + ' Wins!';
  }

  let cellScores = this.calculateCellScores(rowScores);

  if (cellScores.every(score => score === -1)) {
    message = 'Draw';
  }

  return message;
}

TicTacToeGame.prototype.choose = function() {

  let cellScores = this.calculateCellScores(this.calculateRowScores());
  let maxValue = Math.max(...cellScores);
  let candidates = [];

  cellScores.forEach(function(cell, index) {
    if (cell === maxValue) {
      candidates.push(index);
    }
  })

  return candidates;
}

TicTacToeGame.prototype.goEasy = function(turn) {
  if (turn === 0) {
    return getRandomElement([1, 3, 5, 7]);
  } else if (turn === 1) {
    let candidates = [1, 3, 5, 7].filter(elt => this.board[elt] === ' ');
    return getRandomElement(candidates);
  } else if (turn === 2) {
    if (this.board[1] === this.friend && this.board[7] === ' ') {
      return 7;
    } else if (this.board[7] === this.friend && this.board[1] === ' ') {
      return 1;
    } else if (this.board[3] === this.friend && this.board[5] === ' ') {
      return 5;
    } else if (this.board[5] === this.friend && this.board[3] === ' ') {
      return 3;
    }
  }
  return getRandomElement(this.choose());
}

TicTacToeGame.prototype.go = function() {
  let choice;
  if (this.mode === 'easy') {
      choice = this.goEasy(this.history.length);
  } else if (this.history.length === 0) {
    if (this.mode === 'smackdown') {
      choice = getRandomElement([0, 2, 6, 8]);
    } else {
      choice = getRandomElement([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    }
  } else {
    choice = getRandomElement(this.choose());
  }
  this.enter(choice, true);
}

TicTacToeGame.prototype.enter = function(position, isComputer) {

  if (!this.history.gameComplete && this.board[position] === ' ') {
    this.board[position] = this.friend;
    this.history.push(this.board.slice());
    console.clear();
    console.log(this.draw());
    let gameResult = this.calculateGameResult();
    if (gameResult) {
      this.history.gameComplete = true;
      console.log(gameResult);
    } else {
      this.swapFriendFoe();
      if (!isComputer) {
        let that = this;
        setTimeout(function() {that.go()}, 700);
      }
    }
    return this.board[position]
  } else {
    console.log('invalid move');
  }
}

TicTacToeGame.prototype.swapFriendFoe = function() {

  [this.friend, this.foe] = [this.foe, this.friend];
}

TicTacToeGame.prototype.hint = function() {

  console.log(this.draw(this.calculateCellScores(this.calculateRowScores())));
  return this.choose();
}

TicTacToeGame.prototype.draw = function(board) {

  board = board || this.board;

  let boardDrawing = board.map(function(cell, i) {
    if (cell.toString().length > 1) {
      return (i === 2 || i === 5 || i === 8) ? cell + ' ' : cell + ' |';
    } else {
    return (i === 2 || i === 5 || i === 8) ? ' ' + cell + ' ' : ' ' + cell + ' |';
    }
  });

  boardDrawing.splice(3, 0, '\n---|', '---', '|---\n');
  boardDrawing.splice(9, 0, '\n---|', '---', '|---\n');

  return '\n' + boardDrawing.join('');
}

TicTacToeGame.prototype.showHistory = function() {

  for (let i = 0; i < this.history.length; i++) {
    console.log(this.draw(this.history[i]))
  }
}

TicTacToeGame.prototype.changeMode = function(mode) {

  this.mode = mode;
  this.reset();
}


$(function() {

  let game = new TicTacToeGame('hard');
  let messageDefault = 'Play TicTacToe!';
  $('#title').text(messageDefault);
  setTableValues();

  function setTableValues() {
    $('.gameCell').each(function(index) {
      $(this).text(game.board[index]);
    })
  }

  $('.gameBoard').on('click', '.gameCell', function() {
    let move = game.enter(+$(this).attr('id').slice(-1), true);
    if (move) {
      $(this).text(move);
      let _game = game;
      setTimeout(function() {
        _game.go()
        setTableValues()
      }, 700);
    }
    let message = game.calculateGameResult();
    if (message) {
      $('#title').text(message);
    }
  })

  $('#computer-go').on('click', function() {
    game.go()
    setTableValues();
    let message = game.calculateGameResult();
    if (message) {
      $('#title').text(message);
    }
  })

  $('#mode').on('click', 'button', function() {
    game.changeMode($(this).text());
    setTableValues();
    $('#title').text(messageDefault);
  })

})
