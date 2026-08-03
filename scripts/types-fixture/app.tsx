import { useRef, useState } from 'react'
import Swipi, {
  SwipiProps,
  SwipiRef,
  SwipiState,
  useSwipiCarousel
} from 'swipi'
import type { SwipiCarousel, SwipiCarouselRef } from 'swipi'

export const Headless = () => {
  const [carouselRef, carousel]: [SwipiCarouselRef, SwipiCarousel] =
    useSwipiCarousel({ loop: true, dragFree: true, onSelect: (state) => state })

  return (
    <>
      <div ref={carouselRef}>
        <div>
          <div>one</div>
          <div>two</div>
        </div>
      </div>

      <button onClick={carousel.scrollNext} disabled={!carousel.canScrollNext}>
        {carousel.selectedIndex} / {carousel.snapCount} / {carousel.slidesCount}
      </button>
    </>
  )
}

const config: SwipiProps['config'] = [
  { maxWidth: 700, slidesNumber: 1, spaceBetween: 10, biasRight: true }
]

export const Consumer = () => {
  const swipi = useRef<SwipiRef>(null)
  const [state, setState] = useState<SwipiState>()

  const scrollToLast = (): void => {
    const snaps = swipi.current?.scrollSnapList() ?? []

    swipi.current?.scrollTo(snaps.length - 1)
  }

  return (
    <>
      <Swipi
        ref={swipi}
        loop
        dragFree
        showDots
        showArrows
        config={config}
        slidesNumber={3}
        initialSlide={1}
        animationSpeed={300}
        dotsAnimation="sliding"
        slidesAnimation="fade-in"
        spaceBetweenSlides={10}
        ariaLabel="Gallery"
        onSelect={setState}
        onChange={({ prev, current, next }) => [prev, current, next]}
      >
        <div>one</div>
        <div>two</div>
      </Swipi>

      <button onClick={scrollToLast}>
        {state?.selectedIndex} / {state?.snapCount}
      </button>
    </>
  )
}
