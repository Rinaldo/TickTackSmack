const SoundEffects = () => {

  const impactSound1 = document.createElement('audio')
  impactSound1.src = './impactSoundEffect.mp3'
  impactSound1.preload = 'auto'
  const impactSound2 = impactSound1.cloneNode()
  const impactSound3 = impactSound1.cloneNode()

  setTimeout(() => {
    impactSound1.play()
    setTimeout(() => {
      impactSound2.play()
      setTimeout(() => {
        impactSound3.play()
      }, 600)
    }, 600)
  }, 0)

  return null
}

export default SoundEffects