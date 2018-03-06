class App {
  constructor() {
    this.memeContainer = document.getElementById('meme-container')
    this.memeUrl = 'http://localhost:3000/api/v1/memes'
    this.fetchMemes()
    this.memes = []
  }

  fetchMemes() {
    fetch(this.memeUrl)
      .then(res => res.json())
      .then(json => this.createMemes(json))
  }

  createMemes(json) {
    json.forEach(memeData => {
      let meme = new Meme(memeData);
      this.memes.push(meme);
    })
    this.displayMemes()
    this.addButtonListeners()
  }

  displayMemes() {
    this.memeContainer.innerHTML = this.memes.map((meme) => meme.render()).join('')
  }

  addButtonListeners() {
    let seeButtons = document.querySelectorAll('.button')
    seeButtons.forEach(button => {
      button.addEventListener('click', event => {
        let commentContainer = event.target.nextElementSibling
        if(commentContainer.style.display === 'block') {
          commentContainer.style.display = 'none'
        } else {
          commentContainer.style.display = 'block'
        }
      })
    })
  }
}
