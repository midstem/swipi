import { afterEach, describe, expect, it, vi } from 'vitest'
import { isSignal, signal } from '@angular/core'
import { useSwipiCarousel } from '..'

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

describe('useSwipiCarousel before the ref runs', () => {
  it('returns a ref and a readable signal', () => {
    const [carouselRef, carousel] = useSwipiCarousel()

    expect(typeof carouselRef).toBe('function')
    expect(isSignal(carousel)).toBe(true)
    expect(carousel().selectedIndex).toBe(0)
    expect(carousel().slidesCount).toBe(0)
  })

  it('says nothing to the console outside an injection context', () => {
    const messages = listenToConsole()

    useSwipiCarousel({ loop: true })
    useSwipiCarousel(signal({ loop: true }))

    expect(messages).toEqual([])
  })

  it('leaves the options signal alone until a node arrives', () => {
    const options = signal({ loop: true })

    useSwipiCarousel(options)

    expect(() => options.set({ loop: false })).not.toThrow()
  })

  it('takes a call on every method before a node arrives', () => {
    const [, carousel] = useSwipiCarousel()
    const { scrollNext, scrollPrev, scrollTo } = carousel()

    expect(() => {
      scrollNext()
      scrollPrev()
      scrollTo(2)
    }).not.toThrow()
  })

  it('takes a null before it has ever seen an element', () => {
    const [carouselRef, carousel] = useSwipiCarousel()

    expect(() => carouselRef(null)).not.toThrow()
    expect(carousel().snapCount).toBe(0)
  })
})
