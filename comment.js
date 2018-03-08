const Comment = (() => {
  let liked_comments = []
  return class Comment {
    constructor({id, text, rating, meme_id, created_at}) {
      this.id = id;
      this.text = text;
      this.rating = rating;
      this.meme_id = meme_id
      this.created_at = new Date(created_at);
      this.baseUrl = `http://localhost:3000/api/v1/memes/${this.meme_id}/comments/${this.id}`
    }

    incrementCommentLikes(event) {
      const ratingNode = event.target.previousSibling
      const memeId = this.meme_id
      const commentId = event.target.dataset.id

      if (!liked_comments.includes(this.id)) {
        liked_comments.push(this.id)
        this.rating += 1;

      } else {
        const index = liked_comments.indexOf(this.id);
        if (index > -1) liked_comments.splice(index, 1);
        this.rating -= 1;
        event.target.classList.remove('red');
        event.target.setAttribute('data-liked', 'false')
      }

        let options = {
          method: 'PATCH',
          body: JSON.stringify( {comment: this} ),
          headers: {
            "Content-Type": 'application/json',
            Accept: 'application/json'
          }
        }

        fetch(this.baseUrl, options)
          .then(res => res.json())
          .then(json => {
            ratingNode.innerHTML = '<i class="check icon"></i>' + this.rating + ' like'
            if (this.rating > 1) {
              ratingNode.innerHTML += 's'
            }
        })
    }
    render() {
      let commentString = `<div class="ui raised segment"><div class="comment" id="comment-${this.id}">`
      commentString += '<div class="content">'
      commentString += '<div class="metadata">'
      commentString += `<div class='rating'><i class="check icon"></i> ${this.rating} like`
      if (this.rating == 1) {
         commentString += '</div>'
        } else {
          commentString += `s</div>`
        }
      if (liked_comments.includes(this.id)) {
        commentString += `<i class="left comment like icon red" id="like-${this.id}" data-liked="true" data-meme="${this.meme_id}"></i>`
      } else {
        commentString += `<i class="left comment like icon" id="like-${this.id}" data-liked="false" data-meme="${this.meme_id}"></i>`
      }
      commentString += `<div class='date'>${this.formatDate(this.created_at)}</div>`
      commentString += '</div>' //close metadata
      commentString += `<div class='text'>${this.text}</div>`
      commentString += `</div></div></div>` //close content and comment
      return commentString
    }

    formatDate(date) {
      const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
      const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"];

      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hour >= 12 ? 'pm' : 'am';
      const adjustedHour = hour > 12 ? hour - 12 : hour;


      return monthNames[monthIndex] + ' ' + day + ', ' + year + ' ' + adjustedHour + ":" + minutes + " " + ampm;
    }
  }
})()
