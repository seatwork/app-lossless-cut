/**
 * --------------------------------------------------------
 * Video Transcode Extension
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

const http = require('http')
const ffmpeg = require('./ffmpeg')
const host = 'http://127.0.0.1:4725'

module.exports = {

  async setSource(source) {
    this.metadata = await ffmpeg.getMediaInfo(source)
    this.source = source
    this.src = source
    this.isLoaded = false
    this.isTranscoded = false
    this.startTime = 0
  },

  getDuration() {
    return this.metadata.General.Duration
  },

  getCurrentTime() {
    return this.currentTime + this.startTime
  },

  transcode() {
    if (!this.isTranscoded) {
      this.isTranscoded = true
      this.seek(0)
      this.createServer()
    }
  },

  seek(timestamp) {
    if (timestamp === undefined) return
    if (timestamp < 0) timestamp = 0
    if (timestamp > this.metadata.General.Duration) timestamp = this.metadata.General.Duration

    if (this.isTranscoded) {
      this.src = host + '?source=' + this.source + '&fileSize=' + this.metadata.General.FileSize + '&startTime=' + timestamp
      this.startTime = timestamp
    } else {
      this.currentTime = timestamp
    }
  },

  createServer() {
    if (this.server && this.server.listening) return

    this.server = http.createServer((request, response) => {
      const params = util.parseQuery(request.url)
      const ffProc = ffmpeg.fastCodec(params.source, params.fileSize, params.startTime)
      ffProc.stdout.pipe(response)

      request.on('close', () => {
        ffProc.stdout.destroy()
        ffProc.stderr.destroy()
        ffProc.kill()
      })
    }).listen(4725)

    this.server.on('error', err => {
      alert(err.message)
    })
  }

}
