import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_ANIMATION_SPEED, DEFAULT_AUTOPLAY_SPEED } from '#src/constants'
import { SwipiApi } from '#src/types'
import { createSwipi } from '../index'
import { DEFAULT_OPTIONS } from '../constants'
import { resolveOptions } from '../options'
import { getTrack, getTrackOffset, mountViewport, SLIDE_WIDTH } from './dom'

let engine: SwipiApi | null = null

afterEach(() => {
  engine?.destroy()
  engine = null
  document.body.innerHTML = ''
})

describe('resolveOptions', () => {
  it('falls back to the defaults when nothing is given', () => {
    expect(resolveOptions()).toMatchObject(DEFAULT_OPTIONS)
  })

  it('treats an explicit undefined as a missing option', () => {
    expect(
      resolveOptions({
        animationSpeed: undefined,
        autoplaySpeed: undefined,
        axis: undefined,
        loop: undefined
      })
    ).toMatchObject(DEFAULT_OPTIONS)
  })

  it('keeps the values that are given, including the falsy ones', () => {
    expect(resolveOptions({ animationSpeed: 0, startIndex: 0 })).toMatchObject({
      animationSpeed: 0,
      startIndex: 0
    })
  })

  it('leaves the options that have no default undefined', () => {
    expect(resolveOptions()).toMatchObject({
      slideWidth: undefined,
      spaceBetween: undefined,
      onChange: undefined,
      onSelect: undefined
    })
  })
})

describe('createSwipi options', () => {
  it('runs on the default speed when the option comes in as undefined', () => {
    vi.useFakeTimers()

    try {
      engine = createSwipi(mountViewport(), {
        slideWidth: SLIDE_WIDTH,
        animationSpeed: 0,
        autoplay: true,
        autoplaySpeed: undefined
      })

      vi.advanceTimersByTime(DEFAULT_AUTOPLAY_SPEED)

      expect(engine.getSnapshot().selectedIndex).toBe(1)
    } finally {
      vi.useRealTimers()
    }
  })

  it('restores a default an update clears with undefined', () => {
    vi.useFakeTimers()

    try {
      const viewport = mountViewport()

      engine = createSwipi(viewport, {
        slideWidth: SLIDE_WIDTH,
        animationSpeed: 1000
      })

      engine.update({ animationSpeed: undefined })
      engine.scrollNext()

      vi.advanceTimersByTime(DEFAULT_ANIMATION_SPEED * 2)

      expect(getTrack(viewport).style.transform).not.toContain('NaN')
      expect(getTrackOffset(viewport)).toBe(-SLIDE_WIDTH)
    } finally {
      vi.useRealTimers()
    }
  })
})
