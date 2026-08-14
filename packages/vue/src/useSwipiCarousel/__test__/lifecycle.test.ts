import { describe, expect, it, vi } from 'vitest'
import { triggerResize } from '../../test/setup'
import { mountCarousel } from './carousel'
import { getSlides, getTrack, getTrackOffset, readState } from './dom'

describe('useSwipiCarousel lifecycle', () => {
  it('picks up a slide the consumer renders after the first paint', async () => {
    const wrapper = await mountCarousel({ options: { slideWidth: 300 } })

    expect(readState()).toBe('0/2/4/false/true/true')

    await wrapper.setProps({ count: 6 })

    await vi.waitFor(() => expect(readState()).toBe('0/4/6/false/true/true'))
    expect(getSlides()).toHaveLength(6)
  })

  it('puts its transform back when a patch overwrites the track style', async () => {
    const wrapper = await mountCarousel({
      options: { slideWidth: 300, startIndex: 1 }
    })

    expect(getTrackOffset()).toBe(-300)

    await wrapper.setProps({ trackStyle: 'opacity: 0.5' })

    expect(getTrack().style.opacity).toBe('0.5')
    expect(getTrackOffset()).toBe(-300)
  })

  it('keeps one engine across patches that do not touch the options', async () => {
    const onSelect = vi.fn()

    const wrapper = await mountCarousel({ options: { onSelect } })

    onSelect.mockClear()

    await wrapper.setProps({ label: 'first' })
    await wrapper.setProps({ label: 'second' })
    await wrapper.setProps({ label: 'third' })

    expect(onSelect).not.toHaveBeenCalled()
    expect(readState()).toBe('0/4/4/false/true/true')
  })

  it('hands the track back untouched when the component goes away', async () => {
    const wrapper = await mountCarousel({ options: { loop: true } })

    const track = getTrack()
    const slides = getSlides()

    wrapper.unmount()

    expect(track.style.transform).toBe('')
    expect(track.style.getPropertyValue('--swipi-slide-width')).toBe('')
    slides.forEach((slide) => expect(slide.style.transform).toBe(''))
  })

  it('stops listening once the component is gone', async () => {
    const onSelect = vi.fn()

    const wrapper = await mountCarousel({
      options: { slideWidth: 300, onSelect }
    })

    wrapper.unmount()
    onSelect.mockClear()

    triggerResize()

    expect(onSelect).not.toHaveBeenCalled()
  })
})
