import React, { Component } from 'react'
import { connect } from 'react-redux'

import Board from './Board.jsx'
import GameStatus from './GameStatus.jsx'
import GameButton from './GameButton.jsx'
import soundEffects from '../sounds/soundEffects.js'

import game from '../gameEngine'

class ModeChoice extends Component {

  constructor(props) {
    super(props)
    this.state = { mode: props.match.path.slice(1) || 'hard' }
  }

  componentDidMount() {
    game.changeMode(this.state.mode)
    if (this.state.mode === 'smackdown') {
      soundEffects()
      game.changePlayer('o')
      setTimeout(game.go.bind(game), 2400)
    }
  }

  render() {
    return (
      <div>
        <GameStatus />
        <GameButton />
        <Board />
      </div>
    )
  }
}

export default ModeChoice
