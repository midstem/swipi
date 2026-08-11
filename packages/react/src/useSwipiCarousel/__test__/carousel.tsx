import { useState, type JSX } from 'react'
import { screen } from '@testing-library/react'
import { useSwipiCarousel } from '..'
import { SwipiCarousel, SwipiCarouselOptions } from '../types'
import { SLIDE_WIDTH, SLIDES_COUNT } from './dom'

export type CarouselProps = SwipiCarouselOptions & {
  count?: number
  onRender?: (carousel: SwipiCarousel) => void
}

export const Carousel = ({
  count = SLIDES_COUNT,
  onRender,
  ...options
}: CarouselProps): JSX.Element => {
  const [carouselRef, carousel] = useSwipiCarousel({
    slideWidth: SLIDE_WIDTH,
    ...options
  })

  onRender?.(carousel)

  return (
    <section>
      <div data-testid="viewport" ref={carouselRef}>
        <div data-testid="track">
          {Array.from({ length: count }, (_, index) => (
            <article key={index}>{index + 1}</article>
          ))}
        </div>
      </div>

      <button onClick={carousel.scrollPrev}>back</button>
      <button onClick={carousel.scrollNext}>forward</button>

      <nav>
        {Array.from({ length: carousel.snapCount }, (_, index) => (
          <button key={index} onClick={() => carousel.scrollTo(index)}>
            dot {index}
          </button>
        ))}
      </nav>

      <p data-testid="state">
        {carousel.selectedIndex}/{carousel.snapCount}/{carousel.slidesCount}/
        {String(carousel.canScrollPrev)}/{String(carousel.canScrollNext)}/
        {String(carousel.hasOverflow)}
      </p>
    </section>
  )
}

export const Host = (props: CarouselProps): JSX.Element => {
  const [, setTick] = useState(0)

  return (
    <>
      <button onClick={() => setTick((tick) => tick + 1)}>rerender</button>
      <Carousel {...props} />
    </>
  )
}

export const rerenderButton = (): HTMLElement =>
  screen.getByRole('button', { name: 'rerender' })

export const forwardButton = (): HTMLElement =>
  screen.getByRole('button', { name: 'forward' })

export const backButton = (): HTMLElement =>
  screen.getByRole('button', { name: 'back' })
