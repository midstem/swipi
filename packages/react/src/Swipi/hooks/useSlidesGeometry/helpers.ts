import { GEOMETRY_TOLERANCE } from '../../constants'
import { SlidesMeasurement } from '../../types'

export const isClose = (a: number, b: number): boolean =>
  Math.abs(a - b) < GEOMETRY_TOLERANCE

export const isSame = (a: SlidesMeasurement, b: SlidesMeasurement): boolean =>
  isClose(a.contentSize, b.contentSize) &&
  isClose(a.loopSize, b.loopSize) &&
  a.positions.length === b.positions.length &&
  a.positions.every((position, index) =>
    isClose(position, b.positions[index])
  ) &&
  a.sizes.every((size, index) => isClose(size, b.sizes[index]))
