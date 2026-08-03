import { useState, type JSX } from 'react'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useSwipiCarousel } from '.'
import { SwipiCarouselOptions } from './types'
import { isPointerCaptured } from '../test/setup'

const SLIDE_LABELS = ['one', 'two', 'three', 'four']

const POINTER_ID = 1

const Carousel = (options: SwipiCarouselOptions): JSX.Element => {
  const [carouselRef, carousel] = useSwipiCarousel({
    slideWidth: 900,
    ...options
  })

  return (
    <section>
      <div data-testid="viewport" ref={carouselRef}>
        <div data-testid="track">
          {SLIDE_LABELS.map((label) => (
            <article key={label}>{label}</article>
          ))}
        </div>
      </div>

      <button onClick={carousel.scrollPrev}>back</button>
      <button onClick={carousel.scrollNext}>forward</button>

      <nav>
        {Array.from({ length: carousel.snapCount }, (_, index) => (
          <button key={index} onClick={() => carousel.scrollTo(index)}>
            dot {index}
          </button>
        ))}
      </nav>

      <p data-testid="state">
        {carousel.selectedIndex}/{carousel.snapCount}/{carousel.slidesCount}/
        {String(carousel.canScrollPrev)}/{String(carousel.canScrollNext)}/
        {String(carousel.hasOverflow)}
      </p>
    </section>
  )
}

const readState = (): string => screen.getByTestId('state').textContent

const getViewport = (): HTMLElement => screen.getByTestId('viewport')

const getTrack = (): HTMLElement => screen.getByTestId('track')

const getDot = (index: number): HTMLElement =>
  screen.getByRole('button', { name: `dot ${index}` })

const drag = (points: [number, number][]): void => {
  const viewport = getViewport()

  fireEvent.pointerDown(viewport, {
    pointerId: POINTER_ID,
    button: 0,
    clientX: points[0][0],
    clientY: points[0][1]
  })

  points.slice(1).forEach(([clientX, clientY]) => {
    fireEvent.pointerMove(viewport, { pointerId: POINTER_ID, clientX, clientY })
  })
}

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
})

describe('useSwipiCarousel navigation', () => {
  it('moves through the snaps and updates the bounds', () => {
    render(<Carousel />)

    const forward = screen.getByRole('button', { name: 'forward' })

    fireEvent.click(forward)
    fireEvent.click(forward)
    fireEvent.click(forward)

    expect(readState()).toBe('3/4/4/true/false/true')
  })

  it('scrolls to the snap behind a dot', () => {
    render(<Carousel />)

    fireEvent.click(getDot(2))

    expect(readState()).toBe('2/4/4/true/true/true')
  })

  it('keeps both directions open in loop mode', () => {
    render(<Carousel loop />)

    expect(readState()).toBe('0/4/4/true/true/true')
  })

  it('moves the track to the selected snap', async () => {
    render(<Carousel />)

    fireEvent.click(getDot(1))

    await waitFor(() =>
      expect(getTrack().style.transform).toBe('translate3d(-900px, 0, 0)')
    )
  })

  it('survives a re-render of the parent', () => {
    const Host = (): JSX.Element => {
      const [, setTick] = useState(0)

      return (
        <>
          <button onClick={() => setTick((tick) => tick + 1)}>rerender</button>
          <Carousel />
        </>
      )
    }

    render(<Host />)

    fireEvent.click(screen.getByRole('button', { name: 'rerender' }))

    expect(readState()).toBe('0/4/4/false/true/true')
  })
})

describe('useSwipiCarousel drag', () => {
  it('follows the pointer through listeners of its own', () => {
    render(<Carousel />)

    drag([
      [500, 0],
      [400, 0],
      [300, 0]
    ])

    expect(getTrack().style.transform).toBe('translate3d(-200px, 0, 0)')
  })

  it('captures the pointer and releases it on the way up', () => {
    render(<Carousel />)

    drag([
      [500, 0],
      [400, 0]
    ])

    expect(isPointerCaptured(POINTER_ID)).toBe(true)

    fireEvent.pointerUp(getViewport(), { pointerId: POINTER_ID })

    expect(isPointerCaptured(POINTER_ID)).toBe(false)
  })

  it('ignores a movement below the drag threshold', () => {
    render(<Carousel />)

    drag([
      [500, 0],
      [498, 0]
    ])

    expect(getTrack().style.transform).toBe('')
  })

  it('leaves the track alone when a vertical swipe wins', () => {
    render(<Carousel />)

    drag([
      [500, 0],
      [500, 40]
    ])

    expect(getTrack().style.transform).toBe('')
  })

  it('stops dragging when everything fits the viewport', () => {
    render(<Carousel slideWidth={100} />)

    drag([
      [500, 0],
      [400, 0]
    ])

    expect(getTrack().style.transform).toBe('')
  })

  it('prevents the native drag that would break the gesture', () => {
    render(<Carousel />)

    const dragStart = new Event('dragstart', {
      bubbles: true,
      cancelable: true
    })

    getTrack().dispatchEvent(dragStart)

    expect(dragStart.defaultPrevented).toBe(true)
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
