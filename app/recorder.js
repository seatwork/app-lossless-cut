/**
 * --------------------------------------------------------
 * Recorder Component
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */
module.exports = class {

  constructor() {
    this.container = $(`
      <div class="recorder"><div>
        <div class="duration">00:00:00.00</div>
        <button class="start">Start</button>
        <button class="stop">Stop</button>
      </div></div>
    `)

    this.duration = this.container.$('.duration')
    this.startBtn = this.container.$('button.start')
    this.stopBtn = this.container.$('button.stop')
    this.started = false
    document.body.appendChild(this.container)

    this.container.onclick = e => this.onmaskclick(e)
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
      this.container.onclick = e => this.onmaskclick(e)
    } else {
      this.started = true
      this.startBtn.style.display = 'none'
      this.stopBtn.style.display = 'block'
      this.container.onclick = null
    }
  }

  onmaskclick(e) {
    if (e.currentTarget === e.target) {
      this.container.classList.remove('visible')
    }
  }

  show() {
    this.container.classList.add('visible')
  }

}
