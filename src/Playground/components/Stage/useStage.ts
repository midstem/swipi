import { useMemo, useState } from 'react'
import { useWindowResize } from '../../../Swipi/hooks/useWindowResize'
import { UseStageProps, UseStageReturn } from '../../types'
import { getActiveBreakpoint, getConfig, getVisibleSlides } from './helpers'

export const useStage = ({ state }: UseStageProps): UseStageReturn => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)

  useWindowResize(() => setWindowWidth(window.innerWidth))

  const config = useMemo(() => getConfig(state), [state])

  const visibleSlides = getVisibleSlides(state, config, windowWidth)

  return {
    config,
    windowWidth,
    visibleSlides,
    areArrowsAvailable: state.slidesCount > visibleSlides,
    activeBreakpoint: getActiveBreakpoint(config, windowWidth)
  }
}
