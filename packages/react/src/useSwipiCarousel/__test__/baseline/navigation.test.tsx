import { describe, expect, it } from 'vitest'
import { act } from '@testing-library/react'
import { renderBaseline } from './recorder'

describe('baseline: scrollTo', () => {
  it('reports the snap it was sent to', () => {
    const { events, carousel } = renderBaseline()

    act(() => carousel().scrollTo(2))

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true',
      'change prev=1 current=2 next=3',
      'select index=2 snaps=4 canPrev=true canNext=true'
    ])
  })

  it('says nothing when it is sent to the snap it is on', () => {
    const { events, carousel } = renderBaseline()

    act(() => carousel().scrollTo(2))

    const afterJump = events.length

    act(() => carousel().scrollTo(2))

    expect(events).toHaveLength(afterJump)
  })

  it('reports the clamped snap for an index beyond the last one', () => {
    const { events, carousel } = renderBaseline()

    act(() => carousel().scrollTo(9))

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true',
      'change prev=2 current=3 next=3',
      'select index=3 snaps=4 canPrev=true canNext=false'
    ])
  })
})

describe('baseline: step navigation', () => {
  it('reports every step up to the last snap', () => {
    const { events, carousel } = renderBaseline()

    act(() => carousel().scrollNext())
    act(() => carousel().scrollNext())
    act(() => carousel().scrollNext())

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true',
      'change prev=0 current=1 next=2',
      'select index=1 snaps=4 canPrev=true canNext=true',
      'change prev=1 current=2 next=3',
      'select index=2 snaps=4 canPrev=true canNext=true',
      'change prev=2 current=3 next=3',
      'select index=3 snaps=4 canPrev=true canNext=false'
    ])
  })

  it('says nothing when it is asked past the last snap', () => {
    const { events, carousel } = renderBaseline()

    act(() => carousel().scrollTo(3))

    const afterLast = events.length

    act(() => carousel().scrollNext())

    expect(events).toHaveLength(afterLast)
  })

  it('reports a step back', () => {
    const { events, carousel } = renderBaseline()

    act(() => carousel().scrollTo(2))
    act(() => carousel().scrollPrev())

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true',
      'change prev=1 current=2 next=3',
      'select index=2 snaps=4 canPrev=true canNext=true',
      'change prev=0 current=1 next=2',
      'select index=1 snaps=4 canPrev=true canNext=true'
    ])
  })

  it('says nothing when it is asked before the first snap', () => {
    const { events, carousel } = renderBaseline()

    const afterMount = events.length

    act(() => carousel().scrollPrev())

    expect(events).toHaveLength(afterMount)
  })
})
