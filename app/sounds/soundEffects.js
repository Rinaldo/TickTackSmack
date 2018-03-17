export const soundEffects = document.createElement('audio')

export const setSoundEffectsSource = () => {
  if (!soundEffects.src) {
    soundEffects.src = './media/impact-sounds.mp3'
    soundEffects.preload = 'auto'
  }
}

const playSoundEffects = () => {
  setSoundEffectsSource()
  setTimeout(() => {
    soundEffects.play()
  }, 400)
}

export default playSoundEffects
