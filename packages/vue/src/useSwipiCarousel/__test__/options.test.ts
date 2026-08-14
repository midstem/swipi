import { describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { mountCarousel, settle } from './carousel'
import { getTrack, readState } from './dom'

describe('useSwipiCarousel options', () => {
  it('writes the gap variable without a slide width beside it', async () => {
    await mountCarousel({
      options: { slideWidth: undefined, spaceBetween: 24 }
    })

    const style = getTrack().style

    expect(style.getPropertyValue('--swipi-slide-gap')).toBe('24px')
    expect(style.getPropertyValue('--swipi-slide-width')).toBe('')
  })

  it('takes a variable back when its option goes away', async () => {
    const carousel = await mountCarousel({ options: { spaceBetween: 24 } })

    expect(getTrack().style.getPropertyValue('--swipi-slide-gap')).toBe('24px')

    await carousel.setProps({ options: {} })

    expect(getTrack().style.getPropertyValue('--swipi-slide-gap')).toBe('')
  })

  it('reaches the engine when a single option flips', async () => {
    const carousel = await mountCarousel({ options: { slideWidth: 300 } })

    expect(readState()).toBe('0/2/4/false/true/true')

    await carousel.setProps({ options: { slideWidth: 300, loop: true } })

    expect(readState()).toBe('0/4/4/true/true/true')
  })

  it('follows a plain reactive object as closely as a ref', async () => {
    const options = reactive({ slideWidth: 300, loop: false })

    await mountCarousel({ options })

    expect(readState()).toBe('0/2/4/false/true/true')

    options.loop = true
    await settle()

    expect(readState()).toBe('0/4/4/true/true/true')
  })

  it('keeps the callbacks the consumer passes in', async () => {
    const onSelect = vi.fn()

    const carousel = await mountCarousel({
      options: { slideWidth: 300, onSelect }
    })

    onSelect.mockClear()

    await carousel.setProps({ options: { slideWidth: 600, onSelect } })

    expect(onSelect).toHaveBeenCalled()
  })
})
