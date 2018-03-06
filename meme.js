class Meme {
  constructor({id, title, image_url, text, rating, created_at, comments}) {
    this.id = id;
    this.title = title;
    this.image_url = image_url;
    this.text = text;
    this.rating = rating;
    this.created_at = new Date(created_at);
    this.comments = comments;
  }

  render() {
    let memeString = `<div class="meme ui card">`
    if (this.image_url) {
      memeString += `<div class="image">
                      <img src="${this.image_url}">
                     </div>`
    }
    memeString += `<div class="content">
                   <i class="right floated like icon"></i>
                   <i class="right floated star icon"></i>`

    if (this.title) {
      memeString += `<a class="header">${this.title}</a>`
    }

    memeString += `<div class="meta">
                    <span class="date">${this.whenPosted()}</span>
                   </div>`
    if (this.text) {
      memeString += `<div class="description">${this.text}</div>`
    }
    let comments = this.createComments()
    memeString += `</div>` //closing content div
    memeString += `<div class="extra content">
        <a>
          <i class="check icon"></i>
          ${this.rating} votes
        </a>
      </div>
      <div class="ui bottom attached button" data-id="${this.id}">
        <i class="add icon"></i>
          See Comments
      </div>
      <div class="comment-container" style="display:none">${comments}</div>`
    return memeString
  }

//   createComments() {
//     let commentString = ''
//     this.comments.forEach(commentData => {
//       let comment = new Comment(commentData)
//       commentString += comment.render()
//     })
//     return commentString
//   }
//
// }

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
// var hours = Math.abs(date1 - date2) / 36e5;


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
