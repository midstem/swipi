import { measureSlides, NO_WIDTH } from '../../index'
import { EMPTY_MEASUREMENT } from './constants'
import { isClose, isSameMeasurement } from './helpers'
import { SetupObserversProps } from './types'

export const setupObservers = ({
  track,
  offsets,
  onMeasure
}: SetupObserversProps): (() => void) => {
  let lastWidth = NO_WIDTH
  let lastMeasurement = EMPTY_MEASUREMENT

  const measure = (): void => {
    const nextWidth = track.getBoundingClientRect().width
    const nextMeasurement = measureSlides(track, offsets)

    let changed = false

    if (!isClose(lastWidth, nextWidth)) {
      lastWidth = nextWidth
      changed = true
    }

    if (!isSameMeasurement(lastMeasurement, nextMeasurement)) {
      lastMeasurement = nextMeasurement
      changed = true
    }

    if (changed) {
      onMeasure(lastWidth, lastMeasurement)
    }
  }

  // Initial measure
  measure()

  const hasResizeObserver = typeof ResizeObserver !== 'undefined'
  const sizes = hasResizeObserver ? new ResizeObserver(measure) : null

  const observeSlides = (): void => {
    if (!sizes) return

    sizes.disconnect()
    sizes.observe(track)

    for (let index = 0; index < track.children.length; index += 1) {
      sizes.observe(track.children[index])
    }
  }

  const children =
    typeof MutationObserver === 'undefined'
      ? null
      : new MutationObserver(() => {
          observeSlides()
          measure()
        })

  observeSlides()
  children?.observe(track, { childList: true })

  if (!hasResizeObserver) window.addEventListener('resize', measure)

  return () => {
    sizes?.disconnect()
    children?.disconnect()

    if (!hasResizeObserver) window.removeEventListener('resize', measure)
  }
}

export { EMPTY_MEASUREMENT }
export type { SetupObserversProps }
