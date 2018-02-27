import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import Header from './Header.jsx'
import ModeChoice from './ModeChoice.jsx'

const Main = props => {

  return (
    <Router>
      <div className={`main main-${props.mode}`}>
        <Header />
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

const mapState = state => ({
  mode: state.getIn(['gameState', 'mode']),
})

export default connect(mapState)(Main)
