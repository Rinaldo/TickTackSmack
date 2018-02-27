import React from 'react'
import { connect } from 'react-redux'

import game from '../gameEngine'

const GameButton = props => {

  const clickHandler = () => (props.numTurns ? game.reset() : game.compFirst())
  const text = props.numTurns ? 'reset game' : 'let computer go first'

  return (
    <button className="game-button" onClick={clickHandler}>{text}</button>
  )
}

const mapState = state => ({
  numTurns: state.getIn(['gameState', 'board']).filter(Boolean).size,
  // mode: state.getIn(['gameState', 'mode'])
})

export default connect(mapState)(GameButton)
