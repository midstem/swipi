import type { ChangeEvent, ReactNode, RefObject } from 'react'
import type { SlidePositions, SwipiState } from 'swipi'
import type {
  CarouselRef,
  ConfigNumberField,
  ImperativeApiProps as CoreImperativeApiProps,
  ImperativeReadings,
  PlaygroundEvent,
  PlaygroundState,
  SectionProps as CoreSectionProps,
  StageProps as CoreStageProps,
  UpdateState
} from '@swipi/playground-core'

export type SwipiRef = RefObject<CarouselRef | null>

export type SectionProps = CoreSectionProps & {
  children: ReactNode
}

export type StageProps = CoreStageProps & {
  swipiRef: SwipiRef
}

export type ImperativeApiProps = CoreImperativeApiProps & {
  swipiRef: SwipiRef
}

export type UseImperativeApiProps = ImperativeApiProps

export type UsePlaygroundReturn = {
  state: PlaygroundState
  slides: string[]
  events: PlaygroundEvent[]
  remountKey: string
  swipiRef: SwipiRef
  swipiState?: SwipiState
  positions?: SlidePositions
  update: UpdateState
  remount: () => void
  reset: () => void
  clearEvents: () => void
  handleSelect: (state: SwipiState) => void
  handleChange: (positions: SlidePositions) => void
}

export type UseToggleReturn = {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export type UseFieldReturn<Element extends HTMLElement> = {
  id: string
  handleChange: (event: ChangeEvent<Element>) => void
}

export type UseConfigEditorReturn = {
  addItem: () => void
  removeItem: (index: number) => () => void
  changeNumber: (
    index: number,
    field: ConfigNumberField
  ) => (event: ChangeEvent<HTMLInputElement>) => void
  changeBiasRight: (
    index: number
  ) => (event: ChangeEvent<HTMLInputElement>) => void
}

export type UseImperativeApiReturn = {
  index: number
  readings?: ImperativeReadings
  changeIndex: (event: ChangeEvent<HTMLInputElement>) => void
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: () => void
  readState: () => void
}
