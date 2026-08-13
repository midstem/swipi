import { StrictMode } from 'react'
import { describe, expect, it } from 'vitest'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { SwipiState } from '@swipi/core'
import { setContainerWidth, triggerResize } from '../../test/setup'
import { Carousel, CarouselProps } from './carousel'
import { addSlide, getDot, getTrack, readState } from './dom'
import { perStrictAttach } from './strict'

const renderStrict = (props: CarouselProps = {}) =>
  render(
    <StrictMode>
      <Carousel {...props} />
    </StrictMode>
  )

describe('useSwipiCarousel in StrictMode', () => {
  it('measures the slides once the effects are mounted twice', () => {
    renderStrict()

    expect(readState()).toBe('0/4/4/false/true/true')
    expect(getTrack().style.getPropertyValue('--swipi-slide-width')).toBe(
      '900px'
    )
  })

  it('navigates after the double mount', () => {
    renderStrict()

    fireEvent.click(getDot(2))

    expect(readState()).toBe('2/4/4/true/true/true')
  })

  it('keeps the size observer delivering after the double mount', () => {
    renderStrict({ slideWidth: 300 })

    expect(readState()).toBe('0/2/4/false/true/true')

    act(() => {
      setContainerWidth(600)
      triggerResize()
    })

    expect(readState()).toBe('0/3/4/false/true/true')
  })

  it('keeps the child observer delivering after the double mount', async () => {
    renderStrict()

    act(addSlide)

    await waitFor(() => expect(readState()).toBe('0/5/5/false/true/true'))
  })

  it('applies the start index once, not twice', async () => {
    const states: SwipiState[] = []

    renderStrict({ startIndex: 2, onSelect: (state) => states.push(state) })

    await waitFor(() => expect(readState()).toBe('2/4/4/true/true/true'))
    expect(states.map((state) => state.selectedIndex)).toEqual(
      perStrictAttach([0, 2])
    )
  })
})
