import { FIRST_SLIDE_INDEX } from '../constants'
import { SwipiOptions, SwipiApi, SlideOffsets } from '../types'
import { measureSlides } from '../modules/geometry'
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
import { setupObservers } from '../modules/orchestration/observers'
import { setupAutoplay } from '../modules/orchestration/autoplay'
import { setupPrefersReducedMotion } from '../modules/orchestration/prefersReducedMotion'

import { setupStore } from './store'
import { setupScroll } from './scroll'
import { setupGeometrySync, GeometryState } from './geometrySync'

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
  let prefersReducedMotion = false

  const offsets: SlideOffsets = new WeakMap()
  let hasAppliedOffsets = false
  let destroyPrefersReducedMotion: () => void

  const store = setupStore({
    onChange: (positions) => currentOptions.onChange?.(positions),
    onSelect: (state) => currentOptions.onSelect?.(state),
    getSlidePositions,
    getIsMeasured: () => sync.state.isMeasured,
    getIsLoop: () => sync.state.isLoop
  })

  const syncStateAndNotify = (state: GeometryState) => {
    store.updateSnapshot({
      slideIndex: state.slideIndex,
      snapCount: state.countShowDots,
      slidesCount: state.measurement.sizes.length,
      hasOverflow: state.hasOverflow,
      canScrollNext: state.canScrollNext,
      canScrollPrev: state.canScrollPrev
    })
  }

  const sync = setupGeometrySync({
    getOptions: () => currentOptions,
    syncStateAndNotify,
    moveTo: (target) => transformApi.moveTo(target),
    restartAutoplay: () => autoplayApi.restart()
  })

  const render = (transformValue: number) => {
    renderTrack(
      track,
      transformValue,
      sync.state.isLoop,
      sync.state.geometry,
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

  const transformApi = setupTransform({ render, onTarget: sync.syncSlideIndex })

  const destroyEvents = setupEvents({
    viewport,
    getIsLoop: () => sync.state.isLoop,
    getDragFree: () => !!currentOptions.dragFree,
    getGeometry: () => sync.state.geometry,
    getHasOverflow: () => sync.state.hasOverflow,
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
    getCanScrollNext: () => sync.state.canScrollNext,
    getCanScrollPrev: () => sync.state.canScrollPrev,
    getTarget: () => transformApi.getContext().target,
    getGeometry: () => sync.state.geometry,
    getIsLoop: () => sync.state.isLoop,
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
    onMeasure: sync.syncGeometry
  })

  return {
    scrollNext: scrollApi.scrollNext,
    scrollPrev: scrollApi.scrollPrev,
    scrollTo: scrollApi.scrollTo,
    getSnapshot: () =>
      store.getSnapshot({
        slideIndex: sync.state.slideIndex,
        snapCount: sync.state.countShowDots,
        slidesCount: sync.state.measurement.sizes.length,
        hasOverflow: sync.state.hasOverflow,
        canScrollNext: sync.state.canScrollNext,
        canScrollPrev: sync.state.canScrollPrev
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
        sync.syncGeometry(
          sync.state.containerWidth,
          measureSlides(track, offsets)
        )
        render(transformApi.getContext().transform)
      } else if (prevOptions.loop !== currentOptions.loop) {
        sync.syncGeometry(sync.state.containerWidth, sync.state.measurement)
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
      sync.syncSlideIndex(transformApi.getContext().target)
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
