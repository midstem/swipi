import { useState, type JSX } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useSwipiCarousel } from '.'
import { SwipiCarousel, SwipiCarouselOptions } from './types'
import { SlidePositions, SwipiState } from '../Swipi/types'
import {
  isPointerCaptured,
  setContainerWidth,
  triggerResize
} from '../test/setup'

const SLIDES_COUNT = 4

const SLIDE_WIDTH = 900

const POINTER_ID = 1

const PAUSE_BEFORE_RELEASE = 150

type CarouselProps = SwipiCarouselOptions & {
  count?: number
  onRender?: (carousel: SwipiCarousel) => void
}

const Carousel = ({
  count = SLIDES_COUNT,
  onRender,
  ...options
}: CarouselProps): JSX.Element => {
  const [carouselRef, carousel] = useSwipiCarousel({
    slideWidth: SLIDE_WIDTH,
    ...options
  })

  onRender?.(carousel)

  return (
    <section>
      <div data-testid="viewport" ref={carouselRef}>
        <div data-testid="track">
          {Array.from({ length: count }, (_, index) => (
            <article key={index}>{index + 1}</article>
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

const Host = (props: CarouselProps): JSX.Element => {
  const [, setTick] = useState(0)

  return (
    <>
      <button onClick={() => setTick((tick) => tick + 1)}>rerender</button>
      <Carousel {...props} />
    </>
  )
}

const readState = (): string => screen.getByTestId('state').textContent

const getViewport = (): HTMLElement => screen.getByTestId('viewport')

const getTrack = (): HTMLElement => screen.getByTestId('track')

const getSlides = (): HTMLElement[] =>
  Array.from(getTrack().children) as HTMLElement[]

const getDot = (index: number): HTMLElement =>
  screen.getByRole('button', { name: `dot ${index}` })

const getTrackOffset = (): number => {
  const offset = /translate3d\((-?[\d.]+)px/.exec(getTrack().style.transform)

  return offset ? Number(offset[1]) : 0
}

const lastOf = <Item,>(items: Item[]): Item => items[items.length - 1]

const rerenderButton = (): HTMLElement =>
  screen.getByRole('button', { name: 'rerender' })

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

  it('writes the gap variable without a slide width beside it', () => {
    render(<Carousel slideWidth={undefined} spaceBetween={24} />)

    const style = getTrack().style

    expect(style.getPropertyValue('--swipi-slide-gap')).toBe('24px')
    expect(style.getPropertyValue('--swipi-slide-width')).toBe('')
  })

  it('takes a variable back when its option goes away', () => {
    const { rerender } = render(<Carousel spaceBetween={24} />)

    expect(getTrack().style.getPropertyValue('--swipi-slide-gap')).toBe('24px')

    rerender(<Carousel />)

    expect(getTrack().style.getPropertyValue('--swipi-slide-gap')).toBe('')
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

  it('animates the track down to the last snap', async () => {
    render(<Carousel />)

    fireEvent.click(getDot(3))

    await waitFor(() => expect(getTrackOffset()).toBe(-2700))
  })

  it('survives a re-render of the parent', () => {
    render(<Host />)

    fireEvent.click(rerenderButton())

    expect(readState()).toBe('0/4/4/false/true/true')
  })

  it('hands back the same carousel until something about it changes', () => {
    const seen: SwipiCarousel[] = []

    render(<Host onRender={(carousel) => seen.push(carousel)} />)

    const mounted = seen.length

    fireEvent.click(rerenderButton())

    expect(seen.length).toBeGreaterThan(mounted)
    expect(seen.at(-1)).toBe(seen[mounted - 1])

    fireEvent.click(screen.getByRole('button', { name: 'forward' }))

    expect(seen.at(-1)).not.toBe(seen[mounted - 1])
  })
})

describe('useSwipiCarousel reactive state', () => {
  it('reports the state once on mount, after the slides are measured', () => {
    const states: SwipiState[] = []

    render(<Carousel onSelect={(state) => states.push(state)} />)

    expect(states).toEqual([
      {
        selectedIndex: 0,
        snapCount: 4,
        canScrollNext: true,
        canScrollPrev: false
      }
    ])
  })

  it('pushes the updated state after navigation', () => {
    const states: SwipiState[] = []

    render(<Carousel onSelect={(state) => states.push(state)} />)

    fireEvent.click(getDot(3))

    expect(lastOf(states)).toEqual({
      selectedIndex: 3,
      snapCount: 4,
      canScrollNext: false,
      canScrollPrev: true
    })
  })

  it('stays quiet while the parent re-renders with an inline callback', () => {
    const states: SwipiState[] = []

    render(<Host onSelect={(state) => states.push(state)} />)

    const callsAfterMount = states.length

    fireEvent.click(rerenderButton())
    fireEvent.click(rerenderButton())

    expect(states).toHaveLength(callsAfterMount)
  })

  it('reports every index of a rapid navigation burst', () => {
    const states: SwipiState[] = []

    render(<Carousel onSelect={(state) => states.push(state)} />)

    const forward = screen.getByRole('button', { name: 'forward' })

    fireEvent.click(forward)
    fireEvent.click(forward)
    fireEvent.click(forward)

    expect(states.map((state) => state.selectedIndex)).toEqual([0, 1, 2, 3])
  })

  it('reports the neighbours of the selected slide through onChange', () => {
    const positions: SlidePositions[] = []

    render(<Carousel onChange={(value) => positions.push(value)} />)

    expect(lastOf(positions)).toEqual({ prev: 0, current: 0, next: 1 })

    fireEvent.click(getDot(1))

    expect(lastOf(positions)).toEqual({ prev: 0, current: 1, next: 2 })
  })

  it('wraps the neighbours around the ends in loop mode', () => {
    const positions: SlidePositions[] = []

    render(<Carousel loop onChange={(value) => positions.push(value)} />)

    expect(lastOf(positions)).toEqual({ prev: 3, current: 0, next: 1 })
  })
})

describe('useSwipiCarousel slide discovery', () => {
  it('counts the slides that are actually in the track', () => {
    render(<Carousel count={6} slideWidth={300} />)

    expect(getSlides()).toHaveLength(6)
    expect(readState()).toBe('0/4/6/false/true/true')
  })

  it('picks up a slide inserted outside a react render', async () => {
    render(<Carousel />)

    expect(readState()).toBe('0/4/4/false/true/true')

    act(() => {
      getTrack().appendChild(document.createElement('article'))
    })

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

describe('useSwipiCarousel startIndex', () => {
  it('starts at the requested index, counted from zero', async () => {
    render(<Carousel startIndex={3} />)

    await waitFor(() => expect(readState()).toBe('3/4/4/true/false/true'))
    expect(getTrackOffset()).toBe(-2700)
  })

  it('tells the first index from the second one', async () => {
    render(<Carousel startIndex={1} />)

    await waitFor(() => expect(readState()).toBe('1/4/4/true/true/true'))
    expect(getTrackOffset()).toBe(-900)
  })

  it('clamps an index beyond the last one', async () => {
    render(<Carousel startIndex={9} />)

    await waitFor(() => expect(readState()).toBe('3/4/4/true/false/true'))
  })
})

describe('useSwipiCarousel autoplay', () => {
  it('advances on its own', async () => {
    render(<Carousel autoplay autoplaySpeed={20} />)

    await waitFor(() => expect(readState()).toBe('1/4/4/true/true/true'))
  })

  it('stays where it is without autoplay', async () => {
    render(<Carousel autoplaySpeed={20} />)

    await new Promise((resolve) => setTimeout(resolve, PAUSE_BEFORE_RELEASE))

    expect(readState()).toBe('0/4/4/false/true/true')
  })
})

describe('useSwipiCarousel loop', () => {
  it('wraps to the first slide when scrolling next from the last', async () => {
    render(<Carousel loop />)

    fireEvent.click(getDot(3))
    fireEvent.click(screen.getByRole('button', { name: 'forward' }))

    await waitFor(() => expect(readState()).toBe('0/4/4/true/true/true'))
  })

  it('wraps to the last slide when scrolling prev from the first', async () => {
    render(<Carousel loop />)

    fireEvent.click(screen.getByRole('button', { name: 'back' }))

    await waitFor(() => expect(readState()).toBe('3/4/4/true/true/true'))
  })

  it('takes the shortest way around to a snap behind the start', async () => {
    render(<Carousel loop />)

    fireEvent.click(getDot(3))

    expect(readState()).toBe('3/4/4/true/true/true')

    await waitFor(() => expect(getTrackOffset()).toBeGreaterThan(0))
  })

  it('renders a single DOM node per slide', () => {
    render(<Carousel loop />)

    expect(getSlides()).toHaveLength(4)
    expect(screen.getAllByText('1')).toHaveLength(1)
  })

  it('keeps the trailing slide shifted behind the first one', () => {
    render(<Carousel loop />)

    const [first, second, third, last] = getSlides()

    expect(first.style.transform).toBe('')
    expect(second.style.transform).toBe('')
    expect(third.style.transform).toBe('')
    expect(last.style.transform).toBe('translate3d(-3600px, 0, 0)')
  })

  it('does not shift any slide when the loop is off', () => {
    render(<Carousel />)

    getSlides().forEach((slide) => expect(slide.style.transform).toBe(''))
  })

  it('clears the shifted slides when the loop is turned off', () => {
    const { rerender } = render(<Carousel loop />)

    expect(lastOf(getSlides()).style.transform).toMatch(/^translate3d\(-\d/)

    rerender(<Carousel />)

    getSlides().forEach((slide) => expect(slide.style.transform).toBe(''))
  })

  it('does not loop when every slide is already visible', () => {
    render(<Carousel loop slideWidth={100} />)

    expect(readState()).toBe('0/1/4/false/false/false')
    getSlides().forEach((slide) => expect(slide.style.transform).toBe(''))
  })

  it('keeps the loop offsets in sync after the slides are re-measured', () => {
    const { rerender } = render(<Carousel loop />)

    rerender(<Carousel loop slideWidth={600} />)

    expect(lastOf(getSlides()).style.transform).toBe(
      'translate3d(-2400px, 0, 0)'
    )
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

  it('moves the track without re-rendering the consumer', () => {
    const states: SwipiState[] = []

    render(<Carousel onSelect={(state) => states.push(state)} />)

    const rendersBeforeDrag = states.length

    drag([
      [500, 0],
      [480, 0],
      [460, 0],
      [440, 0]
    ])

    expect(getTrackOffset()).toBe(-60)
    expect(states).toHaveLength(rendersBeforeDrag)

    fireEvent.pointerUp(getViewport(), { pointerId: POINTER_ID })
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
    expect(isPointerCaptured(POINTER_ID)).toBe(false)
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

  it('carries a flick over to the next slide', async () => {
    render(<Carousel />)

    drag([
      [500, 0],
      [460, 0],
      [420, 0]
    ])

    fireEvent.pointerUp(getViewport(), { pointerId: POINTER_ID })

    await waitFor(() => expect(getTrackOffset()).toBe(-900))
  })

  it('snaps to the neighbouring slide when the gesture is cancelled', async () => {
    render(<Carousel />)

    drag([
      [500, 0],
      [400, 0]
    ])

    fireEvent.pointerCancel(getViewport(), { pointerId: POINTER_ID })

    await waitFor(() => expect(getTrackOffset()).toBe(-900))
  })

  it('drops the track on the current slide when the pointer rests before the release', async () => {
    render(<Carousel />)

    drag([
      [500, 0],
      [460, 0],
      [420, 0]
    ])

    await new Promise((resolve) => setTimeout(resolve, PAUSE_BEFORE_RELEASE))

    fireEvent.pointerUp(getViewport(), { pointerId: POINTER_ID })

    await waitFor(() => expect(getTrackOffset()).toBe(0))
  })

  it('keeps the projected position with dragFree', async () => {
    render(<Carousel dragFree />)

    drag([
      [500, 0],
      [460, 0],
      [420, 0]
    ])

    fireEvent.pointerUp(getViewport(), { pointerId: POINTER_ID })

    await waitFor(() => {
      const offset = getTrackOffset()

      expect(offset).toBeLessThan(-80)
      expect(offset % SLIDE_WIDTH).not.toBe(0)
    })
  })
})

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

    fireEvent.click(screen.getByRole('button', { name: 'back' }))

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
