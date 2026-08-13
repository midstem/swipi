import { describe, expect, it } from 'vitest'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { SwipiCarousel } from '../types'
import { Carousel, forwardButton, Host, rerenderButton } from './carousel'
import { getDot, getTrack, getTrackOffset, readState } from './dom'

describe('useSwipiCarousel navigation', () => {
  it('moves through the snaps and updates the bounds', () => {
    render(<Carousel />)

    fireEvent.click(forwardButton())
    fireEvent.click(forwardButton())
    fireEvent.click(forwardButton())

    expect(readState()).toBe('3/4/4/true/false/true')
  })

  it('scrolls to the snap behind a dot', () => {
    render(<Carousel />)

    fireEvent.click(getDot(2))

    expect(readState()).toBe('2/4/4/true/true/true')
  })

  it('keeps both directions open in loop mode', () => {
    render(<Carousel loop />)

    expect(readState()).toBe('0/4/4/true/true/true')
  })

  it('moves the track to the selected snap', async () => {
    render(<Carousel />)

    fireEvent.click(getDot(1))

    await waitFor(() =>
      expect(getTrack().style.transform).toBe('translate3d(-900px, 0, 0)')
    )
  })

  it('animates the track down to the last snap', async () => {
    render(<Carousel />)

    fireEvent.click(getDot(3))

    await waitFor(() => expect(getTrackOffset()).toBe(-2700))
  })

  it('survives a re-render of the parent', () => {
    render(<Host />)

    fireEvent.click(rerenderButton())

    expect(readState()).toBe('0/4/4/false/true/true')
  })

  it('hands back the same carousel until something about it changes', () => {
    const seen: SwipiCarousel[] = []

    render(<Host onRender={(carousel) => seen.push(carousel)} />)

    const mounted = seen.length

    fireEvent.click(rerenderButton())

    expect(seen.length).toBeGreaterThan(mounted)
    expect(seen.at(-1)).toBe(seen[mounted - 1])

    fireEvent.click(forwardButton())

    expect(seen.at(-1)).not.toBe(seen[mounted - 1])
  })
})
