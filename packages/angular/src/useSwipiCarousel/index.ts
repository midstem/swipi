import {
  DestroyRef,
  effect,
  inject,
  Injector,
  isSignal,
  PLATFORM_ID,
  signal,
  untracked
} from '@angular/core'
import type { ProviderToken } from '@angular/core'
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
  SwipiCarouselTarget,
  UseSwipiCarousel
} from './types'

const EMPTY_TRANSFORM = ''

const BROWSER = 'browser'

const noop = (): void => {}

const getEmptySnapshot = (): SwipiSnapshot => ({
  selectedIndex: 0,
  snapCount: 0,
  slidesCount: 0,
  hasOverflow: false,
  canScrollNext: false,
  canScrollPrev: false
})

const tryInject = <T>(token: ProviderToken<T>): T | null => {
  try {
    return inject(token, { optional: true })
  } catch {
    return null
  }
}

const toElement = (target: SwipiCarouselTarget): HTMLElement | null => {
  if (!target) return null

  return ('nativeElement' in target ? target.nativeElement : target) ?? null
}

const getIsBrowser = (): boolean => {
  const platformId = tryInject(PLATFORM_ID)

  if (platformId) return platformId === BROWSER

  return typeof document !== 'undefined'
}

export const useSwipiCarousel = (
  options: SwipiCarouselSource = {}
): UseSwipiCarousel => {
  let engine: SwipiApi | null = null
  let attached: HTMLElement | null = null
  let stopSubscription = noop
  let stopTrack = noop

  const injector = tryInject(Injector)
  const destroyRef = tryInject(DestroyRef)
  const isBrowser = getIsBrowser()

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

  const carousel = signal<SwipiCarousel>(toCarousel(getEmptySnapshot()))

  const publish = (snapshot: SwipiSnapshot): void =>
    untracked(() => carousel.set(toCarousel(snapshot)))

  const readOptions = (): SwipiCarouselOptions =>
    (isSignal(options) ? options() : options) ?? {}

  const updateSnapshot = (): void => {
    if (!engine) return

    publish(engine.getSnapshot())
  }

  const watchOptions = (): (() => void) => {
    if (!isSignal(options) || !injector) return noop

    const reference = effect(
      () => {
        const next = resolveOptions(readOptions())

        untracked(() => engine?.update(next))
      },
      { injector }
    )

    return () => reference.destroy()
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

  const stopOptions = watchOptions()

  const detach = (): void => {
    stopSubscription()
    stopTrack()

    stopSubscription = noop
    stopTrack = noop

    engine?.destroy()
    engine = null
    attached = null
  }

  const carouselRef: SwipiCarouselRef = (target) => {
    const next = isBrowser ? toElement(target) : null

    if (next === attached) return

    detach()

    if (!next) {
      publish(getEmptySnapshot())

      return
    }

    attached = next
    engine = createSwipi(next, resolveOptions(untracked(readOptions)))
    stopSubscription = engine.subscribe(updateSnapshot)
    stopTrack = watchTrack(next.firstElementChild as HTMLElement | null)

    updateSnapshot()
  }

  destroyRef?.onDestroy(() => {
    stopOptions()
    detach()
    publish(getEmptySnapshot())
  })

  return [carouselRef, carousel.asReadonly()]
}
