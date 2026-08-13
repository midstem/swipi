import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { Carousel } from './carousel'
import { getTrackOffset, readState } from './dom'

describe('useSwipiCarousel startIndex', () => {
  it('starts at the requested index, counted from zero', async () => {
    render(<Carousel startIndex={3} />)

    await waitFor(() => expect(readState()).toBe('3/4/4/true/false/true'))
    expect(getTrackOffset()).toBe(-2700)
  })

  it('tells the first index from the second one', async () => {
    render(<Carousel startIndex={1} />)

    await waitFor(() => expect(readState()).toBe('1/4/4/true/true/true'))
    expect(getTrackOffset()).toBe(-900)
  })

  it('clamps an index beyond the last one', async () => {
    render(<Carousel startIndex={9} />)

    await waitFor(() => expect(readState()).toBe('3/4/4/true/false/true'))
  })
})
