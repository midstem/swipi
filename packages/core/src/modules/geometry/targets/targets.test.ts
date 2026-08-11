import { describe, expect, test } from 'vitest'
import { getStepTarget } from '.'
import { getSlideLap } from '../slides'
import { getSnapIndex, toSnaps } from '../snaps'

describe('loop period with a gap between slides', () => {
  const withGap = (count: number, width: number, gap: number) => {
    const positions = Array.from({ length: count }, (_, i) => i * (width + gap))
    const sizes = Array.from({ length: count }, () => width)
    const contentSize = positions[count - 1] + width

    return {
      positions,
      sizes,
      contentSize,
      loopSize: contentSize + gap,
      snaps: toSnaps({
        positions,
        sizes,
        contentSize,
        viewportWidth: width,
        loop: true
      })
    }
  }

  const geometry = withGap(5, 300, 20)

  test('should repeat over the gap as well as the slides', () => {
    expect(geometry.contentSize).toBe(1580)
    expect(geometry.loopSize).toBe(1600)
  })

  test('should land back on the first slide after a full lap', () => {
    expect(getSnapIndex(-geometry.loopSize, geometry, true)).toBe(0)
    expect(getSlideLap(0, -geometry.loopSize, geometry)).toBe(geometry.loopSize)
  })

  test('should step by the slide plus its gap', () => {
    expect(getStepTarget(0, geometry, true, 1)).toBe(-320)
    expect(getStepTarget(-320, geometry, true, 1)).toBe(-640)
  })

  test('should return to the origin after stepping through every slide', () => {
    const transform = geometry.snaps.reduce(
      (position) => getStepTarget(position, geometry, true, 1),
      0
    )

    expect(transform).toBe(-geometry.loopSize)
  })
})
