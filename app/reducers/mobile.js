import { Map } from 'immutable'

const SET_AUDIO_ALLOWED = 'SET_AUDIO_ALLOWED'

export const setAudioAllowed = bool => ({
  type: SET_AUDIO_ALLOWED,
  bool,
})

const initialState = Map({
  audioAllowed: false,
})

const mobileReducer = (state = initialState, action) => {

  switch (action.type) {

    case SET_AUDIO_ALLOWED:
      return state.set('audioAllowed', action.bool)

    default:
      return state
  }
}

export default mobileReducer
