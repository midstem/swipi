import { RefObject, useCallback, useLayoutEffect, useState } from 'react'
import { measureSlides } from '../../geometry'
import { GEOMETRY_TOLERANCE } from '../../constants'
import { SlideOffsets, SlidesMeasurement } from '../../types'

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

export const useSlidesGeometry = (
  trackRef: RefObject<HTMLElement | null>,
  offsetsRef: RefObject<SlideOffsets>
): SlidesMeasurement => {
  const [measurement, setMeasurement] =
    useState<SlidesMeasurement>(EMPTY_MEASUREMENT)

  const measure = useCallback((): void => {
    const track = trackRef.current

    if (!track) return

    const next = measureSlides(track, offsetsRef.current)

    setMeasurement((previous) => (isSame(previous, next) ? previous : next))
  }, [trackRef, offsetsRef])

  useLayoutEffect(() => {
    measure()
  })

  return measurement
}
