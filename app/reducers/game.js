import { List, Map } from 'immutable'

const UPDATE_BOARD = 'UPDATE_BOARD'
const RESET_GAME = 'RESET_GAME'
const SWAP_FRIEND_FOE = 'SWAP_FRIEND_FOE'
const SET_MODE = 'SET_MODE'
const SET_PLAYER = 'SET_PLAYER'
const DECLARE_WINNER = 'DECLARE_WINNER'

export const updateBoard = index => ({
  type: UPDATE_BOARD,
  index,
})

export const resetGame = () => ({
  type: RESET_GAME,
})

export const swapFriendFoe = () => ({
  type: SWAP_FRIEND_FOE,
})

export const setMode = mode => ({
  type: SET_MODE,
  mode,
})

export const setPlayer = player => ({
  type: SET_PLAYER,
  player,
})

export const declareWinner = winner => ({
  type: DECLARE_WINNER,
  winner,
})

const initialState = Map({
  board: List(['', '', '', '', '', '', '', '', '']),
  friend: 'x',
  foe: 'o',
  player: 'x',
  mode: 'hard',
  complete: false,
  winner: null,
})

const gameReducer = (gameState = initialState, action) => {

  switch (action.type) {

    case UPDATE_BOARD:
      return gameState.update('board', boardValue =>
        boardValue.set(action.index, gameState.get('friend')))

    case RESET_GAME:
      return initialState.set('mode', gameState.get('mode'))

    case SWAP_FRIEND_FOE: {
      return gameState.withMutations(state => {
        state.set('friend', gameState.get('foe')).set('foe', gameState.get('friend'))
      })
    }

    case SET_MODE:
      return action.mode === 'smackdown' ?
        initialState.withMutations(state => { state.set('mode', action.mode).set('player', 'o') }) :
        initialState.set('mode', action.mode)

    case SET_PLAYER:
      return initialState.withMutations(state => {
        state.set('player', action.player).set('mode', gameState.get('mode'))
      })

    case DECLARE_WINNER:
      return gameState.withMutations(state => {
        state.set('winner', action.winner || null).set('complete', true)
      })

    default:
      return gameState
  }
}

export default gameReducer
