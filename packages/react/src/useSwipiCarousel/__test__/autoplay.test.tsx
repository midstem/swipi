import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { Carousel } from './carousel'
import { readState, rest } from './dom'

const AUTOPLAY_SPEED = 20

describe('useSwipiCarousel autoplay', () => {
  it('advances on its own', async () => {
    render(<Carousel autoplay autoplaySpeed={AUTOPLAY_SPEED} />)

    await waitFor(() => expect(readState()).toBe('1/4/4/true/true/true'))
  })

  it('stays where it is without autoplay', async () => {
    render(<Carousel autoplaySpeed={AUTOPLAY_SPEED} />)

    await rest()

    expect(readState()).toBe('0/4/4/false/true/true')
  })
})
