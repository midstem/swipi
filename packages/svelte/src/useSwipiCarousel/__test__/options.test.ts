import { describe, expect, it, vi } from 'vitest'
import { writable } from 'svelte/store'
import { SwipiCarouselOptions } from '../types'
import { mountCarousel } from './carousel'
import { getTrack } from './dom'

describe('useSwipiCarousel options', () => {
  it('writes the gap variable without a slide width beside it', () => {
    mountCarousel({ options: { slideWidth: undefined, spaceBetween: 24 } })

    const style = getTrack().style

    expect(style.getPropertyValue('--swipi-slide-gap')).toBe('24px')
    expect(style.getPropertyValue('--swipi-slide-width')).toBe('')
  })

  it('takes a variable back when its option goes away', () => {
    const options = writable<SwipiCarouselOptions>({ spaceBetween: 24 })

    mountCarousel({ options })

    expect(getTrack().style.getPropertyValue('--swipi-slide-gap')).toBe('24px')

    options.set({})

    expect(getTrack().style.getPropertyValue('--swipi-slide-gap')).toBe('')
  })

  it('reaches the engine when a single option flips', () => {
    const options = writable<SwipiCarouselOptions>({ slideWidth: 300 })

    const carousel = mountCarousel({ options })

    expect(carousel.readState()).toBe('0/2/4/false/true/true')

    options.set({ slideWidth: 300, loop: true })

    expect(carousel.readState()).toBe('0/4/4/true/true/true')
  })

  it('reads a store that is already carrying a value', () => {
    const options = writable<SwipiCarouselOptions>({ slideWidth: 100 })

    const carousel = mountCarousel({ options })

    expect(carousel.readState()).toBe('0/1/4/false/false/false')
  })

  it('keeps the callbacks the consumer passes in', () => {
    const onSelect = vi.fn()
    const options = writable<SwipiCarouselOptions>({
      slideWidth: 300,
      onSelect
    })

    mountCarousel({ options })

    onSelect.mockClear()

    options.set({ slideWidth: 600, onSelect })

    expect(onSelect).toHaveBeenCalled()
  })

  it('stops following the store once the action is destroyed', () => {
    const options = writable<SwipiCarouselOptions>({ slideWidth: 300 })

    const carousel = mountCarousel({ options })

    carousel.unmount()

    expect(() => options.set({ slideWidth: 300, loop: true })).not.toThrow()
    expect(carousel.readState()).toBe('0/0/0/false/false/false')
  })
})
