import { SlidesGeometry } from '#src/types'

export type MomentumSnapType = {
  transform: number
  velocity: number
  startTransform: number
  geometry: SlidesGeometry
  loop: boolean
  dragFree: boolean
}
