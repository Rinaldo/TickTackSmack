import React from 'react'
import { connect } from 'react-redux'

const GameStatus = props => {

  return (
    <h2 className="game-status">
      {(!props.complete && props.mode !== 'smackdown') && 'Play TicTacToe!'}
      {(!props.complete && props.mode === 'smackdown' && props.audioAllowed) && (<span><span id="tick">Tick</span><span id="tack">Tack</span><span id="smack">Smack</span></span>)}
      {(!props.complete && props.mode === 'smackdown' && !props.audioAllowed) && (<span onClick={props.startSmackdown}>Tap to begin</span>)}
      {(props.complete && props.winner) && `${props.winner.toUpperCase()} Wins!`}
      {(props.complete && !props.winner) && 'Draw'}
    </h2>
  )
}

const mapState = state => ({
  complete: state.getIn(['gameState', 'complete']),
  winner: state.getIn(['gameState', 'winner']),
  mode: state.getIn(['gameState', 'mode']),
  audioAllowed: state.getIn(['mobileState', 'audioAllowed']),
})

export default connect(mapState)(GameStatus)
