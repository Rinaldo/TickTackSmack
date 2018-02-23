import { List, Map } from 'immutable'
import store, { gameState } from './store'
import { updateBoard, swapFriendFoe, completedGame, declareWinner, setMode, resetGame } from './reducers/game'

const friendPts = 12
const foePts = 8
const blankPts = 1
const mixedPts = 0

const enter = position => {
  const board = gameState.board.toJS()
  if (!gameState.get('complete') && !board[position]) {
    store.dispatch(updateBoard(position))
    updateCompletionStatus()
    if (!gameState.get('complete')) {
      store.dispatch(swapFriendFoe())
    }
  }
}

const goEasy = (board, numTurns) => {

  if (numTurns === 0) {
    return getRandomElement([1, 3, 5, 7]);
  } else if (numTurns === 1) {
    let candidates = [1, 3, 5, 7].filter(elt => !board[elt]);
    return getRandomElement(candidates);
  } else if (numTurns === 2) {
    if (this.board[1] === this.friend && !this.board[7]) {
      return 7;
    } else if (this.board[7] === this.friend && !this.board[1]) {
      return 1;
    } else if (this.board[3] === this.friend && !this.board[5]) {
      return 5;
    } else if (this.board[5] === this.friend && !this.board[3]) {
      return 3;
    }
  }
  return getRandomElement(this.choose());
}

const go = () => {

  const board = gameState.board.toJS()
  const numTurns = board.filter(Boolean).length
  let choice;
  if (gameState.get('mode') === 'easy') {
      choice = this.goEasy(board, numTurns);
  } else if (numTurns === 0) {
    if (gameState.get('mode') === 'smackdown') {
      choice = getRandomElement([0, 2, 6, 8]);
    } else {
      choice = getRandomElement([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    }
  } else {
    choice = getRandomElement(choose());
  }
  this.enter(choice);
}

const choose = () => {

  const cellScores = calculateCellScores(calculateRowScores())
  const maxValue = Math.max(...cellScores)
  const candidates = []

  cellScores.forEach(function(cell, index) {
    if (cell === maxValue) {
      candidates.push(index)
    }
  })

  return candidates;
}

const calculateCellScores = rowScores => {

  const board = gameState.board.toJS()
  const numTurns = board.filter(Boolean).length
  //hardcoded edgecases
  const edgeCase0 = [mixedPts, blankPts, blankPts, foePts, foePts, foePts, friendPts, friendPts]
  const edgeCase1 = [foePts, foePts, foePts, foePts, friendPts, friendPts, friendPts, foePts * friendPts * foePts]

  if (numTurns === 2 && rowScores.slice().sort((a, b) => a - b).toString() === edgeCase0.toString()) {
    if (rowScores[6] === 0) rowScores[6] += friendPts + foePts
    else rowScores[7] += friendPts + foePts
  }
  if (numTurns === 3 && rowScores.slice().sort((a, b) => a - b).toString() === edgeCase1.toString()) {
    rowScores[1] += friendPts
    rowScores[4] += friendPts
  }

  //list of rows that each cell is a part of
  const cellRows = [[0, 3, 6], [0, 4], [0, 5, 7], [1, 3],
    [1, 4, 6, 7], [1, 5], [2, 3, 7], [2, 4], [2, 5, 6]];

  return board.map(function(cell, index) {
    return cell ? -1 : cellRows[index].reduce((total, item) => total + rowScores[item], 0)
  })
}

const calculateRowScores = () => {

  const board = gameState.board.toJS()
  let rowScores = [];
  let pointsBoard = board.map((cell) => {
    if (cell === gameState.get('friend')) return friendPts
    if (cell === gameState.get('foe')) return foePts
    else return blankPts
  });
  //specific cells that make up each row
  rowScores[0] = pointsBoard[0] * pointsBoard[1] * pointsBoard[2];
  rowScores[1] = pointsBoard[3] * pointsBoard[4] * pointsBoard[5];
  rowScores[2] = pointsBoard[6] * pointsBoard[7] * pointsBoard[8];
  rowScores[3] = pointsBoard[0] * pointsBoard[3] * pointsBoard[6];
  rowScores[4] = pointsBoard[1] * pointsBoard[4] * pointsBoard[7];
  rowScores[5] = pointsBoard[2] * pointsBoard[5] * pointsBoard[8];
  rowScores[6] = pointsBoard[0] * pointsBoard[4] * pointsBoard[8];
  rowScores[7] = pointsBoard[2] * pointsBoard[4] * pointsBoard[6];

  //set mixed (friend, foe, and blank) rows to the mixedPts constant
  const fixedScores = rowScores.map(rowPts => (rowPts === friendPts * foePts ? mixedPts : rowPts))

  return fixedScores;
}

const updateCompletionStatus = () => {
  const rowScores = this.calculateRowScores()
  if (rowScores.indexOf(Math.pow(friendPts, 3)) !== -1) {
    store.dispatch(completedGame())
    store.dispatch(declareWinner(gameState.get('friend')))
  } else if (rowScores.indexOf(Math.pow(this.rowPoints.foe, 3)) !== -1) {
    store.dispatch(completedGame())
    store.dispatch(declareWinner(gameState.get('foe')))
  }
  const cellScores = this.calculateCellScores(rowScores)

  if (cellScores.every(score => score === -1)) {
    store.dispatch(completedGame())
  }
}

const changeMode = mode => {
  store.dispatch(setMode(mode))
  store.dispatch(resetGame())
}

const getRandomElement = array => {
  return array[Math.floor((Math.random() * array.length))]
}

const game = {
  enter,
  go,
  changeMode,
}

export default game
