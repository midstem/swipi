import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { setContainerWidth, triggerResize } from '../../test/setup'
import { Carousel, Host, rerenderButton } from './carousel'
import { addSlide, getDot, getSlides, getTrackOffset, readState } from './dom'

describe('useSwipiCarousel slide discovery', () => {
  it('counts the slides that are actually in the track', () => {
    render(<Carousel count={6} slideWidth={300} />)

    expect(getSlides()).toHaveLength(6)
    expect(readState()).toBe('0/4/6/false/true/true')
  })

  it('picks up a slide inserted outside a react render', async () => {
    render(<Carousel />)

    expect(readState()).toBe('0/4/4/false/true/true')

    act(addSlide)

    await waitFor(() => expect(readState()).toBe('0/5/5/false/true/true'))
  })

  it('does not add a snap for the gap after the last slide', () => {
    setContainerWidth(1000)

    render(<Carousel count={6} slideWidth={320} spaceBetween={20} />)

    expect(readState()).toBe('0/4/6/false/true/true')
  })

  it('re-counts the snaps when the viewport shrinks', () => {
    render(<Carousel slideWidth={300} />)

    expect(readState()).toBe('0/2/4/false/true/true')

    act(() => {
      setContainerWidth(600)
      triggerResize()
    })

    expect(readState()).toBe('0/3/4/false/true/true')
  })

  it('picks up a slide that grows outside a react render', async () => {
    render(<Carousel slideWidth={300} />)

    expect(readState()).toBe('0/2/4/false/true/true')

    const [first] = getSlides()

    act(() => {
      getSlides().forEach((slide) =>
        slide.setAttribute('data-test-width', '600')
      )
      triggerResize(first)
    })

    await waitFor(() => expect(readState()).toBe('0/4/4/false/true/true'))
    expect(getTrackOffset()).toBe(0)

    fireEvent.click(getDot(1))

    await waitFor(() => expect(getTrackOffset()).toBe(-600))
  })

  it('reads nothing from the DOM while the consumer re-renders', () => {
    render(<Host />)

    const readLayout = vi.spyOn(Element.prototype, 'getBoundingClientRect')

    fireEvent.click(rerenderButton())
    fireEvent.click(rerenderButton())
    fireEvent.click(rerenderButton())

    expect(readLayout).not.toHaveBeenCalled()

    readLayout.mockRestore()
  })
})
