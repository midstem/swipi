import type { Signal } from '@angular/core'
import type { SlidePositions, SwipiState } from '@midstem/swipi-angular'
import type {
  CarouselRef,
  PlaygroundEvent,
  PlaygroundState,
  UpdateState
} from '@swipi/playground-core'

export type UsePlaygroundReturn = {
  state: Signal<PlaygroundState>
  slides: Signal<string[]>
  events: Signal<PlaygroundEvent[]>
  remountKey: Signal<string>
  carousel: Signal<CarouselRef | null>
  swipiState: Signal<SwipiState | undefined>
  positions: Signal<SlidePositions | undefined>
  update: UpdateState
  remount: () => void
  reset: () => void
  clearEvents: () => void
  handleSelect: (state: SwipiState) => void
  handleChange: (positions: SlidePositions) => void
  handleReady: (carousel: CarouselRef) => void
}
