import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import {
  createDom,
  listenToConsole,
  readBuiltEntry,
  waitFor
} from './environment.js'

const window = createDom()

const listener = listenToConsole()

try {
  await import(pathToFileURL(readBuiltEntry()).href)
} catch (error) {
  listener.restore()

  throw new Error(`the built app crashed on import: ${error.message}`)
}

const readState = () => {
  const state = window.document.querySelector('#state')

  assert.ok(state, 'the built app did not render the carousel')

  return state.textContent.split('/').map(Number)
}

await waitFor(() => {
  const [, snapCount, slidesCount] = readState()

  assert.equal(slidesCount, 4, 'the built app did not measure the slides')
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
  const [selectedIndex] = readState()

  assert.equal(selectedIndex, 1, 'the built app did not move to the next snap')
})

listener.restore()

assert.deepEqual(listener.messages, [], 'the built app wrote to the console')

console.log('prod: the built app mounts, measures and moves')
