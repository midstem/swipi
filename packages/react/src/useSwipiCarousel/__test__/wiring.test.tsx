import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Carousel } from './carousel'
import { getTrack, getViewport, readState } from './dom'

describe('useSwipiCarousel wiring', () => {
  it('finds the track as the only child of the viewport', () => {
    render(<Carousel />)

    expect(getTrack().style.getPropertyValue('--swipi-slide-width')).toBe(
      '900px'
    )
    expect(readState()).toBe('0/4/4/false/true/true')
  })

  it('adds nothing of its own to the elements it is given', () => {
    render(<Carousel />)

    expect(getViewport().attributes).toHaveLength(1)
    expect(getTrack().attributes).toHaveLength(2)
  })

  it('leaves the carousel alone when everything fits', () => {
    render(<Carousel slideWidth={100} />)

    expect(readState()).toBe('0/1/4/false/false/false')
  })

  it('writes the gap variable without a slide width beside it', () => {
    render(<Carousel slideWidth={undefined} spaceBetween={24} />)

    const style = getTrack().style

    expect(style.getPropertyValue('--swipi-slide-gap')).toBe('24px')
    expect(style.getPropertyValue('--swipi-slide-width')).toBe('')
  })

  it('takes a variable back when its option goes away', () => {
    const { rerender } = render(<Carousel spaceBetween={24} />)

    expect(getTrack().style.getPropertyValue('--swipi-slide-gap')).toBe('24px')

    rerender(<Carousel />)

    expect(getTrack().style.getPropertyValue('--swipi-slide-gap')).toBe('')
  })
})
