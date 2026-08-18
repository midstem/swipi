import { describe, expect, it, vi } from 'vitest'
import { signal } from '@angular/core'
import { SwipiCarouselOptions } from '../types'
import { flush, mountCarousel } from './carousel'
import { getTrack } from './dom'

describe('useSwipiCarousel options', () => {
  it('writes the gap variable without a slide width beside it', () => {
    mountCarousel({ options: { slideWidth: undefined, spaceBetween: 24 } })

    const style = getTrack().style

    expect(style.getPropertyValue('--swipi-slide-gap')).toBe('24px')
    expect(style.getPropertyValue('--swipi-slide-width')).toBe('')
  })

  it('takes a variable back when its option goes away', () => {
    const options = signal<SwipiCarouselOptions>({ spaceBetween: 24 })

    mountCarousel({ options })

    expect(getTrack().style.getPropertyValue('--swipi-slide-gap')).toBe('24px')

    options.set({})
    flush()

    expect(getTrack().style.getPropertyValue('--swipi-slide-gap')).toBe('')
  })

  it('reaches the engine when a single option flips', () => {
    const options = signal<SwipiCarouselOptions>({ slideWidth: 300 })

    const carousel = mountCarousel({ options })

    expect(carousel.readState()).toBe('0/2/4/false/true/true')

    options.set({ slideWidth: 300, loop: true })
    flush()

    expect(carousel.readState()).toBe('0/4/4/true/true/true')
  })

  it('reads a signal that is already carrying a value', () => {
    const options = signal<SwipiCarouselOptions>({ slideWidth: 100 })

    const carousel = mountCarousel({ options })

    expect(carousel.readState()).toBe('0/1/4/false/false/false')
  })

  it('keeps the callbacks the consumer passes in', () => {
    const onSelect = vi.fn()
    const options = signal<SwipiCarouselOptions>({ slideWidth: 300, onSelect })

    mountCarousel({ options })

    onSelect.mockClear()

    options.set({ slideWidth: 600, onSelect })
    flush()

    expect(onSelect).toHaveBeenCalled()
  })

  it('stops following the signal once the ref is handed a null', () => {
    const options = signal<SwipiCarouselOptions>({ slideWidth: 300 })

    const carousel = mountCarousel({ options })

    carousel.detach()

    options.set({ slideWidth: 300, loop: true })

    expect(() => flush()).not.toThrow()
    expect(carousel.readState()).toBe('0/0/0/false/false/false')
  })

  it('leaves a plain object of options unread after the first measure', () => {
    const options: SwipiCarouselOptions = { slideWidth: 300 }

    const carousel = mountCarousel({ options })

    options.loop = true
    flush()

    expect(carousel.readState()).toBe('0/2/4/false/true/true')
  })
})
