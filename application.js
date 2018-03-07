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
    let seeButtons = document.querySelectorAll('.see-more')
    seeButtons.forEach(button => {
      button.addEventListener('click', event => {
        const seeCommentsNode = event.target.childNodes[1]
        if (seeCommentsNode.classList.contains('add')) {
          seeCommentsNode.classList.replace('add', 'minus')
          event.target.childNodes[2].nodeValue = "Close Comments"
        } else {
          seeCommentsNode.classList.replace('minus', 'add')
          event.target.childNodes[2].nodeValue = "See Comments"
        }
        let commentContainer = document.getElementById(`${event.target.dataset.id}`)
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

  addCommentLikeListeners() {
    const commentLikeButtons = document.querySelectorAll(".comment.like")
    for(let i=0; i < commentLikeButtons.length; i++) {
      commentLikeButtons[i].addEventListener('click', (event) => this.incrementCommentLikes(event))
    }
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
    console.log(fresh)
    fresh.addEventListener('click', () => {
      // this.removeActiveClassFromAllButtons();
      // fresh.classList.add('active');
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
    const memeLikeButtons = document.querySelectorAll(".meme.like")
    for(let i=0; i < memeLikeButtons.length; i++) {
      memeLikeButtons[i].addEventListener('click', (event) => this.incrementMemeLikes(event))
    }
    this.seeMoreListeners()
    this.addCommentListeners()
    this.addCommentLikeListeners()
  }

  incrementMemeLikes(event) {
    // /api/v1/memes/:id
    const patchUrl = this.memeUrl + '/' + event.target.dataset.id
    // find matching meme object
    let foundMeme = this.memes.find((meme) => meme.id == event.target.dataset.id)
    foundMeme.rating += 1;
    event.target.classList.add('red');
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
        // update vote count in place
        const votesNode = event.target.parentNode.nextSibling.childNodes[1]
        const text = votesNode.innerText.split(' ')
        const finalText = [text[0], parseInt(text[1]) + 1, text[2]].join(' ')
        votesNode.innerHTML = '<i class="check icon"></i>' + finalText
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
      .then(json => this.addNewComment(json, memeId))
  }

    addNewComment(json, memeId) {
      //find parent meme object using memeId
      const parent = this.memes.find((meme) => meme.id == memeId)
      // creating new comment with each field because mass assignment with json object adds meme object
      const newComment = new Comment({id: json.id, text: json.text, rating: json.rating, meme_id: json.meme.id, created_at: json.created_at})
      //push new comment into parent comments array
      parent.comments.push(newComment)
      //render comments and replace parents' comment container
      const parentCommentContainer = document.getElementById(`${memeId}`)
      parentCommentContainer.innerHTML = parent.renderComments();
      this.addCommentListeners()
      this.addCommentLikeListeners()
    }

  incrementCommentLikes(event) {
    // /api/v1/memes/:meme_id/comments/:id
    const ratingNode = event.target.previousSibling
    const memeId = event.target.dataset.meme
    const commentId = event.target.dataset.id
    const patchUrl = this.memeUrl + '/' + memeId + '/comments/' + commentId
    //find matching meme object
    let foundMeme = this.memes.find((meme) => meme.id == memeId)
    //now find comment object
    let foundComment = foundMeme.comments.find((comment) => comment.id == commentId)
    foundComment.rating += 1;
    let options = {
      method: 'PATCH',
      body: JSON.stringify( {comment: foundComment} ),
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json'
      }
    }

    fetch(patchUrl, options)
      .then(res => res.json())
      .then(json => {
        ratingNode.innerHTML = '<i class="check icon"></i>' + foundComment.rating + ' like'
        if (foundComment.rating > 1) ratingNode.innerHTML += 's'
        foundMeme.sortComments()
        const newCommentsHTML = foundMeme.renderComments()
        document.getElementById(`${memeId}`).innerHTML = newCommentsHTML;
        this.addCommentListeners()
        this.addCommentLikeListeners()
    })
  }

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
  //     console.log(pastedData);
  //     console.log(imageInput.placeholder);
  //     imageInput.value += pastedData;
  //   });
  // }

}
