import { useState } from 'react'
import { useSwipiCarousel } from '@midstem/swipi-react'
import type {
  SlidePositions,
  SwipiAxis,
  SwipiCarousel,
  SwipiCarouselRef,
  SwipiState
} from '@midstem/swipi-react'

const AXIS: SwipiAxis = 'y'

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

export const Consumer = () => {
  const [state, setState] = useState<SwipiState>()
  const [positions, setPositions] = useState<SlidePositions>()

  const [carouselRef, carousel] = useSwipiCarousel({
    axis: AXIS,
    loop: true,
    autoplay: true,
    slideWidth: 320,
    spaceBetween: 10,
    startIndex: 1,
    autoplaySpeed: 4000,
    animationSpeed: 300,
    respectReducedMotion: true,
    onSelect: setState,
    onChange: setPositions
  })

  const scrollToLast = (): void => carousel.scrollTo(carousel.snapCount - 1)

  return (
    <>
      <div ref={carouselRef}>
        <div>
          <div>one</div>
          <div>two</div>
        </div>
      </div>

      <button onClick={carousel.scrollPrev} disabled={!carousel.canScrollPrev}>
        prev
      </button>

      <button onClick={scrollToLast}>
        {state?.selectedIndex} / {state?.snapCount} / {positions?.next}
      </button>
    </>
  )
}
