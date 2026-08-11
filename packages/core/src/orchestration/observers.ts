import {
  GEOMETRY_TOLERANCE,
  measureSlides,
  NO_WIDTH,
  SlideOffsets,
  SlidesMeasurement
} from '../index'

export const EMPTY_MEASUREMENT: SlidesMeasurement = {
  positions: [],
  sizes: [],
  contentSize: 0,
  loopSize: 0
}

const isClose = (a: number, b: number): boolean =>
  Math.abs(a - b) < GEOMETRY_TOLERANCE

export const isSameMeasurement = (
  a: SlidesMeasurement,
  b: SlidesMeasurement
): boolean =>
  isClose(a.contentSize, b.contentSize) &&
  isClose(a.loopSize, b.loopSize) &&
  a.positions.length === b.positions.length &&
  a.positions.every((position, index) =>
    isClose(position, b.positions[index])
  ) &&
  a.sizes.every((size, index) => isClose(size, b.sizes[index]))

export type SetupObserversProps = {
  track: HTMLElement
  offsets: SlideOffsets
  onMeasure: (width: number, measurement: SlidesMeasurement) => void
}

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
