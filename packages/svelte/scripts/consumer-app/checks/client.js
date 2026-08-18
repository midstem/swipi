import assert from 'node:assert/strict'
import { createDom, listenToConsole, waitFor } from './environment.js'

const window = createDom()

const { mount, unmount } = await import('svelte')
const { VERSION } = await import('svelte/compiler')
const { loadCarousel, SLIDES } = await import('./carousel.js')

const Carousel = await loadCarousel('client')

const listener = listenToConsole()

const readState = () => {
  const state = window.document.querySelector('#state')

  assert.ok(state, 'the carousel did not render')

  return state.textContent.split('/').map(Number)
}

const component = mount(Carousel, {
  target: window.document.querySelector('#root')
})

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

await unmount(component)

await new Promise((resolve) => setTimeout(resolve, 50))

assert.equal(
  track.style.transform,
  '',
  'the track kept a transform after the component was gone'
)

listener.restore()

assert.deepEqual(listener.messages, [], 'the client run wrote to the console')

console.log(`client: mount, move and unmount on svelte ${VERSION}`)
