import { ONE_STEP } from '../../../constants'
import { SlidesGeometry } from '../../../types'

export const getStride = (
  { positions, loopSize }: SlidesGeometry,
  index: number
): number => {
  const next = index + ONE_STEP

  if (next < positions.length) return positions[next] - positions[index]

  return loopSize - positions[index]
}
