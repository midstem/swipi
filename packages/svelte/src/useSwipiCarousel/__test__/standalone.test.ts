import { afterEach, describe, expect, it, vi } from 'vitest'
import { get, writable } from 'svelte/store'
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

describe('useSwipiCarousel before the action runs', () => {
  it('returns an action and a readable store', () => {
    const [carouselRef, carousel] = useSwipiCarousel()

    expect(typeof carouselRef).toBe('function')
    expect(typeof carousel.subscribe).toBe('function')
    expect(get(carousel).selectedIndex).toBe(0)
    expect(get(carousel).slidesCount).toBe(0)
  })

  it('says nothing to the console when it is never used', () => {
    const messages = listenToConsole()

    useSwipiCarousel({ loop: true })
    useSwipiCarousel(writable({ loop: true }))

    expect(messages).toEqual([])
  })

  it('leaves the options store alone until a node arrives', () => {
    const options = writable({ loop: true })
    const subscribers: unknown[] = []

    options.subscribe((value) => subscribers.push(value))

    useSwipiCarousel(options)

    options.set({ loop: false })

    expect(subscribers).toHaveLength(2)
  })

  it('takes a call on every method before a node arrives', () => {
    const [, carousel] = useSwipiCarousel()
    const { scrollNext, scrollPrev, scrollTo } = get(carousel)

    expect(() => {
      scrollNext()
      scrollPrev()
      scrollTo(2)
    }).not.toThrow()
  })
})
