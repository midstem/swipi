import { SlidesGeometry } from '../../types'
import { toSnaps } from '../snaps'

export const build = (
  sizes: number[],
  viewportWidth: number,
  loop = false
): SlidesGeometry => {
  const positions = sizes.reduce<number[]>(
    (acc, _size, index) => [
      ...acc,
      index ? acc[index - 1] + sizes[index - 1] : 0
    ],
    []
  )
  const contentSize = positions[positions.length - 1] + sizes[sizes.length - 1]

  return {
    positions,
    sizes,
    contentSize,
    loopSize: contentSize,
    snaps: toSnaps({ positions, sizes, contentSize, viewportWidth, loop })
  }
}
