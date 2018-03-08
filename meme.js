const Meme = (() => {
  let liked_memes = []
  return class Meme {
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

    memeDiv() {
      return document.getElementById('meme-'+this.id)
    }

    commentContainer() {
      return this.memeDiv().nextElementSibling
    }

    // ***** EVENT LISTENERS *****
    seeMoreListener() {
      const seeButton = this.memeDiv().querySelector('.see-more')
      const containerStyle = this.commentContainer().style

      seeButton.addEventListener('click', event => {
        const seeCommentsNode = event.target.childNodes[1]
        if(containerStyle.display === 'block') {
          containerStyle.display = 'none'
          seeCommentsNode.classList.replace('minus', 'add')
          event.target.childNodes[2].nodeValue = "See Comments"
        } else {
          containerStyle.display = 'block'
          seeCommentsNode.classList.replace('add', 'minus')
          event.target.childNodes[2].nodeValue = "Close Comments"
        }
      })
    }

    newCommentButtonListener() {
      const commentContainer = this.memeDiv().nextElementSibling
      const button = commentContainer.querySelector('.new-comment')
      button.addEventListener('click', event => {
        let commentText = event.target.previousElementSibling.firstChild
        this.postComment(commentText.value)
        // pluralizing comments on meme page if there are more than one comment
        let commentCount = this.memeDiv().querySelector('.comment-count');
        if (this.comments.length === 1) {
          commentCount.innerText += 's';
        }
        let commentSplit = commentCount.innerText.split(' ');
        commentSplit[0]++;
        commentCount.innerText = commentSplit.join(' ');
        commentText.value = ""
      })
    }

    addCommentLikeListeners() {
      this.comments.forEach(comment => {
        let likeIcon = document.querySelector(`#like-${comment.id}`)
        likeIcon.addEventListener('click', event => {
          comment.incrementCommentLikes(event)
          this.refreshComments()
        })
      })
    }

    addMemeLikeListener() {
      const likeIcon = document.querySelector(`#meme-like-${this.id}`)
      // add an event listener to each meme like icon
      likeIcon.addEventListener("click", event => this.incrementMemeLikes(event))
    }
    // ***** END OF EVENT LISTENERS *****

    incrementMemeLikes(event) {
      if (!liked_memes.includes(this.id)) {
        liked_memes.push(this.id)
        this.rating += 1;
        event.target.classList.add('red');
        event.target.setAttribute('data-liked', 'true')
      } else {
        // remove from liked_memes and decrement likes
        const index = liked_memes.indexOf(this.id);
        if (index > -1) liked_memes.splice(index, 1);
        this.rating -= 1;
        event.target.classList.remove('red');
        event.target.setAttribute('data-liked', 'false')
      }
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
        const finalText = [text[0], json.rating, text[2]].join(' ')
        votesNode.innerHTML = '<i class="check icon"></i>' + finalText
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


    addNewComment(json) {
      // creating new comment with each field because mass assignment with json object adds meme object
      const newComment = new Comment({id: json.id, text: json.text, rating: json.rating, meme_id: json.meme.id, created_at: json.created_at})
      //push new comment into parent comments array
      this.comments.push(newComment)
      //render comments and replace parents' comment container
      this.refreshComments()
      this.seeMoreListener()
    }

    refreshComments() {
      const parentCommentContainer = document.getElementById(`${this.id}`)
      this.sortComments()
      parentCommentContainer.innerHTML = this.renderComments();
      this.newCommentButtonListener()
      this.addCommentLikeListeners()
    }

    render() {
      let memeString = `<div class="meme ui fluid card" id="meme-${this.id}">`
      if (this.image_url) {
        memeString += `<div class="image">
        <img src="${this.image_url}">
        </div>`
      }
      if (liked_memes.includes(this.id)) {
        memeString += `<div class="content">
        <i class="right floated meme like icon red" id="meme-like-${this.id}" data-liked="true"></i>`
      } else {
        memeString += `<div class="content">
        <i class="right floated meme like icon" id="meme-like-${this.id}" data-liked="false"></i>`
      }

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
      ${this.rating} Like`
      if (this.rating === 0 || this.rating > 1) {
        memeString += `s`
      }
      memeString += `</a>
      <p class="comment-count"style="float:right;">${this.comments.length} Comment`
      if (this.comments.length === 0 || this.comments.length > 1) {
        memeString += `s`
      }
      memeString += `</p>
      </div>
      <div class="ui bottom attached button see-more" data-id="${this.id}" id="button">
      <i class="add icon"></i>`
      if (this.comments.length > 0) {
        memeString += 'See Comments'
      } else {
        memeString += 'Add Comment'
      }
      memeString += `</div>
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
})()
