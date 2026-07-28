import type { JSX } from 'react'
import Swipi from '../../../Swipi'
import { StageProps } from '../../types'
import CustomActiveDot from '../CustomActiveDot'
import CustomDot from '../CustomDot'
import { useStage } from './useStage'

const Stage = ({
  state,
  slides,
  remountKey,
  swipiRef,
  onSelect,
  onChange
}: StageProps): JSX.Element => {
  const {
    config,
    windowWidth,
    visibleSlides,
    areArrowsAvailable,
    activeBreakpoint
  } = useStage({ state })

  return (
    <div className="pg-card">
      <div className="pg-stage__slider" style={{ width: state.stageWidth }}>
        <Swipi
          key={remountKey}
          ref={swipiRef}
          loop={state.loop}
          config={config}
          biasRight={state.biasRight}
          showDots={state.showDots}
          autoplay={state.autoplay}
          showArrows={state.showArrows}
          initialSlide={state.initialSlide}
          slidesNumber={state.slidesNumber}
          autoplaySpeed={state.autoplaySpeed}
          animationSpeed={state.animationSpeed}
          spaceBetweenSlides={state.spaceBetweenSlides}
          dotColor={state.dotColor}
          activeDotColor={state.activeDotColor}
          sizeForDefaultDot={state.sizeForDefaultDot}
          sizeForDefaultActiveDot={state.sizeForDefaultActiveDot}
          dotsAnimation={state.dotsAnimation}
          slidesAnimation={state.slidesAnimation}
          customDot={state.customDot ? <CustomDot /> : undefined}
          customActiveDot={
            state.customActiveDot ? <CustomActiveDot /> : undefined
          }
          prevButton={state.prevButton}
          nextButton={state.nextButton}
          className={state.className || undefined}
          ariaLabel={state.ariaLabel}
          onSelect={onSelect}
          onChange={onChange}
        >
          {slides.map((color, index) => (
            <div
              key={color}
              className="pg-slide"
              style={{ backgroundColor: color }}
            >
              {index + 1}
            </div>
          ))}
        </Swipi>
      </div>

      <ul className="pg-facts">
        <li>
          window width: <b>{windowWidth}px</b>
        </li>
        <li>
          visible slides: <b>{visibleSlides}</b>
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
