import type { JSX, KeyboardEvent } from 'react'
import { useSwipiCarousel } from '@midstem/swipi-react'
import { StageProps } from '../../types'
import { useStage } from './useStage'
import {
  STYLES,
  getArrows,
  getSlideStyle,
  getTrackStyle,
  getViewportStyle,
  isNextKey,
  isPreviousKey
} from '@swipi/playground-core'

const Stage = ({
  state,
  slides,
  swipiRef,
  onSelect,
  onChange
}: StageProps): JSX.Element => {
  const {
    bias,
    isVertical,
    slideWidth,
    spaceBetween,
    visibleSlides,
    windowWidth,
    activeBreakpoint
  } = useStage({ state })

  const [carouselRef, carousel] = useSwipiCarousel({
    axis: state.axis,
    loop: state.loop,
    dragFree: state.dragFree,
    autoplay: state.autoplay,
    startIndex: state.startIndex,
    autoplaySpeed: state.autoplaySpeed,
    animationSpeed: state.animationSpeed,
    respectReducedMotion: state.respectReducedMotion,
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

  const [previousArrow, nextArrow] = getArrows(isVertical)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (isPreviousKey(event.key, isVertical)) carousel.scrollPrev()
    if (isNextKey(event.key, isVertical)) carousel.scrollNext()
  }

  return (
    <div className={STYLES.card}>
      <div className={STYLES.slider} style={{ width: state.stageWidth }}>
        <div className={STYLES.carousel} data-pg="carousel">
          <span
            className={STYLES.visuallyHidden}
            aria-live="polite"
            aria-atomic
          >
            Slide {carousel.selectedIndex + 1} of {carousel.snapCount}
          </span>

          <div className={STYLES.carouselRow} data-axis={state.axis}>
            {showArrows && (
              <button
                type="button"
                className={STYLES.arrow}
                aria-label="Previous slide"
                disabled={!carousel.canScrollPrev}
                onClick={carousel.scrollPrev}
              >
                {previousArrow}
              </button>
            )}

            <div
              ref={carouselRef}
              className={STYLES.viewport}
              data-pg="viewport"
              data-axis={state.axis}
              style={getViewportStyle(state, isVertical)}
              role="group"
              tabIndex={0}
              aria-roledescription="carousel"
              aria-label={state.ariaLabel}
              onKeyDown={handleKeyDown}
            >
              <div
                className={STYLES.track}
                data-axis={state.axis}
                style={getTrackStyle(visibleSlides, bias, slideWidth)}
              >
                {slides.map((color, index) => (
                  <div
                    key={color}
                    className={STYLES.slide}
                    data-pg="slide"
                    data-axis={state.axis}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${slides.length}`}
                    style={getSlideStyle(
                      state,
                      index === carousel.selectedIndex
                    )}
                  >
                    <div
                      className={STYLES.slideBox}
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
                className={STYLES.arrow}
                aria-label="Next slide"
                disabled={!carousel.canScrollNext}
                onClick={carousel.scrollNext}
              >
                {nextArrow}
              </button>
            )}
          </div>

          {state.showDots && (
            <nav className={STYLES.dots}>
              {Array.from({ length: carousel.snapCount }, (_, index) => {
                const isActive = index === carousel.selectedIndex

                return (
                  <button
                    key={index}
                    type="button"
                    className={STYLES.dot}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={isActive}
                    onClick={() => carousel.scrollTo(index)}
                  >
                    <span
                      className={STYLES.dotMark}
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

      <ul className={STYLES.facts}>
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
        <p className={STYLES.warning}>
          All slides fit on the screen, so arrows, dots navigation and{' '}
          <code>loop</code> are disabled — add more slides, decrease{' '}
          <code>slidesNumber</code> or narrow the stage.
        </p>
      )}
    </div>
  )
}

export default Stage
