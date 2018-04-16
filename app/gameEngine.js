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


// maps board of x's, o's, and blanks to board of friend, foe, and blank points
const getPointsBoard = () => {
  const gameState = store.getState().get('gameState')
  const board = gameState.get('board')
  return board.map(cell => {
    if (cell === gameState.get('friend')) return friendPts
    if (cell === gameState.get('foe')) return foePts
    return blankPts
  })
}
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
// set mixed (friend, foe, and blank) rows to the mixedPts constant
const fixMixedRows = rowScores =>
  rowScores.map(rowPts => (rowPts === friendPts * foePts * blankPts ? mixedPts : rowPts))
// calculates row scores by multiplying the point values of the cells in each row
const calculateRowScores = () => fixMixedRows(pointsBoardToRowScores(getPointsBoard()))


// adjusts scores in cases where algorithm fails to see fork
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
    rowScores = rowScores.withMutations(scores => {
      scores.set(1, rowScores.get(1) + friendPts).set(4, rowScores.get(4) + friendPts)
    })
  }
  return rowScores
}
// calculates cell scores by summing the row scores of the rows the cell is in
const calculateCellScores = rowScores => {
  const board = store.getState().getIn(['gameState', 'board'])
  const fixedScores = fixEdgeCases(rowScores, board)

  return board.map((cell, index) =>
    (cell ? -1 : cellRows.get(index).reduce((accum, curr) => accum + fixedScores.get(curr), 0)))
}


const choose = () => {
  const cellScores = calculateCellScores(calculateRowScores())
  const maxValue = cellScores.max()
  const indicesOfMaxValues = cellScores.reduce((indices, cell, index) =>
    (cell === maxValue ? [...indices, index] : indices), [])

  return indicesOfMaxValues
}
const endGame = friendOrFoe => {
  store.dispatch(declareWinner(friendOrFoe ? store.getState().getIn(['gameState', friendOrFoe]) : null))
  return store.getState().getIn(['gameState', 'complete'])  // should always be true
}
const updateCompletionStatus = () => {
  const rowScores = calculateRowScores()
  const threeFriendsInARow = rowScores.includes(Math.pow(friendPts, 3))
  const threeFoesInARow = rowScores.includes(Math.pow(foePts, 3))

  if (threeFriendsInARow) return endGame('friend')
  else if (threeFoesInARow) return endGame('foe')

  const draw = calculateCellScores(rowScores).every(score => score === -1)
  if (draw) return endGame()

  return store.getState().getIn(['gameState', 'complete'])  // should always be false at this point
}
const computerGo = () => {
  const gameState = store.getState().get('gameState')
  const board = gameState.get('board')
  const numTurns = board.filter(Boolean).size

  // using a nested ternary to avoid reassigning the 'choices' variable
  const choices =
    // in easy mode go on the sides for the first 3 turns
    (gameState.get('mode') === 'easy' && numTurns < 3) ? [1, 3, 5, 7].filter(elt => !board.get(elt))
    // start in the corners for smackdown
    : (numTurns === 0 && gameState.get('mode') === 'smackdown') ? [0, 2, 6, 8]
    // start randomly for hard
    : (numTurns === 0) ? [0, 1, 2, 3, 4, 5, 6, 7, 8]
    // else let algorithm choose
    : choose()

  enter(getRandomElement(choices))
}
const enter = position => {
  const state = store.getState()
  const cellIsEmpty = !state.getIn(['gameState', 'board']).get(position)
  const playersTurn = state.getIn(['gameState', 'player']) === state.getIn(['gameState', 'friend'])
  const gameNotComplete = !store.getState().getIn(['gameState', 'complete'])

  if (gameNotComplete && cellIsEmpty) {
    store.dispatch(updateBoard(position))
    const gameStillNotComplete = !updateCompletionStatus()
    if (gameStillNotComplete) {
      store.dispatch(swapFriendFoe())
      if (playersTurn) {
        setTimeout(computerGo, 500)
      }
    }
  }
}


const reset = () => {
  store.dispatch(resetGame())
}

const compFirst = () => {
  store.dispatch(setPlayer('o'))
  computerGo()
}

const changeMode = mode => {
  store.dispatch(setMode(mode))
}

const game = {
  enter,
  computerGo,
  changeMode,
  compFirst,
  reset,
}

export default game
