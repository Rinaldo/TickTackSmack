import React, { Component } from 'react'

import Board from './Board.jsx'
import GameHeader from './GameHeader.jsx'
import GameButton from './GameButton.jsx'

import game from '../gameEngine'


class HardContainer extends Component {

  componentDidMount() {
    game.changeMode('hard')
  }

  render() {
    return (
      <div>
        <GameHeader />
        <GameButton />
        <Board />
      </div>
    )
  }
}

export default HardContainer
