import { List, Map } from 'immutable'

const UPDATE_BOARD = 'UPDATE_BOARD'
const RESET_BOARD = 'RESET_BOARD'
const SWAP_FRIEND_FOE = 'SWAP_FRIEND_FOE'
const CHANGE_MODE = 'CHANGE_MODE'
const DECLARE_WINNER = 'DECLARE_WINNER'

const updateBoard = index => ({
  type: UPDATE_BOARD,
  index,
})

const resetBoard = () => ({
  type: RESET_BOARD,
})

const swapFriendFoe = () => ({
  type: SWAP_FRIEND_FOE,
})

const changeMode = mode => ({
  type: CHANGE_MODE,
  mode,
})

const initialState = Map({
  board: List(['', '', '', '', '', '', '', '', '']),
  friend: 'x',
  foe: 'o',
  mode: 'hard',
  winner: null,
  rowPoints: Map({ friend: 12, foe: 8, blank: 1, mixed: 0 }),
})

const gameReducer = (game = initialState, action) => {

  switch (action.type) {

    case UPDATE_BOARD:
      return game.update('board', boardValue => boardValue.set(action.index, game.get('friend')))

    case RESET_BOARD:
      return game.update('board', initialState.get('board'))

    case SWAP_FRIEND_FOE: {
      const currFriend = game.get('friend')
      const currFoe = game.get('foe')
      let newState = game.set('friend', currFoe)
      newState = game.set('foe', currFriend)
      return newState
    }

    case CHANGE_MODE:
      return game.set('mode', action.mode)

    default:
      return game
  }
}
