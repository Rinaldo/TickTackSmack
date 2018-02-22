import React, { Component } from 'react'

import Board from './Board.jsx'
import Header from './Header.jsx'

class Main extends Component {

  render() {
    return (
      <div>
        <Header />
        <div className="content">
        <Board />
        </div>
      </div>
    )
  }
}

export default Main
