import assert from 'node:assert/strict'
import { createSSRApp, version } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Carousel, SLIDES } from './carousel.js'
import { listenToConsole } from './environment.js'

const listener = listenToConsole()

const html = await renderToString(createSSRApp(Carousel))

listener.restore()

assert.equal(typeof window, 'undefined', 'the server run found a window')

SLIDES.forEach((slide) =>
  assert.ok(html.includes(slide), `the server output is missing "${slide}"`)
)

assert.ok(
  html.includes('0/0/0'),
  'the server output does not report an unmeasured carousel'
)

assert.deepEqual(listener.messages, [], 'the server run wrote to the console')

console.log(`ssr: renderToString is silent on vue ${version}`)
