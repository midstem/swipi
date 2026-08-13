import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { SlidePositions, SwipiState } from 'swipi-vue'
import type {
  CarouselRef,
  ImperativeApiProps as CoreImperativeApiProps,
  StageProps as CoreStageProps,
  PlaygroundEvent,
  PlaygroundState,
  UpdateState
} from '@swipi/playground-core'

export type SwipiRef = ShallowRef<CarouselRef | null>

export type StageProps = Pick<CoreStageProps, 'state' | 'slides'>

export type ImperativeApiProps = CoreImperativeApiProps & {
  carousel: CarouselRef | null
}

export type UsePlaygroundReturn = {
  state: PlaygroundState
  slides: ComputedRef<string[]>
  events: Ref<PlaygroundEvent[]>
  remountKey: ComputedRef<string>
  swipiRef: SwipiRef
  swipiState: Ref<SwipiState | undefined>
  positions: Ref<SlidePositions | undefined>
  update: UpdateState
  remount: () => void
  reset: () => void
  clearEvents: () => void
  handleSelect: (state: SwipiState) => void
  handleChange: (positions: SlidePositions) => void
  handleReady: (carousel: CarouselRef) => void
}
