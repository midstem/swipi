import {
  HALF,
  INITIAL_TRANSFORM,
  MOMENTUM_DECAY_TIME,
  NO_OFFSET,
  ONE_STEP,
  SNAP_TOLERANCE
} from '../constants'
import {
  MomentumSnapType,
  SlidesGeometry,
  SlidesMeasurement,
  SnapsFromPositions
} from '../types'
import { clamp, normalizeIndex } from '../helpers'

export const EMPTY_GEOMETRY: SlidesGeometry = {
  positions: [],
  sizes: [],
  snaps: [],
  contentSize: 0,
  loopSize: 0
}

const getGap = (positions: number[], sizes: number[]): number =>
  positions.length > ONE_STEP
    ? Math.max(positions[ONE_STEP] - (positions[0] + sizes[0]), NO_OFFSET)
    : NO_OFFSET

export const measureSlides = (track: HTMLElement): SlidesMeasurement => {
  const { children } = track
  const positions: number[] = []
  const sizes: number[] = []

  for (let index = 0; index < children.length; index += 1) {
    const slide = children[index] as HTMLElement

    positions.push(slide.offsetLeft)
    sizes.push(slide.offsetWidth)
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

const getStride = (
  { positions, loopSize }: SlidesGeometry,
  index: number
): number => {
  const next = index + ONE_STEP

  if (next < positions.length) return positions[next] - positions[index]

  return loopSize - positions[index]
}

const toSnap = (position: number): number => -position || INITIAL_TRANSFORM

export const toSnaps = ({
  positions,
  contentSize,
  viewportWidth,
  loop
}: SnapsFromPositions): number[] => {
  if (!positions.length) return []

  if (loop) return positions.map(toSnap)

  const maxScroll = Math.min(viewportWidth - contentSize, INITIAL_TRANSFORM)

  return positions.reduce<number[]>((snaps, position) => {
    const snap = Math.max(toSnap(position), maxScroll)
    const previous = snaps[snaps.length - 1]

    if (snaps.length && Math.abs(previous - snap) < SNAP_TOLERANCE) return snaps

    return [...snaps, snap]
  }, [])
}

export const findNearestSnap = (transform: number, snaps: number[]): number => {
  let nearest = 0
  let shortest = Infinity

  snaps.forEach((snap, index) => {
    const distance = Math.abs(snap - transform)

    if (distance >= shortest) return

    shortest = distance
    nearest = index
  })

  return nearest
}

export const getSnapIndex = (
  transform: number,
  { snaps, loopSize }: SlidesGeometry,
  loop: boolean
): number => {
  if (!snaps.length) return 0

  if (!loop) return findNearestSnap(transform, snaps)

  const scrolled = normalizeIndex(-transform, loopSize)

  return findNearestSnap(-scrolled, [...snaps, -loopSize]) % snaps.length
}

export const clampToSnaps = (
  transform: number,
  { snaps }: SlidesGeometry,
  loop: boolean
): number => {
  if (loop || !snaps.length) return transform

  return clamp(transform, snaps[snaps.length - 1], INITIAL_TRANSFORM)
}

export const getStepTarget = (
  transform: number,
  geometry: SlidesGeometry,
  loop: boolean,
  step: number
): number => {
  const { snaps } = geometry

  if (!snaps.length) return transform

  const current = getSnapIndex(transform, geometry, loop)

  if (!loop) {
    return snaps[clamp(current + step, 0, snaps.length - ONE_STEP)]
  }

  if (!step) return transform

  const leaving = step > 0 ? current : normalizeIndex(current - 1, snaps.length)
  const stride = getStride(geometry, leaving)

  return transform - step * stride
}

export const getScrollToTarget = (
  transform: number,
  geometry: SlidesGeometry,
  loop: boolean,
  index: number
): number => {
  const { snaps, positions, loopSize } = geometry

  if (!snaps.length) return transform

  if (!loop) return snaps[clamp(index, 0, snaps.length - ONE_STEP)]

  const scrolled = normalizeIndex(-transform, loopSize)
  const distance = positions[normalizeIndex(index, positions.length)] - scrolled
  const half = loopSize * HALF

  const shortest =
    distance > half
      ? distance - loopSize
      : distance < -half
        ? distance + loopSize
        : distance

  return transform - shortest
}

export const getMomentumSnap = ({
  transform,
  velocity,
  startTransform,
  geometry,
  loop,
  dragFree
}: MomentumSnapType): number => {
  const projected = transform + velocity * MOMENTUM_DECAY_TIME

  if (dragFree) return projected

  const startIndex = getSnapIndex(startTransform, geometry, loop)
  const yardstick = geometry.sizes[startIndex] || ONE_STEP
  const steps = clamp(
    Math.round((startTransform - projected) / yardstick),
    -ONE_STEP,
    ONE_STEP
  )

  return getStepTarget(startTransform, geometry, loop, steps)
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
