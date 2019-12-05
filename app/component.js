/**
 * --------------------------------------------------------
 * Components
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

const message = document.querySelector('.message')
const loading = document.querySelector('.loading')
const pointer = loading.querySelector('.pointer')

module.exports = {
  alert(text) {
    const content = message.querySelector('div')
    content.innerHTML = text
    content.classList.add('visible')

    // Auto hide
    if (message.timer) clearTimeout(message.timer)
    message.timer = setTimeout(function() {
      content.classList.remove('visible')
    }, 3000)
  },

  loading(progress) {
    if (progress) {
      loading.style.display = 'block'
      pointer.innerHTML = Number.isInteger(progress) ? progress : ''
    } else {
      loading.style.display = 'none'
      pointer.innerHTML = ''
    }
  }
}
