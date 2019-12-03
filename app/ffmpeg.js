/**
 * --------------------------------------------------------
 * Ffmpeg Process
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

const fs = require('fs')
const stringToStream = require('string-to-stream')
const { execFile } = require('child_process')
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

    // -i 放在 -ss 之前表示不使用关键帧技术；-i 放在 -ss 之后表示使用关键帧技术
    // 不使用关键帧剪切后视频开头可能存在几秒定格画面；使用关键帧截取速度快，但时间不精确，
    // 并且如果结尾不是关键帧，则可能出现一段空白（参数 avoid_negative_ts 可解决）
    ffmpeg([
      '-ss', startSecs, '-t', endSecs - startSecs, '-accurate_seek', '-i', videoPath,
      '-vcodec', 'copy', '-acodec', 'copy', '-avoid_negative_ts', 1, '-y', outputFile
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
  },

  fastCodec(videoPath, startTime) {
    startTime = startTime || 0
    const file = fs.statSync(videoPath)

    // -frag_duration: Create fragments that are duration microseconds long.
    return execFile(ffmpegPath, [
      '-ss', startTime, '-i', videoPath, '-preset:v', 'ultrafast',
      '-f', 'mp4', '-frag_duration', 1000000, 'pipe:1',
    ], {
      encoding: 'buffer', maxBuffer: file.size
    })
  },

  getDuration(videoPath) {
    return new Promise(resolve => {
      execFile(ffmpegPath, ['-i', videoPath, '-'], (error, stdout, stderr) => {
        const match = /Duration\: ([0-9\:\.]+),/.exec(stderr)
        resolve(match ? util.parseDuration(match[1]) : 0)
      })
    })
  }

}
