class Meme {
  constructor({id, title, image_url, text, rating, created_at, comments}) {
    this.id = id;
    this.title = title;
    this.image_url = image_url;
    this.text = text;
    this.rating = rating;
    this.created_at = created_at;
    this.comments = comments;
  }

  render() {
    let memeString = `<div class="meme ui card">`
    if (this.image_url) {
      memeString += `<div class="image">
                      <img src="${this.image_url}">
                     </div>`
    }
    memeString += `<div class="content">`

    if (this.title) {
      memeString += `<a class="header">${this.title}</a>`
    }

    memeString += `<div class="meta">
                    <span class="date">n minutes ago...</span>
                   </div>`
    if (this.text) {
      memeString += `<div class="description">${this.text}</div>`
    }
    let comments = this.createComments()
    memeString += `</div>` //closing content div
    memeString += `<div class="extra content">
        <a>
          <i class="like icon"></i>
          Upvotes: ${this.rating}
        </a>
      </div>
      <a href="#" class="see-comments" data-id="${this.id}">See Comments</a>
      <div class="comment-container" style="display:none">${comments}</div>`
    return memeString
  }

  createComments() {
    let commentString = ''
    this.comments.forEach(commentData => {
      let comment = new Comment(commentData)
      commentString += comment.render()
    })
    return commentString
  }

}

// <div class="ui card">
//   <div class="image">
//     <img src="/images/avatar2/large/kristy.png">
//   </div>
//   <div class="content">
//     <a class="header">Kristy</a>
//     <div class="meta">
//       <span class="date">Joined in 2013</span>
//     </div>
//     <div class="description">
//       Kristy is an art director living in New York.
//     </div>
//   </div>
//   <div class="extra content">
//     <a>
//       <i class="user icon"></i>
//       22 Friends
//     </a>
//   </div>
// </div>
