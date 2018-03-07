class Comment {
  constructor({id, text, rating, meme_id, created_at}) {
    this.id = id;
    this.text = text;
    this.rating = rating;
    this.meme_id = meme_id
    this.created_at = new Date(created_at);
  }

  render() {
    let commentString = `<div class="comment">`
    commentString += '<div class="content">'
    commentString += '<div class="metadata">'
    commentString += `<div class='rating'><i class="check icon"></i> ${this.rating} like`
    if (this.rating == 1) {
       commentString += '</div>'
      } else {
        commentString += `s</div>`
      }
    commentString += `<i class="left comment like icon" data-id="${this.id}" data-meme="${this.meme_id}"></i>`
    commentString += `<div class='date'>${this.formatDate(this.created_at)}</div>`
    commentString += '</div>' //close metadata
    commentString += `<div class='text'>${this.text}</div>`
    commentString += `</div></div>` //close content and comment
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
