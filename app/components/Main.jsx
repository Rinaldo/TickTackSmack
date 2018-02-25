/* eslint class-methods-use-this: 0 */

import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Header from './Header.jsx'
import ModeChoice from './ModeChoice.jsx'

const Main = () => {

  return (
    <Router>
      <div>
        <Header />
        <div className="content">
          <Route exact path="/" component={ModeChoice} />
          <Route exact path="/easy" component={ModeChoice} />
          <Route exact path="/hard" component={ModeChoice} />
          {/* <Route exact path="/smackdown" component={ModeChoice} /> */}
        </div>
      </div>
    </Router>
  )
}

export default Main
