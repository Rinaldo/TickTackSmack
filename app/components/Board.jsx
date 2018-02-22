import React from 'react'

import XIcon from './icons/XIcon.jsx'
import OIcon from './icons/OIcon.jsx'

const Board = props => {
  return (
    <div className="board-wrapper">
    <div className="board">
      <div className="board-cell"><XIcon /></div>
      <div className="board-cell"><XIcon /></div>
      <div className="board-cell"></div>
      <div className="board-cell"></div>
      <div className="board-cell"><OIcon /></div>
      <div className="board-cell"></div>
      <div className="board-cell"></div>
      <div className="board-cell"></div>
      <div className="board-cell"></div>
    </div>
    </div>
  )
}

export default Board
