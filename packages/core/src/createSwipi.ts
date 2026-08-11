import {
  clamp,
  FIRST_SLIDE_INDEX,
  getSlidePositions,
  getSnapIndex,
  getScrollToTarget,
  getStepTarget,
  clampToSnaps,
  NO_SLIDES,
  ONE_STEP,
  toSnaps,
  SwipiOptions,
  SwipiApi,
  SwipiSnapshot,
  SlideOffsets,
  SlidesGeometry,
  SlidesMeasurement
} from './index'
import { measureSlides } from './geometry'
import {
  applyTrackVariables,
  removeTrackVariables,
  renderTrack,
  clearTrackTransform,
  resetSlideOffsets
} from './orchestration/track'
import { setupTransform } from './orchestration/transform'
import { setupEvents } from './orchestration/events'
import { setupObservers, EMPTY_MEASUREMENT } from './orchestration/observers'
import { setupAutoplay } from './orchestration/autoplay'
import { setupPrefersReducedMotion } from './orchestration/prefersReducedMotion'

const DEFAULT_OPTIONS: SwipiOptions = {
  loop: false,
  dragFree: false,
  autoplay: false,
  startIndex: FIRST_SLIDE_INDEX,
  autoplaySpeed: 3000,
  animationSpeed: 300,
  respectReducedMotion: false
}

