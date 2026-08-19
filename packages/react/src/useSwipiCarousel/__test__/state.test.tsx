import { describe, expect, it } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { SlidePositions, SwipiState } from '@midstem/swipi'
import { Carousel, forwardButton, Host, rerenderButton } from './carousel'
import { getDot, lastOf } from './dom'

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

    fireEvent.click(forwardButton())
    fireEvent.click(forwardButton())
    fireEvent.click(forwardButton())

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
