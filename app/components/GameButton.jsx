import React from 'react'
import { connect } from 'react-redux'

import game from '../gameEngine'

const GameButton = props => {

  const clickHandler = () => {
    if (props.mode === 'smackdown') game.compFirst()
    else props.numTurns ? game.reset() : game.compFirst()
  }
  const text = !props.numTurns && props.mode !== 'smackdown' ? 'let computer go first' : 'reset game'

  return (
    <button
      className="game-button"
      onClick={clickHandler}
      disabled={props.mode === 'smackdown' && !props.numTurns}>
      {text}
    </button>
  )
}

const mapState = state => ({
  numTurns: state.getIn(['gameState', 'board']).filter(Boolean).size,
  mode: state.getIn(['gameState', 'mode'])
})

export default connect(mapState)(GameButton)
