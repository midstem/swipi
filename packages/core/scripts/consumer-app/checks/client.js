import assert from 'node:assert/strict'
import { createDom, listenToConsole, waitFor } from './environment.js'

const window = createDom()

const { mount, SLIDES, SLIDE_WIDTH } = await import('./carousel.js')

const listener = listenToConsole()

const readState = () => {
  const state = window.document.querySelector('#state')

  assert.ok(state, 'the carousel did not render')

  return state.textContent.split('/').map(Number)
}

const app = mount(window.document)

await waitFor(() => {
  const [, snapCount, slidesCount] = readState()

  assert.equal(slidesCount, SLIDES.length, 'the slides were not measured')
  assert.ok(snapCount > 1, 'the carousel found a single snap')
})

const track = window.document.querySelector('#track')

assert.equal(
  track.style.getPropertyValue('--swipi-slide-width'),
  `${SLIDE_WIDTH}px`,
  'the slide width variable never reached the track'
)

window.document.querySelector('#next').click()

await waitFor(() => {
  const [selectedIndex] = readState()

  assert.equal(selectedIndex, 1, 'the carousel did not move to the next snap')
})

app.unmount()

await new Promise((resolve) => setTimeout(resolve, 50))

listener.restore()

assert.deepEqual(listener.messages, [], 'the client run wrote to the console')

console.log(`client: mount, move and unmount on node ${process.versions.node}`)
