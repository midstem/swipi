import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import {
  createDom,
  listenToConsole,
  readBuiltEntry,
  readBuiltHtml,
  readState,
  SLIDES,
  waitFor
} from './environment.js'

const window = createDom(readBuiltHtml('index.csr.html'))

const listener = listenToConsole()

try {
  await import(pathToFileURL(readBuiltEntry('index.csr.html')).href)
} catch (error) {
  listener.restore()

  throw new Error(`the built app crashed on import: ${error.message}`)
}

await waitFor(() => {
  const [, snapCount, slidesCount] = readState(window)

  assert.equal(slidesCount, SLIDES.length, 'the slides were not measured')
  assert.ok(snapCount > 1, 'the carousel found a single snap')
})

const track = window.document.querySelector('#track')

assert.equal(
  track.style.getPropertyValue('--swipi-slide-width'),
  '300px',
  'the slide width variable never reached the track'
)

window.document.querySelector('#next').click()

await waitFor(() => {
  const [selectedIndex] = readState(window)

  assert.equal(selectedIndex, 1, 'the carousel did not move to the next snap')
})

window.document.querySelector('app-carousel').remove()

await new Promise((resolve) => setTimeout(resolve, 50))

listener.restore()

assert.deepEqual(listener.messages, [], 'the client run wrote to the console')

console.log('client: a fresh mount measures and moves')
