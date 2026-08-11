import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { Carousel, forwardButton } from './carousel'
import { getTrackOffset, SLIDE_WIDTH } from './dom'

const stubReducedMotion = (matches: boolean): void => {
  vi.stubGlobal(
    'matchMedia',
    (media: string) =>
      ({
        media,
        matches,
        addEventListener: (): void => {},
        removeEventListener: (): void => {}
      }) as unknown as MediaQueryList
  )
}

describe('useSwipiCarousel under prefers-reduced-motion', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('animates like everywhere else while the option is off', () => {
    stubReducedMotion(true)

    render(<Carousel />)
    fireEvent.click(forwardButton())

    expect(getTrackOffset()).toBe(0)
  })

  it('jumps straight to the snap once the option is on', () => {
    stubReducedMotion(true)

    render(<Carousel respectReducedMotion />)
    fireEvent.click(forwardButton())

    expect(getTrackOffset()).toBe(-SLIDE_WIDTH)
  })

  it('keeps the animation with the option on and the setting off', () => {
    stubReducedMotion(false)

    render(<Carousel respectReducedMotion />)
    fireEvent.click(forwardButton())

    expect(getTrackOffset()).toBe(0)
  })
})
