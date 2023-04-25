import { describe, expect, test, vi } from 'vitest'
import { MutableRefObject } from 'react'
import {
  addUniqueId,
  returnSlideWidth,
  calculateSlideIndex,
  startAutoplay,
  isButtonFn,
  setKeyToChildren,
  returnSlidesAnimation,
  isFadeInAnimation
} from '.'
import { defaultSliderWidth } from '../constants'
import { SlidesAnimation, ValueOf } from '../../types'

describe('addUniqueId', () => {
  test('should add unique IDs to slides', () => {
    const slides = [<div />, <div />]
    const uniqueSlides = addUniqueId(slides)
    expect(uniqueSlides[0].id).not.toBeUndefined()
    expect(uniqueSlides[1].id).not.toBeUndefined()
    expect(uniqueSlides[0].id).not.toEqual(uniqueSlides[1].id)
  })
})

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
    expect(slideWidth).toEqual((defaultSliderWidth + 20) / 3)
  })
})

describe('calculateSlideIndex', () => {
  test('should calculate slide index based on transform, slide width, and children', () => {
    const slideIndex = calculateSlideIndex(100, 20, [<div />, <div />])
    expect(slideIndex).toEqual(1)
  })
})

describe('startAutoplay', () => {
  test('should start autoplay', () => {
    vi.useFakeTimers()
    const timeout: MutableRefObject<NodeJS.Timeout | undefined> = {
      current: undefined
    }
    const nextImg = vi.fn()
    const autoplaySpeed = 3000

    startAutoplay(autoplaySpeed, timeout, nextImg)
    vi.advanceTimersByTime(autoplaySpeed)

    expect(nextImg).toHaveBeenCalledTimes(1)
  })
})

describe('isButtonFn', () => {
  test('should return true if children length is greater than visibleCountSlides', () => {
    const children = [<div />, <div />, <div />]
    const visibleCountSlides = 2
    expect(isButtonFn(children, visibleCountSlides)).toBe(true)
  })

  test('should return false if children length is less than or equal to visibleCountSlides', () => {
    const children = [<div />, <div />]
    const visibleCountSlides = 2
    expect(isButtonFn(children, visibleCountSlides)).toBe(false)
  })
})

describe('setKeyToChildren', () => {
  test('should set keys to children based on their index', () => {
    const children = [<div />, <div />]
    const keyedChildren = setKeyToChildren(children)
    expect(keyedChildren[0].key).toEqual(0)
    expect(keyedChildren[1].key).toEqual(1)
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
