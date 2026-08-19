import type { SlidePositions, SwipiState } from '@midstem/swipi'
import type {
  CarouselRef,
  ImperativeApiProps as CoreImperativeApiProps,
  PlaygroundEvent,
  PlaygroundState,
  StageProps,
  UpdateState
} from '@swipi/playground-core'

export type Component<Props> = {
  element: HTMLElement
  update: (props: Props) => void
}

export type SectionComponent = {
  element: HTMLElement
  body: HTMLElement
}

export type StageComponent = Component<StageProps> & {
  carousel: CarouselRef
  destroy: () => void
}

export type ImperativeApiProps = CoreImperativeApiProps & {
  carousel: CarouselRef | null
}

export type PlaygroundSnapshot = {
  state: PlaygroundState
  slides: string[]
  events: PlaygroundEvent[]
  remountKey: string
  carousel: CarouselRef | null
  swipiState?: SwipiState
  positions?: SlidePositions
}

export type Playground = {
  getSnapshot: () => PlaygroundSnapshot
  subscribe: (listener: () => void) => () => void
  update: UpdateState
  remount: () => void
  reset: () => void
  clearEvents: () => void
  handleSelect: (state: SwipiState) => void
  handleChange: (positions: SlidePositions) => void
  handleReady: (carousel: CarouselRef) => void
}
