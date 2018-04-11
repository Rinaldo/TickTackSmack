import store from './store'
import Immutable, { List } from 'immutable'
import { updateBoard, swapFriendFoe, declareWinner, setMode, setPlayer, resetGame } from './reducers/game'

// points for calculating row scores
const friendPts = 12
const foePts = 8
const blankPts = 1
const mixedPts = 0

/* hardcoded edgecases */
// foe in middle, friend in corner
const edgeCase0 = List([mixedPts, blankPts, blankPts, foePts, foePts, foePts, friendPts, friendPts])
// foe-friend-foe on diagonal
const edgeCase1 = List([foePts, foePts, foePts, foePts, friendPts, friendPts, friendPts, foePts * friendPts * foePts])

// list of rows that each cell is a part of
const cellRows = Immutable.fromJS([[0, 3, 6], [0, 4], [0, 5, 7], [1, 3], [1, 4, 6, 7], [1, 5], [2, 3, 7], [2, 4], [2, 5, 6]])

const getRandomElement = array => {
  return array[Math.floor((Math.random() * array.length))]
}

// maps board of x's and o's to board of friend, foe, and blank points
const getPointsBoard = () => {
  const gameState = store.getState().get('gameState')
  const board = gameState.get('board')
  return board.map(cell => {
    if (cell === gameState.get('friend')) return friendPts
    if (cell === gameState.get('foe')) return foePts
    else return blankPts
  })
}

// set mixed (friend, foe, and blank) rows to the mixedPts constant
const fixMixedRows = rowScores => rowScores.map(rowPts => (rowPts === friendPts * foePts ? mixedPts : rowPts))

// specific cells that make up each row
const pointsBoardToRowScores = pointsBoard => List([
  pointsBoard.get(0) * pointsBoard.get(1) * pointsBoard.get(2),
  pointsBoard.get(3) * pointsBoard.get(4) * pointsBoard.get(5),
  pointsBoard.get(6) * pointsBoard.get(7) * pointsBoard.get(8),
  pointsBoard.get(0) * pointsBoard.get(3) * pointsBoard.get(6),
  pointsBoard.get(1) * pointsBoard.get(4) * pointsBoard.get(7),
  pointsBoard.get(2) * pointsBoard.get(5) * pointsBoard.get(8),
  pointsBoard.get(0) * pointsBoard.get(4) * pointsBoard.get(8),
  pointsBoard.get(2) * pointsBoard.get(4) * pointsBoard.get(6),
  ])

// calculates row scores by multiplying the point values of the cells in each row
const calculateRowScores = () => {
  const pointsBoard = getPointsBoard()
  const rowScores = pointsBoardToRowScores(pointsBoard)
  const fixedScores = fixMixedRows(rowScores)
  return fixedScores
}

const fixEdgeCases = (rowScores, board) => {

  const numTurns = board.filter(Boolean).size
  // provides correct scoring to maximize chance of creating fork for opponent
  if (numTurns === 2 && rowScores.sort().equals(edgeCase0)) {
    rowScores = rowScores.get(6) === 0 ?
      rowScores.set(6, rowScores.get(6) + friendPts + foePts) :
      rowScores.set(7, rowScores.get(7) + friendPts + foePts)
  }
  // fixes scoring if computer is on receiving end of fork attempt
  else if (numTurns === 3 && rowScores.sort().equals(edgeCase1)) {
    rowScores = rowScores.set(1, rowScores.get(1) + friendPts)
    rowScores = rowScores.set(4, rowScores.get(4) + friendPts)
  }
  return rowScores
}

// calculates cell scores by summing the row scores of the rows the cell is in
const calculateCellScores = rowScores => {
  const board = store.getState().getIn(['gameState', 'board'])
  const fixedScores = fixEdgeCases(rowScores, board)

  return board.map((cell, index) => {
    return cell ? -1 : cellRows.get(index).reduce((accum, currVal) => accum + fixedScores.get(currVal), 0)
  })
}

const updateCompletionStatus = () => {

  const gameState = store.getState().get('gameState')
  const friend = gameState.get('friend')
  const foe = gameState.get('foe')

  const rowScores = calculateRowScores()
  const threeFriendsInARow = rowScores.includes(Math.pow(friendPts, 3))
  const threeFoesInARow = rowScores.includes(Math.pow(foePts, 3))

  if (threeFriendsInARow) {
    store.dispatch(declareWinner(friend))
  } else if (threeFoesInARow) {
    store.dispatch(declareWinner(foe))
  }
  const cellScores = calculateCellScores(rowScores)

  if (cellScores.every(score => score === -1)) {
    store.dispatch(declareWinner())
  }
}

const choose = () => {

  const cellScores = calculateCellScores(calculateRowScores())
  const maxValue = Math.max(...cellScores.toJS())
  const candidates = []

  cellScores.forEach((cell, index) => {
    if (cell === maxValue) {
      candidates.push(index)
    }
  })
  return candidates
}

// hard coded bad moves for the first 3 turns
const goEasy = (gameState, numTurns) => {

  const board = gameState.get('board')

  if (numTurns === 0) {
    return getRandomElement([1, 3, 5, 7])
  } else if (numTurns === 1) {
    const candidates = [1, 3, 5, 7].filter(elt => !board.get(elt))
    return getRandomElement(candidates)
  } else if (numTurns === 2) {
    if (board.get(1) === gameState.get('friend') && !board.get(7)) {
      return 7
    } else if (board.get(7) === gameState.get('friend') && !board.get(1)) {
      return 1
    } else if (board.get(3) === gameState.get('friend') && !board.get(5)) {
      return 5
    } else if (board.get(5) === gameState.get('friend') && !board.get(3)) {
      return 3
    }
  } else {
    return getRandomElement(choose())
  }
}

const go = () => {

  const gameState = store.getState().get('gameState')
  const numTurns = gameState.get('board').filter(Boolean).size
  let choice

  if (gameState.get('mode') === 'easy' && numTurns < 3) {
    choice = goEasy(gameState, numTurns)
  } else if (numTurns === 0) {
    choice = gameState.get('mode') === 'smackdown' ?
      getRandomElement([0, 2, 6, 8]) :
      getRandomElement([0, 1, 2, 3, 4, 5, 6, 7, 8])
  } else {
    choice = getRandomElement(choose())
  }
  enter(choice)
}

const enter = position => {

  const state = store.getState()
  const cell = state.getIn(['gameState', 'board']).get(position)
  const playersTurn = state.getIn(['gameState', 'player']) === state.getIn(['gameState', 'friend'])

  if (!store.getState().getIn(['gameState', 'complete']) && !cell) {
    store.dispatch(updateBoard(position))
    updateCompletionStatus()
    if (!store.getState().getIn(['gameState', 'complete'])) {
      store.dispatch(swapFriendFoe())
      if (playersTurn) {
        setTimeout(go, 500)
      }
    }
  }
}

const reset = () => {
  store.dispatch(resetGame())
}

const compFirst = () => {
  store.dispatch(setPlayer('o'))
  go()
}

const changeMode = mode => {
  store.dispatch(setMode(mode))
}

const game = {
  enter,
  go,
  changeMode,
  compFirst,
  reset,
}

export default game
