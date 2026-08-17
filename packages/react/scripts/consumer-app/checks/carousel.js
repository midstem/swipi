import { createElement as element } from 'react'
import { useSwipiCarousel } from '@midstem/swipi-react'

export const SLIDES = ['one', 'two', 'three', 'four']

export const Carousel = () => {
  const [carouselRef, carousel] = useSwipiCarousel({ slideWidth: 300 })

  return element(
    'section',
    null,
    element(
      'div',
      { id: 'viewport', ref: carouselRef },
      element(
        'div',
        { id: 'track' },
        SLIDES.map((slide) => element('article', { key: slide }, slide))
      )
    ),
    element('button', { id: 'next', onClick: carousel.scrollNext }, 'next'),
    element(
      'p',
      { id: 'state' },
      `${carousel.selectedIndex}/${carousel.snapCount}/${carousel.slidesCount}`
    )
  )
}
