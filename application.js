class App {
  constructor() {
    this.memeContainer = document.getElementById('meme-container')
    this.memeUrl = 'http://localhost:3000/api/v1/memes'
    this.memes = [];
  }
  // **** EVENT LISTENERS *****
  buttonEventListeners() {
    this.newMemeButtonEventListener();
    this.freshButtonEventListener();
    this.topButtonEventListener();
  }

  seeMoreListeners() {
    // moved to meme.js
  }

  addCommentListeners() {
    // moved to meme.js
  }

  newMemeButtonEventListener() {
    let newMeme = document.getElementById('new-meme');
    newMeme.addEventListener('click', () => {
      this.removeActiveClassFromAllButtons();
      newMeme.classList.add('active');
      this.memeContainer.innerHTML = '';
      this.memeContainer.innerHTML += `<form id="new-meme-form" class="ui form">
      <div class="sixteen wide field form-field">
      <label>Meme Title:</label>
      <input type="text" placeholder="Title...">
      </div>
      <div class="sixteen wide field form-field">
      <label>Image URL:</label>
      <input type="text" placeholder="Image URL...">
      </div>
      <div class="sixteen wide field form-field">
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

  freshButtonEventListener() {
    let fresh = document.getElementById('fresh');
    fresh.classList.add('active');

    fresh.addEventListener('click', () => {
      this.removeActiveClassFromAllButtons();
      fresh.classList.add('active');
      console.log(fresh)
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
      this.memes.forEach(meme => meme.sortComments());
      this.displayMemes();
    })
  }

  // ***** HANDLE MEMES *****
  fetchMemes() {
    fetch(this.memeUrl)
      .then(res => res.json())
      .then(json => this.createMemes(json))
  }

  createMemes(json) {
    this.memes = []
    json.forEach(memeData => {
      let meme = new Meme(memeData);
      meme.comments = [];
      memeData.comments.forEach((comment) => {
        let newComment = new Comment(comment)
        newComment.meme_id = meme.id;
        meme.comments.push(newComment)
      })
      this.memes.push(meme);
    })
    this.memes.sort((a,b) => {
      return new Date(b.created_at) - new Date(a.created_at)
    })
    this.memes.forEach(meme => meme.sortComments())
    this.displayMemes();
  }

  displayMemes() {
    this.memeContainer.innerHTML = this.memes.map(meme => {
      return meme.render()
    }).join('')
    
    this.memes.forEach(meme => {
      meme.seeMoreListener()
      meme.newCommentListener()
      meme.commentListeners()
      meme.addLikeListener()
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

  // ***** HANDLE COMMENTS *****
    // moved to comment.js

  // ***** HANDLE PAGE *****
  renderFreshAfterPostToApi() {
    this.removeActiveClassFromAllButtons();
    document.getElementById('fresh').classList.add('active');
    this.memeContainer.innerHTML = '';
    this.fetchMemes();
  }

  removeActiveClassFromAllButtons() {
    let top = document.getElementById('top');
    let fresh = document.getElementById('fresh');
    let newMeme = document.getElementById('new-meme');
    top.classList.remove('active');
    fresh.classList.remove('active');
    newMeme.classList.remove('active');
  }

  // imagePreview() {
  //   $("#imagePreview").bind("paste", function(e){
  //     var pastedData = e.originalEvent.clipboardData.getData('text');
  //     let container = document.getElementById('image-field');
  //     let imageInput = document.getElementById('imagePreview');
  //     container.innerHTML += `<br><img class="ui medium image" src="${pastedData}">`
  //     imageInput.value += pastedData;
  //   });
  // }

}
