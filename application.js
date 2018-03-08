class App {
  constructor() {
    this.memeContainer = document.getElementById('meme-container')
    this.memeUrl = 'http://localhost:3000/api/v1/memes'
    this.memes = [];
    this.pageStart = 0
    this.pageEnd = 15;
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
      <div class="field form-field">
      <label>Meme Title:</label>
      <input type="text" placeholder="Title...">
      </div>
      <div class="field image-field form-field">
      <label>Image URL:</label>
      <input id="imageInput" type="text" placeholder="Image URL...">
      </div>
      <div class="field form-field">
      <label>Text:</label>
      <textarea></textarea>
      </div>
      <button class="ui button" type="submit">Preview</button>
      </form>`;
      this.memePreviewListener();
    });
  }

  memePreviewListener() {
    let newMeme = document.getElementById('new-meme-form');
    newMeme.addEventListener('submit', (event) => {
      event.preventDefault();
      if (newMeme[0].value.length > 0 || newMeme[1].value.length > 0 || newMeme[2].value.length > 0) {
        this.memeContainer.innerHTML = '';
        this.memeContainer.innerHTML += this.renderMemePreview(newMeme[0].value, newMeme[1].value, newMeme[2].value);
        this.postMemePreviewListener();
        this.editMemePreviewListener();
      } else {
        alert("At least one field must be entered");
      }
    });
  }

  postMemePreviewListener() {
    let formSubmission = this.checkIfNewMemeFormSubmissionsAreEmpty();
    document.getElementById('meme-submission').addEventListener('click', (event) => {
      this.postNewMemeToApi(formSubmission[0], formSubmission[1], formSubmission[2]);
    })
  }

  editMemePreviewListener() {
    let formSubmission = this.checkIfNewMemeFormSubmissionsAreEmpty();
    document.getElementById('edit-meme').addEventListener('click', (event) => {
      this.memeContainer.innerHTML = '';
      this.memeContainer.innerHTML += `<form id="new-meme-form" class="ui form">
      <div class="field form-field">
      <label>Meme Title:</label>
      <input type="text" value='${formSubmission[0]}'>
      </div>
      <div class="field image-field form-field">
      <label>Image URL:</label>
      <input id="imageInput" type="text" value='${formSubmission[1]}'>
      </div>
      <div class="field form-field">
      <label>Text:</label>
      <textarea>${formSubmission[2]}</textarea>
      </div>
      <button class="ui button" type="submit">Preview</button>
      </form>`;
      this.memePreviewListener();
    })
  }

  checkIfNewMemeFormSubmissionsAreEmpty() {
    let title = '';
    let image_url = '';
    let text = '';
    if (document.getElementById('preview-title')) {
      title = document.getElementById('preview-title').innerText;
    }
    if (document.getElementById('preview-image-source')) {
      image_url = document.getElementById('preview-image-source').src;
    }
    if (document.getElementById('preview-text')) {
      text = document.getElementById('preview-text').innerText;
    }
    return [title, image_url, text];
  }

  morePostsButtonEventListener() {
    document.getElementById('more-memes-button').addEventListener('click', (event) => {
      this.displayMemes();
    })
  }

// Torre: deleted newMemeFormSubmissionListener on purpose

  freshButtonEventListener() {
    let fresh = document.getElementById('fresh');
    fresh.classList.add('active');
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
      this.pageStart = 0;
      this.pageEnd = 15;
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
    this.pageStart = 0;
    this.pageEnd = 15;
    this.displayMemes();
  }

  displayMemes() {
    if (this.pageStart === 0) {
      this.memeContainer.innerHTML = '';
    }
    let pageCount = this.memes.slice(this.pageStart, this.pageEnd);
    this.memeContainer.innerHTML += pageCount.map(meme => {
      return meme.render()
    }).join('')
    pageCount.forEach(meme => {
      meme.seeMoreListener()
      meme.newCommentButtonListener()
      meme.addCommentLikeListeners()
      meme.addMemeLikeListener()
    })
    this.pageStart += 15;
    this.pageEnd += 15;
    if (this.pageStart > this.memes.length) {
      document.getElementById('more-memes-button-container').innerHTML = "<br><br><button class='huge ui teal button'>No More Memes!</button>"
    } else {
      document.getElementById('more-memes-button-container').innerHTML = "<br><br><button id='more-memes-button'class='huge ui teal button'>More Memes Please!</button>"
      this.morePostsButtonEventListener();
    }
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
    fetch(`${this.memeUrl}`, options)
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

  renderMemePreview(title, image_url, text) {
    let memePreviewString = `<div class="meme ui fluid card">`
    if (image_url) {
      memePreviewString += `<div class="image">
                      <img id="preview-image-source" src="${image_url}">
                     </div>`
    }
    memePreviewString += `<div class="content">`

    if (title) {
      memePreviewString += `<a id="preview-title" class="header">${title}</a>`
    }
    if (text) {
      memePreviewString += `<div id="preview-text" class="description">${text}</div>`
    }
    memePreviewString += `</div></div><div class="ui buttons">
      <button class="ui button big positive" id="meme-submission">Post</button>
      <div class="or"></div>
      <button class="ui button big" id="edit-meme">Edit</button>
      </div>`
    return memePreviewString
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
