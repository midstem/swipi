import { describe, expect, test, vi } from 'vitest'
import { MutableRefObject } from 'react'
import {
  returnSlideWidth,
  calculateSlideIndex,
  startAutoplay,
  isHideArrowsFn,
  returnSlidesAnimation,
  isFadeInAnimation,
  getSlideOffset,
  getShortestLoopStep,
  clampTransform,
  normalizeIndex,
  returnCountOfDots,
  getDragVelocity,
  getMomentumTarget,
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

describe('calculateSlideIndex', () => {
  const geometry = { slideWidth: 100, slidesCount: 5, lastIndex: 4 }

  test('should calculate the index from the track offset', () => {
    expect(
      calculateSlideIndex({ ...geometry, transform: -200, loop: false })
    ).toEqual(2)
  })

  test('should wrap an unbounded offset in loop mode', () => {
    expect(
      calculateSlideIndex({ ...geometry, transform: -700, loop: true })
    ).toEqual(2)
  })

  test('should wrap a positive offset in loop mode', () => {
    expect(
      calculateSlideIndex({ ...geometry, transform: 100, loop: true })
    ).toEqual(4)
  })

  test('should clamp the index to the bounds when the loop is off', () => {
    expect(
      calculateSlideIndex({ ...geometry, transform: -900, loop: false })
    ).toEqual(4)
    expect(
      calculateSlideIndex({ ...geometry, transform: 300, loop: false })
    ).toEqual(0)
  })
})

describe('clampTransform', () => {
  const geometry = { slideWidth: 100, lastIndex: 3 }

  test('should keep the track between the first and the last slide', () => {
    expect(
      clampTransform({ ...geometry, transform: -500, loop: false })
    ).toEqual(-300)
    expect(clampTransform({ ...geometry, transform: 50, loop: false })).toEqual(
      0
    )
  })

  test('should leave the offset untouched in loop mode', () => {
    expect(
      clampTransform({ ...geometry, transform: -500, loop: true })
    ).toEqual(-500)
  })
})

describe('getSlideOffset', () => {
  const geometry = { slideWidth: 100, slidesCount: 4 }

  const getOffsets = (transform: number, loop: boolean): number[] =>
    Array.from({ length: geometry.slidesCount }, (_, index) =>
      getSlideOffset({ ...geometry, index, transform, loop })
    )

  test('should not shift any slide when the loop is off', () => {
    expect(getOffsets(-300, false)).toEqual([0, 0, 0, 0])
  })

  test('should keep the last slide buffered on the left of the first one', () => {
    const contentSize = geometry.slidesCount * geometry.slideWidth

    expect(getOffsets(0, true)).toEqual([0, 0, 0, -contentSize])
  })

  test('should move slides that left on the left side to the right side', () => {
    const contentSize = geometry.slidesCount * geometry.slideWidth

    expect(getOffsets(-200, true)).toEqual([contentSize, 0, 0, 0])
  })

  test('should shift a slide by whole laps only', () => {
    const contentSize = geometry.slidesCount * geometry.slideWidth

    getOffsets(-1000, true).forEach((offset) =>
      expect(offset % contentSize).toEqual(0)
    )
  })

  test('should place every slide in a distinct visible position', () => {
    const positions = getOffsets(-1000, true).map(
      (offset, index) => index * geometry.slideWidth - 1000 + offset
    )

    expect([...positions].sort((a, b) => a - b)).toEqual([-100, 0, 100, 200])
  })
})

describe('getShortestLoopStep', () => {
  test('should go forward when the target is ahead', () => {
    expect(getShortestLoopStep(0, 2, 6)).toEqual(2)
  })

  test('should go backward when wrapping around is shorter', () => {
    expect(getShortestLoopStep(0, 5, 6)).toEqual(-1)
  })

  test('should stay in place for the current slide', () => {
    expect(getShortestLoopStep(3, 3, 6)).toEqual(0)
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

describe('getMomentumTarget', () => {
  const geometry = { slideWidth: 100, dragFree: false, startTransform: -100 }

  test('should stay on the current slide when the pointer stopped', () => {
    expect(
      getMomentumTarget({ ...geometry, transform: -120, velocity: 0 })
    ).toEqual(-100)
  })

  test('should carry a flick over to the next slide', () => {
    expect(
      getMomentumTarget({ ...geometry, transform: -120, velocity: -1 })
    ).toEqual(-200)
  })

  test('should never skip a slide, however hard the flick is', () => {
    expect(
      getMomentumTarget({ ...geometry, transform: -120, velocity: -10 })
    ).toEqual(-200)
    expect(
      getMomentumTarget({ ...geometry, transform: -120, velocity: 10 })
    ).toEqual(0)
  })

  test('should move by one slide however far the gesture was dragged', () => {
    expect(
      getMomentumTarget({
        ...geometry,
        startTransform: 0,
        transform: -258,
        velocity: -1
      })
    ).toEqual(-100)
  })

  test('should advance on a short but fast flick', () => {
    expect(
      getMomentumTarget({
        ...geometry,
        startTransform: 0,
        transform: -5,
        velocity: -1
      })
    ).toEqual(-100)
  })

  test('should snap back when the drag did not reach the halfway point', () => {
    expect(
      getMomentumTarget({
        ...geometry,
        startTransform: 0,
        transform: -30,
        velocity: 0
      })
    ).toEqual(0)
  })

  test('should keep the projected position with dragFree', () => {
    expect(
      getMomentumTarget({
        ...geometry,
        dragFree: true,
        transform: -120,
        velocity: -1
      })
    ).toEqual(-370)
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

describe('returnCountOfDots', () => {
  test('should return one dot when all slides are visible', () => {
    expect(returnCountOfDots(3, 3, false)).toEqual(1)
  })

  test('should return a dot per slide in loop mode', () => {
    expect(returnCountOfDots(5, 2, true)).toEqual(5)
  })

  test('should return the count of snap positions without a loop', () => {
    expect(returnCountOfDots(5, 2, false)).toEqual(4)
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

describe('isHideArrowsFn', () => {
  test('should return true if slides count is greater than visibleCountSlides', () => {
    expect(isHideArrowsFn(3, 2)).toBe(true)
  })

  test('should return false if slides count is less than or equal to visibleCountSlides', () => {
    expect(isHideArrowsFn(2, 2)).toBe(false)
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
