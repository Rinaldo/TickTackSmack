import React, { Component } from 'react'

class Header extends Component {

  render() {
    return (
      <div className="header">
        <h2>TicTacToe</h2>
        <div className='dropdown'>
          <img className="menu-icon" src="menu.svg" />
          <ul className='modes-menu'>
            <li>Easy</li>
            <li>Hard</li>
            <li>Smackdown</li>
            <li>Multiplayer</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Header
