import {
  HALF,
  INITIAL_TRANSFORM,
  MOMENTUM_DECAY_TIME,
  NO_OFFSET,
  ONE_STEP
} from '../constants'
import { MomentumSnapType, SlidesGeometry, SnapsFromPositions } from '../types'
import { clamp, normalizeIndex } from '../helpers'

export const EMPTY_GEOMETRY: SlidesGeometry = {
  positions: [],
  sizes: [],
  snaps: [],
  contentSize: 0
}

export const measureSlides = (
  track: HTMLElement,
  viewportWidth: number,
  loop: boolean
): SlidesGeometry => {
  const { children } = track
  const positions: number[] = []
  const sizes: number[] = []

  for (let index = 0; index < children.length; index += 1) {
    const slide = children[index] as HTMLElement

    positions.push(slide.offsetLeft)
    sizes.push(slide.offsetWidth)
  }

  if (!positions.length) return EMPTY_GEOMETRY

  const origin = positions[0]
  const offsets = positions.map((position) => position - origin)
  const contentSize = offsets[offsets.length - 1] + sizes[sizes.length - 1]

  return {
    positions: offsets,
    sizes,
    contentSize,
    snaps: toSnaps({
      positions: offsets,
      sizes,
      contentSize,
      viewportWidth,
      loop
    })
  }
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

    if (snaps[snaps.length - 1] === snap) return snaps

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
  { snaps, contentSize }: SlidesGeometry,
  loop: boolean
): number => {
  if (!snaps.length) return 0

  if (!loop) return findNearestSnap(transform, snaps)

  const scrolled = normalizeIndex(-transform, contentSize)

  return findNearestSnap(-scrolled, [...snaps, -contentSize]) % snaps.length
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
  const { snaps, sizes } = geometry

  if (!snaps.length) return transform

  const current = getSnapIndex(transform, geometry, loop)

  if (!loop) {
    return snaps[clamp(current + step, 0, snaps.length - ONE_STEP)]
  }

  if (!step) return transform

  const leaving = step > 0 ? current : normalizeIndex(current - 1, snaps.length)

  return transform - step * sizes[leaving]
}

export const getScrollToTarget = (
  transform: number,
  geometry: SlidesGeometry,
  loop: boolean,
  index: number
): number => {
  const { snaps, positions, contentSize } = geometry

  if (!snaps.length) return transform

  if (!loop) return snaps[clamp(index, 0, snaps.length - ONE_STEP)]

  const scrolled = normalizeIndex(-transform, contentSize)
  const distance = positions[normalizeIndex(index, positions.length)] - scrolled
  const half = contentSize * HALF

  const shortest =
    distance > half
      ? distance - contentSize
      : distance < -half
        ? distance + contentSize
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
  { positions, sizes, contentSize }: SlidesGeometry
): number => {
  if (contentSize <= 0 || !positions.length) return NO_OFFSET

  const position = positions[index] + transform
  const laps = Math.floor((position + sizes[index]) / contentSize)

  return laps ? -laps * contentSize : NO_OFFSET
}
