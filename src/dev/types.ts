import type { ReactNode } from 'react'
import { ConfigType, DotsAnimation, SlidePositions } from '../Swipi/types'
import { SlidesAnimation, ValueOf } from '../types'

export type PlaygroundState = {
  slidesCount: number
  loop: boolean
  biasRight: boolean
  showDots: boolean
  autoplay: boolean
  showArrows: boolean
  initialSlide: number
  slidesNumber: number
  autoplaySpeed: number
  animationSpeed: number
  spaceBetweenSlides: number
  dotColor: string
  activeDotColor: string
  sizeForDefaultDot: number
  sizeForDefaultActiveDot: number
  dotsAnimation: DotsAnimation
  slidesAnimation: ValueOf<SlidesAnimation>
  customDot: boolean
  customActiveDot: boolean
  nextButton: string
  prevButton: string
  className: string
  ariaLabel: string
  useConfig: boolean
  config: ConfigType[]
  stageWidth: number
}

export type PlaygroundStateKey = keyof PlaygroundState

export type UpdateState = <Key extends PlaygroundStateKey>(
  key: Key,
  value: PlaygroundState[Key]
) => void

export type SelectOption<Value extends string> = {
  value: Value
  label: string
}

export type FieldProps = {
  label: string
  hint?: string
  children: ReactNode
}

export type ToggleProps = {
  label: string
  hint?: string
  checked: boolean
  onChange: (value: boolean) => void
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

export type TextFieldProps = {
  label: string
  hint?: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export type ColorFieldProps = {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
}

export type SelectFieldProps<Value extends string> = {
  label: string
  hint?: string
  value: Value
  options: SelectOption<Value>[]
  onChange: (value: Value) => void
}

export type SectionProps = {
  title: string
  children: ReactNode
}

export type ConfigEditorProps = {
  config: ConfigType[]
  disabled: boolean
  onChange: (config: ConfigType[]) => void
}

export type PlaygroundEvent = {
  id: number
  name: 'onSelect' | 'onChange'
  payload: string
}

export type EventLogProps = {
  events: PlaygroundEvent[]
  onClear: () => void
}

export type ImperativeReadings = {
  selectedScrollSnap: number
  scrollSnapList: number[]
  canScrollNext: boolean
  canScrollPrev: boolean
}

export type SlidePositionsState = SlidePositions | undefined
