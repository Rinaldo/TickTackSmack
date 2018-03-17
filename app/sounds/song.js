export const song = document.createElement('audio')

const playSong = () => {
  if (!song.src) {
    song.src = './media/x-gon-give-it.mp3'
    song.preload = 'auto'
  }
  song.play()
}

export default playSong
