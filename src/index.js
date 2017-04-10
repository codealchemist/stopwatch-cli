#!/usr/bin/env node

'use strict'
const path = require('path')
const fs = require('fs')
const clivas = require('clivas')

// Hide cursor.
clivas.cursor(false)

// Avoid enter key from generating new lines
// and allows capturing key events.
const readline = require('readline')
readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

// print ascii art
const artFile = path.join(__dirname, './ascii-art.txt')
const art = fs.readFileSync(artFile, 'utf8')
console.log(art)
console.log('Press ENTER key to create LAPS, SPACE to PAUSE or "q" to quit.')
console.log()

const Stopwatch = require('./stopwatch')
const stopwatch = new Stopwatch({render: true})
stopwatch.start()

process.stdin.on('keypress', (str, key) => {
  // Lap.
  if (key && key.name === 'return') {
    stopwatch.lap()
  }

  // Pause.
  if (key.name === 'space') {
    clivas.line(`{yellow:-- Paused --}`)
    stopwatch.pause()
  }

  // Exit.
  if (key.name === 'q' || key.sequence === '\u0003') {
    clivas.line(`
      {yellow:Have a good time!}
    `)
    process.exit()
  }
})
