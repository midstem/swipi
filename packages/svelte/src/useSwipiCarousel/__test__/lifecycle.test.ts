import { describe, expect, it, vi } from 'vitest'
import { triggerResize } from '../../test/setup'
import { mountCarousel, settle } from './carousel'
import { getSlides, getTrack, getTrackOffset } from './dom'

describe('useSwipiCarousel lifecycle', () => {
  it('picks up a slide the consumer renders after the first paint', async () => {
    const carousel = mountCarousel({ options: { slideWidth: 300 } })

    expect(carousel.readState()).toBe('0/2/4/false/true/true')

    carousel.setCount(6)

    await vi.waitFor(() =>
      expect(carousel.readState()).toBe('0/4/6/false/true/true')
    )
    expect(getSlides()).toHaveLength(6)
  })

  it('puts its transform back when a patch overwrites the track style', async () => {
    const carousel = mountCarousel({
      options: { slideWidth: 300, startIndex: 1 }
    })

    expect(getTrackOffset()).toBe(-300)

    carousel.setTrackStyle('opacity: 0.5')
    await settle()

    expect(getTrack().style.opacity).toBe('0.5')
    expect(getTrackOffset()).toBe(-300)
  })

  it('leaves a track it never moved alone', async () => {
    const carousel = mountCarousel({ options: { slideWidth: 300 } })

    carousel.setTrackStyle('opacity: 0.5')
    await settle()

    expect(getTrack().style.opacity).toBe('0.5')
    expect(getTrack().style.transform).toBe('')
  })

  it('hands the track back untouched when the action is destroyed', () => {
    const carousel = mountCarousel({ options: { loop: true } })

    const track = getTrack()
    const slides = getSlides()

    carousel.unmount()

    expect(track.style.transform).toBe('')
    expect(track.style.getPropertyValue('--swipi-slide-width')).toBe('')
    slides.forEach((slide) => expect(slide.style.transform).toBe(''))
  })

  it('reports an empty carousel once the action is destroyed', () => {
    const carousel = mountCarousel({ options: { slideWidth: 300 } })

    carousel.unmount()

    expect(carousel.readState()).toBe('0/0/0/false/false/false')
  })

  it('stops listening once the action is destroyed', () => {
    const onSelect = vi.fn()

    const carousel = mountCarousel({ options: { slideWidth: 300, onSelect } })

    carousel.unmount()
    onSelect.mockClear()

    triggerResize()

    expect(onSelect).not.toHaveBeenCalled()
  })
})
