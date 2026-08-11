import { SlideOffsets, SlidesMeasurement } from '../../index'

export type SetupObserversProps = {
  track: HTMLElement
  offsets: SlideOffsets
  onMeasure: (width: number, measurement: SlidesMeasurement) => void
}
