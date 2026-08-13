import { describe, expect, it } from 'vitest'
import { act } from '@testing-library/react'
import { renderBaseline } from './recorder'

describe('baseline: loop', () => {
  it('reports the neighbours wrapped around the ends', () => {
    const { events } = renderBaseline({ loop: true })

    expect(events).toEqual([
      'change prev=3 current=0 next=1',
      'select index=0 snaps=4 canPrev=true canNext=true'
    ])
  })

  it('reports the wrap forward off the last snap', () => {
    const { events, carousel } = renderBaseline({ loop: true })

    act(() => carousel().scrollTo(3))
    act(() => carousel().scrollNext())

    expect(events).toEqual([
      'change prev=3 current=0 next=1',
      'select index=0 snaps=4 canPrev=true canNext=true',
      'change prev=2 current=3 next=0',
      'select index=3 snaps=4 canPrev=true canNext=true',
      'change prev=3 current=0 next=1',
      'select index=0 snaps=4 canPrev=true canNext=true'
    ])
  })

  it('reports the wrap backward off the first snap', () => {
    const { events, carousel } = renderBaseline({ loop: true })

    act(() => carousel().scrollPrev())

    expect(events).toEqual([
      'change prev=3 current=0 next=1',
      'select index=0 snaps=4 canPrev=true canNext=true',
      'change prev=2 current=3 next=0',
      'select index=3 snaps=4 canPrev=true canNext=true'
    ])
  })

  it('reports a carousel that fits as one that does not loop', () => {
    const { events } = renderBaseline({ loop: true, slideWidth: 100 })

    expect(events).toEqual([
      'change prev=0 current=0 next=0',
      'select index=0 snaps=1 canPrev=false canNext=false'
    ])
  })
})
