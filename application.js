class App {
  constructor() {
    this.memeContainer = document.getElementById('meme-container')
    this.memeUrl = 'http://localhost:3000/api/v1/memes'
    this.fetchMemes()
  }

  fetchMemes() {
    fetch(this.memeUrl)
      .then(res => res.json())
      .then(json => console.log(json))
  }

}
