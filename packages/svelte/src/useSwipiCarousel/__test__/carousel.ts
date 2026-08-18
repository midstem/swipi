import { afterEach } from 'vitest'
import { useSwipiCarousel } from '..'
import { SwipiCarousel, SwipiCarouselSource } from '../types'
import { buildSlides, SLIDE_WIDTH, SLIDES_COUNT } from './dom'

export type CarouselProps = {
  options?: SwipiCarouselSource
  count?: number
  trackStyle?: string
}

export type MountedCarousel = {
  readCarousel: () => SwipiCarousel
  readState: () => string
  setCount: (count: number) => void
  setTrackStyle: (style: string) => void
  unmount: () => void
}

const isStore = (source: SwipiCarouselSource): boolean =>
  typeof (source as { subscribe?: unknown }).subscribe === 'function'

const withDefaults = (source: SwipiCarouselSource): SwipiCarouselSource =>
  isStore(source) ? source : { slideWidth: SLIDE_WIDTH, ...source }

const readable = (carousel: SwipiCarousel): string =>
  [
    carousel.selectedIndex,
    carousel.snapCount,
    carousel.slidesCount,
    carousel.canScrollPrev,
    carousel.canScrollNext,
    carousel.hasOverflow
  ].join('/')

const live = new Set<() => void>()

afterEach(() => Array.from(live).forEach((teardown) => teardown()))

export const settle = (): Promise<void> =>
  new Promise((done) => setTimeout(done, 0))

export const mountCarousel = (props: CarouselProps = {}): MountedCarousel => {
  const { options = {}, count = SLIDES_COUNT, trackStyle = '' } = props

  const host = document.createElement('div')
  const viewport = document.createElement('div')
  const track = document.createElement('div')

  viewport.setAttribute('data-testid', 'viewport')
  track.setAttribute('data-testid', 'track')

  if (trackStyle) track.setAttribute('style', trackStyle)

  buildSlides(track, count)
  viewport.appendChild(track)
  host.appendChild(viewport)
  document.body.appendChild(host)

  const [carouselRef, carousel] = useSwipiCarousel(withDefaults(options))

  let latest = {} as SwipiCarousel

  const stopReading = carousel.subscribe((next) => {
    latest = next
  })

  const action = carouselRef(viewport)

  const teardown = (): void => {
    action?.destroy?.()
    stopReading()
    host.remove()
    live.delete(teardown)
  }

  live.add(teardown)

  return {
    readCarousel: () => latest,
    readState: () => readable(latest),
    setCount: (next: number) => buildSlides(track, next),
    setTrackStyle: (style: string) => track.setAttribute('style', style),
    unmount: teardown
  }
}
