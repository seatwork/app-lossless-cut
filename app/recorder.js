/**
 * --------------------------------------------------------
 * Recorder Component
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

module.exports = class {

  constructor() {
    this.el = $('.recorder')
    this.duration = $('.recorder>div>div')
    this.startBtn = $('.recorder button.start')
    this.stopBtn = $('.recorder button.stop')
    this.started = false

    this.el.onclick = e => this.onmaskclick(e)
    this.startBtn.onclick = () => {
      this.switch()
      this.onstart()
    }
    this.stopBtn.onclick = () => {
      this.switch()
      this.onstop()
    }
  }

  setDuration(time) {
    this.duration.innerHTML = time
  }

  switch() {
    if (this.started) {
      this.started = false
      this.startBtn.style.display = 'block'
      this.stopBtn.style.display = 'none'
      this.el.onclick = e => this.onmaskclick(e)
    } else {
      this.started = true
      this.startBtn.style.display = 'none'
      this.stopBtn.style.display = 'block'
      this.el.onclick = null
    }
  }

  onmaskclick(e) {
    if (e.currentTarget === e.target) this.hide()
  }

  show() {
    this.el.classList.add('visible')
  }

  hide() {
    this.el.classList.remove('visible')
  }

}
