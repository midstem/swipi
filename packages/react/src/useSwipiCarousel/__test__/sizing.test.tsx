import { type JSX } from 'react'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useSwipiCarousel } from '..'
import { SwipiCarouselOptions } from '../types'
import { setContainerWidth } from '../../test/setup'
import { backButton, Carousel } from './carousel'
import {
  getDot,
  getSlides,
  getTrack,
  getTrackOffset,
  lastOf,
  readState,
  SLIDES_COUNT
} from './dom'

describe('useSwipiCarousel with fractional slide widths', () => {
  const FRACTIONAL_WIDTH = 100.5

  const NARROW_VIEWPORT = 250

  const LOOP_SIZE = FRACTIONAL_WIDTH * SLIDES_COUNT

  it('snaps to a position between two pixels', async () => {
    setContainerWidth(NARROW_VIEWPORT)

    render(<Carousel slideWidth={FRACTIONAL_WIDTH} />)

    fireEvent.click(getDot(1))

    await waitFor(() => expect(getTrackOffset()).toBe(-FRACTIONAL_WIDTH))
  })

  it('wraps a looped slide by the exact loop size', () => {
    setContainerWidth(NARROW_VIEWPORT)

    render(<Carousel loop slideWidth={FRACTIONAL_WIDTH} />)

    expect(lastOf(getSlides()).style.transform).toBe(
      `translate3d(-${LOOP_SIZE}px, 0, 0)`
    )
  })

  it('clamps the last snap to a fractional viewport width', async () => {
    setContainerWidth(250.5)

    render(<Carousel slideWidth={FRACTIONAL_WIDTH} />)

    fireEvent.click(getDot(2))

    await waitFor(() => expect(getTrackOffset()).toBe(-151.5))
  })
})

describe('useSwipiCarousel with a gap between slides', () => {
  const GAPPED_WIDTH = 220

  const GAP = 20

  const GAPPED_VIEWPORT = 500

  const renderGapped = (options: SwipiCarouselOptions = {}): void => {
    setContainerWidth(GAPPED_VIEWPORT)

    render(
      <Carousel slideWidth={GAPPED_WIDTH} spaceBetween={GAP} {...options} />
    )
  }

  it('snaps a slide and its gap at a time', async () => {
    renderGapped()

    expect(readState()).toBe('0/3/4/false/true/true')

    fireEvent.click(getDot(1))

    await waitFor(() => expect(getTrackOffset()).toBe(-(GAPPED_WIDTH + GAP)))
  })

  it('repeats over the gap that follows the last slide when looping', async () => {
    renderGapped({ loop: true })

    fireEvent.click(backButton())

    await waitFor(() => expect(getTrackOffset()).toBe(GAPPED_WIDTH + GAP))

    const contentSize = SLIDES_COUNT * GAPPED_WIDTH + (SLIDES_COUNT - 1) * GAP

    expect(lastOf(getSlides()).style.transform).toBe(
      `translate3d(-${contentSize + GAP}px, 0, 0)`
    )
  })
})

describe('useSwipiCarousel with slides sized by the consumer', () => {
  const WIDTHS = [200, 500, 100, 400]

  const UnevenCarousel = (options: SwipiCarouselOptions): JSX.Element => {
    const [carouselRef, carousel] = useSwipiCarousel(options)

    return (
      <div>
        <div ref={carouselRef}>
          <div data-testid="track">
            {WIDTHS.map((width) => (
              <article key={width} data-test-width={width} />
            ))}
          </div>
        </div>

        <button onClick={() => carousel.scrollTo(2)}>third</button>

        <p data-testid="state">
          {carousel.selectedIndex}/{carousel.snapCount}
        </p>
      </div>
    )
  }

  it('snaps to positions that follow the real slide widths', async () => {
    render(<UnevenCarousel />)

    expect(readState()).toBe('0/3')

    fireEvent.click(screen.getByRole('button', { name: 'third' }))

    await waitFor(() =>
      expect(getTrack().style.transform).toBe('translate3d(-300px, 0, 0)')
    )
  })

  it('offers a snap per slide when looping', () => {
    render(<UnevenCarousel loop />)

    expect(readState()).toBe('0/4')
  })
})
