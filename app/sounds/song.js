const Song = () => {

  const xSong = document.createElement('audio')
  xSong.src = './X-Gon-Give-It.mp3'
  xSong.preload = 'auto'

  xSong.play()

  return null
}

export default Song
