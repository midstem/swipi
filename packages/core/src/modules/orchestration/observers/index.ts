import { EMPTY_MEASUREMENT, NO_WIDTH } from '#src/constants'
import { getElementSize } from '#src/modules/axis'
import { measureSlides } from '#src/modules/geometry'
import { SlidesMeasurement } from '#src/types'
import { isClose, isSameMeasurement } from './helpers'
import { ObserversApi, SetupObserversProps } from './types'

export const setupObservers = ({
  track,
  offsets,
  getAxis,
  onMeasure
}: SetupObserversProps): ObserversApi => {
  let lastWidth = NO_WIDTH
  let lastMeasurement = EMPTY_MEASUREMENT

  const read = (): [number, SlidesMeasurement] => [
    getElementSize(track, getAxis()),
    measureSlides(track, offsets, getAxis())
  ]

  const measure = (): void => {
    const [nextWidth, nextMeasurement] = read()

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

  const remeasure = (): void => {
    const [nextWidth, nextMeasurement] = read()

    lastWidth = nextWidth
    lastMeasurement = nextMeasurement

    onMeasure(lastWidth, lastMeasurement)
  }

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

  return {
    measure,
    remeasure,
    destroy: () => {
      sizes?.disconnect()
      children?.disconnect()

      if (!hasResizeObserver) window.removeEventListener('resize', measure)
    }
  }
}

export type { ObserversApi, SetupObserversProps }
