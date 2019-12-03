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
    this.isLoaded = false
    this.isTranscoded = false
    this.startTime = 0
  },

  getDuration() {
    return this.timespan
  },

  getCurrentTime() {
    return this.currentTime + this.startTime
  },

  async onloadedmetadata() {
    if (!this.isLoaded) {
      this.isLoaded = true
      this.timespan = this.isTranscoded ? await ffmpeg.getDuration(this.source) : this.duration
      this.onceloaded()
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
    if (timestamp > this.timespan) timestamp = this.timespan

    if (this.isTranscoded) {
      this.src = host + '?source=' + this.source + '&startTime=' + timestamp
      this.startTime = timestamp
    } else {
      this.currentTime = timestamp
    }
  },

  createServer() {
    if (this.server && this.server.listening) {
      return
    }
    this.server = http.createServer((request, response) => {
      const params = util.parseQuery(request.url)
      const process = ffmpeg.fastCodec(params.source, params.startTime)
      process.stdout.pipe(response)
    }).listen(4725)
  }

}
