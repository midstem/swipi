import assert from 'node:assert/strict'
import { VERSION } from 'svelte/compiler'
import { render } from 'svelte/server'
import { loadCarousel, SLIDES } from './carousel.js'
import { listenToConsole } from './environment.js'

const Carousel = await loadCarousel('server')

const listener = listenToConsole()

const { body } = render(Carousel)

listener.restore()

assert.equal(typeof window, 'undefined', 'the server run found a window')

SLIDES.forEach((slide) =>
  assert.ok(body.includes(slide), `the server output is missing "${slide}"`)
)

assert.ok(
  body.includes('0/0/0'),
  'the server output does not report an unmeasured carousel'
)

assert.deepEqual(listener.messages, [], 'the server run wrote to the console')

console.log(`ssr: render is silent on svelte ${VERSION}`)
