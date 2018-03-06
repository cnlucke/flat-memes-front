class App {
  constructor() {
    this.memeContainer = document.getElementById('meme-container')
    this.memeUrl = 'http://localhost:3000/api/v1/memes'
    this.fetchMemes()
    this.newMemeButtonEventListener();
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

  newMemeButtonEventListener() {
    let newMeme = document.getElementById('new-meme');
    newMeme.addEventListener('click', () => {
      this.removeActiveClassFromAllButtons();
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
      this.newMemeFormSubmissionListener();
    });
  }

  newMemeFormSubmissionListener() {
    let newMeme = document.getElementById('new-meme-form')
    newMeme.addEventListener('submit', (event) => {
      event.preventDefault();
      this.postNewMemeToApi(newMeme[0].value, newMeme[1].value, newMeme[2].value);
    })
  }

  postNewMemeToApi(title, image_url, text) {
    let options = {
      method: 'POST',
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({"meme": {"title": title, "image_url": image_url, "text": text, "rating": 0}})
    }
    fetch('http://localhost:3000/api/v1/memes', options)
      .then(res => res.json())
      .then(json => console.log(json));
  }

  removeActiveClassFromAllButtons() {
    let home = document.getElementById('home');
    let top = document.getElementById('top');
    let fresh = document.getElementById('fresh');
    let newMeme = document.getElementById('new-meme');
    home.classList.remove('active');
    top.classList.remove('active');
    fresh.classList.remove('active');
    newMeme.classList.remove('active');
  }

}
