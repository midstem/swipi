import { describe, expect, it } from 'vitest'
import { setContainerWidth, triggerResize } from '../../test/setup'
import { mountCarousel, settle } from './carousel'
import { getSlides, getTrack, getViewport, readState } from './dom'

describe('useSwipiCarousel mounting', () => {
  it('drives the track it is handed through the function ref', async () => {
    await mountCarousel()

    expect(getTrack().style.getPropertyValue('--swipi-slide-width')).toBe(
      '900px'
    )
    expect(readState()).toBe('0/4/4/false/true/true')
  })

  it('adds nothing of its own to the elements it is given', async () => {
    await mountCarousel()

    expect(getViewport().attributes).toHaveLength(1)
    expect(getTrack().attributes).toHaveLength(2)
  })

  it('counts the slides that are actually in the track', async () => {
    await mountCarousel({ count: 6, options: { slideWidth: 300 } })

    expect(getSlides()).toHaveLength(6)
    expect(readState()).toBe('0/4/6/false/true/true')
  })

  it('leaves the carousel alone when everything fits', async () => {
    await mountCarousel({ options: { slideWidth: 100 } })

    expect(readState()).toBe('0/1/4/false/false/false')
  })

  it('re-counts the snaps when the viewport shrinks', async () => {
    await mountCarousel({ options: { slideWidth: 300 } })

    expect(readState()).toBe('0/2/4/false/true/true')

    setContainerWidth(600)
    triggerResize()
    await settle()

    expect(readState()).toBe('0/3/4/false/true/true')
  })
})
