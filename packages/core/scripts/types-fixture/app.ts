import { createSwipi, resolveOptions } from '@midstem/swipi'
import type {
  ResolvedSwipiOptions,
  SlidePositions,
  SwipiApi,
  SwipiAxis,
  SwipiOptions,
  SwipiSnapshot,
  SwipiState
} from '@midstem/swipi'

const AXIS: SwipiAxis = 'y'

export const headless = (viewport: HTMLElement): (() => void) => {
  const carousel: SwipiApi = createSwipi(viewport, {
    loop: true,
    dragFree: true,
    onSelect: (state: SwipiState) => state.selectedIndex
  })

  const unsubscribe = carousel.subscribe(() => {
    const snapshot: SwipiSnapshot = carousel.getSnapshot()

    if (snapshot.canScrollNext) carousel.scrollNext()
  })

  return () => {
    unsubscribe()
    carousel.destroy()
  }
}

export const defaults = (options?: SwipiOptions): ResolvedSwipiOptions =>
  resolveOptions(options)

export const consumer = (viewport: HTMLElement): SwipiSnapshot => {
  let state: SwipiState | undefined
  let positions: SlidePositions | undefined

  const options: SwipiOptions = {
    axis: AXIS,
    loop: true,
    autoplay: true,
    slideWidth: 320,
    spaceBetween: 10,
    startIndex: 1,
    autoplaySpeed: 4000,
    animationSpeed: 300,
    respectReducedMotion: true,
    onSelect: (next) => {
      state = next
    },
    onChange: (next) => {
      positions = next
    }
  }

  const carousel = createSwipi(viewport, options)

  carousel.update({ loop: false })
  carousel.measure()
  carousel.sync()
  carousel.scrollPrev()
  carousel.scrollTo(carousel.getSnapshot().snapCount - 1)
  carousel.destroy()

  return {
    ...carousel.getSnapshot(),
    selectedIndex: state?.selectedIndex ?? positions?.current ?? 0
  }
}
