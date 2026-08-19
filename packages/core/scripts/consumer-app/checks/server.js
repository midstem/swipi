import assert from 'node:assert/strict'
import { listenToConsole } from './environment.js'

const listener = listenToConsole()

const { createSwipi } = await import('@midstem/swipi')

listener.restore()

assert.equal(typeof window, 'undefined', 'the server run found a window')

assert.equal(typeof document, 'undefined', 'the server run found a document')

assert.equal(
  typeof createSwipi,
  'function',
  'the server run cannot reach createSwipi'
)

assert.deepEqual(
  listener.messages,
  [],
  'importing the package wrote to the console'
)

console.log(
  `server: the entry imports without a dom on node ${process.versions.node}`
)
