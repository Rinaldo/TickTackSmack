/* eslint-disable no-nested-ternary */

import React from 'react'
import { connect } from 'react-redux'

const GameHeader = props => {

  return (
    <h2 className="game-header">
      {(props.complete && !props.winner) ?
        'Draw'

      : (props.winner) ?
        `${props.winner.toUpperCase()} Wins!`

      : (props.mode !== 'smackdown') ?
        'Play TicTacToe!'

      : (props.audioAllowed) ?
        (<span><span id="tick">Tick</span><span id="tack">Tack</span><span id="smack">Smack</span></span>)

      : (!props.audioAllowed) ?
        (<span onClick={props.startSmackdown}>Tap to begin</span>)

      : null}
    </h2>
  )
}

const mapState = state => ({
  complete: state.getIn(['gameState', 'complete']),
  winner: state.getIn(['gameState', 'winner']),
  mode: state.getIn(['gameState', 'mode']),
  audioAllowed: state.getIn(['mobileState', 'audioAllowed']),
})

export default connect(mapState)(GameHeader)
