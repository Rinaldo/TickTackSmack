import React, { Component } from 'react'
import { connect } from 'react-redux'

import Board from './Board.jsx'
import GameHeader from './GameHeader.jsx'
import GameButton from './GameButton.jsx'
import playSoundEffects, { soundEffects } from '../sounds/soundEffects.js'
import playSong, { song } from '../sounds/song.js'

import game from '../gameEngine'

import { setAudioAllowed } from '../reducers/mobile'

class ModeContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mode: props.match.path.slice(1) || 'hard',
    }
    this.startSmackdown = this.startSmackdown.bind(this)
  }

  componentDidMount() {
    game.changeMode(this.state.mode)
    if (this.state.mode === 'smackdown') {
      const isMobile = typeof window.orientation !== 'undefined' ||
        navigator.userAgent.includes('IEMobile')
      if (this.props.audioAllowed || !isMobile) {
        this.startSmackdown()
      }
    }
  }

  componentWillUnmount() {
    if (this.state.mode === 'smackdown') {
      clearTimeout(this.songDelay)
      song.currentTime = 0
      song.pause()
      soundEffects.currentTime = 0
      soundEffects.pause()
    }
  }

  startSmackdown() {
    if (!this.props.audioAllowed) this.props.setAudioAllowed()
    playSoundEffects()
    if (!song.src) song.play() // necessary because playSong is invoked from setTimeout, not directly from click handler
    this.songDelay = setTimeout(() => {
      playSong()
      game.computerGo()
    }, 2600)
  }

  render() {
    return (
      <div>
        <GameHeader startSmackdown={this.startSmackdown} />
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
  setAudioAllowed: () => dispatch(setAudioAllowed()),
})

export default connect(mapState, mapDispatch)(ModeContainer)
