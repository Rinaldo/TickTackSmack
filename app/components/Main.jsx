import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import Header from './Header.jsx'
import ModeChoice from './ModeChoice.jsx'

import { setIsMobile, setAudioAllowed } from '../reducers/mobile'

import { soundEffects, setSoundEffectsSource } from '../sounds/soundEffects.js'
import { song, setSongSource } from '../sounds/song.js'

class Main extends Component {

  constructor(props) {
    super(props)
    this.allowAudio = this.allowAudio.bind(this)
  }

  componentDidMount() {
    const isMobile = typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1
    this.props.setIsMobile(isMobile)
    if (!isMobile) this.props.setAudioAllowed(true)
  }

  allowAudio() {
    if (!this.props.isMobile || this.props.audioAllowed) return
    this.props.setAudioAllowed(true)
    song.play()
    setSongSource()
    soundEffects.play()
    setSoundEffectsSource()
  }

  render() {
    return (
      <Router>
        <div className={`main main-${this.props.mode}`}>
          <Header click={this.allowAudio} />
          <div className="content">
            <Route exact path="/" render={() => <Redirect to="/hard" />} />
            <Route exact path="/easy" component={ModeChoice} />
            <Route exact path="/hard" component={ModeChoice} />
            <Route exact path="/smackdown" component={ModeChoice} />
          </div>
        </div>
      </Router>
    )
  }
}

const mapState = state => ({
  mode: state.getIn(['gameState', 'mode']),
  isMobile: state.getIn(['mobileState', 'isMobile']),
  audioAllowed: state.getIn(['mobileState', 'audioAllowed']),
})
const mapDispatch = dispatch => ({
  setIsMobile: bool => dispatch(setIsMobile(bool)),
  setAudioAllowed: bool => dispatch(setAudioAllowed(bool)),
})

export default connect(mapState, mapDispatch)(Main)
