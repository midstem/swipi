import { describe, expect, test } from 'vitest'
import { getSlideLap } from '.'
import { build } from '../__test__/build'

describe('getSlideLap', () => {
  const geometry = build([300, 300, 300, 300], 300, true)

  test('should keep the trailing slide buffered before the first one', () => {
    expect(getSlideLap(3, 0, geometry)).toBe(-1200)
    expect(getSlideLap(0, 0, geometry)).toBe(0)
  })

  test('should move a slide that left on the left over to the right', () => {
    expect(getSlideLap(0, -600, geometry)).toBe(1200)
  })

  test('should shift by whole laps only', () => {
    geometry.positions.forEach((_, index) =>
      expect(getSlideLap(index, -3000, geometry) % geometry.contentSize).toBe(0)
    )
  })
})
