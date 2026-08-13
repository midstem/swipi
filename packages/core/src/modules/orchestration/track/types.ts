import { SlidesGeometry, SlideOffsets } from '#src/types'

export type RenderTrackProps = {
  track: HTMLElement
  transform: number
  loop: boolean
  geometry: SlidesGeometry
  offsets: SlideOffsets
  hasAppliedOffsets: boolean
}
