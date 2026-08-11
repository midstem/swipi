import { describe, expect, it } from 'vitest'
import { cancelDrag, drag, release, rest } from '../dom'
import { renderBaseline } from './recorder'

describe('baseline: drag', () => {
  it('says nothing while the pointer moves and reports once on release', () => {
    const { events } = renderBaseline()

    const afterMount = events.length

    drag([
      [500, 0],
      [460, 0],
      [420, 0]
    ])

    expect(events).toHaveLength(afterMount)

    release()

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true',
      'change prev=0 current=1 next=2',
      'select index=1 snaps=4 canPrev=true canNext=true'
    ])
  })

  it('says nothing for a movement below the threshold', () => {
    const { events } = renderBaseline()

    const afterMount = events.length

    drag([
      [500, 0],
      [498, 0]
    ])

    release()

    expect(events).toHaveLength(afterMount)
  })

  it('says nothing when a vertical swipe wins', () => {
    const { events } = renderBaseline()

    const afterMount = events.length

    drag([
      [500, 0],
      [500, 40]
    ])

    release()

    expect(events).toHaveLength(afterMount)
  })

  it('reports the snap the cancelled gesture falls back to', () => {
    const { events } = renderBaseline()

    drag([
      [500, 0],
      [400, 0]
    ])

    cancelDrag()

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true',
      'change prev=0 current=1 next=2',
      'select index=1 snaps=4 canPrev=true canNext=true'
    ])
  })

  it('says nothing when a rested drag stays on its own snap', async () => {
    const { events } = renderBaseline()

    const afterMount = events.length

    drag([
      [500, 0],
      [460, 0],
      [420, 0]
    ])

    await rest()

    release()

    expect(events).toHaveLength(afterMount)
  })

  it('says nothing when a rested dragFree release stays on its own snap', async () => {
    const { events } = renderBaseline({ dragFree: true })

    const afterMount = events.length

    drag([
      [500, 0],
      [460, 0],
      [420, 0]
    ])

    await rest()

    release()

    expect(events).toHaveLength(afterMount)
  })
})
