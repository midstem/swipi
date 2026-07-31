import { describe, expect, test, vi } from 'vitest'
import { MutableRefObject } from 'react'
import {
  returnSlideWidth,
  startAutoplay,
  hasSlidesOverflow,
  toCoreConfig,
  returnSlidesAnimation,
  isFadeInAnimation,
  normalizeIndex,
  getDragVelocity,
  getMomentumDuration
} from '.'
import {
  DEFAULT_SWIPI_WIDTH,
  MAX_DRAG_VELOCITY,
  MAX_MOMENTUM_DURATION,
  MIN_MOMENTUM_DURATION
} from '../constants'
import { SlidesAnimation, ValueOf } from '../../types'

describe('returnSlideWidth', () => {
  test('should return slide width based on visible slides count, current width and space between slides', () => {
    const slideWidth = returnSlideWidth({
      visibleCountSlides: 3,
      current: 120,
      spaceBetween: 20
    })
    expect(slideWidth).toEqual((120 + 20) / 3)
  })

  test('should return slide width with default current width when not provided', () => {
    const slideWidth = returnSlideWidth({
      visibleCountSlides: 3,
      spaceBetween: 20
    })
    expect(slideWidth).toEqual((DEFAULT_SWIPI_WIDTH + 20) / 3)
  })

  test('should fall back to the default width when the container is not measured yet', () => {
    const slideWidth = returnSlideWidth({
      visibleCountSlides: 2,
      current: 0,
      spaceBetween: 0
    })
    expect(slideWidth).toEqual(DEFAULT_SWIPI_WIDTH / 2)
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

describe('hasSlidesOverflow', () => {
  test('should return true if slides count is greater than visibleCountSlides', () => {
    expect(hasSlidesOverflow(3, 2)).toBe(true)
  })

  test('should return false if slides count is less than or equal to visibleCountSlides', () => {
    expect(hasSlidesOverflow(2, 2)).toBe(false)
  })
})

describe('returnSlidesAnimation', () => {
  test('should return fadeIn CSS properties when animation is SlidesAnimation.FADE_IN', () => {
    const animation: ValueOf<SlidesAnimation> = SlidesAnimation.FADE_IN
    const isVisible = true
    const fadeInStyles = returnSlidesAnimation(animation, isVisible)

    expect(fadeInStyles).toEqual({
      opacity: 1,
      transition: 'opacity 350ms cubic-bezier(0.25, 1, 0.5, 1) 0s'
    })
  })

  test('should return empty CSS properties when animation is not SlidesAnimation.FADE_IN', () => {
    //@ts-expect-error: For testing, we need something that is not in SlidesAnimation
    const animation: ValueOf<SlidesAnimation> = 'non-fade-in'
    const isVisible = true
    const emptyStyles = returnSlidesAnimation(animation, isVisible)

    expect(emptyStyles).toEqual({})
  })

  test('should reuse the same object for the default animation so slides can be memoized', () => {
    const animation: ValueOf<SlidesAnimation> = SlidesAnimation.DEFAULT

    expect(returnSlidesAnimation(animation, true)).toBe(
      returnSlidesAnimation(animation, false)
    )
  })

  test('should reuse one object per visibility state of the fade-in animation', () => {
    const animation: ValueOf<SlidesAnimation> = SlidesAnimation.FADE_IN

    expect(returnSlidesAnimation(animation, true)).toBe(
      returnSlidesAnimation(animation, true)
    )
    expect(returnSlidesAnimation(animation, false)).toBe(
      returnSlidesAnimation(animation, false)
    )
    expect(returnSlidesAnimation(animation, true)).not.toBe(
      returnSlidesAnimation(animation, false)
    )
  })
})

describe('isFadeInAnimation', () => {
  test('should return true if animation is SlidesAnimation.FADE_IN', () => {
    const animation: ValueOf<SlidesAnimation> = SlidesAnimation.FADE_IN
    expect(isFadeInAnimation(animation)).toBe(true)
  })

  test('should return false if animation is not SlidesAnimation.FADE_IN', () => {
    //@ts-expect-error: For testing, we need something that is not in SlidesAnimation
    const animation: ValueOf<SlidesAnimation> = 'something-for-test'
    expect(isFadeInAnimation(animation)).toBe(false)
  })
})

describe('toCoreConfig', () => {
  const config = [
    { maxWidth: 600, slidesNumber: 2, spaceBetween: 10, biasRight: true },
    { maxWidth: 900, slidesNumber: 4, spaceBetween: 20 }
  ]

  test('should keep the config untouched for the default animation', () => {
    expect(toCoreConfig(config, SlidesAnimation.DEFAULT)).toBe(config)
  })

  test('should collapse every breakpoint to a single slide for fade-in', () => {
    expect(toCoreConfig(config, SlidesAnimation.FADE_IN)).toEqual([
      { maxWidth: 600, slidesNumber: 1, spaceBetween: 10, biasRight: false },
      { maxWidth: 900, slidesNumber: 1, spaceBetween: 20, biasRight: false }
    ])
  })
})
