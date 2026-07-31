import { describe, expect, test } from 'vitest'
import {
  clampToSnaps,
  getSlideLap,
  getSnapIndex,
  toSnaps,
  EMPTY_GEOMETRY
} from '.'
import { SlidesGeometry } from '../types'

const build = (sizes: number[], viewportWidth: number, loop = false) => {
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
    snaps: toSnaps({ positions, sizes, contentSize, viewportWidth, loop })
  }
}

describe('toSnaps with equal slides', () => {
  test('should snap to every slide when one is visible', () => {
    expect(build([300, 300, 300], 300).snaps).toEqual([0, -300, -600])
  })

  test('should stop where the content ends when several are visible', () => {
    expect(build([300, 300, 300, 300, 300], 900).snaps).toEqual([0, -300, -600])
  })

  test('should offer a single snap when everything fits', () => {
    expect(build([300, 300], 900).snaps).toEqual([0])
  })

  test('should snap to every slide in loop mode regardless of the viewport', () => {
    expect(build([300, 300, 300, 300, 300], 900, true).snaps).toEqual([
      0, -300, -600, -900, -1200
    ])
  })
})

describe('toSnaps with uneven slides', () => {
  test('should follow the real slide positions', () => {
    expect(build([200, 500, 100, 400], 400).snaps).toEqual([
      0, -200, -700, -800
    ])
  })

  test('should collapse the snaps that would scroll past the end', () => {
    expect(build([200, 500, 100, 400], 900).snaps).toEqual([0, -200, -300])
  })
})

describe('getSnapIndex', () => {
  const geometry = build([200, 500, 100, 400], 400)

  test('should pick the snap the track is resting on', () => {
    expect(getSnapIndex(-200, geometry, false)).toBe(1)
    expect(getSnapIndex(-700, geometry, false)).toBe(2)
  })

  test('should pick the closest snap while dragging between two', () => {
    expect(getSnapIndex(-260, geometry, false)).toBe(1)
    expect(getSnapIndex(-640, geometry, false)).toBe(2)
  })

  test('should return the first snap when there is no geometry yet', () => {
    expect(getSnapIndex(-500, EMPTY_GEOMETRY, false)).toBe(0)
  })
})

describe('getSnapIndex in loop mode', () => {
  const geometry = build([300, 300, 300, 300], 300, true)

  test('should wrap an offset beyond the content', () => {
    expect(getSnapIndex(-1500, geometry, true)).toBe(1)
  })

  test('should wrap a positive offset back to the end', () => {
    expect(getSnapIndex(300, geometry, true)).toBe(3)
  })

  test('should treat a full lap as the first slide', () => {
    expect(getSnapIndex(-1200, geometry, true)).toBe(0)
  })
})

describe('clampToSnaps', () => {
  const geometry = build([300, 300, 300, 300, 300], 900)

  test('should keep the track between the first and the last snap', () => {
    expect(clampToSnaps(-5000, geometry, false)).toBe(-600)
    expect(clampToSnaps(200, geometry, false)).toBe(0)
  })

  test('should leave the offset untouched in loop mode', () => {
    expect(clampToSnaps(-5000, geometry, true)).toBe(-5000)
  })
})

describe('getSlideLap', () => {
  const geometry: SlidesGeometry = build([300, 300, 300, 300], 300, true)

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
