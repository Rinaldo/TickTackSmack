import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import loggingMiddleware from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

const middlewares = process.env.NODE_ENV !== 'production' ?
  [thunkMiddleware, loggingMiddleware] :
  [thunkMiddleware]

export default createStore(rootReducer, applyMiddleware(...middlewares))
