import { SlidesGeometry, SlideOffsets, SwipiAxis } from '#src/types'

export type RenderTrackProps = {
  track: HTMLElement
  transform: number
  axis: SwipiAxis
  loop: boolean
  geometry: SlidesGeometry
  offsets: SlideOffsets
  hasAppliedOffsets: boolean
}
