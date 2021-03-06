import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import Navbar from './Navbar.jsx'
import EasyContainer from './EasyContainer.jsx'
import HardContainer from './HardContainer.jsx'
import SmackdownContainer from './SmackdownContainer.jsx'
import About from './About.jsx'
import InfoButton from './icons/InfoButton.jsx'
import PageNotFound from './PageNotFound.jsx'

import { setAudioAllowed } from '../reducers/mobile'

import { soundEffects, setSoundEffectsSource } from '../sounds/soundEffects.js'
import { song, setSongSource } from '../sounds/song.js'

class Main extends Component {

  constructor(props) {
    super(props)
    this.allowAudio = this.allowAudio.bind(this)
  }

  componentDidMount() {
    const isMobile = typeof window.orientation !== 'undefined' ||
      navigator.userAgent.includes('IEMobile')
    if (!isMobile) this.props.setAudioAllowed()
  }

  // workaround for restriction on autoplaying audio on mobile
  allowAudio() {
    if (this.props.audioAllowed) return
    this.props.setAudioAllowed()
    song.play() // play an empty audio element on click, gaining control of it so we can play it again later
    setSongSource() // setting the audio source so we can later play the sound we want
    soundEffects.play()
    setSoundEffectsSource()
  }

  render() {
    return (
      <Router>
        <div className={`main main-${this.props.mode}`}>
          <Navbar click={this.allowAudio} />
          <div className="content">
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/hard" />} />
              <Route exact path="/easy" component={EasyContainer} />
              <Route exact path="/hard" component={HardContainer} />
              <Route exact path="/smackdown" component={SmackdownContainer} />
              <Route exact path="/about" component={About} />
              <Route component={PageNotFound} />
            </Switch>
            <InfoButton />
          </div>
        </div>
      </Router>
    )
  }
}

const mapState = state => ({
  mode: state.getIn(['gameState', 'mode']),
  audioAllowed: state.getIn(['mobileState', 'audioAllowed']),
})
const mapDispatch = dispatch => ({
  setAudioAllowed: () => dispatch(setAudioAllowed()),
})

export default connect(mapState, mapDispatch)(Main)
