import { describe, expect, test, vi } from 'vitest'
import { MutableRefObject } from 'react'
import {
  clamp,
  getDragVelocity,
  getMomentumDuration,
  getSlidePositions,
  normalizeIndex,
  startAutoplay
} from '.'
import {
  MAX_DRAG_VELOCITY,
  MAX_MOMENTUM_DURATION,
  MIN_MOMENTUM_DURATION
} from '../constants'

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

describe('getDragVelocity', () => {
  test('should return the speed of the pointer in px per ms', () => {
    expect(getDragVelocity({ distance: -60, duration: 30 })).toEqual(-2)
  })

  test('should cap an unrealistically fast sample', () => {
    expect(getDragVelocity({ distance: -500, duration: 1 })).toEqual(
      -MAX_DRAG_VELOCITY
    )
  })

  test('should survive two samples taken at the same moment', () => {
    expect(getDragVelocity({ distance: 10, duration: 0 })).toEqual(
      MAX_DRAG_VELOCITY
    )
  })
})

describe('getMomentumDuration', () => {
  const animationSpeed = 300

  test('should fall back to the configured speed without velocity', () => {
    expect(
      getMomentumDuration({ distance: -100, velocity: 0, animationSpeed })
    ).toEqual(animationSpeed)
  })

  test('should follow the distance and the release speed', () => {
    expect(
      getMomentumDuration({ distance: -300, velocity: -2, animationSpeed })
    ).toEqual(450)
  })

  test('should stay within the momentum bounds', () => {
    expect(
      getMomentumDuration({ distance: -10, velocity: -3, animationSpeed })
    ).toEqual(MIN_MOMENTUM_DURATION)
    expect(
      getMomentumDuration({ distance: -3000, velocity: -1, animationSpeed })
    ).toEqual(MAX_MOMENTUM_DURATION)
  })
})

describe('getSlidePositions', () => {
  test('should keep the neighbours inside the list without a loop', () => {
    expect(getSlidePositions(0, 4, false)).toEqual({
      prev: 1,
      current: 1,
      next: 2
    })
    expect(getSlidePositions(3, 4, false)).toEqual({
      prev: 3,
      current: 4,
      next: 4
    })
  })

  test('should wrap the neighbours around the ends with a loop', () => {
    expect(getSlidePositions(0, 4, true)).toEqual({
      prev: 4,
      current: 1,
      next: 2
    })
    expect(getSlidePositions(3, 4, true)).toEqual({
      prev: 3,
      current: 4,
      next: 1
    })
  })
})

describe('startAutoplay', () => {
  test('should start autoplay', () => {
    vi.useFakeTimers()
    const timeout: MutableRefObject<ReturnType<typeof setTimeout> | undefined> =
      {
        current: undefined
      }
    const nextImg = vi.fn()
    const autoplaySpeed = 3000

    startAutoplay(autoplaySpeed, timeout, nextImg)
    vi.advanceTimersByTime(autoplaySpeed)

    expect(nextImg).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
