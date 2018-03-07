import { combineReducers } from 'redux-immutable'

import gameState from './game'
import mobileState from './mobile'

const rootReducer = combineReducers({
  gameState,
  mobileState,
})

export default rootReducer
