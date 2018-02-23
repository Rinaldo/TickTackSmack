import { combineReducers } from 'redux-immutable'

import gameState from './game'

const rootReducer = combineReducers({
  gameState
})

export default rootReducer
