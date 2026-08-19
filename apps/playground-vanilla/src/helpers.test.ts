import { describe, expect, it } from 'vitest'
import {
  DEFAULT_STATE,
  getSlideStyle,
  getViewportStyle
} from '@swipi/playground-core'
import { applyStyle, element } from './dom'
import { toRange } from './helpers'

const applyTo = (style: Parameters<typeof applyStyle>[1]): HTMLElement => {
  const node = element('div')

  applyStyle(node, style)

  return node
}

describe('applyStyle', () => {
  it('gives a bare number the pixels the property expects', () => {
    const node = applyTo(getViewportStyle({ ...DEFAULT_STATE }, true))

    expect(node.style.height).toBe(`${DEFAULT_STATE.stageHeight}px`)
  })

  it('leaves a unitless property without a unit', () => {
    const node = applyTo(
      getSlideStyle({ ...DEFAULT_STATE, slidesAnimation: 'fade-in' }, true)
    )

    expect(node.style.opacity).toBe('1')
  })

  it('keeps a custom property and its calc as they are', () => {
    const node = applyTo({ '--pg-basis': 'calc(100% / 2)' })

    expect(node.style.getPropertyValue('--pg-basis')).toBe('calc(100% / 2)')
  })

  it('drops a property that has no value', () => {
    const node = applyTo({ height: undefined, opacity: 0 })

    expect(node.getAttribute('style')).toBe('opacity: 0;')
  })

  it('forgets the property the next style leaves out', () => {
    const node = applyTo({ height: 100 })

    applyStyle(node, { opacity: 1 })

    expect(node.style.height).toBe('')
    expect(node.style.opacity).toBe('1')
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
