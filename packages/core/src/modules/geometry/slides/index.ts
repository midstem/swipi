import { DEFAULT_AXIS } from '#src/constants'
import { getRectSize, getRectStart } from '#src/modules/axis'
import {
  SlideOffsets,
  SlidesGeometry,
  SlidesMeasurement,
  SwipiAxis
} from '#src/types'
import { NO_OFFSET } from './constants'
import { getGap } from './helpers'

export const measureSlides = (
  track: HTMLElement,
  laps?: SlideOffsets,
  axis: SwipiAxis = DEFAULT_AXIS
): SlidesMeasurement => {
  const { children } = track
  const positions: number[] = []
  const sizes: number[] = []

  for (let index = 0; index < children.length; index += 1) {
    const slide = children[index] as HTMLElement
    const rect = slide.getBoundingClientRect()

    positions.push(getRectStart(rect, axis) - (laps?.get(slide) ?? NO_OFFSET))
    sizes.push(getRectSize(rect, axis))
  }

  if (!positions.length) {
    return { positions: [], sizes: [], contentSize: 0, loopSize: 0 }
  }

  const origin = positions[0]
  const offsets = positions.map((position) => position - origin)
  const contentSize = offsets[offsets.length - 1] + sizes[sizes.length - 1]

  return {
    positions: offsets,
    sizes,
    contentSize,
    loopSize: contentSize + getGap(offsets, sizes)
  }
}

export const getSlideLap = (
  index: number,
  transform: number,
  { positions, sizes, loopSize }: SlidesGeometry
): number => {
  if (loopSize <= 0 || !positions.length) return NO_OFFSET

  const position = positions[index] + transform
  const laps = Math.floor((position + sizes[index]) / loopSize)

  return laps ? -laps * loopSize : NO_OFFSET
}
