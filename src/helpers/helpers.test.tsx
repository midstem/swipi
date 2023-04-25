import { generateUniqueID, cloneArray } from './index'
import { describe, expect, test } from 'vitest'

describe('generateUniqueID', () => {
  test('should generate a unique ID with length 36', () => {
    const id = generateUniqueID()
    expect(id).toHaveLength(36)
  })

  test('should generate unique IDs', () => {
    const id1 = generateUniqueID()
    const id2 = generateUniqueID()
    expect(id1).not.toEqual(id2)
  })
})

describe('cloneArray', () => {
  test('should clone the input array n times', () => {
    const inputArray = [{ a: 1 }, { b: 2 }, { c: 3 }]
    const clonedArray = cloneArray(inputArray, 3)
    expect(clonedArray).toHaveLength(9)
  })

  test('should maintain the order of elements in the cloned array', () => {
    const inputArray = [{ a: 1 }, { b: 2 }, { c: 3 }]
    const clonedArray = cloneArray(inputArray, 3)
    expect(clonedArray[0].a).toEqual(1)
    expect(clonedArray[1].b).toEqual(2)
    expect(clonedArray[2].c).toEqual(3)
    expect(clonedArray[3].a).toEqual(1)
    expect(clonedArray[4].b).toEqual(2)
    expect(clonedArray[5].c).toEqual(3)
    expect(clonedArray[6].a).toEqual(1)
    expect(clonedArray[7].b).toEqual(2)
    expect(clonedArray[8].c).toEqual(3)
  })
})
