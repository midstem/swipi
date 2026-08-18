import { describe, expect, it } from 'vitest'
import {
  DEFAULT_STATE,
  getSlideStyle,
  getViewportStyle
} from '@swipi/playground-core'
import { toRange, toStyle } from './helpers'

describe('toStyle', () => {
  it('gives a bare number the pixels the property expects', () => {
    expect(toStyle(getViewportStyle({ ...DEFAULT_STATE }, true))).toBe(
      `height: ${DEFAULT_STATE.stageHeight}px`
    )
  })

  it('leaves a unitless property without a unit', () => {
    const style = getSlideStyle(
      { ...DEFAULT_STATE, slidesAnimation: 'fade-in' },
      true
    )

    expect(toStyle(style)).toContain('opacity: 1')
    expect(toStyle(style)).not.toContain('opacity: 1px')
  })

  it('keeps a custom property and its calc as they are', () => {
    expect(toStyle({ '--pg-basis': 'calc(100% / 2)' })).toBe(
      '--pg-basis: calc(100% / 2)'
    )
  })

  it('drops a property that has no value', () => {
    expect(toStyle({ height: undefined, opacity: 0 })).toBe('opacity: 0')
  })

  it('writes nothing for an empty style', () => {
    expect(toStyle({})).toBe('')
  })
})

describe('toRange', () => {
  it('counts from zero up to the length it is given', () => {
    expect(toRange(3)).toEqual([0, 1, 2])
  })

  it('stays empty without a length', () => {
    expect(toRange(0)).toEqual([])
  })
})
