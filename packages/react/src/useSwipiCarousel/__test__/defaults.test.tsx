import { describe, expect, it } from 'vitest'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Carousel } from './carousel'
import { getDot, getTrack, getTrackOffset, readState, SLIDE_WIDTH } from './dom'

describe('useSwipiCarousel defaults', () => {
  it('keeps the defaults when optional props are passed through as undefined', async () => {
    render(
      <Carousel
        axis={undefined}
        loop={undefined}
        autoplay={undefined}
        autoplaySpeed={undefined}
        animationSpeed={undefined}
      />
    )

    expect(readState()).toBe('0/4/4/false/true/true')

    fireEvent.click(getDot(1))

    await waitFor(() => expect(getTrackOffset()).toBe(-SLIDE_WIDTH))
    expect(getTrack().style.transform).not.toContain('NaN')
  })

  it('falls back to the default when a re-render drops the option', async () => {
    const { rerender } = render(<Carousel animationSpeed={0} />)

    rerender(<Carousel animationSpeed={undefined} />)

    fireEvent.click(getDot(1))

    await waitFor(() => expect(getTrackOffset()).toBe(-SLIDE_WIDTH))
    expect(getTrack().style.transform).not.toContain('NaN')
  })
})
