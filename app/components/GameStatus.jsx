import React from 'react'
import { connect } from 'react-redux'

const GameStatus = props => {

  return (
    <h2 className="game-status">
      {(!props.complete && props.mode !== 'smackdown') && 'Play TicTacToe!'}
      {(!props.complete && props.mode === 'smackdown') && 'TickTackSmack'}
      {(props.complete && props.winner) && `${props.winner.toUpperCase()} Wins!`}
      {(props.complete && !props.winner) && 'Draw'}
    </h2>
  )
}

const mapState = state => ({
  complete: state.getIn(['gameState', 'complete']),
  winner: state.getIn(['gameState', 'winner']),
  mode: state.getIn(['gameState', 'mode']),
})

export default connect(mapState)(GameStatus)
