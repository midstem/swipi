import { useCallback, useLayoutEffect, useState } from 'react'
import { measureSlides } from '../../geometry'
import { SlidesMeasurement } from '../../types'
import { UseSlidesGeometryProps } from './types'
import { isSame } from './helpers'

const EMPTY_MEASUREMENT: SlidesMeasurement = {
  positions: [],
  sizes: [],
  contentSize: 0,
  loopSize: 0
}

export const useSlidesGeometry = ({
  trackRef,
  offsetsRef,
  slideWidth,
  spaceBetween
}: UseSlidesGeometryProps): SlidesMeasurement => {
  const [measurement, setMeasurement] =
    useState<SlidesMeasurement>(EMPTY_MEASUREMENT)

  const measure = useCallback((): void => {
    const track = trackRef.current

    if (!track) return

    const next = measureSlides(track, offsetsRef.current)

    setMeasurement((previous) => (isSame(previous, next) ? previous : next))
  }, [trackRef, offsetsRef])

  useLayoutEffect(measure, [measure, slideWidth, spaceBetween])

  useLayoutEffect(() => {
    const track = trackRef.current

    if (!track) return

    const hasResizeObserver = typeof ResizeObserver !== 'undefined'
    const sizes = hasResizeObserver ? new ResizeObserver(measure) : null

    const observeSlides = (): void => {
      if (!sizes) return

      sizes.disconnect()
      sizes.observe(track)

      for (let index = 0; index < track.children.length; index += 1) {
        sizes.observe(track.children[index])
      }
    }

    const children =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver(() => {
            observeSlides()
            measure()
          })

    observeSlides()
    children?.observe(track, { childList: true })

    if (!hasResizeObserver) window.addEventListener('resize', measure)

    return () => {
      sizes?.disconnect()
      children?.disconnect()

      if (!hasResizeObserver) window.removeEventListener('resize', measure)
    }
  }, [trackRef, measure])

  return measurement
}
