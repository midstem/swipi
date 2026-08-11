import { describe, expect, it } from 'vitest'
import { act } from '@testing-library/react'
import { renderBaseline } from './recorder'

describe('baseline: option changes', () => {
  it('reports the wrapped neighbours when the loop is turned on', () => {
    const { events, rerender } = renderBaseline()

    rerender({ loop: true })

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true',
      'change prev=3 current=0 next=1',
      'select index=0 snaps=4 canPrev=true canNext=true'
    ])
  })

  it('reports the clamped neighbours when the loop is turned off', () => {
    const { events, rerender } = renderBaseline({ loop: true })

    rerender({ loop: false })

    expect(events).toEqual([
      'change prev=3 current=0 next=1',
      'select index=0 snaps=4 canPrev=true canNext=true',
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true'
    ])
  })

  it('reports the new snap count when the slides grow', () => {
    const { events, rerender } = renderBaseline({ slideWidth: 300 })

    rerender({ slideWidth: 900 })

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=2 canPrev=false canNext=true',
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true'
    ])
  })

  it('reports the snap it is pushed back to when the slides grow under it', () => {
    const { events, carousel, rerender } = renderBaseline({ slideWidth: 300 })

    act(() => carousel().scrollTo(2))

    rerender({ slideWidth: 900 })

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=2 canPrev=false canNext=true',
      'change prev=0 current=1 next=1',
      'select index=1 snaps=2 canPrev=true canNext=false',
      'change prev=0 current=1 next=2',
      'select index=1 snaps=4 canPrev=true canNext=true'
    ])
  })

  it('says nothing when the animation speed changes', () => {
    const { events, rerender } = renderBaseline()

    const afterMount = events.length

    rerender({ animationSpeed: 50 })

    expect(events).toHaveLength(afterMount)
  })

  it('says nothing when autoplay is turned off', () => {
    const { events, rerender } = renderBaseline({ autoplay: true })

    const afterMount = events.length

    rerender({ autoplay: false })

    expect(events).toHaveLength(afterMount)
  })

  it('says nothing when a start index arrives after the mount', () => {
    const { events, rerender } = renderBaseline()

    const afterMount = events.length

    rerender({ startIndex: 2 })

    expect(events).toHaveLength(afterMount)
  })
})
