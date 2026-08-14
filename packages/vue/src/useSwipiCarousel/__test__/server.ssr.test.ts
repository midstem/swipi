import {
  createSSRApp,
  defineComponent,
  h,
  type PropType,
  type VNode
} from 'vue'
import { renderToString } from 'vue/server-renderer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSwipiCarousel } from '..'
import { SwipiCarouselOptions } from '../types'

const Carousel = defineComponent({
  props: {
    options: {
      type: Object as PropType<SwipiCarouselOptions>,
      default: (): SwipiCarouselOptions => ({})
    }
  },
  setup(props) {
    const [carouselRef, carousel] = useSwipiCarousel(props.options)

    return (): VNode =>
      h('section', [
        h('div', { ref: carouselRef }, [
          h('div', [
            h('article', 'one'),
            h('article', 'two'),
            h('article', 'three')
          ])
        ]),
        h(
          'p',
          [
            carousel.selectedIndex,
            carousel.snapCount,
            carousel.slidesCount,
            carousel.canScrollPrev,
            carousel.canScrollNext,
            carousel.hasOverflow
          ].join('/')
        )
      ])
  }
})

const renderCarousel = (options: SwipiCarouselOptions = {}): Promise<string> =>
  renderToString(createSSRApp(Carousel, { options }))

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
  it('renders without a window', () => {
    expect(typeof window).toBe('undefined')
  })

  it('returns the markup it was given', async () => {
    const html = await renderCarousel({
      loop: true,
      autoplay: true,
      startIndex: 2
    })

    expect(html).toContain('<article>one</article>')
    expect(html).toContain('<article>three</article>')
  })

  it('reports an unmeasured carousel', async () => {
    const html = await renderCarousel({ loop: true })

    expect(html).toContain('0/0/0/false/false/false')
  })

  it('says nothing to the console', async () => {
    const messages = listenToConsole()

    await renderCarousel({
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
