class Meme {
  constructor({id, title, image_url, text, rating, created_at, comments}) {
    this.id = id;
    this.title = title;
    this.image_url = image_url;
    this.text = text;
    this.rating = rating;
    this.created_at = created_at;
    this.comments = comments;
    this.createComments()
  }

  render() {
    let memeString = `<div class="meme">`
    if (this.title) {
      memeString += `<div>${this.title}</div>`
    }
    if (this.image_url) {
      memeString += `<img src="${this.image_url}">`
    }
    if (this.text) {
      memeString += `<div>${this.text}</div>`
    }
    memeString += `<div>${this.rating}</div>`

    return memeString
  }

  createComments() {
    this.comments.forEach(commentData => {
      let comment = new Comment(commentData)
      console.log(comment.render())
    })
  }
}




// <div class="content active">
//   <p class="transition visible" style="display: block !important;">A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.</p>
// </div>
