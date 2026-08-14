import { useMemo, useState } from 'react'
import { useWindowResize } from '../../hooks/useWindowResize'
import { VERTICAL_AXIS } from '@swipi/playground-core'
import { UseStageProps, UseStageReturn } from '@swipi/playground-core'
import {
  getActiveBreakpoint,
  getBias,
  getConfig,
  getSlideWidth,
  getSpaceBetween,
  getVisibleSlides
} from '@swipi/playground-core'

export const useStage = ({ state }: UseStageProps): UseStageReturn => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)

  useWindowResize(() => setWindowWidth(window.innerWidth))

  const config = useMemo(() => getConfig(state), [state])

  const visibleSlides = getVisibleSlides(state, config, windowWidth)

  return {
    config,
    windowWidth,
    visibleSlides,
    isVertical: state.axis === VERTICAL_AXIS,
    slideWidth: getSlideWidth(state),
    spaceBetween: getSpaceBetween(state, config, windowWidth),
    bias: getBias(state, config, windowWidth, visibleSlides),
    activeBreakpoint: getActiveBreakpoint(config, windowWidth)
  }
}
