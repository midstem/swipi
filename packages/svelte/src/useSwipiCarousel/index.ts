import { writable } from 'svelte/store'
import type { Readable } from 'svelte/store'
import {
  createSwipi,
  resolveOptions,
  SwipiApi,
  SwipiSnapshot
} from '@midstem/swipi'
import {
  SwipiCarousel,
  SwipiCarouselOptions,
  SwipiCarouselRef,
  SwipiCarouselSource,
  UseSwipiCarousel
} from './types'

const EMPTY_TRANSFORM = ''

const noop = (): void => {}

const getEmptySnapshot = (): SwipiSnapshot => ({
  selectedIndex: 0,
  snapCount: 0,
  slidesCount: 0,
  hasOverflow: false,
  canScrollNext: false,
  canScrollPrev: false
})

const isStore = (
  source: SwipiCarouselSource
): source is Readable<SwipiCarouselOptions> =>
  typeof (source as Readable<SwipiCarouselOptions>).subscribe === 'function'

export const useSwipiCarousel = (
  options: SwipiCarouselSource = {}
): UseSwipiCarousel => {
  let engine: SwipiApi | null = null
  let currentOptions: SwipiCarouselOptions = isStore(options) ? {} : options
  let stopOptions = noop
  let stopSubscription = noop
  let stopTrack = noop

  const scrollNext = (): void => engine?.scrollNext()
  const scrollPrev = (): void => engine?.scrollPrev()
  const scrollTo = (index: number): void => engine?.scrollTo(index)

  const toCarousel = (snapshot: SwipiSnapshot): SwipiCarousel => ({
    selectedIndex: snapshot.selectedIndex,
    snapCount: snapshot.snapCount,
    slidesCount: snapshot.slidesCount,
    hasOverflow: snapshot.hasOverflow,
    canScrollNext: snapshot.canScrollNext,
    canScrollPrev: snapshot.canScrollPrev,
    scrollNext,
    scrollPrev,
    scrollTo
  })

  const carousel = writable<SwipiCarousel>(toCarousel(getEmptySnapshot()))

  const updateSnapshot = (): void => {
    if (!engine) return

    carousel.set(toCarousel(engine.getSnapshot()))
  }

  const watchOptions = (): (() => void) => {
    if (!isStore(options)) return noop

    return options.subscribe((next) => {
      currentOptions = next ?? {}
      engine?.update(resolveOptions(currentOptions))
    })
  }

  const watchTrack = (track: HTMLElement | null): (() => void) => {
    if (!track || typeof MutationObserver === 'undefined') return noop

    let rendered = track.style.transform

    const observer = new MutationObserver(() => {
      const transform = track.style.transform

      if (transform === rendered) return

      rendered = transform

      if (transform !== EMPTY_TRANSFORM) return

      engine?.sync()
      rendered = track.style.transform
    })

    observer.observe(track, { attributes: true, attributeFilter: ['style'] })

    return () => observer.disconnect()
  }

  const teardown = (): void => {
    stopOptions()
    stopSubscription()
    stopTrack()

    stopOptions = noop
    stopSubscription = noop
    stopTrack = noop

    engine?.destroy()
    engine = null

    carousel.set(toCarousel(getEmptySnapshot()))
  }

  const carouselRef: SwipiCarouselRef = (node) => {
    stopOptions = watchOptions()

    engine = createSwipi(node, resolveOptions(currentOptions))
    stopSubscription = engine.subscribe(updateSnapshot)
    stopTrack = watchTrack(node.firstElementChild as HTMLElement | null)

    updateSnapshot()

    return { destroy: teardown }
  }

  return [carouselRef, { subscribe: carousel.subscribe }]
}
