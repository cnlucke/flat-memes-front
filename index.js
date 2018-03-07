document.addEventListener('DOMContentLoaded', () => {
  let app = new App()
  app.fetchMemes()
  app.buttonEventListeners();
})
