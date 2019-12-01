/**
 * --------------------------------------------------------
 * Ffmpeg Process
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = path.join(__dirname, 'assets/ffmpeg.exe')

module.exports = {

  cutVideo(videoPath, startTime, endTime) {
    let startSecs = util.parseDuration(startTime)
    let endSecs = util.parseDuration(endTime)
    if (startSecs >= endSecs) {
      alert('Start time cannot be later than end time')
      return
    }

    let suffix = ('-' + startTime + '-' + endTime).replace(/:/g, '.')
    let filename = videoPath + suffix + path.extname(videoPath)
    loading(true)

    ffmpeg(videoPath)
    .setFfmpegPath(ffmpegPath)
    .setStartTime(startSecs)
    .setDuration(endSecs - startSecs)
    .audioCodec('copy') // Audio lossless
    .videoCodec('copy') // Video lossless
    .save(filename)
    .on('end', function() {
      loading(false)
    })
    .on('error', function(err) {
      alert(err.message)
    })
  },

  mergeVideos(videoPaths) {
    const listFile = 'merge-list.txt'
    const mergedFile = videoPaths[0] + '-merged' + path.extname(videoPaths[0])
    const concatTxt = videoPaths.map(path => "file '" + path + "'").join('\n')
    fs.writeFileSync(listFile, concatTxt)
    loading(true)

    ffmpeg().input(listFile)
    .setFfmpegPath(ffmpegPath)
    .inputOptions(['-f concat', '-safe 0'])
    .outputOptions('-c copy')
    .save(mergedFile)
    .on('end', function() {
      loading(false)
      fs.unlinkSync(listFile)
    })
    .on('error', function(err) {
      alert(err.message)
      fs.unlinkSync(listFile)
    })
  },

  captureImage(videoPath, timestamp) {
    loading(true)

    ffmpeg(videoPath)
    .setFfmpegPath(ffmpegPath)
    .screenshots({
      timestamps: [timestamp],
      filename: 'thumbnail-' + timestamp + '.png',
      folder: path.dirname(videoPath),
    })
    .on('end', function() {
      loading(false)
    })
    .on('error', function(err) {
      alert(err.message)
    })
  },

  extractAudio(videoPath) {
    let filename = videoPath.replace(path.extname(videoPath), '.mp3')
    loading(true)

    ffmpeg(videoPath)
    .setFfmpegPath(ffmpegPath)
    .noVideo()
    .audioCodec('libmp3lame')
    .save(filename)
    .on('end', function() {
      loading(false)
    })
    .on('error', function(err) {
      alert(err.message)
    })
  }
}
