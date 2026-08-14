import assert from 'node:assert/strict'
import { createElement as element, StrictMode, version } from 'react'
import { renderToString } from 'react-dom/server'
import { Carousel, SLIDES } from './carousel.js'
import { listenToConsole } from './environment.js'

const listener = listenToConsole()

const html = renderToString(element(StrictMode, null, element(Carousel)))

listener.restore()

assert.equal(typeof window, 'undefined', 'the server run found a window')

SLIDES.forEach((slide) =>
  assert.ok(html.includes(slide), `the server output is missing "${slide}"`)
)

assert.ok(
  html.replace(/<!-- -->/g, '').includes('0/0/0'),
  'the server output does not report an unmeasured carousel'
)

assert.deepEqual(listener.messages, [], 'the server run wrote to the console')

console.log(`ssr: renderToString is silent on react ${version}`)
