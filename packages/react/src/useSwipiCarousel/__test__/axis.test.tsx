import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { isPointerCaptured, setAxis } from '../../test/setup'
import { Carousel, forwardButton } from './carousel'
import {
  drag,
  getTrack,
  getTrackOffset,
  POINTER_ID,
  readState,
  release,
  SLIDE_WIDTH,
  SLIDES_COUNT
} from './dom'

describe('useSwipiCarousel on the vertical axis', () => {
  it('measures the slides it stacks', () => {
    setAxis('y')

    render(<Carousel axis="y" />)

    expect(readState()).toBe(
      `0/${SLIDES_COUNT}/${SLIDES_COUNT}/false/true/true`
    )
  })

  it('moves the track down on scrollNext', async () => {
    setAxis('y')

    render(<Carousel axis="y" animationSpeed={0} />)

    forwardButton().click()

    await waitFor(() =>
      expect(getTrack().style.transform).toBe(
        `translate3d(0, ${-SLIDE_WIDTH}px, 0)`
      )
    )
  })

  it('follows a vertical pointer', () => {
    setAxis('y')

    render(<Carousel axis="y" />)

    drag([
      [0, 500],
      [0, 400],
      [0, 300]
    ])

    expect(getTrackOffset('y')).toBe(-200)
    expect(isPointerCaptured(POINTER_ID)).toBe(true)

    release()
  })

  it('leaves the track alone when a horizontal swipe wins', () => {
    setAxis('y')

    render(<Carousel axis="y" />)

    drag([
      [500, 0],
      [460, 0]
    ])

    expect(getTrack().style.transform).toBe('')
    expect(isPointerCaptured(POINTER_ID)).toBe(false)
  })

  it('carries a vertical flick over to the next slide', async () => {
    setAxis('y')

    render(<Carousel axis="y" />)

    drag([
      [0, 500],
      [0, 460],
      [0, 420]
    ])

    release()

    await waitFor(() => expect(getTrackOffset('y')).toBe(-SLIDE_WIDTH))
  })
})
