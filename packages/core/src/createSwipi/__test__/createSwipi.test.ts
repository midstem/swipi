import { afterEach, describe, expect, it, vi } from 'vitest'
import { SLIDE_WIDTH_VARIABLE, SLIDE_GAP_VARIABLE } from '#src/constants'
import { SwipiApi } from '#src/types'
import { createSwipi } from '../index'
import { MISSING_TRACK_ERROR } from '../constants'
import {
  getSlides,
  getTrack,
  getTrackOffset,
  mountViewport,
  SLIDE_WIDTH,
  SLIDES_COUNT
} from './dom'

const INSTANT = { animationSpeed: 0, slideWidth: SLIDE_WIDTH }

const AUTOPLAY_SPEED = 100

const ANIMATION_SPEED = 300

const HELD_BUTTON = 1

const NO_BUTTON = 0

let engine: SwipiApi | null = null
let viewport: HTMLElement

const mount = (options = {}): SwipiApi => {
  viewport = mountViewport()
  engine = createSwipi(viewport, { ...INSTANT, ...options })

  return engine
}

const pointer = (
  type: string,
  clientX: number,
  buttons = HELD_BUTTON
): void => {
  viewport.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      pointerId: 1,
      pointerType: 'mouse',
      button: type === 'pointermove' ? -1 : 0,
      buttons,
      clientX,
      clientY: 0
    })
  )
}

const swipe = (from: number, to: number): void => {
  pointer('pointerdown', from)
  pointer('pointermove', (from + to) / 2)
  pointer('pointermove', to)
  pointer('pointerup', to, NO_BUTTON)
}

afterEach(() => {
  engine?.destroy()
  engine = null
  document.body.innerHTML = ''
})

describe('createSwipi', () => {
  it('refuses a viewport without a track', () => {
    expect(() => createSwipi(document.createElement('div'))).toThrow(
      MISSING_TRACK_ERROR
    )
  })

  it('reports the measured slides in the first snapshot', () => {
    const swipi = mount()

    expect(swipi.getSnapshot()).toEqual({
      selectedIndex: 0,
      snapCount: SLIDES_COUNT,
      slidesCount: SLIDES_COUNT,
      hasOverflow: true,
      canScrollNext: true,
      canScrollPrev: false
    })
  })

  it('moves the track and notifies the subscribers on scrollNext', () => {
    const swipi = mount()

    const listener = vi.fn()
    swipi.subscribe(listener)

    swipi.scrollNext()

    expect(getTrackOffset(viewport)).toBe(-SLIDE_WIDTH)
    expect(listener).toHaveBeenCalled()
    expect(swipi.getSnapshot()).toMatchObject({
      selectedIndex: 1,
      canScrollPrev: true
    })
  })

  it('stops calling a listener once its unsubscribe has run', () => {
    const swipi = mount()

    const listener = vi.fn()
    swipi.subscribe(listener)()

    swipi.scrollNext()

    expect(listener).not.toHaveBeenCalled()
  })

  it('keeps advancing on its own while autoplay is on', () => {
    vi.useFakeTimers()

    try {
      const swipi = mount({ autoplay: true, autoplaySpeed: AUTOPLAY_SPEED })

      vi.advanceTimersByTime(AUTOPLAY_SPEED)

      expect(swipi.getSnapshot().selectedIndex).toBe(1)

      vi.advanceTimersByTime(AUTOPLAY_SPEED)

      expect(swipi.getSnapshot().selectedIndex).toBe(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it('lands on a slide when a drag interrupts the running animation', () => {
    vi.useFakeTimers()

    try {
      mount({ loop: true, animationSpeed: ANIMATION_SPEED })

      swipe(600, 300)
      vi.advanceTimersByTime(ANIMATION_SPEED / 3)

      const interrupted = getTrackOffset(viewport)

      swipe(300, 600)
      vi.advanceTimersByTime(ANIMATION_SPEED)

      expect(Math.abs(interrupted) % SLIDE_WIDTH).not.toBe(0)
      expect(Math.abs(getTrackOffset(viewport)) % SLIDE_WIDTH).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it('starts on the requested index', () => {
    const swipi = mount({ startIndex: 2 })

    expect(swipi.getSnapshot()).toMatchObject({ selectedIndex: 2 })
    expect(getTrackOffset(viewport)).toBe(-SLIDE_WIDTH * 2)
  })

  it('re-reads a geometry no observer has noticed on measure', () => {
    const swipi = mount()

    getTrack(viewport).style.setProperty(
      SLIDE_WIDTH_VARIABLE,
      `${SLIDE_WIDTH / 2}px`
    )

    expect(swipi.getSnapshot().snapCount).toBe(SLIDES_COUNT)

    swipi.measure()

    expect(swipi.getSnapshot().snapCount).toBe(SLIDES_COUNT - 1)
  })

  it('shifts the slides once the loop is on and clears them when it is off', () => {
    const swipi = mount()

    const lastSlide = getSlides(viewport)[SLIDES_COUNT - 1]

    swipi.update({ loop: true })
    swipi.scrollPrev()

    expect(lastSlide.style.transform).toMatch(/^translate3d\(-\d/)

    swipi.update({ loop: false })

    expect(lastSlide.style.transform).toBe('')
  })

  it('leaves the track untouched after destroy', () => {
    const swipi = mount({ spaceBetween: 10 })

    const track = getTrack(viewport)

    swipi.scrollNext()
    swipi.destroy()
    engine = null

    expect(track.style.transform).toBe('')
    expect(track.style.getPropertyValue(SLIDE_WIDTH_VARIABLE)).toBe('')
    expect(track.style.getPropertyValue(SLIDE_GAP_VARIABLE)).toBe('')
  })
})
