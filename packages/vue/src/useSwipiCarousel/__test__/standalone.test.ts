import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
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

describe('useSwipiCarousel outside a component', () => {
  it('returns a function ref and a reactive state', () => {
    const [carouselRef, carousel] = useSwipiCarousel()

    expect(typeof carouselRef).toBe('function')
    expect(carousel.selectedIndex).toBe(0)
    expect(carousel.slidesCount).toBe(0)
  })

  it('says nothing to the console without an active instance', () => {
    const messages = listenToConsole()

    useSwipiCarousel({ loop: true })
    useSwipiCarousel(ref({ loop: true }))

    expect(messages).toEqual([])
  })

  it('leaves the state alone when the ref is handed nothing', () => {
    const [carouselRef, carousel] = useSwipiCarousel()

    carouselRef(null)

    expect(carousel.slidesCount).toBe(0)
    expect(carousel.canScrollNext).toBe(false)
  })

  it('takes a call on every method before a node arrives', () => {
    const [, carousel] = useSwipiCarousel()

    expect(() => {
      carousel.scrollNext()
      carousel.scrollPrev()
      carousel.scrollTo(2)
    }).not.toThrow()
  })
})
