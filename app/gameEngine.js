import store from './store'
import { updateBoard, swapFriendFoe, completedGame, declareWinner, setMode, setPlayer, resetGame } from './reducers/game'

const friendPts = 12
const foePts = 8
const blankPts = 1
const mixedPts = 0

const getRandomElement = array => {
  return array[Math.floor((Math.random() * array.length))]
}

const calculateRowScores = () => {
  // using toJS to avoid rewriting this function
  const gameState = store.getState().get('gameState')
  const board = gameState.get('board').toJS()
  let rowScores = [];
  let pointsBoard = board.map((cell) => {
    if (cell === gameState.get('friend')) return friendPts
    if (cell === gameState.get('foe')) return foePts
    else return blankPts
  });
  // specific cells that make up each row
  rowScores[0] = pointsBoard[0] * pointsBoard[1] * pointsBoard[2];
  rowScores[1] = pointsBoard[3] * pointsBoard[4] * pointsBoard[5];
  rowScores[2] = pointsBoard[6] * pointsBoard[7] * pointsBoard[8];
  rowScores[3] = pointsBoard[0] * pointsBoard[3] * pointsBoard[6];
  rowScores[4] = pointsBoard[1] * pointsBoard[4] * pointsBoard[7];
  rowScores[5] = pointsBoard[2] * pointsBoard[5] * pointsBoard[8];
  rowScores[6] = pointsBoard[0] * pointsBoard[4] * pointsBoard[8];
  rowScores[7] = pointsBoard[2] * pointsBoard[4] * pointsBoard[6];

  // set mixed (friend, foe, and blank) rows to the mixedPts constant
  const fixedScores = rowScores.map(rowPts => (rowPts === friendPts * foePts ? mixedPts : rowPts))

  return fixedScores;
}

const calculateCellScores = rowScores => {
  // using toJS to avoid rewriting this function
  const board = store.getState().getIn(['gameState', 'board']).toJS()
  const numTurns = board.filter(Boolean).length
  // hardcoded edgecases
  //edgeCase0: foe in middle, friend in corner
  const edgeCase0 = [mixedPts, blankPts, blankPts, foePts, foePts, foePts, friendPts, friendPts]
  // edgeCase1: foe-friend-foe on diagonal
  const edgeCase1 = [foePts, foePts, foePts, foePts, friendPts, friendPts, friendPts, foePts * friendPts * foePts]

  // provides correct hint to maximize chance of creating fork
  if (numTurns === 2 && rowScores.slice().sort((a, b) => a - b).toString() === edgeCase0.toString()) {
    console.log('edge case 0 found!')
    if (rowScores[6] === 0) rowScores[6] += friendPts + foePts
    else rowScores[7] += friendPts + foePts
  }
  // fixes score if computer is on receiving end of fork attempt
  if (numTurns === 3 && rowScores.slice().sort((a, b) => a - b).toString() === edgeCase1.toString()) {
    console.log('edge case 1 found!')
    rowScores[1] += friendPts
    rowScores[4] += friendPts
  }

  // list of rows that each cell is a part of
  const cellRows = [[0, 3, 6], [0, 4], [0, 5, 7], [1, 3],
  [1, 4, 6, 7], [1, 5], [2, 3, 7], [2, 4], [2, 5, 6]];

  const cellScores = board.map(function (cell, index) {
    return cell ? -1 : cellRows[index].reduce((total, item) => total + rowScores[item], 0)
  })
  return cellScores
}

const updateCompletionStatus = () => {
  //console.log('updating status')
  const rowScores = calculateRowScores()
  if (rowScores.indexOf(Math.pow(friendPts, 3)) !== -1) {
    store.dispatch(completedGame())
    store.dispatch(declareWinner(store.getState().getIn(['gameState', 'friend'])))
  } else if (rowScores.indexOf(Math.pow(foePts, 3)) !== -1) {
    store.dispatch(completedGame())
    store.dispatch(declareWinner(store.getState().getIn(['gameState', 'foe'])))
  }
  const cellScores = calculateCellScores(rowScores)

  if (cellScores.every(score => score === -1)) {
    store.dispatch(completedGame())
  }
}

const enter = position => {

  const cell = store.getState().getIn(['gameState', 'board']).get(position)
  if (!store.getState().getIn(['gameState', 'complete']) && !cell) {
    store.dispatch(updateBoard(position))
    updateCompletionStatus()
    if (!store.getState().getIn(['gameState', 'complete'])) {
      store.dispatch(swapFriendFoe())
    }
  }
}

const choose = () => {
  const cellScores = calculateCellScores(calculateRowScores())
  const maxValue = Math.max(...cellScores)
  const candidates = []

  cellScores.forEach(function (cell, index) {
    if (cell === maxValue) {
      candidates.push(index)
    }
  })
  //console.log('choices:', candidates)
  return candidates;
}

const goEasy = (gameState, numTurns) => {
  const board = gameState.get('board')
  if (numTurns === 0) {
    return getRandomElement([1, 3, 5, 7]);
  } else if (numTurns === 1) {
    let candidates = [1, 3, 5, 7].filter(elt => !board.get(elt));
    return getRandomElement(candidates);
  } else if (numTurns === 2) {
    if (board.get(1) === gameState.get('friend') && !board.get(7)) {
      return 7;
    } else if (board.get(7) === gameState.get('friend') && !board.get(1)) {
      return 1;
    } else if (board.get(3) === gameState.get('friend') && !board.get(5)) {
      return 5;
    } else if (board.get(5) === gameState.get('friend') && !board.get(3)) {
      return 3;
    }
  }
  return getRandomElement(choose());
}

const go = () => {
  const gameState = store.getState().get('gameState')
  const numTurns = gameState.get('board').filter(Boolean).size
  let choice;
  if (gameState.get('mode') === 'easy') {
    choice = goEasy(gameState, numTurns);
  } else if (numTurns === 0) {
    if (gameState.get('mode') === 'smackdown') {
      choice = getRandomElement([0, 2, 6, 8]);
    } else {
      choice = getRandomElement([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    }
  } else {
    choice = getRandomElement(choose());
  }
  enter(choice);
}

const compFirst = () => {
  store.dispatch(setPlayer('o'))
  go()
}

const changeMode = mode => {
  store.dispatch(setMode(mode))
  store.dispatch(resetGame())
  if (mode === 'smackdown') compFirst()
}

const reset = () => {
  store.dispatch(resetGame())
}

const game = {
  enter,
  go,
  changeMode,
  compFirst,
  reset,
}

export default game
