import { describe, expect, it } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { addSlide } from '../dom'
import { renderBaseline } from './recorder'

describe('baseline: mount', () => {
  it('says nothing before the slides can be measured', async () => {
    const { events } = renderBaseline({ count: 0 })

    expect(events).toEqual([])

    act(addSlide)

    await waitFor(() => expect(events.length).toBeGreaterThan(0))

    expect(events).toEqual([
      'change prev=0 current=0 next=0',
      'select index=0 snaps=1 canPrev=false canNext=false'
    ])
  })

  it('reports the measured carousel once', () => {
    const { events } = renderBaseline()

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true'
    ])
  })

  it('reports a carousel that fits its viewport', () => {
    const { events } = renderBaseline({ slideWidth: 100 })

    expect(events).toEqual([
      'change prev=0 current=0 next=0',
      'select index=0 snaps=1 canPrev=false canNext=false'
    ])
  })

  it('says nothing more while the consumer re-renders', () => {
    const { events, rerender } = renderBaseline()

    const afterMount = events.length

    rerender({})
    rerender({})

    expect(events).toHaveLength(afterMount)
  })
})
