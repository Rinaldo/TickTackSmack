import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'

class Nabvar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      justTriggered: false, // on mobile a tap registers both a click and a mouseEnter event, the timeout prevents taps from toggling open/close twice
    }
    this.mouseClick = this.mouseClick.bind(this)
    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
  }

  mouseClick() {
    if (!this.state.justTriggered) this.setState({ open: !this.state.open })
  }
  mouseEnter() {
    this.setState({
      open: true,
      justTriggered: true,
    })
    setTimeout(() => this.setState({ justTriggered: false}), 100)
  }
  mouseLeave() {
    this.setState({
      open: false,
      justTriggered: true,
    })
    setTimeout(() => this.setState({ justTriggered: false}), 100)
  }

  render() {
    return (
      <div className="navbar" onClick={this.props.click}>
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

export default Nabvar
