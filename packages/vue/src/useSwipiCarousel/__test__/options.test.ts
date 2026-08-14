import { describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { Carousel, mountCarousel, settle } from './carousel'
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
    const wrapper = await mountCarousel({ options: { spaceBetween: 24 } })

    expect(getTrack().style.getPropertyValue('--swipi-slide-gap')).toBe('24px')

    await wrapper.setProps({ options: {} })

    expect(getTrack().style.getPropertyValue('--swipi-slide-gap')).toBe('')
  })

  it('reaches the engine when a single option flips', async () => {
    const wrapper = await mountCarousel({ options: { slideWidth: 300 } })

    expect(readState()).toBe('0/2/4/false/true/true')

    await wrapper.setProps({ options: { slideWidth: 300, loop: true } })

    expect(readState()).toBe('0/4/4/true/true/true')
  })

  it('follows a plain reactive object as closely as a ref', async () => {
    const options = reactive({ slideWidth: 300, loop: false })

    mount(Carousel, { props: { options }, attachTo: document.body })
    await settle()

    expect(readState()).toBe('0/2/4/false/true/true')

    options.loop = true
    await settle()

    expect(readState()).toBe('0/4/4/true/true/true')
  })

  it('keeps the callbacks the consumer passes in', async () => {
    const onSelect = vi.fn()

    const wrapper = await mountCarousel({
      options: { slideWidth: 300, onSelect }
    })

    onSelect.mockClear()

    await wrapper.setProps({ options: { slideWidth: 600, onSelect } })

    expect(onSelect).toHaveBeenCalled()
  })
})
