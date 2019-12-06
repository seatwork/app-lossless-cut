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
  setSource(source) {
    this.source = source
    this.src = source
    this.isTranscoded = false
    this.metadata = undefined
    this.startTime = 0
  },

  getDuration() {
    return this.metadata ? this.metadata.General.Duration : undefined
  },

  getCurrentTime() {
    return this.currentTime + this.startTime
  },

  async onloadedmetadata() {
    if (!this.metadata) {
      this.metadata = await ffmpeg.getMediaInfo(this.source)
      if (!this.isTranscoded) {
        this.metadata.General.Duration = this.duration
      }
      this.onmetadataloaded()
    }
  },

  transcode() {
    if (!this.isTranscoded) {
      this.isTranscoded = true
      this.src = host + '?source=' + this.source
      this.createServer()
    }
  },

  seek(timestamp) {
    if (timestamp === undefined) return
    if (timestamp < 0) timestamp = 0
    if (timestamp > this.metadata.General.Duration) timestamp = this.metadata.General.Duration

    if (this.isTranscoded) {
      this.src = host + '?source=' + this.source + '&startTime=' + timestamp
      this.startTime = timestamp
    } else {
      this.currentTime = timestamp
    }
  },

  createServer() {
    if (this.server && this.server.listening) return

    this.server = http.createServer((request, response) => {
      const params = util.parseQuery(request.url)
      const ffProc = ffmpeg.fastCodec(params.source, params.startTime)
      ffProc.stdout.pipe(response)

      request.on('close', () => {
        ffProc.stdout.destroy()
        ffProc.stderr.destroy()
        ffProc.kill()
      })
    }).listen(4725)
  }

}
