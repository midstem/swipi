import { RefObject, useLayoutEffect } from 'react'
import { SLIDE_GAP_VARIABLE, SLIDE_WIDTH_VARIABLE } from '../../constants'

type UseTrackVariablesProps = {
  trackRef: RefObject<HTMLElement | null>
  slideWidth?: number
  spaceBetween?: number
}

const toPixels = (value: number): string => `${value}px`

export const useTrackVariables = ({
  trackRef,
  slideWidth,
  spaceBetween
}: UseTrackVariablesProps): void => {
  useLayoutEffect(() => {
    const track = trackRef.current

    if (!track || slideWidth === undefined) return

    track.style.setProperty(SLIDE_WIDTH_VARIABLE, toPixels(slideWidth))
    track.style.setProperty(SLIDE_GAP_VARIABLE, toPixels(spaceBetween ?? 0))
  }, [trackRef, slideWidth, spaceBetween])
}
