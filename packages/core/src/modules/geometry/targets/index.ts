import { ONE_STEP } from '#src/constants'
import { clamp, normalizeIndex } from '#src/modules/math'
import { SlidesGeometry } from '#src/types'
import { getSnapIndex } from '../snaps'
import { HALF, MOMENTUM_DECAY_TIME } from './constants'
import { getStride } from './helpers'
import { MomentumSnapType } from './types'

export * from './types'

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
