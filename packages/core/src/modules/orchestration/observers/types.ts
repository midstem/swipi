import { SlideOffsets, SlidesMeasurement, SwipiAxis } from '#src/types'

export type SetupObserversProps = {
  track: HTMLElement
  offsets: SlideOffsets
  getAxis: () => SwipiAxis
  onMeasure: (width: number, measurement: SlidesMeasurement) => void
}

export type ObserversApi = {
  measure: () => void
  remeasure: () => void
  destroy: () => void
}
