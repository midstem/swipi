import { createSwipi } from '@midstem/swipi'

const SLIDES = ['one', 'two', 'three', 'four']

const SLIDE_WIDTH = 300

const root = document.querySelector('#root')

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
root.append(section)

const carousel = createSwipi(viewport, { slideWidth: SLIDE_WIDTH })

const render = () => {
  const { selectedIndex, snapCount, slidesCount } = carousel.getSnapshot()

  state.textContent = `${selectedIndex}/${snapCount}/${slidesCount}`
}

carousel.subscribe(render)
next.addEventListener('click', () => carousel.scrollNext())

render()
