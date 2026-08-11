import { SlideOffsets, SlidesMeasurement } from '../../../types'

export type SetupObserversProps = {
  track: HTMLElement
  offsets: SlideOffsets
  onMeasure: (width: number, measurement: SlidesMeasurement) => void
}

export type ObserversApi = {
  measure: () => void
  destroy: () => void
}
