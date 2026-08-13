import { afterEach, describe, expect, it } from 'vitest'
import { setAxis } from '@tools/tests'
import { SwipiApi, SwipiOptions } from '#src/types'
import { createSwipi } from '../index'
import {
  getSlides,
  getTrack,
  getTrackOffset,
  mountViewport,
  SLIDE_WIDTH,
  SLIDES_COUNT
} from './dom'

const VERTICAL: SwipiOptions = {
  axis: 'y',
  animationSpeed: 0,
  slideWidth: SLIDE_WIDTH
}

let engine: SwipiApi | null = null
let viewport: HTMLElement

const mount = (options: SwipiOptions = {}): SwipiApi => {
  viewport = mountViewport()
  engine = createSwipi(viewport, { ...VERTICAL, ...options })

  return engine
}

afterEach(() => {
  engine?.destroy()
  engine = null
  document.body.innerHTML = ''
})

describe('createSwipi on the vertical axis', () => {
  it('measures the slides along the height', () => {
    setAxis('y')

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

  it('moves the track down instead of sideways', () => {
    setAxis('y')

    const swipi = mount()

    swipi.scrollNext()

    expect(getTrack(viewport).style.transform).toBe(
      `translate3d(0, ${-SLIDE_WIDTH}px, 0)`
    )
    expect(getTrackOffset(viewport, 'y')).toBe(-SLIDE_WIDTH)
    expect(swipi.getSnapshot()).toMatchObject({ selectedIndex: 1 })
  })

  it('shifts the looped slides along the same axis', () => {
    setAxis('y')

    const swipi = mount({ loop: true })

    swipi.scrollPrev()

    expect(getSlides(viewport)[SLIDES_COUNT - 1].style.transform).toMatch(
      /^translate3d\(0, -\d/
    )
    expect(swipi.getSnapshot()).toMatchObject({
      selectedIndex: SLIDES_COUNT - 1
    })
  })

  it('re-measures and re-renders when the axis changes', () => {
    const swipi = createSwipi((viewport = mountViewport()), {
      animationSpeed: 0,
      slideWidth: SLIDE_WIDTH
    })

    engine = swipi

    swipi.scrollNext()

    expect(getTrackOffset(viewport)).toBe(-SLIDE_WIDTH)

    setAxis('y')
    swipi.update({ axis: 'y' })

    expect(getTrackOffset(viewport, 'y')).toBe(-SLIDE_WIDTH)
    expect(getTrack(viewport).style.transform).toBe(
      `translate3d(0, ${-SLIDE_WIDTH}px, 0)`
    )
    expect(swipi.getSnapshot()).toMatchObject({
      selectedIndex: 1,
      snapCount: SLIDES_COUNT
    })
  })

  it('drops the slide offsets left over from the other axis', () => {
    const swipi = createSwipi((viewport = mountViewport()), {
      animationSpeed: 0,
      slideWidth: SLIDE_WIDTH,
      loop: true
    })

    engine = swipi

    swipi.scrollPrev()

    const lastSlide = getSlides(viewport)[SLIDES_COUNT - 1]

    expect(lastSlide.style.transform).toMatch(/^translate3d\(-\d/)

    setAxis('y')
    swipi.update({ axis: 'y' })

    expect(lastSlide.style.transform).not.toMatch(/^translate3d\(-\d/)
  })
})
