import { describe, expect, it } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { setContainerWidth, triggerResize } from '../../../test/setup'
import { addSlide } from '../dom'
import { renderBaseline } from './recorder'

const AFTER_MOUNT = 2

describe('baseline: resize', () => {
  it('reports the new snap count when the viewport shrinks', () => {
    const { events } = renderBaseline({ slideWidth: 300 })

    act(() => {
      setContainerWidth(600)
      triggerResize()
    })

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=2 canPrev=false canNext=true',
      'change prev=0 current=0 next=1',
      'select index=0 snaps=3 canPrev=false canNext=true'
    ])
  })

  it('reports the new snap count when a slide is added outside react', async () => {
    const { events } = renderBaseline()

    act(addSlide)

    await waitFor(() => expect(events.length).toBeGreaterThan(AFTER_MOUNT))

    expect(events).toEqual([
      'change prev=0 current=0 next=1',
      'select index=0 snaps=4 canPrev=false canNext=true',
      'change prev=0 current=0 next=1',
      'select index=0 snaps=5 canPrev=false canNext=true'
    ])
  })
})
