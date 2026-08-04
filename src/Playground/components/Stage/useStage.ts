import { useMemo, useState } from 'react'
import { useWindowResize } from '../../hooks/useWindowResize'
import { UseStageProps, UseStageReturn } from '../../types'
import {
  getActiveBreakpoint,
  getBias,
  getConfig,
  getSlideWidth,
  getSpaceBetween,
  getVisibleSlides
} from './helpers'

export const useStage = ({ state }: UseStageProps): UseStageReturn => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)

  useWindowResize(() => setWindowWidth(window.innerWidth))

  const config = useMemo(() => getConfig(state), [state])

  const visibleSlides = getVisibleSlides(state, config, windowWidth)

  return {
    config,
    windowWidth,
    visibleSlides,
    slideWidth: getSlideWidth(state),
    spaceBetween: getSpaceBetween(state, config, windowWidth),
    bias: getBias(state, config, windowWidth, visibleSlides),
    activeBreakpoint: getActiveBreakpoint(config, windowWidth)
  }
}
