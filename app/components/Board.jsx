import React from 'react'
import { connect } from 'react-redux'

import XIcon from './icons/XIcon.jsx'
import OIcon from './icons/OIcon.jsx'

import game from '../gameEngine'
import { updateBoard } from '../reducers/game'

const Board = props => {

  const selectCell = event => {
    if (!props.complete && props.friend === props.player && event.target.getAttribute('index') !== null) {
      game.enter(+event.target.getAttribute('index'))
    }
  }

  return (
    <div className="board-wrapper">
      <div className="board">
        {props.board.map((cell, index) => (
          <div key={index} className="board-cell" index={index} onClick={selectCell}>
            {cell === 'x' && <XIcon />}
            {cell === 'o' && <OIcon />}
          </div>
        ))}
      </div>
    </div>
  )
}

const mapState = state => ({
  board: state.getIn(['gameState', 'board']),
  complete: state.getIn(['gameState', 'complete']),
  friend: state.getIn(['gameState', 'friend']),
  player: state.getIn(['gameState', 'player']),
})

const mapDispatch = dispatch => ({
  updateBoard: index => dispatch(updateBoard(index))
})

export default connect(mapState, mapDispatch)(Board)
