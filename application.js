class App {
  constructor() {
    this.memeContainer = document.getElementById('meme-container')
    this.memeUrl = 'http://localhost:3000/api/v1/memes'
    this.fetchMemes()
    this.buttonEventListeners();
    this.memes = [];
  }

  buttonEventListeners() {
    this.newMemeButtonEventListener();
    this.freshButtonEventListener();
    this.topButtonEventListener();
  }

  fetchMemes() {
    fetch(this.memeUrl)
      .then(res => res.json())
      .then(json => this.createMemes(json))
  }

  createMemes(json) {
    this.memes = []
    json.forEach(memeData => {
      let meme = new Meme(memeData);
      this.memes.push(meme);
    })
    this.memes.sort((a,b) => {
      return new Date(b.created_at) - new Date(a.created_at)
    })
    this.displayMemes()
    this.seeMoreListeners()
    this.addCommentListeners()
  }

  displayMemes() {
    this.memeContainer.innerHTML = this.memes.map((meme) => meme.render()).join('')
    const memeLikeButtons = document.querySelectorAll(".meme.like")
    for(let i=0; i < memeLikeButtons.length; i++) {
      memeLikeButtons[i].addEventListener('click', (event) => this.incrementLikes(event))
    }
  }

  incrementLikes(event) {
    // /api/v1/memes/:id
    const patchUrl = this.memeUrl + '/' + event.target.dataset.id
    // find matching meme object
    let foundMeme = this.memes.find((meme) => meme.id == event.target.dataset.id)
    foundMeme.rating += 1;
    let options = {
      method: 'PATCH',
      body: JSON.stringify( {meme: foundMeme} ),
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json'
      }
    }

    fetch(patchUrl, options)
      .then(res => res.json())
      .then(json => {
        this.fetchMemes()
    })
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
      .then(json => {
        //find parent meme object using memeId
        const parent = this.memes.find((meme) => meme.id == memeId)
        //push new comment into parent comments array
        parent.comments.push(json)
        //render comments and replace parents' comment container
        const parentCommentContainer = document.getElementById(`${memeId}`)
        const newComments = parent.createComments() + parent.renderCommentForm()
        parentCommentContainer.innerHTML = newComments
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
    let memeObj = {"title": title, "image_url": image_url, "text": text, "rating": 0};
    let options = {
      method: 'POST',
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({"meme": memeObj})
    }
    fetch('http://localhost:3000/api/v1/memes', options)
      .then((res) => this.renderFreshAfterPostToApi());
  }

  renderFreshAfterPostToApi() {
    this.removeActiveClassFromAllButtons();
    document.getElementById('fresh').classList.add('active');
    this.memeContainer.innerHTML = '';
    this.fetchMemes();
  }

  freshButtonEventListener() {
    let fresh = document.getElementById('fresh');
    fresh.addEventListener('click', () => {
      this.removeActiveClassFromAllButtons();
      fresh.classList.add('active');
      this.memeContainer.innerHTML = '';
      this.createMemes(this.memes);
    });
  }

  topButtonEventListener() {
    let top = document.getElementById('top');
    top.addEventListener('click', event => {
      this.removeActiveClassFromAllButtons();
      top.classList.add('active');
      this.memes.sort((a,b) => {
        return b.rating - a.rating
      })
      this.displayMemes();
    })
  }

  removeActiveClassFromAllButtons() {
    let top = document.getElementById('top');
    let fresh = document.getElementById('fresh');
    let newMeme = document.getElementById('new-meme');
    top.classList.remove('active');
    fresh.classList.remove('active');
    newMeme.classList.remove('active');
  }

}
