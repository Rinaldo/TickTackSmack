const Audio = () => {

  const impactSound1 = document.createElement('audio')
  impactSound1.src = './impactSoundEffect.mp3'
  const impactSound2 = impactSound1.cloneNode()
  const impactSound3 = impactSound1.cloneNode()

  // const impactSounds = [impactSound1, impactSound2, impactSound3]

  // //impactSounds.forEach((sound, index) => setTimeout(() => sound.play(), 800 * index))
  // let index = 0;
  // const soundInterval = setInterval(() => {
  //   impactSounds[index++].play()
  //   if (index >= impactSounds.length) clearInterval(soundInterval)
  // }, 800)
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

export default Audio
