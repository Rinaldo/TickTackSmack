import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'

class Header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      justTriggered: false,
    }
    this.mouseClick = this.mouseClick.bind(this)
    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
  }

  mouseClick() {
    //console.log('clicking')
    if (!this.state.justTriggered) this.setState({ open: !this.state.open })
  }
  mouseEnter() {
    //console.log('entering')
    this.setState({
      open: true,
      justTriggered: true,
    })
    setTimeout(() => this.setState({ justTriggered: false}), 100)
  }
  mouseLeave() {
    //console.log('leaving')
    this.setState({
      open: false,
      justTriggered: true,
    })
    setTimeout(() => this.setState({ justTriggered: false}), 100)
  }

  render() {
    return (
      <div className="header" onClick={this.props.click}>
        <h2><Link to="/hard">TicTacToe</Link></h2>
        <div className="dropdown" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.mouseClick}>
          <img className="menu-icon" src="./media/menu-icon.svg" />
          <ul className={`modes-menu modes-menu-${this.state.open ? 'open' : 'closed'}`}>
            <li ><NavLink to="/easy">Easy</NavLink></li>
            <li ><NavLink to="/hard">Hard</NavLink></li>
            <li ><NavLink to="/smackdown">Smackdown</NavLink></li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Header
