import type { JSX } from 'react'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useSwipiCarousel } from '.'
import { SwipiCarouselOptions } from './types'

const SLIDE_LABELS = ['one', 'two', 'three', 'four']

const Carousel = (options: SwipiCarouselOptions): JSX.Element => {
  const {
    state,
    scrollNext,
    scrollPrev,
    getViewportProps,
    getTrackProps,
    getSlideProps,
    getDotProps,
    getLiveRegionProps
  } = useSwipiCarousel({ slidesNumber: 1, ...options })

  return (
    <section>
      <div data-testid="viewport" {...getViewportProps()}>
        <div data-testid="track" {...getTrackProps()}>
          {SLIDE_LABELS.map((label, index) => (
            <article key={label} {...getSlideProps(index)}>
              {label}
            </article>
          ))}
        </div>
      </div>

      <span data-testid="live" {...getLiveRegionProps()}>
        {state.announcement}
      </span>

      <button onClick={scrollPrev}>back</button>
      <button onClick={scrollNext}>forward</button>

      <nav>
        {Array.from({ length: state.snapCount }, (_, index) => (
          <button key={index} {...getDotProps(index)} />
        ))}
      </nav>

      <p data-testid="state">
        {state.selectedIndex}/{state.snapCount}/{String(state.canScrollPrev)}/
        {String(state.canScrollNext)}
      </p>
    </section>
  )
}

const readState = (): string => screen.getByTestId('state').textContent

const getDots = (): HTMLElement[] =>
  screen.getAllByRole('button', { name: /Go to slide/ })

describe('useSwipiCarousel wiring', () => {
  it('marks the viewport as a focusable carousel', () => {
    render(<Carousel ariaLabel="Gallery" />)

    const viewport = screen.getByTestId('viewport')

    expect(viewport.getAttribute('role')).toBe('group')
    expect(viewport.getAttribute('aria-roledescription')).toBe('carousel')
    expect(viewport.getAttribute('aria-label')).toBe('Gallery')
    expect(viewport.getAttribute('tabindex')).toBe('0')
  })

  it('labels every slide with its position', () => {
    render(<Carousel />)

    expect(screen.getByRole('group', { name: '1 of 4' })).toBeTruthy()
    expect(screen.getByRole('group', { name: '4 of 4' })).toBeTruthy()
  })

  it('announces the selected slide through the live region', () => {
    render(<Carousel />)

    const live = screen.getByTestId('live')

    expect(live.getAttribute('aria-live')).toBe('polite')
    expect(live.textContent).toBe('Slide 1 of 4')

    fireEvent.click(screen.getByRole('button', { name: 'forward' }))

    expect(live.textContent).toBe('Slide 2 of 4')
  })
})

describe('useSwipiCarousel navigation', () => {
  it('reports the initial state', () => {
    render(<Carousel />)

    expect(readState()).toBe('0/4/false/true')
  })

  it('moves through the snaps and updates the bounds', () => {
    render(<Carousel />)

    const forward = screen.getByRole('button', { name: 'forward' })

    fireEvent.click(forward)
    fireEvent.click(forward)
    fireEvent.click(forward)

    expect(readState()).toBe('3/4/true/false')
  })

  it('responds to arrow keys with no arrows of ours on the page', () => {
    render(<Carousel />)

    const viewport = screen.getByTestId('viewport')

    fireEvent.keyDown(viewport, { key: 'ArrowRight' })

    expect(readState()).toBe('1/4/true/true')

    fireEvent.keyDown(viewport, { key: 'ArrowLeft' })

    expect(readState()).toBe('0/4/false/true')
  })

  it('scrolls to the snap behind a dot', () => {
    render(<Carousel />)

    fireEvent.click(getDots()[2])

    expect(readState()).toBe('2/4/true/true')
    expect(getDots()[2].getAttribute('aria-current')).toBe('true')
    expect(getDots()[0].getAttribute('aria-current')).toBe('false')
  })

  it('keeps both directions open in loop mode', () => {
    render(<Carousel loop />)

    expect(readState()).toBe('0/4/true/true')
  })
})

describe('useSwipiCarousel geometry', () => {
  it('drives the slide width from the track variable', () => {
    render(<Carousel />)

    const track = screen.getByTestId('track')

    expect(track.style.getPropertyValue('--swipi-slide-width')).toBe('900px')
  })

  it('counts the slides it finds in the track', () => {
    render(<Carousel />)

    expect(screen.getByTestId('track').children).toHaveLength(4)
  })

  it('moves the track to the selected snap', async () => {
    render(<Carousel />)

    fireEvent.click(getDots()[1])

    await waitFor(() =>
      expect(screen.getByTestId('track').style.transform).toBe(
        'translate3d(-900px, 0, 0)'
      )
    )
  })
})
