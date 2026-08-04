import { StrictMode, type JSX } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSwipiCarousel } from '.'
import { SwipiCarouselOptions } from './types'

const Carousel = (options: SwipiCarouselOptions): JSX.Element => {
  const [carouselRef, carousel] = useSwipiCarousel(options)

  return (
    <section>
      <div ref={carouselRef}>
        <div>
          <article>one</article>
          <article>two</article>
          <article>three</article>
        </div>
      </div>

      <p>
        {carousel.selectedIndex}/{carousel.snapCount}/{carousel.slidesCount}/
        {String(carousel.canScrollPrev)}/{String(carousel.canScrollNext)}/
        {String(carousel.hasOverflow)}
      </p>
    </section>
  )
}

const listenToConsole = () => {
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
  it('renders without a window', () => {
    expect(typeof window).toBe('undefined')
  })

  it('returns the markup it was given', () => {
    const html = renderToString(<Carousel loop autoplay startIndex={2} />)

    expect(html).toContain('<article>one</article>')
    expect(html).toContain('<article>three</article>')
  })

  it('reports an unmeasured carousel', () => {
    const html = renderToString(<Carousel loop />).replace(/<!-- -->/g, '')

    expect(html).toContain('0/0/0/false/false/false')
  })

  it('says nothing to the console', () => {
    const messages = listenToConsole()

    renderToString(
      <Carousel
        loop
        autoplay
        dragFree
        slideWidth={320}
        spaceBetween={16}
        startIndex={2}
      />
    )

    expect(messages).toEqual([])
  })

  it('says nothing to the console in StrictMode', () => {
    const messages = listenToConsole()

    renderToString(
      <StrictMode>
        <Carousel loop />
      </StrictMode>
    )

    expect(messages).toEqual([])
  })
})
