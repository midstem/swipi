import { afterEach, describe, expect, it, vi } from 'vitest'
import { SLIDE_WIDTH_VARIABLE, SLIDE_GAP_VARIABLE } from '../../constants'
import { SwipiApi } from '../../types'
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

let engine: SwipiApi | null = null
let viewport: HTMLElement

const mount = (options = {}): SwipiApi => {
  viewport = mountViewport()
  engine = createSwipi(viewport, { ...INSTANT, ...options })

  return engine
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
