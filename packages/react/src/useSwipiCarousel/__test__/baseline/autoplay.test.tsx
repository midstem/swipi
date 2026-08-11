import { describe, expect, it } from 'vitest'
import { waitFor } from '@testing-library/react'
import { rest } from '../dom'
import { renderBaseline } from './recorder'

const AUTOPLAY_SPEED = 20

const RECORDED_TICKS = 6

describe('baseline: autoplay', () => {
  it('reports the snaps it walks through on its own', async () => {
    const { events } = renderBaseline({
      autoplay: true,
      autoplaySpeed: AUTOPLAY_SPEED
    })

    await waitFor(() =>
      expect(events.length).toBeGreaterThanOrEqual(RECORDED_TICKS)
    )

    expect(events.slice(0, RECORDED_TICKS)).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true',
      'change prev=0 current=1 next=2',
      'select index=1 snaps=4 canPrev=true canNext=true',
      'change prev=1 current=2 next=3',
      'select index=2 snaps=4 canPrev=true canNext=true'
    ])
  })

  it('says nothing on its own without autoplay', async () => {
    const { events } = renderBaseline({ autoplaySpeed: AUTOPLAY_SPEED })

    const afterMount = events.length

    await rest()

    expect(events).toHaveLength(afterMount)
  })
})
