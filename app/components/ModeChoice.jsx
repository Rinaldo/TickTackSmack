import React, { Component } from 'react'
import { connect } from 'react-redux'

import Board from './Board.jsx'
import GameStatus from './GameStatus.jsx'
import GameButton from './GameButton.jsx'
import playSoundEffects, { impactSounds } from '../sounds/soundEffects.js'
import playSong, { song } from '../sounds/song.js'

import game from '../gameEngine'

import { setIsMobile, setAudioAllowed } from '../reducers/mobile'

class ModeChoice extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mode: props.match.path.slice(1) || 'hard',
    }
    this.startSmackdown = this.startSmackdown.bind(this)
  }

  componentDidMount() {
    const isMobile = typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1
    game.changeMode(this.state.mode)
    if (this.state.mode === 'smackdown' && (this.props.audioAllowed || !isMobile)) {
      this.startSmackdown()
    }
  }

  componentWillUnmount() {
    if (this.state.mode === 'smackdown') {
      clearTimeout(this.songDelay)
      song.currentTime = 0
      song.pause()
    }
  }

  startSmackdown() {
    game.changePlayer('o')
      playSoundEffects()
      this.songDelay = setTimeout(() => {
        playSong()
        game.go()
      }, 2600)
  }

  render() {
    return (
      <div>
        <GameStatus startSmackdown={this.startSmackdown} />
        <GameButton />
        <Board />
      </div>
    )
  }
}

const mapState = state => ({
  audioAllowed: state.getIn(['mobileState', 'audioAllowed']),
})
const mapDispatch = dispatch => ({
  setAudioAllowed: bool => dispatch(setAudioAllowed(bool)),
})

export default connect(mapState, mapDispatch)(ModeChoice)