export const createSwipi = (
  viewport: HTMLElement,
  options: SwipiOptions = {}
): SwipiApi => {
  const track = viewport.firstElementChild as HTMLElement | null
  if (!track) {
    throw new Error(
      'Swipi: Viewport must have at least one child element (the track).'
    )
  }

  let currentOptions = { ...DEFAULT_OPTIONS, ...options }
  const subscribers = new Set<() => void>()

  let slideIndex = FIRST_SLIDE_INDEX
  let containerWidth = 0
  let measurement: SlidesMeasurement = EMPTY_MEASUREMENT
  let geometry: SlidesGeometry = { ...EMPTY_MEASUREMENT, snaps: [] }
  let hasOverflow = false
  let isLoop = false
  let canScrollNext = false
  let canScrollPrev = false
  let countShowDots = 0
  let lastIndex = FIRST_SLIDE_INDEX
  let isMeasured = false
  let isStartIndexApplied = false
  let prefersReducedMotion = false

  const offsets: SlideOffsets = new WeakMap()
  let hasAppliedOffsets = false

  let cachedSnapshot: SwipiSnapshot | null = null

  let destroyPrefersReducedMotion: () => void

  const notify = () => {
    subscribers.forEach((listener) => listener())
  }

  const updateSnapshot = () => {
    const nextSnapshot: SwipiSnapshot = {
      selectedIndex: slideIndex,
      snapCount: countShowDots,
      slidesCount: measurement.sizes.length,
      hasOverflow,
      canScrollNext,
      canScrollPrev
    }

    if (
      !cachedSnapshot ||
      cachedSnapshot.selectedIndex !== nextSnapshot.selectedIndex ||
      cachedSnapshot.snapCount !== nextSnapshot.snapCount ||
      cachedSnapshot.slidesCount !== nextSnapshot.slidesCount ||
      cachedSnapshot.hasOverflow !== nextSnapshot.hasOverflow ||
      cachedSnapshot.canScrollNext !== nextSnapshot.canScrollNext ||
      cachedSnapshot.canScrollPrev !== nextSnapshot.canScrollPrev
    ) {
      cachedSnapshot = nextSnapshot
      notify()

      if (isMeasured) {
        currentOptions.onChange?.(
          getSlidePositions(
            cachedSnapshot.selectedIndex,
            cachedSnapshot.snapCount,
            isLoop
          )
        )
        currentOptions.onSelect?.({
          selectedIndex: cachedSnapshot.selectedIndex,
          snapCount: cachedSnapshot.snapCount,
          canScrollNext: cachedSnapshot.canScrollNext,
          canScrollPrev: cachedSnapshot.canScrollPrev
        })
      }
    }
  }

  const syncGeometry = (width: number, measure: SlidesMeasurement) => {
    containerWidth = width
    measurement = measure
    const slidesCount = measurement.sizes.length
    isMeasured = slidesCount > NO_SLIDES

    hasOverflow = measurement.contentSize > containerWidth
    isLoop = !!currentOptions.loop && hasOverflow

    geometry = {
      ...measurement,
      snaps: toSnaps({
        ...measurement,
        viewportWidth: containerWidth,
        loop: isLoop
      })
    }

    countShowDots = geometry.snaps.length
    lastIndex = Math.max(countShowDots - 1, FIRST_SLIDE_INDEX)

    canScrollNext = isLoop || slideIndex < lastIndex
    canScrollPrev = isLoop || slideIndex > FIRST_SLIDE_INDEX

    updateSnapshot()

    if (isMeasured) {
      if (!isStartIndexApplied) {
        isStartIndexApplied = true
        const startIndex = currentOptions.startIndex ?? FIRST_SLIDE_INDEX
        transformApi.moveTo(
          geometry.snaps[clamp(startIndex, FIRST_SLIDE_INDEX, lastIndex)] ?? 0
        )
      } else {
        // If geometry changed but we are already initialized, we snap to the closest index
        transformApi.moveTo(
          geometry.snaps[clamp(slideIndex, 0, lastIndex)] ?? 0
        )
      }
    }
  }

  const syncSlideIndex = (target: number): void => {
    const index = getSnapIndex(target, geometry, isLoop)
    if (slideIndex !== index) {
      slideIndex = index
      canScrollNext = isLoop || slideIndex < lastIndex
      canScrollPrev = isLoop || slideIndex > FIRST_SLIDE_INDEX

      autoplayApi.restart()
      updateSnapshot()
    }
  }

  const render = (transformValue: number) => {
    renderTrack(
      track,
      transformValue,
      isLoop,
      geometry,
      offsets,
      hasAppliedOffsets,
      () => {
        hasAppliedOffsets = true
      },
      () => {
        hasAppliedOffsets = false
      }
    )
  }

  const transformApi = setupTransform({
    render,
    onTarget: syncSlideIndex
  })

  const destroyEvents = setupEvents({
    viewport,
    getIsLoop: () => isLoop,
    getDragFree: () => !!currentOptions.dragFree,
    getGeometry: () => geometry,
    getHasOverflow: () => hasOverflow,
    getAnimationSpeed: () => currentOptions.animationSpeed ?? 300,
    getTransform: () => transformApi.getContext().transform,
    moveTo: transformApi.moveTo,
    animateTo: (value, duration) =>
      transformApi.animateTo(
        value,
        duration ?? currentOptions.animationSpeed ?? 300,
        prefersReducedMotion
      )
  })

  const scrollNext = () => {
    if (!canScrollNext) return
    const target = transformApi.getContext().target
    const transformValue = getStepTarget(target, geometry, isLoop, ONE_STEP)
    transformApi.animateTo(
      clampToSnaps(transformValue, geometry, isLoop),
      currentOptions.animationSpeed ?? 300,
      prefersReducedMotion
    )
  }

  const scrollPrev = () => {
    if (!canScrollPrev) return
    const target = transformApi.getContext().target
    const transformValue = getStepTarget(target, geometry, isLoop, -ONE_STEP)
    transformApi.animateTo(
      clampToSnaps(transformValue, geometry, isLoop),
      currentOptions.animationSpeed ?? 300,
      prefersReducedMotion
    )
  }

  const scrollTo = (index: number) => {
    const target = transformApi.getContext().target
    const transformValue = getScrollToTarget(target, geometry, isLoop, index)
    transformApi.animateTo(
      transformValue,
      currentOptions.animationSpeed ?? 300,
      prefersReducedMotion
    )
  }

  const autoplayApi = setupAutoplay({
    getAutoplay: () => !!currentOptions.autoplay,
    getAutoplaySpeed: () => currentOptions.autoplaySpeed ?? 3000,
    nextImg: scrollNext
  })

  autoplayApi.restart()

  destroyPrefersReducedMotion = setupPrefersReducedMotion((reduced) => {
    if (!currentOptions.respectReducedMotion) {
      prefersReducedMotion = false
    } else {
      prefersReducedMotion = reduced
    }
  })

  applyTrackVariables(
    track,
    currentOptions.slideWidth,
    currentOptions.spaceBetween
  )

  const destroyObservers = setupObservers({
    track,
    offsets,
    onMeasure: syncGeometry
  })

  return {
    scrollNext,
    scrollPrev,
    scrollTo,
    getSnapshot: () => {
      if (!cachedSnapshot) {
        cachedSnapshot = {
          selectedIndex: slideIndex,
          snapCount: countShowDots,
          slidesCount: measurement.sizes.length,
          hasOverflow,
          canScrollNext,
          canScrollPrev
        }
      }
      return cachedSnapshot
    },
    subscribe: (listener) => {
      subscribers.add(listener)
      return () => {
        subscribers.delete(listener)
      }
    },
    update: (newOptions) => {
      const prevOptions = currentOptions
      currentOptions = { ...currentOptions, ...newOptions }

      if (
        prevOptions.slideWidth !== currentOptions.slideWidth ||
        prevOptions.spaceBetween !== currentOptions.spaceBetween
      ) {
        applyTrackVariables(
          track,
          currentOptions.slideWidth,
          currentOptions.spaceBetween
        )

        // Force a re-measurement since layout variables changed
        syncGeometry(containerWidth, measureSlides(track, offsets))
        render(transformApi.getContext().transform)
      } else if (prevOptions.loop !== currentOptions.loop) {
        syncGeometry(containerWidth, measurement)
        render(transformApi.getContext().transform)
      }

      if (
        prevOptions.autoplay !== currentOptions.autoplay ||
        prevOptions.autoplaySpeed !== currentOptions.autoplaySpeed
      ) {
        autoplayApi.restart()
      }

      if (
        prevOptions.respectReducedMotion !== currentOptions.respectReducedMotion
      ) {
        destroyPrefersReducedMotion()
        destroyPrefersReducedMotion = setupPrefersReducedMotion((reduced) => {
          prefersReducedMotion = currentOptions.respectReducedMotion
            ? reduced
            : false
        })
      }
    },
    measure: () => {
      // Just re-assigns variables from DOM which might trigger observer
      // We can also force an observer check if needed, but observer usually handles it.
    },
    sync: () => {
      render(transformApi.getContext().transform)
      syncSlideIndex(transformApi.getContext().target)
    },
    destroy: () => {
      destroyEvents()
      destroyObservers()
      destroyPrefersReducedMotion()
      autoplayApi.destroy()
      transformApi.destroy()
      removeTrackVariables(track)
      clearTrackTransform(track)
      resetSlideOffsets(track, () => {
        hasAppliedOffsets = false
      })
    }
  }
}
