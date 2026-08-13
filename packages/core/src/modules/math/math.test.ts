import { describe, expect, test } from 'vitest'
import { clamp, normalizeIndex } from '.'

describe('clamp', () => {
  test('should keep a value inside the bounds', () => {
    expect(clamp(5, 0, 10)).toEqual(5)
    expect(clamp(-5, 0, 10)).toEqual(0)
    expect(clamp(15, 0, 10)).toEqual(10)
  })
})

describe('normalizeIndex', () => {
  test('should wrap negative indexes to the end of the list', () => {
    expect(normalizeIndex(-1, 5)).toEqual(4)
  })

  test('should wrap indexes beyond the list back to the start', () => {
    expect(normalizeIndex(6, 5)).toEqual(1)
  })
})
