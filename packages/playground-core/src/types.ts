import {
  SlidePositions,
  SwipiAxis,
  SwipiOptions,
  SwipiState
} from '@midstem/swipi'

export enum SlidesAnimation {
  DEFAULT = 'default',
  FADE_IN = 'fade-in'
}

export type ValueOf<T extends string> = `${T}`

export type StyleObject = Record<string, string | number | undefined>

export type ConfigType = {
  maxWidth: number
  biasRight?: boolean
  slidesNumber: number
  spaceBetween?: number
}

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
  axis: SwipiAxis
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
  respectReducedMotion: boolean
  spaceBetween: number
  slidesAnimation: ValueOf<SlidesAnimation>
  ariaLabel: string
  useConfig: boolean
  config: ConfigType[]
  stageWidth: number
  stageHeight: number
}

export type PlaygroundStateKey = keyof PlaygroundState

export type HookOptionKey = Exclude<keyof SwipiOptions, 'onChange' | 'onSelect'>

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

export type SectionOrigin = 'hook' | 'playground'

export type SectionProps = {
  title: string
  origin: SectionOrigin
  hint?: string
}

export type ToggleProps = {
  label: string
  hint?: string
  checked: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}

export type UseToggleProps = Pick<ToggleProps, 'onChange'>

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
  onSelect: (state: SwipiState) => void
  onChange: (positions: SlidePositions) => void
}

export type UseStageProps = Pick<StageProps, 'state'>

export type UseStageReturn = {
  bias: number
  isVertical: boolean
  slideWidth?: number
  spaceBetween: number
  config: ConfigType[]
  windowWidth: number
  visibleSlides: number
  activeBreakpoint?: ConfigType
}

export type ImperativeApiProps = {
  slidesCount: number
}

export type UseImperativeApiProps = ImperativeApiProps

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

export type EmbedHeightMessage = {
  type: 'swipi-playground:height'
  height: number
}

export type EmbedReadyMessage = {
  type: 'swipi-playground:ready'
}

export type EmbedMeasureMessage = {
  type: 'swipi-playground:measure'
}

export type EmbedMessage = EmbedHeightMessage | EmbedReadyMessage

export type PlaygroundFramework =
  | 'react'
  | 'vue'
  | 'svelte'
  | 'angular'
  | 'vanilla'

export type FrameworkOption = {
  id: PlaygroundFramework
  title: string
}

export type FrameworkLink = FrameworkOption & {
  href: string
  isCurrent: boolean
}

export type CodeLanguage =
  | 'jsx'
  | 'markup'
  | 'javascript'
  | 'typescript'
  | 'css'

export type CodeTokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'number'
  | 'tag'
  | 'attribute'
  | 'function'
  | 'property'
  | 'selector'
  | 'punctuation'

export type CodeToken = {
  text: string
  kind: CodeTokenKind
}

export type CodeBlockProps = {
  code: string
  language: CodeLanguage
}
