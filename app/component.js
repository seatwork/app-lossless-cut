/**
 * --------------------------------------------------------
 * Components
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

const message = document.querySelector('.message')
const loading = document.querySelector('.loading')

module.exports = {
  alert(text) {
    const content = message.querySelector('div')
    content.innerHTML = text
    content.classList.add('visible')

    // Auto hide
    if (message.timer) clearTimeout(message.timer)
    message.timer = setTimeout(function() {
      content.classList.remove('visible')
    }, 5000)
  },

  loading(bool) {
    loading.style.display = bool ? 'block' : 'none'
  }
}
