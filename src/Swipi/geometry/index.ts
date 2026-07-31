import { INITIAL_TRANSFORM, NO_OFFSET } from '../constants'
import { SlidesGeometry, SnapsFromPositions } from '../types'
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
