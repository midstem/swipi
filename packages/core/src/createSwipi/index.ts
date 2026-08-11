import {
  ResolvedSwipiOptions,
  SwipiOptions,
  SwipiApi,
  SlideOffsets
} from '#src/types'
import { measureSlides } from '#src/modules/geometry'
import { getSlidePositions } from '#src/modules/neighbours'
import {
  applyTrackVariables,
  removeTrackVariables,
  renderTrack,
  clearTrackTransform,
  resetSlideOffsets
} from '#src/modules/orchestration/track'
import { setupTransform } from '#src/modules/orchestration/transform'
import { setupEvents } from '#src/modules/orchestration/events'
import { setupObservers } from '#src/modules/orchestration/observers'
import { setupAutoplay } from '#src/modules/orchestration/autoplay'
import { setupPrefersReducedMotion } from '#src/modules/orchestration/prefersReducedMotion'

import { DEFAULT_OPTIONS, MISSING_TRACK_ERROR } from './constants'
import { toStoreState } from './helpers'
import { setupStore } from './store'
import { setupScroll } from './scroll'
import { setupGeometrySync } from './geometrySync'

export const createSwipi = (
  viewport: HTMLElement,
  options: SwipiOptions = {}
): SwipiApi => {
  const track = viewport.firstElementChild as HTMLElement | null
  if (!track) throw new Error(MISSING_TRACK_ERROR)

  let currentOptions: ResolvedSwipiOptions = { ...DEFAULT_OPTIONS, ...options }
  let prefersReducedMotion = false

  const offsets: SlideOffsets = new WeakMap()
  let hasAppliedOffsets = false

  const watchReducedMotion = (): (() => void) =>
    setupPrefersReducedMotion((reduced) => {
      prefersReducedMotion = currentOptions.respectReducedMotion
        ? reduced
        : false
    })

  const store = setupStore({
    onChange: (positions) => currentOptions.onChange?.(positions),
    onSelect: (state) => currentOptions.onSelect?.(state),
    getSlidePositions,
    getIsMeasured: () => sync.state.isMeasured,
    getIsLoop: () => sync.state.isLoop
  })

  const sync = setupGeometrySync({
    getOptions: () => currentOptions,
    onState: (state) => store.updateSnapshot(toStoreState(state)),
    moveTo: (target) => transformApi.moveTo(target),
    restartAutoplay: () => autoplayApi.restart()
  })

  const render = (transformValue: number): void => {
    hasAppliedOffsets = renderTrack({
      track,
      transform: transformValue,
      loop: sync.state.isLoop,
      geometry: sync.state.geometry,
      offsets,
      hasAppliedOffsets
    })
  }

  const transformApi = setupTransform({ render, onTarget: sync.syncSlideIndex })

  const destroyEvents = setupEvents({
    viewport,
    getIsLoop: () => sync.state.isLoop,
    getDragFree: () => currentOptions.dragFree,
    getGeometry: () => sync.state.geometry,
    getHasOverflow: () => sync.state.hasOverflow,
    getAnimationSpeed: () => currentOptions.animationSpeed,
    getTransform: () => transformApi.getContext().transform,
    moveTo: transformApi.moveTo,
    animateTo: (value, duration) =>
      transformApi.animateTo(
        value,
        duration ?? currentOptions.animationSpeed,
        prefersReducedMotion
      )
  })

  const scrollApi = setupScroll({
    getCanScrollNext: () => sync.state.canScrollNext,
    getCanScrollPrev: () => sync.state.canScrollPrev,
    getTarget: () => transformApi.getContext().target,
    getGeometry: () => sync.state.geometry,
    getIsLoop: () => sync.state.isLoop,
    getAnimationSpeed: () => currentOptions.animationSpeed,
    getPrefersReducedMotion: () => prefersReducedMotion,
    animateTo: transformApi.animateTo
  })

  const autoplayApi = setupAutoplay({
    getAutoplay: () => currentOptions.autoplay,
    getAutoplaySpeed: () => currentOptions.autoplaySpeed,
    onTick: scrollApi.scrollNext
  })

  autoplayApi.restart()

  let destroyPrefersReducedMotion = watchReducedMotion()

  applyTrackVariables(
    track,
    currentOptions.slideWidth,
    currentOptions.spaceBetween
  )

  const observers = setupObservers({
    track,
    offsets,
    onMeasure: sync.syncGeometry
  })

  return {
    scrollNext: scrollApi.scrollNext,
    scrollPrev: scrollApi.scrollPrev,
    scrollTo: scrollApi.scrollTo,
    getSnapshot: () => store.getSnapshot(toStoreState(sync.state)),
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
        destroyPrefersReducedMotion = watchReducedMotion()
      }
    },
    measure: observers.measure,
    sync: () => {
      render(transformApi.getContext().transform)
      sync.syncSlideIndex(transformApi.getContext().target)
    },
    destroy: () => {
      destroyEvents()
      observers.destroy()
      destroyPrefersReducedMotion()
      autoplayApi.destroy()
      transformApi.destroy()
      removeTrackVariables(track)
      clearTrackTransform(track)
      resetSlideOffsets(track)
      hasAppliedOffsets = false
    }
  }
}
