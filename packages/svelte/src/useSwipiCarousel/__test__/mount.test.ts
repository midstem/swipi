import { describe, expect, it } from 'vitest'
import { setContainerWidth, triggerResize } from '../../test/setup'
import { mountCarousel, settle } from './carousel'
import { getSlides, getTrack, getViewport } from './dom'

describe('useSwipiCarousel mounting', () => {
  it('drives the track it is handed through the action', () => {
    const carousel = mountCarousel()

    expect(getTrack().style.getPropertyValue('--swipi-slide-width')).toBe(
      '900px'
    )
    expect(carousel.readState()).toBe('0/4/4/false/true/true')
  })

  it('adds nothing of its own to the elements it is given', () => {
    mountCarousel()

    expect(getViewport().attributes).toHaveLength(1)
    expect(getTrack().attributes).toHaveLength(2)
  })

  it('counts the slides that are actually in the track', () => {
    const carousel = mountCarousel({ count: 6, options: { slideWidth: 300 } })

    expect(getSlides()).toHaveLength(6)
    expect(carousel.readState()).toBe('0/4/6/false/true/true')
  })

  it('leaves the carousel alone when everything fits', () => {
    const carousel = mountCarousel({ options: { slideWidth: 100 } })

    expect(carousel.readState()).toBe('0/1/4/false/false/false')
  })

  it('re-counts the snaps when the viewport shrinks', async () => {
    const carousel = mountCarousel({ options: { slideWidth: 300 } })

    expect(carousel.readState()).toBe('0/2/4/false/true/true')

    setContainerWidth(600)
    triggerResize()
    await settle()

    expect(carousel.readState()).toBe('0/3/4/false/true/true')
  })

  it('hands the same reader to everyone who subscribes', () => {
    const carousel = mountCarousel({ options: { slideWidth: 300 } })

    expect(carousel.readCarousel().canScrollNext).toBe(true)
    expect(carousel.readCarousel().canScrollPrev).toBe(false)
  })
})
