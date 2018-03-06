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
    commentString += `<div>${this.text}</div>`
    commentString += `<div>${this.rating}</div>`
    commentString += `</div>`
    return commentString
  }
}
