import { generateArray } from './index'
import { describe, expect, test } from 'vitest'

describe('generateArray', () => {
  test('should generate an array of the requested length', () => {
    expect(generateArray(3)).toEqual(['', '', ''])
  })

  test('should generate an empty array for a zero count', () => {
    expect(generateArray(0)).toEqual([])
  })
})
