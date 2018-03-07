class Meme {
  constructor({id, title, image_url, text, rating, created_at, comments}) {
    this.id = id;
    this.title = title;
    this.image_url = image_url;
    this.text = text;
    this.rating = rating;
    this.created_at = new Date(created_at);
    this.comments = comments;
    this.baseUrl = 'http://localhost:3000/api/v1/memes/'+this.id
  }

  addLikeListener() {
    const memeDiv = document.getElementById('meme-'+this.id)
    const likeButton = memeDiv.querySelector('i')
    likeButton.addEventListener('click', event => this.incrementMemeLikes(event))
  }

  incrementMemeLikes(event) {
    this.rating += 1;
    event.target.classList.add('red');
    let options = {
      method: 'PATCH',
      body: JSON.stringify( {meme: this} ),
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json'
      }
    }
    fetch(this.baseUrl, options)
      .then(res => res.json())
      .then(json => {
        // update vote count in place
        const votesNode = event.target.parentNode.nextSibling.childNodes[1]
        const text = votesNode.innerText.split(' ')
        const finalText = [text[0], parseInt(text[1]) + 1, text[2]].join(' ')
        votesNode.innerHTML = '<i class="check icon"></i>' + finalText
    })
  }

  seeMoreListener() {
    const memeDiv = document.getElementById('meme-'+this.id)
    const seeButton = memeDiv.querySelector('.see-more')
    const commentContainer = memeDiv.nextElementSibling
    seeButton.addEventListener('click', event => {
      const seeCommentsNode = event.target.childNodes[1]
      if(commentContainer.style.display === 'block') {
        commentContainer.style.display = 'none'
        seeCommentsNode.classList.replace('minus', 'add')
        event.target.childNodes[2].nodeValue = "See Comments"
      } else {
        commentContainer.style.display = 'block'
        seeCommentsNode.classList.replace('add', 'minus')
        event.target.childNodes[2].nodeValue = "Close Comments"
      }
    })

  }

  newCommentListener() {
    const memeDiv = document.getElementById('meme-'+this.id)
    const commentContainer = memeDiv.nextElementSibling
    const button = commentContainer.querySelector('.new-comment')
    button.addEventListener('click', event => {
      let commentText = event.target.previousElementSibling.firstChild
      this.postComment(commentText.value)
      commentText.value = ""
    })
  }

  postComment(text) {
    let options = {
      method:'POST',
      headers: {
        'Content-Type':'application/json',
        Accept:'application/json'
      },
      body: JSON.stringify({text:text, rating:0, meme_id:this.id})
    }
    fetch(`${this.baseUrl}/comments`, options)
      .then(res => res.json())
      .then(json => {
        this.addNewComment(json)
      })
  }

  commentListeners() {
    this.comments.forEach(comment => comment.addLikeListener())
  }

  addNewComment(json) {
    // creating new comment with each field because mass assignment with json object adds meme object
    const newComment = new Comment({id: json.id, text: json.text, rating: json.rating, meme_id: json.meme.id, created_at: json.created_at})
    //push new comment into parent comments array
    this.comments.push(newComment)
    //render comments and replace parents' comment container
    const parentCommentContainer = document.getElementById(`${this.id}`)
    parentCommentContainer.innerHTML = this.renderComments();
    newComment.addLikeListener()
    // this.addCommentLikeListeners()
  }

  render() {
    let memeString = `<div class="meme ui fluid card" id="meme-${this.id}">`
    if (this.image_url) {
      memeString += `<div class="image">
                      <img src="${this.image_url}">
                     </div>`
    }
    memeString += `<div class="content">
                   <i class="right floated meme like icon" data-id="${this.id}"></i>`

    if (this.title) {
      memeString += `<a class="header">${this.title}</a>`
    }

    memeString += `<div class="meta">
                    <span class="date">${this.whenPosted()}</span>
                   </div>`
    if (this.text) {
      memeString += `<div class="description">${this.text}</div>`
    }
    memeString += `</div>` //closing content div
    memeString += `<div class="extra content">
        <a>
          <i class="check icon"></i>
          ${this.rating} votes
        </a>
      </div>
      <div class="ui bottom attached button see-more" data-id="${this.id}" id="button">
        <i class="add icon"></i>
          See Comments
      </div>
      </div>
      <div class="comment-container ui comments" style="display:none"
        id="${this.id}">${this.renderComments()}</div>`
    return memeString
  }

  renderComments() {
    return this.comments.map((comment) => comment.render()).join(' ') + this.renderCommentForm()
  }

  renderCommentForm() {
    let formString = `<form class='ui reply form'>`
    formString += `<div class='field'><textarea></textarea></div>`
    formString += `<div data-id="${this.id}" class="ui primary submit button new-comment">Add Comment</div>`
    formString += `</form>`
    return formString
  }

  sortComments() {
    this.comments.sort((a,b) => b.rating - a.rating)
  }

  whenPosted() {
    const now = new Date()
    let diff = now - this.created_at
    let minutesSincePosted = Math.floor(diff/1000/60)
    if (minutesSincePosted < 60) {
      return minutesSincePosted + 'm'
    } else if (minutesSincePosted < (60 * 24)) {
      return Math.floor(minutesSincePosted / 60) + 'h'
    }
    else {
      let dateArray = this.created_at.toString().split(' ')
      return dateArray[1] + ' ' + parseInt(dateArray[2])
    }
  }
}
