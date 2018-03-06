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
    this.seeMoreListeners()
    this.addCommentListeners()
  }

  displayMemes() {
    this.memeContainer.innerHTML = this.memes.map((meme) => meme.render()).join('')
  }

  seeMoreListeners() {
    let seeButtons = document.querySelectorAll('.see-more')
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

  addCommentListeners() {
    let buttons = document.querySelectorAll('.new-comment')
    buttons.forEach(button => {
      button.addEventListener('click', event => {
        let commentText = event.target.previousElementSibling.firstChild
        let id = event.target.dataset.id
        this.postComment(commentText.value, id)
        commentText.value = ""
      })
    })
  }

  postComment(text, memeId) {
    let options = {
      method:'POST',
      headers: {
        'Content-Type':'application/json',
        Accept:'application/json'
      },
      body: JSON.stringify({text:text, rating:0, meme_id:memeId})
    }
    fetch(`${this.memeUrl}/${memeId}/comments`, options)
      .then(res => res.json())
      .then(json => console.log(json))
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
