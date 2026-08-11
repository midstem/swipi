import { RefObject } from 'react'
import { SLIDE_GAP_VARIABLE, SLIDE_WIDTH_VARIABLE } from '@swipi/core'
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'

type UseTrackVariablesProps = {
  trackRef: RefObject<HTMLElement | null>
  slideWidth?: number
  spaceBetween?: number
}

const writeVariable = (
  track: HTMLElement,
  variable: string,
  value?: number
): void => {
  if (value === undefined) {
    track.style.removeProperty(variable)

    return
  }

  track.style.setProperty(variable, `${value}px`)
}

export const useTrackVariables = ({
  trackRef,
  slideWidth,
  spaceBetween
}: UseTrackVariablesProps): void => {
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current

    if (!track) return

    writeVariable(track, SLIDE_WIDTH_VARIABLE, slideWidth)
    writeVariable(track, SLIDE_GAP_VARIABLE, spaceBetween)
  }, [trackRef, slideWidth, spaceBetween])
}
