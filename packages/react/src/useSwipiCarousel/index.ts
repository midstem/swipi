import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from 'react'
import {
  createSwipi,
  DEFAULT_OPTIONS,
  SwipiApi,
  SwipiSnapshot
} from '@swipi/core'
import { SwipiCarousel, SwipiCarouselOptions, UseSwipiCarousel } from './types'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { useLatestRef } from '../hooks/useLatestRef'

const noop = (): void => {}
const noopSubscribe = () => noop

const getEmptySnapshot = (): SwipiSnapshot => ({
  selectedIndex: 0,
  snapCount: 0,
  slidesCount: 0,
  hasOverflow: false,
  canScrollNext: false,
  canScrollPrev: false
})

const emptySnapshot = getEmptySnapshot()

const toCarousel = (
  snapshot: SwipiSnapshot,
  engine: SwipiApi | null
): SwipiCarousel => ({
  slidesCount: snapshot.slidesCount,
  hasOverflow: snapshot.hasOverflow,
  selectedIndex: snapshot.selectedIndex,
  snapCount: snapshot.snapCount,
  canScrollNext: snapshot.canScrollNext,
  canScrollPrev: snapshot.canScrollPrev,
  scrollNext: engine ? () => engine.scrollNext() : noop,
  scrollPrev: engine ? () => engine.scrollPrev() : noop,
  scrollTo: engine ? (index) => engine.scrollTo(index) : noop
})

export const useSwipiCarousel = (
  options: SwipiCarouselOptions = {}
): UseSwipiCarousel => {
  const engineRef = useRef<SwipiApi | null>(null)
  const [engine, setEngine] = useState<SwipiApi | null>(null)
  const fullOptions = {
    ...DEFAULT_OPTIONS,
    onChange: noop,
    onSelect: noop,
    slideWidth: undefined,
    spaceBetween: undefined,
    ...options
  }

  const optionsRef = useLatestRef(fullOptions)

  const carouselRef = useCallback(
    (node: HTMLElement | null): void => {
      engineRef.current?.destroy()
      engineRef.current = node ? createSwipi(node, optionsRef.current) : null
      setEngine(engineRef.current)
    },
    [optionsRef]
  )

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      return engine ? engine.subscribe(onStoreChange) : noopSubscribe()
    },
    [engine]
  )

  const getSnapshot = useCallback(() => {
    return engine ? engine.getSnapshot() : emptySnapshot
  }, [engine])

  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getEmptySnapshot
  )

  useIsomorphicLayoutEffect(() => {
    engineRef.current?.update(fullOptions)
  }, [
    fullOptions.loop,
    fullOptions.dragFree,
    fullOptions.autoplay,
    fullOptions.startIndex,
    fullOptions.autoplaySpeed,
    fullOptions.animationSpeed,
    fullOptions.respectReducedMotion,
    fullOptions.slideWidth,
    fullOptions.spaceBetween,
    fullOptions.onChange,
    fullOptions.onSelect
  ])

  useIsomorphicLayoutEffect(() => {
    engineRef.current?.sync()
  })

  return [
    carouselRef,
    useMemo(() => toCarousel(snapshot, engine), [snapshot, engine])
  ]
}
