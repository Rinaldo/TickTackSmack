import { Map } from 'immutable'

const SET_AUDIO_ALLOWED = 'SET_AUDIO_ALLOWED'

export const setAudioAllowed = () => ({
  type: SET_AUDIO_ALLOWED,
})

const initialState = Map({
  audioAllowed: false,
})

const mobileReducer = (state = initialState, action) => {

  switch (action.type) {

    case SET_AUDIO_ALLOWED:
      return state.set('audioAllowed', true)

    default:
      return state
  }
}

export default mobileReducer
