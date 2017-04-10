'use strict'
const format = require('format-duration')
const clivas = require('clivas')

class Stopwatch {
  constructor ({title = ' ELAPSED TIME:', showIcon = true, render = false} = {}) {
    this.title = title
    this.showIcon = showIcon
    this.render = render
    this.timeStart
    this.timeEnd
    this.currentTime
    this.icons = ['⏳', '⌛']
    this.currentIcon = -1
    this.totalIcons = this.icons.length
    this.laps = []
    this.running = false
    this.callback
  }

  onTick (callback) {
    this.callback = callback
    return this
  }

  start () {
    this.running = true
    this.timeStart = new Date()
    this.loop()
  }

  loop () {
    this.currentTime = new Date()
    if (typeof this.callback === 'function') {
      this.callback({
        timeStart: this.timeStart,
        currentTime: this.currentTime,
        elapsedTime: this.getElapsedTime(),
        icon: this.getIcon(),
        laps: this.laps,
        running: this.running
      })
    }

    if (this.render) this.show()

    this.timeoutRef = setTimeout(() => {
      this.loop()
    }, 1000)
  }

  pause () {
    if (!this.running) {
      this.running = true
      this.timeStart = new Date(new Date() - this.getElapsedTime())
      clivas.clear()
      this.loop()
      return
    }

    clearTimeout(this.timeoutRef)
    this.running = false
  }

  lap () {
    const elapsedTime = this.getElapsedTime()
    const time = format(elapsedTime)
    this.laps.push(time)
  }

  getElapsedTime () {
    return this.currentTime - this.timeStart
  }

  getIcon () {
    ++this.currentIcon
    if (this.currentIcon >= this.totalIcons) this.currentIcon = 0
    return this.icons[this.currentIcon]
  }

  show () {
    const elapsedTime = this.getElapsedTime()
    const time = format(elapsedTime)

    let icon = ''
    if (this.showIcon) icon = this.getIcon()
    clivas.clear()
    clivas.line(`{white:${icon} ${this.title} ${time}}`)
    this.showLaps()
  }

  showLaps () {
    this.laps.forEach((lapTime, i) => {
      const lapNumber = i + 1
      const lapInfo = ` - LAP ${lapNumber}: ${lapTime}`
      clivas.line(lapInfo)
    })
  }
}

module.exports = Stopwatch
