class Comment {
  constructor({id, text, rating, meme_id, created_at}) {
    this.id = id;
    this.text = text;
    this.rating = rating;
    this.meme_id = meme_id;
    this.created_at = created_at;
  }

  render() {
    let commentString = `<div class="comment">`
    commentString += '<div class="content">'
    commentString += '<div class="metadata">'
    commentString += `<div class='rating'>${this.rating}</div>`
    commentString += `<div class='date'>${this.created_at}</div>`
    commentString += '</div>' //close metadata
    commentString += `<div class='text'>${this.text}</div>`
    commentString += `</div></div>` //close content and comment
    return commentString
  }
}
