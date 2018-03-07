import { Map } from 'immutable'

const SET_IS_MOBILE = 'SET_IS_MOBILE'
const SET_AUDIO_ALLOWED = 'SET_AUDIO_ALLOWED'

export const setIsMobile = bool => ({
  type: SET_IS_MOBILE,
  bool,
})

export const setAudioAllowed = bool => ({
  type: SET_AUDIO_ALLOWED,
  bool,
})

const initialState = Map({
  isMobile: true,
  audioAllowed: false,
})

const mobileReducer = (state = initialState, action) => {

  switch (action.type) {

    case SET_IS_MOBILE:
      return state.set('isMobile', action.bool)

    case SET_AUDIO_ALLOWED:
      return state.set('audioAllowed', action.bool)

    default:
      return state
  }
}

export default mobileReducer
