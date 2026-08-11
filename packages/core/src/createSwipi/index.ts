import { FIRST_SLIDE_INDEX, NO_SLIDES } from '../constants'
import { clamp } from '../modules/math'
import {
  SwipiOptions,
  SwipiApi,
  SlideOffsets,
  SlidesGeometry,
  SlidesMeasurement
} from '../types'
import { getSnapIndex, toSnaps, measureSlides } from '../modules/geometry'
import { getSlidePositions } from '../modules/neighbours'
import {
  applyTrackVariables,
  removeTrackVariables,
  renderTrack,
  clearTrackTransform,
  resetSlideOffsets
} from '../modules/orchestration/track'
import { setupTransform } from '../modules/orchestration/transform'
import { setupEvents } from '../modules/orchestration/events'
import {
  setupObservers,
  EMPTY_MEASUREMENT
} from '../modules/orchestration/observers'
import { setupAutoplay } from '../modules/orchestration/autoplay'
import { setupPrefersReducedMotion } from '../modules/orchestration/prefersReducedMotion'

import { setupStore } from './store'
import { setupScroll } from './scroll'

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
  let destroyPrefersReducedMotion: () => void

  const store = setupStore({
    onChange: (positions) => currentOptions.onChange?.(positions),
    onSelect: (state) => currentOptions.onSelect?.(state),
    getSlidePositions,
    getIsMeasured: () => isMeasured,
    getIsLoop: () => isLoop
  })

  const syncStateAndNotify = () => {
    store.updateSnapshot({
      slideIndex,
      snapCount: countShowDots,
      slidesCount: measurement.sizes.length,
      hasOverflow,
      canScrollNext,
      canScrollPrev
    })
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

    syncStateAndNotify()

    if (isMeasured) {
      if (!isStartIndexApplied) {
        isStartIndexApplied = true
        const startIndex = currentOptions.startIndex ?? FIRST_SLIDE_INDEX
        transformApi.moveTo(
          geometry.snaps[clamp(startIndex, FIRST_SLIDE_INDEX, lastIndex)] ?? 0
        )
      } else {
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
      syncStateAndNotify()
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

  const transformApi = setupTransform({ render, onTarget: syncSlideIndex })

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

  const scrollApi = setupScroll({
    getCanScrollNext: () => canScrollNext,
    getCanScrollPrev: () => canScrollPrev,
    getTarget: () => transformApi.getContext().target,
    getGeometry: () => geometry,
    getIsLoop: () => isLoop,
    getAnimationSpeed: () => currentOptions.animationSpeed ?? 300,
    getPrefersReducedMotion: () => prefersReducedMotion,
    animateTo: transformApi.animateTo
  })

  const autoplayApi = setupAutoplay({
    getAutoplay: () => !!currentOptions.autoplay,
    getAutoplaySpeed: () => currentOptions.autoplaySpeed ?? 3000,
    nextImg: scrollApi.scrollNext
  })

  autoplayApi.restart()

  destroyPrefersReducedMotion = setupPrefersReducedMotion((reduced) => {
    prefersReducedMotion = currentOptions.respectReducedMotion ? reduced : false
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
    scrollNext: scrollApi.scrollNext,
    scrollPrev: scrollApi.scrollPrev,
    scrollTo: scrollApi.scrollTo,
    getSnapshot: () =>
      store.getSnapshot({
        slideIndex,
        snapCount: countShowDots,
        slidesCount: measurement.sizes.length,
        hasOverflow,
        canScrollNext,
        canScrollPrev
      }),
    subscribe: store.subscribe,
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
    measure: () => {},
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
