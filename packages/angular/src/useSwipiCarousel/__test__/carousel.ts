import { afterEach } from 'vitest'
import { ElementRef, isSignal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { useSwipiCarousel } from '..'
import { SwipiCarousel, SwipiCarouselSource } from '../types'
import { buildSlides, SLIDE_WIDTH, SLIDES_COUNT } from './dom'

export type CarouselProps = {
  options?: SwipiCarouselSource
  count?: number
  trackStyle?: string
  asElementRef?: boolean
}

export type MountedCarousel = {
  readCarousel: () => SwipiCarousel
  readState: () => string
  setCount: (count: number) => void
  setTrackStyle: (style: string) => void
  attach: () => void
  detach: () => void
  unmount: () => void
  destroy: () => void
}

const withDefaults = (source: SwipiCarouselSource): SwipiCarouselSource =>
  isSignal(source) ? source : { slideWidth: SLIDE_WIDTH, ...source }

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

afterEach(() => {
  Array.from(live).forEach((teardown) => teardown())
  TestBed.resetTestingModule()
})

export const settle = (): Promise<void> =>
  new Promise((done) => setTimeout(done, 0))

export const flush = (): void => TestBed.tick()

export const mountCarousel = (props: CarouselProps = {}): MountedCarousel => {
  const {
    options = {},
    count = SLIDES_COUNT,
    trackStyle = '',
    asElementRef = false
  } = props

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

  const [carouselRef, carousel] = TestBed.runInInjectionContext(() =>
    useSwipiCarousel(withDefaults(options))
  )

  const attach = (): void =>
    carouselRef(asElementRef ? new ElementRef(viewport) : viewport)

  attach()

  const teardown = (): void => {
    carouselRef(null)
    host.remove()
    live.delete(teardown)
  }

  live.add(teardown)

  return {
    readCarousel: () => carousel(),
    readState: () => readable(carousel()),
    setCount: (next: number) => buildSlides(track, next),
    setTrackStyle: (style: string) => track.setAttribute('style', style),
    attach,
    detach: () => carouselRef(null),
    unmount: teardown,
    destroy: () => TestBed.resetTestingModule()
  }
}
