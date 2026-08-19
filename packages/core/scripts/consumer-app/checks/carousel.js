import { createSwipi } from '@midstem/swipi'

export const SLIDES = ['one', 'two', 'three', 'four']

export const SLIDE_WIDTH = 300

export const mount = (document) => {
  const section = document.createElement('section')

  const viewport = document.createElement('div')
  viewport.id = 'viewport'

  const track = document.createElement('div')
  track.id = 'track'

  SLIDES.forEach((slide) => {
    const article = document.createElement('article')
    article.textContent = slide
    track.append(article)
  })

  const next = document.createElement('button')
  next.id = 'next'
  next.textContent = 'next'

  const state = document.createElement('p')
  state.id = 'state'

  viewport.append(track)
  section.append(viewport, next, state)
  document.querySelector('#root').append(section)

  const carousel = createSwipi(viewport, { slideWidth: SLIDE_WIDTH })

  const render = () => {
    const { selectedIndex, snapCount, slidesCount } = carousel.getSnapshot()

    state.textContent = `${selectedIndex}/${snapCount}/${slidesCount}`
  }

  const unsubscribe = carousel.subscribe(render)

  next.addEventListener('click', () => carousel.scrollNext())

  render()

  return {
    carousel,
    unmount: () => {
      unsubscribe()
      carousel.destroy()
      section.remove()
    }
  }
}
