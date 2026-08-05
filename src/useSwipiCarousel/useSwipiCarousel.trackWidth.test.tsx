import { type JSX } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useSwipiCarousel } from '.'

/**
 * The gap can live as a `padding-left` on every slide, with the track pulling
 * itself back by the same amount — the layout shadcn's carousel uses. The track
 * is then one gap wider than the viewport, and the scroll limit has to follow
 * the track: measuring the viewport instead leaves room for one extra snap that
 * scrolls a gap past the last slide.
 */
const VIEWPORT_WIDTH = 900

const GAP = 16

const TRACK_WIDTH = VIEWPORT_WIDTH + GAP

const SLIDES_COUNT = 5

const VISIBLE_SLIDES = 3

const SLIDE_WIDTH = TRACK_WIDTH / VISIBLE_SLIDES

const EXPECTED_SNAPS = SLIDES_COUNT - VISIBLE_SLIDES + 1

const Carousel = (): JSX.Element => {
  const [carouselRef, carousel] = useSwipiCarousel()

  return (
    <div ref={carouselRef}>
      <div data-test-width={TRACK_WIDTH}>
        {Array.from({ length: SLIDES_COUNT }, (_, index) => (
          <article key={index} data-test-width={SLIDE_WIDTH}>
            {index + 1}
          </article>
        ))}
      </div>

      <p data-testid="snaps">{carousel.snapCount}</p>
    </div>
  )
}

describe('a track widened by a negative margin', () => {
  it('should snap once per slide that can lead, and no more', () => {
    render(<Carousel />)

    expect(screen.getByTestId('snaps').textContent).toBe(String(EXPECTED_SNAPS))
  })
})
