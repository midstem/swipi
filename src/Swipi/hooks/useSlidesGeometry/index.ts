import { useCallback, useLayoutEffect, useState } from 'react'
import { measureSlides } from '../../geometry'
import { GEOMETRY_TOLERANCE } from '../../constants'
import { SlidesMeasurement } from '../../types'
import { UseSlidesGeometryProps } from './types'

const EMPTY_MEASUREMENT: SlidesMeasurement = {
  positions: [],
  sizes: [],
  contentSize: 0,
  loopSize: 0
}

const isClose = (a: number, b: number): boolean =>
  Math.abs(a - b) < GEOMETRY_TOLERANCE

const isSame = (a: SlidesMeasurement, b: SlidesMeasurement): boolean =>
  isClose(a.contentSize, b.contentSize) &&
  isClose(a.loopSize, b.loopSize) &&
  a.positions.length === b.positions.length &&
  a.positions.every((position, index) =>
    isClose(position, b.positions[index])
  ) &&
  a.sizes.every((size, index) => isClose(size, b.sizes[index]))

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

  // The first measurement has to land before paint, and the sizes React itself
  // writes to the track are not worth waiting an observer callback for.
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
