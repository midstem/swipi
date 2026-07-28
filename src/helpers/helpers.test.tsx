import { generateArray, returnTimeDifference } from './index'
import { describe, expect, test } from 'vitest'

describe('generateArray', () => {
  test('should generate an array of the requested length', () => {
    expect(generateArray(3)).toEqual(['', '', ''])
  })

  test('should generate an empty array for a zero count', () => {
    expect(generateArray(0)).toEqual([])
  })
})

describe('returnTimeDifference', () => {
  test('should return the absolute difference in milliseconds', () => {
    const first = new Date(1000)
    const second = new Date(1350)

    expect(returnTimeDifference(first, second)).toEqual(350)
    expect(returnTimeDifference(second, first)).toEqual(350)
  })
})
