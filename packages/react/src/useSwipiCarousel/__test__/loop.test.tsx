import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { backButton, Carousel, forwardButton } from './carousel'
import { getDot, getSlides, getTrackOffset, lastOf, readState } from './dom'

describe('useSwipiCarousel loop', () => {
  it('wraps to the first slide when scrolling next from the last', async () => {
    render(<Carousel loop />)

    fireEvent.click(getDot(3))
    fireEvent.click(forwardButton())

    await waitFor(() => expect(readState()).toBe('0/4/4/true/true/true'))
  })

  it('wraps to the last slide when scrolling prev from the first', async () => {
    render(<Carousel loop />)

    fireEvent.click(backButton())

    await waitFor(() => expect(readState()).toBe('3/4/4/true/true/true'))
  })

  it('takes the shortest way around to a snap behind the start', async () => {
    render(<Carousel loop />)

    fireEvent.click(getDot(3))

    expect(readState()).toBe('3/4/4/true/true/true')

    await waitFor(() => expect(getTrackOffset()).toBeGreaterThan(0))
  })

  it('renders a single DOM node per slide', () => {
    render(<Carousel loop />)

    expect(getSlides()).toHaveLength(4)
    expect(screen.getAllByText('1')).toHaveLength(1)
  })

  it('keeps the trailing slide shifted behind the first one', () => {
    render(<Carousel loop />)

    const [first, second, third, last] = getSlides()

    expect(first.style.transform).toBe('')
    expect(second.style.transform).toBe('')
    expect(third.style.transform).toBe('')
    expect(last.style.transform).toBe('translate3d(-3600px, 0, 0)')
  })

  it('does not shift any slide when the loop is off', () => {
    render(<Carousel />)

    getSlides().forEach((slide) => expect(slide.style.transform).toBe(''))
  })

  it('clears the shifted slides when the loop is turned off', () => {
    const { rerender } = render(<Carousel loop />)

    expect(lastOf(getSlides()).style.transform).toMatch(/^translate3d\(-\d/)

    rerender(<Carousel />)

    getSlides().forEach((slide) => expect(slide.style.transform).toBe(''))
  })

  it('does not loop when every slide is already visible', () => {
    render(<Carousel loop slideWidth={100} />)

    expect(readState()).toBe('0/1/4/false/false/false')
    getSlides().forEach((slide) => expect(slide.style.transform).toBe(''))
  })

  it('keeps the loop offsets in sync after the slides are re-measured', () => {
    const { rerender } = render(<Carousel loop />)

    rerender(<Carousel loop slideWidth={600} />)

    expect(lastOf(getSlides()).style.transform).toBe(
      'translate3d(-2400px, 0, 0)'
    )
  })
})
