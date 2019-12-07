/**
 * --------------------------------------------------------
 * Common Utils
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

function padStart(num, length) {
  return (Array(length).join('0') + num).slice(-length)
}

module.exports = {
  isNumber(string) {
    return Number.isFinite(parseFloat(string))
  },

  parseQuery(queryString) {
    const index = queryString.indexOf('?')
    queryString = index > -1 ? queryString.substring(index+1) : queryString

    let result = {}
    const params = queryString.split('&')
    params.forEach(param => {
      let item = param.split('=')
      result[item[0]] = decodeURI(item[1])
    })
    return result
  },

  formatDuration(_seconds) {
    const seconds = _seconds || 0
    const minutes = seconds / 60
    const hours = minutes / 60

    const hoursPadded = padStart(Math.floor(hours), 2)
    const minutesPadded = padStart(Math.floor(minutes % 60), 2)
    const secondsPadded = padStart(Math.floor(seconds) % 60, 2)
    const msPadded = padStart(Math.floor((seconds - Math.floor(seconds)) * 1000), 3)

    return `${hoursPadded}:${minutesPadded}:${secondsPadded}.${msPadded}`
  },

  parseDuration(str) {
    if (!str) return
    const match = str.trim().match(/^(\d{2}):(\d{2}):(\d{2})\.(\d{2,3})$/)

    if (!match) return
    const hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    const seconds = parseInt(match[3], 10)
    const ms = parseInt(match[4], 10)

    if (hours > 59 || minutes > 59 || seconds > 59) return
    return ((((hours * 60) + minutes) * 60) + seconds) + (ms / 1000)
  }

}
