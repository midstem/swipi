import { describe, expect, test } from 'vitest'
import { getSlidePositions } from '.'

describe('getSlidePositions', () => {
  test('should keep the neighbours inside the list without a loop', () => {
    expect(getSlidePositions(0, 4, false)).toEqual({
      prev: 0,
      current: 0,
      next: 1
    })
    expect(getSlidePositions(3, 4, false)).toEqual({
      prev: 2,
      current: 3,
      next: 3
    })
  })

  test('should wrap the neighbours around the ends with a loop', () => {
    expect(getSlidePositions(0, 4, true)).toEqual({
      prev: 3,
      current: 0,
      next: 1
    })
    expect(getSlidePositions(3, 4, true)).toEqual({
      prev: 2,
      current: 3,
      next: 0
    })
  })
})
