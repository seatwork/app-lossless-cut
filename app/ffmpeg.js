/**
 * --------------------------------------------------------
 * Ffmpeg Process
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

const { execFile } = require('child_process')
const stringToStream = require('string-to-stream')
const ffmpegPath = path.join(__dirname, 'assets/ffmpeg.exe')

function ffmpeg(args) {
  loading(true)
  return execFile(ffmpegPath, args, (error, stdout, stderr) => {
    loading(false)
    if (error) alert(error)
  })
}

module.exports = {

  cutVideo(videoPath, startTime, endTime) {
    const startSecs = util.parseDuration(startTime)
    const endSecs = util.parseDuration(endTime)
    if (startSecs >= endSecs) {
      alert('Start time cannot be later than end time')
      return
    }

    const suffix = ('-' + startTime + '-' + endTime).replace(/:/g, '.')
    const outputFile = videoPath + suffix + path.extname(videoPath)
    ffmpeg([
      '-i', videoPath, '-ss', startSecs, '-t', endSecs - startSecs,
      '-vcodec', 'copy', '-acodec', 'copy', '-y', outputFile
    ])
  },

  mergeVideos(videoPaths) {
    const outputFile = videoPaths[0] + '-merged' + path.extname(videoPaths[0])
    const process = ffmpeg([
      '-f', 'concat', '-safe', '0', '-protocol_whitelist', 'file,pipe',
      '-i', '-', '-c', 'copy', '-y', outputFile,
    ])

    const videoList = videoPaths.map(path => "file '" + path + "'").join('\n')
    stringToStream(videoList).pipe(process.stdin)
  },

  captureImage(videoPath, timestamp) {
    const outputFile = videoPath + '-' + timestamp + '.jpg'
    ffmpeg([
      '-ss', timestamp, '-i', videoPath, '-vframes', 1,
      '-f', 'image2', '-q:v', '2', '-y', outputFile
    ])
  },

  extractAudio(videoPath) {
    const outputFile = videoPath.replace(path.extname(videoPath), '.aac')
    ffmpeg([
      '-i', videoPath, '-acodec', 'copy', '-vn', '-y', outputFile
    ])
  }
}
