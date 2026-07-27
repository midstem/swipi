import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react'
import Swipi from './index'
import { SwipiRef, SwipiState } from './types'

const renderSlides = (count: number) =>
  Array.from({ length: count }, (_, index) => (
    <div key={index}>{index + 1}</div>
  ))

const lastState = (calls: SwipiState[]) => calls[calls.length - 1]

describe('Swipi accessibility', () => {
  it('exposes the carousel group with a configurable label', () => {
    render(
      <Swipi slidesNumber={1} ariaLabel="Gallery">
        {renderSlides(3)}
      </Swipi>
    )

    const carousel = screen.getByRole('group', { name: 'Gallery' })

    expect(carousel.getAttribute('aria-roledescription')).toBe('carousel')
  })

  it('renders labelled previous/next buttons', () => {
    render(<Swipi slidesNumber={1}>{renderSlides(3)}</Swipi>)

    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeTruthy()
  })

  it('renders dots as accessible buttons with aria-current on the active one', () => {
    render(
      <Swipi slidesNumber={1} showDots>
        {renderSlides(3)}
      </Swipi>
    )

    const firstDot = screen.getByRole('button', { name: 'Go to slide 1' })
    const thirdDot = screen.getByRole('button', { name: 'Go to slide 3' })

    expect(firstDot.getAttribute('aria-current')).toBe('true')
    expect(thirdDot.getAttribute('aria-current')).toBe('false')
  })

  it('labels each slide as a group', () => {
    render(<Swipi slidesNumber={1}>{renderSlides(3)}</Swipi>)

    expect(
      screen.getAllByRole('group', { name: '1 of 3' }).length
    ).toBeGreaterThan(0)
  })

  it('announces the current slide through a live region', () => {
    render(<Swipi slidesNumber={1}>{renderSlides(3)}</Swipi>)

    expect(screen.getByText('Slide 1 of 3')).toBeTruthy()
  })

  it('exposes each real slide only once in loop mode (clones are hidden)', () => {
    render(
      <Swipi slidesNumber={1} loop>
        {renderSlides(3)}
      </Swipi>
    )

    expect(screen.getAllByRole('group', { name: '1 of 3' })).toHaveLength(1)
  })
})

describe('Swipi imperative ref API', () => {
  it('reports the initial navigable state', () => {
    const ref = createRef<SwipiRef>()

    render(
      <Swipi ref={ref} slidesNumber={1}>
        {renderSlides(3)}
      </Swipi>
    )

    expect(ref.current?.selectedScrollSnap()).toBe(0)
    expect(ref.current?.scrollSnapList()).toEqual([0, 1, 2])
    expect(ref.current?.canScrollPrev()).toBe(false)
    expect(ref.current?.canScrollNext()).toBe(true)
  })

  it('scrollTo moves to the requested snap and updates bounds', () => {
    const ref = createRef<SwipiRef>()

    render(
      <Swipi ref={ref} slidesNumber={1}>
        {renderSlides(3)}
      </Swipi>
    )

    act(() => ref.current?.scrollTo(2))

    expect(ref.current?.selectedScrollSnap()).toBe(2)
    expect(ref.current?.canScrollNext()).toBe(false)
    expect(ref.current?.canScrollPrev()).toBe(true)
  })
})

describe('Swipi reactive state (onSelect)', () => {
  it('fires with the initial state on mount', () => {
    const states: SwipiState[] = []

    render(
      <Swipi slidesNumber={1} onSelect={(state) => states.push(state)}>
        {renderSlides(3)}
      </Swipi>
    )

    expect(lastState(states)).toEqual({
      selectedIndex: 0,
      snapCount: 3,
      canScrollNext: true,
      canScrollPrev: false
    })
  })

  it('pushes updated state after navigation', () => {
    const states: SwipiState[] = []
    const ref = createRef<SwipiRef>()

    render(
      <Swipi
        ref={ref}
        slidesNumber={1}
        onSelect={(state) => states.push(state)}
      >
        {renderSlides(3)}
      </Swipi>
    )

    act(() => ref.current?.scrollTo(2))

    expect(lastState(states)).toEqual({
      selectedIndex: 2,
      snapCount: 3,
      canScrollNext: false,
      canScrollPrev: true
    })
  })
})

describe('Swipi navigation bounds', () => {
  it('disables the previous button at the first slide', () => {
    render(<Swipi slidesNumber={1}>{renderSlides(3)}</Swipi>)

    const prev = screen.getByRole('button', { name: 'Previous slide' })

    expect(prev.hasAttribute('disabled')).toBe(true)
  })

  it('keeps both directions available in loop mode', () => {
    const ref = createRef<SwipiRef>()

    render(
      <Swipi ref={ref} slidesNumber={1} loop>
        {renderSlides(3)}
      </Swipi>
    )

    expect(ref.current?.canScrollPrev()).toBe(true)
    expect(ref.current?.canScrollNext()).toBe(true)
  })

  it('wraps to the first slide when scrolling next from the last in loop mode', async () => {
    const states: SwipiState[] = []
    const ref = createRef<SwipiRef>()

    render(
      <Swipi
        ref={ref}
        slidesNumber={1}
        loop
        onSelect={(state) => states.push(state)}
      >
        {renderSlides(3)}
      </Swipi>
    )

    act(() => ref.current?.scrollTo(2))
    act(() => ref.current?.scrollNext())

    await waitFor(() => expect(lastState(states).selectedIndex).toBe(0))
  })
})

describe('Swipi keyboard navigation', () => {
  it('advances on ArrowRight', async () => {
    const states: SwipiState[] = []

    render(
      <Swipi
        slidesNumber={1}
        ariaLabel="Gallery"
        onSelect={(state) => states.push(state)}
      >
        {renderSlides(3)}
      </Swipi>
    )

    fireEvent.keyDown(screen.getByRole('group', { name: 'Gallery' }), {
      key: 'ArrowRight'
    })

    await waitFor(() => expect(lastState(states).selectedIndex).toBe(1))
  })
})
