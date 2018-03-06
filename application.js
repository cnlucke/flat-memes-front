class App {
  constructor() {
    this.memeContainer = document.getElementById('meme-container')
    this.memeUrl = 'http://localhost:3000/api/v1/memes'
    this.fetchMemes()
    this.newMemeEventListener();
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
  newMemeEventListener() {
    let newMeme = document.getElementById('new-meme');
    newMeme.addEventListener('click', () => {
      newMeme.classList.add('active');
      this.memeContainer.innerHTML = '';
      this.memeContainer.innerHTML += `<form id="new-meme-form" class="ui form">
                                        <div class="eight wide field">
                                          <label>Meme Title:</label>
                                          <input type="text" placeholder="Title...">
                                        </div>
                                        <div class="eight wide field">
                                          <label>Image URL:</label>
                                          <input type="text" placeholder="Image URL...">
                                        </div>
                                        <div class="eight wide field">
                                          <label>Text:</label>
                                          <textarea></textarea>
                                        </div>
                                        <button class="ui button" type="submit">Submit</button>
                                      </form>`;
    });
  }

}
