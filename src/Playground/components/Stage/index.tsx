import type { JSX } from 'react'
import { useSwipiCarousel } from '../../../useSwipiCarousel'
import { StageProps } from '../../types'
import CustomActiveDot from '../CustomActiveDot'
import CustomDot from '../CustomDot'
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
    spaceBetween,
    visibleSlides,
    areArrowsAvailable,
    windowWidth,
    activeBreakpoint
  } = useStage({ state })

  const {
    state: carouselState,
    scrollNext,
    scrollPrev,
    scrollTo,
    getViewportProps,
    getTrackProps,
    getSlideProps,
    getDotProps,
    getLiveRegionProps
  } = useSwipiCarousel({
    loop: state.loop,
    dragFree: state.dragFree,
    autoplay: state.autoplay,
    initialSlide: state.initialSlide,
    autoplaySpeed: state.autoplaySpeed,
    animationSpeed: state.animationSpeed,
    ariaLabel: state.ariaLabel,
    onSelect,
    onChange
  })

  swipiRef.current = {
    scrollNext,
    scrollPrev,
    scrollTo,
    selectedScrollSnap: () => carouselState.selectedIndex,
    scrollSnapList: () =>
      Array.from({ length: carouselState.snapCount }, (_, index) => index),
    canScrollNext: () => carouselState.canScrollNext,
    canScrollPrev: () => carouselState.canScrollPrev
  }

  const showArrows = state.showArrows && carouselState.hasOverflow

  return (
    <div className="pg-card">
      <div className="pg-stage__slider" style={{ width: state.stageWidth }}>
        <div className={`pg-carousel ${state.className}`.trim()}>
          <span className="pg-visually-hidden" {...getLiveRegionProps()}>
            {carouselState.announcement}
          </span>

          <div className="pg-carousel__row">
            {showArrows && (
              <button
                type="button"
                className="pg-carousel__arrow"
                aria-label="Previous slide"
                disabled={!carouselState.canScrollPrev}
                onClick={scrollPrev}
              >
                {state.prevButton}
              </button>
            )}

            <div className="pg-carousel__viewport" {...getViewportProps()}>
              <div
                className="pg-carousel__track"
                style={getTrackStyle(visibleSlides, spaceBetween, bias)}
                {...getTrackProps()}
              >
                {slides.map((color, index) => (
                  <div
                    key={color}
                    className="pg-carousel__slide"
                    style={getSlideStyle(
                      state,
                      color,
                      index === carouselState.selectedIndex
                    )}
                    {...getSlideProps(index)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            {showArrows && (
              <button
                type="button"
                className="pg-carousel__arrow"
                aria-label="Next slide"
                disabled={!carouselState.canScrollNext}
                onClick={scrollNext}
              >
                {state.nextButton}
              </button>
            )}
          </div>

          {state.showDots && (
            <nav className="pg-carousel__dots">
              {Array.from({ length: carouselState.snapCount }, (_, index) => {
                const isActive = index === carouselState.selectedIndex

                return (
                  <button
                    key={index}
                    className="pg-carousel__dot"
                    {...getDotProps(index)}
                  >
                    {state.customDot || state.customActiveDot ? (
                      isActive && state.customActiveDot ? (
                        <CustomActiveDot />
                      ) : (
                        state.customDot && <CustomDot />
                      )
                    ) : (
                      <span
                        className="pg-carousel__dot-mark"
                        style={{
                          width: isActive
                            ? state.sizeForDefaultActiveDot
                            : state.sizeForDefaultDot,
                          backgroundColor: isActive
                            ? state.activeDotColor
                            : state.dotColor,
                          transition: `${state.animationSpeed}ms`
                        }}
                      />
                    )}
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
          snap positions: <b>{carouselState.snapCount}</b>
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

      {!areArrowsAvailable && (
        <p className="pg-warning">
          All slides fit on the screen, so arrows, dots navigation and{' '}
          <code>loop</code> are disabled — add more slides or decrease{' '}
          <code>slidesNumber</code>.
        </p>
      )}
    </div>
  )
}

export default Stage
