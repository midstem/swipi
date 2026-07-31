import { RefObject, useCallback, useLayoutEffect, useState } from 'react'
import { measureSlides } from '../../geometry'
import { SlidesMeasurement } from '../../types'

const EMPTY_MEASUREMENT: SlidesMeasurement = {
  positions: [],
  sizes: [],
  contentSize: 0
}

const isSame = (a: SlidesMeasurement, b: SlidesMeasurement): boolean =>
  a.contentSize === b.contentSize &&
  a.positions.length === b.positions.length &&
  a.positions.every((position, index) => position === b.positions[index]) &&
  a.sizes.every((size, index) => size === b.sizes[index])

export const useSlidesGeometry = (
  trackRef: RefObject<HTMLElement | null>
): SlidesMeasurement => {
  const [measurement, setMeasurement] =
    useState<SlidesMeasurement>(EMPTY_MEASUREMENT)

  const measure = useCallback((): void => {
    const track = trackRef.current

    if (!track) return

    const next = measureSlides(track)

    setMeasurement((previous) => (isSame(previous, next) ? previous : next))
  }, [trackRef])

  useLayoutEffect(() => {
    measure()
  })

  return measurement
}
