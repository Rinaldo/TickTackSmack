import React from 'react'
import { render } from 'react-dom'
// import { Provider } from 'react-redux'

// import store from './store'
import Main from './components/Main.jsx'

render(
  // <Provider store={store}>
    <Main />, /* remove comma here when putting provider back in */
  // </Provider>,
  document.getElementById('main')
)
