import { describe, expect, test } from 'vitest'
import { getDotsLeftOffsets, getWidthDifference } from '.'

describe('getWidthDifference', () => {
  test('should calculate the width difference', () => {
    expect(getWidthDifference(20, 10)).toBe(5)
    expect(getWidthDifference(30, 40)).toBe(-5)
  })
})

describe('getDotsLeftOffsets', () => {
  test('should get the left offsets of the dots', () => {
    const dotsRef = {
      current: [
        { offsetLeft: 10 } as HTMLDivElement,
        { offsetLeft: 20 } as HTMLDivElement,
        { offsetLeft: 30 } as HTMLDivElement
      ]
    }

    const expectedResult = [{ left: 10 }, { left: 20 }, { left: 30 }]

    expect(getDotsLeftOffsets(dotsRef)).toEqual(expectedResult)
  })

  test('should handle null dot elements', () => {
    const dotsRef = {
      current: [
        { offsetLeft: 10 } as HTMLDivElement,
        null,
        { offsetLeft: 30 } as HTMLDivElement
      ]
    }

    const expectedResult = [{ left: 10 }, { left: 0 }, { left: 30 }]

    expect(getDotsLeftOffsets(dotsRef)).toEqual(expectedResult)
  })

  test('should handle undefined dotsRef.current', () => {
    const dotsRef = {
      current: undefined
    }
    //@ts-expect-error: For testing, we need current: undefiend
    expect(getDotsLeftOffsets(dotsRef)).toBeUndefined()
  })
})
