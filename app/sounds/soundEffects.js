export const impactSounds = document.createElement('audio')

const playSoundEffects = () => {
  if (!impactSounds.src) {
    impactSounds.src = './media/impact-sounds.mp3'
    impactSounds.preload = 'auto'
  }
  setTimeout(() => {
    impactSounds.play()
  }, 400)
}

export default playSoundEffects
