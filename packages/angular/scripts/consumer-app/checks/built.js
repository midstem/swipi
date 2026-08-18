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

const window = createDom(readBuiltHtml('index.html'))

assert.deepEqual(
  readState(window),
  [0, 0, 0],
  'the prerendered markup is not the one the browser picks up'
)

const listener = listenToConsole()

try {
  await import(pathToFileURL(readBuiltEntry('index.html')).href)
} catch (error) {
  listener.restore()

  throw new Error(`the built app crashed on import: ${error.message}`)
}

await waitFor(() => {
  const [, snapCount, slidesCount] = readState(window)

  assert.equal(slidesCount, SLIDES.length, 'the built app did not measure')
  assert.ok(snapCount > 1, 'the built app found a single snap')
})

const track = window.document.querySelector('#track')

assert.equal(
  track.style.getPropertyValue('--swipi-slide-width'),
  '300px',
  'the built app never wrote the slide width variable'
)

window.document.querySelector('#next').click()

await waitFor(() => {
  const [selectedIndex] = readState(window)

  assert.equal(selectedIndex, 1, 'the built app did not move to the next snap')
})

listener.restore()

assert.deepEqual(listener.messages, [], 'the built app wrote to the console')

console.log('prod: the prerendered app hydrates, measures and moves')
