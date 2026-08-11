import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { SwipiState } from '../../Swipi/types'
import { isPointerCaptured } from '../../test/setup'
import { Carousel } from './carousel'
import {
  cancelDrag,
  drag,
  getTrack,
  getTrackOffset,
  POINTER_ID,
  release,
  rest,
  SLIDE_WIDTH
} from './dom'

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

    release()
  })

  it('captures the pointer and releases it on the way up', () => {
    render(<Carousel />)

    drag([
      [500, 0],
      [400, 0]
    ])

    expect(isPointerCaptured(POINTER_ID)).toBe(true)

    release()

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

    release()

    await waitFor(() => expect(getTrackOffset()).toBe(-900))
  })

  it('snaps to the neighbouring slide when the gesture is cancelled', async () => {
    render(<Carousel />)

    drag([
      [500, 0],
      [400, 0]
    ])

    cancelDrag()

    await waitFor(() => expect(getTrackOffset()).toBe(-900))
  })

  it('drops the track on the current slide when the pointer rests before the release', async () => {
    render(<Carousel />)

    drag([
      [500, 0],
      [460, 0],
      [420, 0]
    ])

    await rest()

    release()

    await waitFor(() => expect(getTrackOffset()).toBe(0))
  })

  it('keeps the projected position with dragFree', async () => {
    render(<Carousel dragFree />)

    drag([
      [500, 0],
      [460, 0],
      [420, 0]
    ])

    release()

    await waitFor(() => {
      const offset = getTrackOffset()

      expect(offset).toBeLessThan(-80)
      expect(offset % SLIDE_WIDTH).not.toBe(0)
    })
  })
})
