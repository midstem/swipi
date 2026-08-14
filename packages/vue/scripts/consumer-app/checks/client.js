import assert from 'node:assert/strict'
import { createElement as element, StrictMode, version } from 'react'
import { createDom, listenToConsole, waitFor } from './environment.js'

const window = createDom()

const { createRoot } = await import('react-dom/client')
const { Carousel, SLIDES } = await import('./carousel.js')

const listener = listenToConsole()

const readState = () => {
  const state = window.document.querySelector('#state')

  assert.ok(state, 'the carousel did not render')

  return state.textContent.split('/').map(Number)
}

const root = createRoot(window.document.querySelector('#root'))

root.render(element(StrictMode, null, element(Carousel)))

await waitFor(() => {
  const [, snapCount, slidesCount] = readState()

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
  const [selectedIndex] = readState()

  assert.equal(selectedIndex, 1, 'the carousel did not move to the next snap')
})

root.unmount()

await new Promise((resolve) => setTimeout(resolve, 50))

listener.restore()

assert.deepEqual(listener.messages, [], 'the client run wrote to the console')

console.log(`client: StrictMode mount, move and unmount on react ${version}`)
