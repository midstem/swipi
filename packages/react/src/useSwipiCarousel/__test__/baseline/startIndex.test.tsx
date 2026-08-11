import { describe, expect, it } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { addSlide, rest } from '../dom'
import { renderBaseline } from './recorder'

const AFTER_MOUNT = 2

describe('baseline: startIndex', () => {
  it('reports the mount snap before the start index it lands on', async () => {
    const { events } = renderBaseline({ startIndex: 3 })

    await waitFor(() => expect(events.length).toBeGreaterThan(AFTER_MOUNT))

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true',
      'change prev=2 current=3 next=3',
      'select index=3 snaps=4 canPrev=true canNext=false'
    ])
  })

  it('reports the clamped start index', async () => {
    const { events } = renderBaseline({ startIndex: 9 })

    await waitFor(() => expect(events.length).toBeGreaterThan(AFTER_MOUNT))

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true',
      'change prev=2 current=3 next=3',
      'select index=3 snaps=4 canPrev=true canNext=false'
    ])
  })

  it('applies the start index once under a double mount', async () => {
    const { events } = renderBaseline({ startIndex: 2 }, true)

    await waitFor(() => expect(events.length).toBeGreaterThan(AFTER_MOUNT))

    await rest()

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true',
      'change prev=1 current=2 next=3',
      'select index=2 snaps=4 canPrev=true canNext=true',
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true',
      'change prev=1 current=2 next=3',
      'select index=2 snaps=4 canPrev=true canNext=true'
    ])
  })

  it('says nothing before the measurement under a double mount', async () => {
    const { events } = renderBaseline({ count: 0, startIndex: 2 }, true)

    expect(events).toEqual([])

    act(addSlide)

    await waitFor(() => expect(events.length).toBeGreaterThan(0))

    expect(events).toEqual([
      'change prev=0 current=0 next=0',
      'select index=0 snaps=1 canPrev=false canNext=false'
    ])
  })
})
