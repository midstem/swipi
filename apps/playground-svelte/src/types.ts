import type { Snippet } from 'svelte'
import type { SlidePositions, SwipiState } from '@midstem/swipi-svelte'
import type {
  CarouselRef,
  ImperativeApiProps as CoreImperativeApiProps,
  SectionProps as CoreSectionProps,
  StageProps as CoreStageProps,
  PlaygroundEvent,
  PlaygroundState,
  UpdateState
} from '@swipi/playground-core'

export type SectionProps = CoreSectionProps & {
  children: Snippet
}

export type StageProps = CoreStageProps & {
  onReady: (carousel: CarouselRef) => void
}

export type ImperativeApiProps = CoreImperativeApiProps & {
  carousel: CarouselRef | null
}

export type UsePlaygroundReturn = {
  state: PlaygroundState
  readonly slides: string[]
  readonly events: PlaygroundEvent[]
  readonly remountKey: string
  readonly carousel: CarouselRef | null
  readonly swipiState: SwipiState | undefined
  readonly positions: SlidePositions | undefined
  update: UpdateState
  remount: () => void
  reset: () => void
  clearEvents: () => void
  handleSelect: (state: SwipiState) => void
  handleChange: (positions: SlidePositions) => void
  handleReady: (carousel: CarouselRef) => void
}
