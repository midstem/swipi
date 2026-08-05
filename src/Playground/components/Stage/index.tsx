import type { JSX, KeyboardEvent } from 'react'
import { useSwipiCarousel } from '../../../useSwipiCarousel'
import { StageProps } from '../../types'
import { useStage } from './useStage'
import { getSlideStyle, getTrackStyle } from './helpers'

const Stage = ({
  state,
  slides,
  swipiRef,
  onSelect,
  onChange
}: StageProps): JSX.Element => {
  const {
    bias,
    slideWidth,
    spaceBetween,
    visibleSlides,
    windowWidth,
    activeBreakpoint
  } = useStage({ state })

  const [carouselRef, carousel] = useSwipiCarousel({
    loop: state.loop,
    dragFree: state.dragFree,
    autoplay: state.autoplay,
    startIndex: state.startIndex,
    autoplaySpeed: state.autoplaySpeed,
    animationSpeed: state.animationSpeed,
    slideWidth,
    spaceBetween,
    onSelect,
    onChange
  })

  swipiRef.current = {
    scrollNext: carousel.scrollNext,
    scrollPrev: carousel.scrollPrev,
    scrollTo: carousel.scrollTo,
    selectedScrollSnap: () => carousel.selectedIndex,
    scrollSnapList: () =>
      Array.from({ length: carousel.snapCount }, (_, index) => index),
    canScrollNext: () => carousel.canScrollNext,
    canScrollPrev: () => carousel.canScrollPrev
  }

  const showArrows = state.showArrows && carousel.hasOverflow

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'ArrowLeft') carousel.scrollPrev()
    if (event.key === 'ArrowRight') carousel.scrollNext()
  }

  return (
    <div className="pg-card">
      <div className="pg-stage__slider" style={{ width: state.stageWidth }}>
        <div className="pg-carousel">
          <span className="pg-visually-hidden" aria-live="polite" aria-atomic>
            Slide {carousel.selectedIndex + 1} of {carousel.snapCount}
          </span>

          <div className="pg-carousel__row">
            {showArrows && (
              <button
                type="button"
                className="pg-carousel__arrow"
                aria-label="Previous slide"
                disabled={!carousel.canScrollPrev}
                onClick={carousel.scrollPrev}
              >
                ‹
              </button>
            )}

            <div
              ref={carouselRef}
              className="pg-carousel__viewport"
              role="group"
              tabIndex={0}
              aria-roledescription="carousel"
              aria-label={state.ariaLabel}
              onKeyDown={handleKeyDown}
            >
              <div
                className="pg-carousel__track"
                style={getTrackStyle(visibleSlides, bias, slideWidth)}
              >
                {slides.map((color, index) => (
                  <div
                    key={color}
                    className="pg-carousel__slide"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${slides.length}`}
                    style={getSlideStyle(
                      state,
                      index === carousel.selectedIndex
                    )}
                  >
                    <div
                      className="pg-carousel__slide-box"
                      style={{ backgroundColor: color }}
                    >
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {showArrows && (
              <button
                type="button"
                className="pg-carousel__arrow"
                aria-label="Next slide"
                disabled={!carousel.canScrollNext}
                onClick={carousel.scrollNext}
              >
                ›
              </button>
            )}
          </div>

          {state.showDots && (
            <nav className="pg-carousel__dots">
              {Array.from({ length: carousel.snapCount }, (_, index) => {
                const isActive = index === carousel.selectedIndex

                return (
                  <button
                    key={index}
                    type="button"
                    className="pg-carousel__dot"
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={isActive}
                    onClick={() => carousel.scrollTo(index)}
                  >
                    <span
                      className="pg-carousel__dot-mark"
                      data-active={isActive}
                      style={{ transition: `${state.animationSpeed}ms` }}
                    />
                  </button>
                )
              })}
            </nav>
          )}
        </div>
      </div>

      <ul className="pg-facts">
        <li>
          window width: <b>{windowWidth}px</b>
        </li>
        <li>
          visible slides: <b>{visibleSlides}</b>
        </li>
        <li>
          snap positions: <b>{carousel.snapCount}</b>
        </li>
        <li>
          active breakpoint:{' '}
          <b>
            {activeBreakpoint
              ? `maxWidth ${activeBreakpoint.maxWidth}`
              : 'none'}
          </b>
        </li>
      </ul>

      {!carousel.hasOverflow && (
        <p className="pg-warning">
          All slides fit on the screen, so arrows, dots navigation and{' '}
          <code>loop</code> are disabled — add more slides, decrease{' '}
          <code>slidesNumber</code> or narrow the stage.
        </p>
      )}
    </div>
  )
}

export default Stage
