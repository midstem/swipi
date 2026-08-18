import { afterEach, describe, expect, it, vi } from 'vitest'
import { signal } from '@angular/core'
import { useSwipiCarousel } from '..'
import { SwipiCarouselOptions } from '../types'

const listenToConsole = (): string[] => {
  const messages: string[] = []
  const record = (...args: unknown[]): void => {
    messages.push(args.map(String).join(' '))
  }

  vi.spyOn(console, 'error').mockImplementation(record)
  vi.spyOn(console, 'warn').mockImplementation(record)

  return messages
}

afterEach(() => vi.restoreAllMocks())

describe('useSwipiCarousel on the server', () => {
  it('runs without a window', () => {
    expect(typeof window).toBe('undefined')
  })

  it('reports an unmeasured carousel', () => {
    const [, carousel] = useSwipiCarousel({ loop: true })

    expect([
      carousel().selectedIndex,
      carousel().snapCount,
      carousel().slidesCount,
      carousel().canScrollPrev,
      carousel().canScrollNext,
      carousel().hasOverflow
    ]).toEqual([0, 0, 0, false, false, false])
  })

  it('touches nothing when the options signal moves', () => {
    const options = signal<SwipiCarouselOptions>({ loop: true })
    const [, carousel] = useSwipiCarousel(options)

    options.set({ loop: false, autoplay: true })

    expect(carousel().snapCount).toBe(0)
  })

  it('takes a null without reaching for an element', () => {
    const [carouselRef, carousel] = useSwipiCarousel({ loop: true })

    expect(() => carouselRef(null)).not.toThrow()
    expect(carousel().slidesCount).toBe(0)
  })

  it('says nothing to the console', () => {
    const messages = listenToConsole()

    useSwipiCarousel({
      loop: true,
      autoplay: true,
      dragFree: true,
      slideWidth: 320,
      spaceBetween: 16,
      startIndex: 2
    })

    expect(messages).toEqual([])
  })
})
