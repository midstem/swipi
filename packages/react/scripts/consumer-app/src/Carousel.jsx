import { useSwipiCarousel } from '@midstem/swipi-react'

const SLIDES = ['one', 'two', 'three', 'four']

const SLIDE_WIDTH = 300

export const Carousel = () => {
  const [carouselRef, carousel] = useSwipiCarousel({ slideWidth: SLIDE_WIDTH })

  return (
    <section>
      <div id="viewport" ref={carouselRef}>
        <div id="track">
          {SLIDES.map((slide) => (
            <article key={slide}>{slide}</article>
          ))}
        </div>
      </div>

      <button id="next" onClick={carousel.scrollNext}>
        next
      </button>

      <p id="state">
        {carousel.selectedIndex}/{carousel.snapCount}/{carousel.slidesCount}
      </p>
    </section>
  )
}
