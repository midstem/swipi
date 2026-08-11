import { INITIAL_TRANSFORM } from '../../../constants'
import { clamp, normalizeIndex } from '../../math'
import { SlidesGeometry } from '../../../types'
import { SNAP_TOLERANCE } from './constants'
import { toSnap } from './helpers'
import { SnapsFromPositions } from './types'

export * from './types'

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
