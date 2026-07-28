import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react'
import Swipi from './index'
import {
  isPointerCaptured,
  setContainerWidth,
  triggerResize
} from '../test/setup'
import { SwipiRef, SwipiState } from './types'

const renderSlides = (count: number) =>
  Array.from({ length: count }, (_, index) => (
    <div key={index}>{index + 1}</div>
  ))

const lastState = (calls: SwipiState[]) => calls[calls.length - 1]

const getSlides = (): HTMLElement[] =>
  screen
    .getAllByRole('group')
    .filter(
      (element) => element.getAttribute('aria-roledescription') === 'slide'
    )

const getTrack = (): HTMLElement => getSlides()[0].parentElement as HTMLElement

const getViewport = (): HTMLElement => getTrack().parentElement as HTMLElement

const getTrackOffset = (): number =>
  Number(/translate3d\((-?[\d.]+)px/.exec(getTrack().style.transform)?.[1])

const POINTER_ID = 1

const drag = (points: [number, number][]): void => {
  const viewport = getViewport()
  const [[startX, startY], ...moves] = points

  fireEvent.pointerDown(viewport, {
    pointerId: POINTER_ID,
    button: 0,
    clientX: startX,
    clientY: startY
  })

  moves.forEach(([clientX, clientY]) =>
    fireEvent.pointerMove(viewport, {
      pointerId: POINTER_ID,
      clientX,
      clientY
    })
  )
}

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

  it('wraps to the last slide when scrolling prev from the first in loop mode', async () => {
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

    act(() => ref.current?.scrollPrev())

    await waitFor(() => expect(lastState(states).selectedIndex).toBe(2))
  })

  it('takes the shortest way around when a snap is on the other side of the loop', async () => {
    const ref = createRef<SwipiRef>()

    render(
      <Swipi ref={ref} slidesNumber={1} loop>
        {renderSlides(5)}
      </Swipi>
    )

    act(() => ref.current?.scrollTo(4))

    expect(ref.current?.selectedScrollSnap()).toBe(4)

    await waitFor(() => expect(getTrackOffset()).toBeGreaterThan(0))
  })
})

describe('Swipi loop without clones', () => {
  it('renders a single DOM node per slide', () => {
    render(
      <Swipi slidesNumber={1} loop>
        {renderSlides(4)}
      </Swipi>
    )

    expect(getSlides()).toHaveLength(4)
    expect(screen.getAllByText('1')).toHaveLength(1)
  })

  it('labels every slide with its own position', () => {
    render(
      <Swipi slidesNumber={1} loop>
        {renderSlides(3)}
      </Swipi>
    )

    expect(
      getSlides().map((slide) => slide.getAttribute('aria-label'))
    ).toEqual(['1 of 3', '2 of 3', '3 of 3'])
  })

  it('keeps the trailing slide shifted behind the first one', () => {
    render(
      <Swipi slidesNumber={1} loop>
        {renderSlides(3)}
      </Swipi>
    )

    const [first, second, last] = getSlides()

    expect(first.style.transform).toBe('')
    expect(second.style.transform).toBe('')
    expect(last.style.transform).toMatch(/^translate3d\(-\d/)
  })

  it('does not shift any slide when the loop is off', () => {
    render(<Swipi slidesNumber={1}>{renderSlides(3)}</Swipi>)

    getSlides().forEach((slide) => expect(slide.style.transform).toBe(''))
  })

  it('does not loop when every slide is already visible', () => {
    const ref = createRef<SwipiRef>()

    render(
      <Swipi ref={ref} slidesNumber={3} loop>
        {renderSlides(3)}
      </Swipi>
    )

    expect(ref.current?.canScrollNext()).toBe(false)
    expect(ref.current?.canScrollPrev()).toBe(false)
    getSlides().forEach((slide) => expect(slide.style.transform).toBe(''))
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

describe('Swipi rendering', () => {
  it('recalculates the slide width when the container resizes', () => {
    render(<Swipi slidesNumber={1}>{renderSlides(3)}</Swipi>)

    expect(getSlides()[0].style.width).toBe('900px')

    act(() => {
      setContainerWidth(600)
      triggerResize()
    })

    expect(getSlides()[0].style.width).toBe('600px')
  })

  it('moves the track on drag without re-rendering the slides', () => {
    const states: SwipiState[] = []

    render(
      <Swipi slidesNumber={1} onSelect={(state) => states.push(state)}>
        {renderSlides(3)}
      </Swipi>
    )

    const rendersBeforeDrag = states.length

    drag([
      [500, 300],
      [480, 300],
      [460, 300],
      [440, 300]
    ])

    expect(getTrackOffset()).toBe(-60)
    expect(states).toHaveLength(rendersBeforeDrag)

    fireEvent.pointerUp(getViewport(), { pointerId: POINTER_ID })
  })

  it('animates the track down to the requested position', async () => {
    const ref = createRef<SwipiRef>()

    render(
      <Swipi ref={ref} slidesNumber={1}>
        {renderSlides(3)}
      </Swipi>
    )

    act(() => ref.current?.scrollTo(2))

    await waitFor(() => expect(getTrackOffset()).toBe(-1800))
  })

  it('keeps a vertical gesture with the page', () => {
    render(<Swipi slidesNumber={1}>{renderSlides(3)}</Swipi>)

    drag([
      [500, 300],
      [495, 340],
      [490, 400]
    ])

    expect(getTrack().style.transform).toBe('')
    expect(isPointerCaptured(POINTER_ID)).toBe(false)
  })

  it('ignores a movement below the drag threshold', () => {
    render(<Swipi slidesNumber={1}>{renderSlides(3)}</Swipi>)

    drag([
      [500, 300],
      [497, 300]
    ])

    expect(getTrack().style.transform).toBe('')
  })

  it('captures the pointer so the drag survives leaving the carousel', () => {
    render(<Swipi slidesNumber={1}>{renderSlides(3)}</Swipi>)

    drag([
      [500, 300],
      [460, 300]
    ])

    expect(isPointerCaptured(POINTER_ID)).toBe(true)

    fireEvent.pointerUp(getViewport(), { pointerId: POINTER_ID })

    expect(isPointerCaptured(POINTER_ID)).toBe(false)
  })

  it('snaps to the neighbouring slide when the gesture is cancelled', async () => {
    render(<Swipi slidesNumber={1}>{renderSlides(3)}</Swipi>)

    drag([
      [500, 300],
      [400, 300]
    ])

    fireEvent.pointerCancel(getViewport(), { pointerId: POINTER_ID })

    await waitFor(() => expect(getTrackOffset()).toBe(-900))
  })

  it('keeps the loop offsets in sync after a resize', () => {
    render(
      <Swipi slidesNumber={1} loop>
        {renderSlides(3)}
      </Swipi>
    )

    act(() => {
      setContainerWidth(600)
      triggerResize()
    })

    const [, , last] = getSlides()

    expect(last.style.transform).toBe('translate3d(-1800px, 0, 0)')
  })
})
