import { describe, expect, test } from 'vitest'
import { getDragVelocity, getMomentumDuration } from '.'
import {
  MAX_DRAG_VELOCITY,
  MAX_MOMENTUM_DURATION,
  MIN_MOMENTUM_DURATION
} from './constants'

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
