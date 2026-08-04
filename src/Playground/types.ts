import type { ChangeEvent, ReactNode, RefObject } from 'react'
import { SlidePositions, SwipiState } from '../Swipi/types'
import { SwipiCarouselOptions } from '../useSwipiCarousel/types'

export enum SlidesAnimation {
  DEFAULT = 'default',
  FADE_IN = 'fade-in'
}

export type ValueOf<T extends string> = `${T}`

export type ConfigType = {
  maxWidth: number
  biasRight?: boolean
  slidesNumber: number
  spaceBetween?: number
}

// The imperative surface the playground builds on top of the hook, kept here
// so the stage and the panel below it agree on its shape.
export type CarouselRef = {
  scrollNext: () => void
  scrollPrev: () => void
  scrollTo: (index: number) => void
  selectedScrollSnap: () => number
  scrollSnapList: () => number[]
  canScrollNext: () => boolean
  canScrollPrev: () => boolean
}

export type PlaygroundState = {
  slidesCount: number
  loop: boolean
  dragFree: boolean
  biasRight: boolean
  showDots: boolean
  autoplay: boolean
  showArrows: boolean
  startIndex: number
  slideWidth: number
  slidesNumber: number
  autoplaySpeed: number
  animationSpeed: number
  spaceBetween: number
  slidesAnimation: ValueOf<SlidesAnimation>
  ariaLabel: string
  useConfig: boolean
  config: ConfigType[]
  stageWidth: number
}

export type PlaygroundStateKey = keyof PlaygroundState

// Every option the hook takes except the callbacks, which the event log wires
// instead of the panel. HOOK_OPTIONS is keyed by this, so a new option in
// SwipiCarouselOptions fails to compile until the panel gains a control.
export type HookOptionKey = Exclude<
  keyof SwipiCarouselOptions,
  'onChange' | 'onSelect'
>

export type UpdateState = <Key extends PlaygroundStateKey>(
  key: Key,
  value: PlaygroundState[Key]
) => void

export type PlaygroundEvent = {
  id: number
  name: 'onSelect' | 'onChange'
  payload: string
}

export type SelectOption<Value extends string> = {
  value: Value
  label: string
}

export type StagePreset = {
  label: string
  width: number
}

export type ImperativeReadings = {
  selectedScrollSnap: number
  scrollSnapList: number[]
  canScrollNext: boolean
  canScrollPrev: boolean
}

export type UsePlaygroundReturn = {
  state: PlaygroundState
  slides: string[]
  events: PlaygroundEvent[]
  remountKey: string
  swipiRef: RefObject<CarouselRef | null>
  swipiState?: SwipiState
  positions?: SlidePositions
  update: UpdateState
  remount: () => void
  reset: () => void
  clearEvents: () => void
  handleSelect: (state: SwipiState) => void
  handleChange: (positions: SlidePositions) => void
}

// `hook` marks a section whose controls are options of useSwipiCarousel;
// `playground` marks the layout and markup the stand draws around it.
export type SectionOrigin = 'hook' | 'playground'

export type SectionProps = {
  title: string
  origin: SectionOrigin
  hint?: string
  children: ReactNode
}

export type ToggleProps = {
  label: string
  hint?: string
  checked: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}

export type UseToggleProps = Pick<ToggleProps, 'onChange'>

export type UseToggleReturn = {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export type NumberFieldProps = {
  label: string
  hint?: string
  value: number
  min?: number
  max?: number
  step?: number
  withSlider?: boolean
  disabled?: boolean
  onChange: (value: number) => void
}

export type UseNumberFieldProps = {
  min: number
  max: number
  onChange: (value: number) => void
}

export type TextFieldProps = {
  label: string
  hint?: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export type UseTextFieldProps = Pick<TextFieldProps, 'onChange'>

export type SelectFieldProps<Value extends string> = {
  label: string
  hint?: string
  value: Value
  options: SelectOption<Value>[]
  onChange: (value: Value) => void
}

export type UseSelectFieldProps<Value extends string> = {
  onChange: (value: Value) => void
}

export type UseFieldReturn<Element extends HTMLElement> = {
  id: string
  handleChange: (event: ChangeEvent<Element>) => void
}

export type ConfigNumberField = 'maxWidth' | 'slidesNumber' | 'spaceBetween'

export type ConfigNumberFieldOption = {
  key: ConfigNumberField
  label: string
}

export type ConfigEditorProps = {
  config: ConfigType[]
  disabled: boolean
  onChange: (config: ConfigType[]) => void
}

export type UseConfigEditorProps = ConfigEditorProps

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

export type ControlsPanelProps = {
  state: PlaygroundState
  update: UpdateState
}

export type UseControlsPanelProps = Pick<ControlsPanelProps, 'update'>

export type UseControlsPanelReturn = {
  change: <Key extends PlaygroundStateKey>(
    key: Key
  ) => (value: PlaygroundState[Key]) => void
  changeStageWidth: (width: number) => () => void
}

export type StageProps = {
  state: PlaygroundState
  slides: string[]
  swipiRef: RefObject<CarouselRef | null>
  onSelect: (state: SwipiState) => void
  onChange: (positions: SlidePositions) => void
}

export type UseStageProps = Pick<StageProps, 'state'>

export type UseStageReturn = {
  bias: number
  slideWidth?: number
  spaceBetween: number
  config: ConfigType[]
  windowWidth: number
  visibleSlides: number
  activeBreakpoint?: ConfigType
}

export type ImperativeApiProps = {
  slidesCount: number
  swipiRef: RefObject<CarouselRef | null>
}

export type UseImperativeApiProps = ImperativeApiProps

export type UseImperativeApiReturn = {
  index: number
  readings?: ImperativeReadings
  changeIndex: (event: ChangeEvent<HTMLInputElement>) => void
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: () => void
  readState: () => void
}

export type StatePanelProps = {
  swipiState?: SwipiState
  positions?: SlidePositions
}

export type EventLogProps = {
  events: PlaygroundEvent[]
  onClear: () => void
}

export type CodeSnippetProps = {
  state: PlaygroundState
}
