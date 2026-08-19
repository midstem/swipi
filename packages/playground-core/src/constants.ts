import type { SwipiAxis } from '@midstem/swipi'
import {
  ConfigNumberFieldOption,
  ConfigType,
  HookOptionKey,
  PlaygroundState,
  SelectOption,
  SlidesAnimation,
  StagePreset,
  ValueOf
} from './types'

export const STORAGE_KEY = 'swipi-playground-state'

export const ONE_SLIDE = 1

export const REDUCE_SLIDE = 0.35

export const SLIDE_COLORS = [
  '#f94144',
  '#f3722c',
  '#f8961e',
  '#f9c74f',
  '#90be6d',
  '#43aa8b',
  '#577590',
  '#6a4c93',
  '#b5179e',
  '#4361ee',
  '#3a0ca3',
  '#4cc9f0'
]

export const MIN_SLIDES_COUNT = 1

export const MAX_SLIDES_COUNT = SLIDE_COLORS.length

export const MAX_EVENTS = 12

export const JSON_INDENT = 2

export const HOOK_OPTIONS: Record<HookOptionKey, string> = {
  axis: 'Geometry',
  loop: 'Behaviour',
  dragFree: 'Behaviour',
  autoplay: 'Behaviour',
  autoplaySpeed: 'Behaviour',
  animationSpeed: 'Behaviour',
  respectReducedMotion: 'Behaviour',
  startIndex: 'Geometry',
  slideWidth: 'Geometry',
  spaceBetween: 'Geometry'
}

export const NO_SLIDE_WIDTH = 0

export const DEFAULT_STATE: PlaygroundState = {
  axis: 'x',
  slidesCount: 5,
  loop: true,
  dragFree: false,
  biasRight: false,
  showDots: true,
  autoplay: false,
  showArrows: true,
  startIndex: 0,
  slideWidth: NO_SLIDE_WIDTH,
  slidesNumber: 1,
  autoplaySpeed: 4000,
  animationSpeed: 300,
  respectReducedMotion: false,
  spaceBetween: 16,
  slidesAnimation: 'default',
  ariaLabel: 'Slides',
  useConfig: false,
  config: [
    { maxWidth: 1200, slidesNumber: 3, spaceBetween: 20 },
    { maxWidth: 768, slidesNumber: 2, spaceBetween: 12 },
    { maxWidth: 480, slidesNumber: 1, spaceBetween: 8 }
  ],
  stageWidth: 640,
  stageHeight: 360
}

export const VERTICAL_AXIS: SwipiAxis = 'y'

export const AXIS_OPTIONS: SelectOption<SwipiAxis>[] = [
  { value: 'x', label: 'x — horizontal' },
  { value: 'y', label: 'y — vertical' }
]

export const SLIDES_ANIMATION_OPTIONS: SelectOption<
  ValueOf<SlidesAnimation>
>[] = [
  { value: 'default', label: 'default' },
  { value: 'fade-in', label: 'fade-in' }
]

export const STAGE_PRESETS: StagePreset[] = [
  { label: 'Mobile', width: 360 },
  { label: 'Tablet', width: 768 },
  { label: 'Desktop', width: 1024 },
  { label: 'Full', width: 1440 }
]

export const README_PRESET = {
  slidesNumber: 2,
  spaceBetween: 12,
  biasRight: false,
  showDots: false
}

export const CONFIG_NUMBER_FIELDS: ConfigNumberFieldOption[] = [
  { key: 'maxWidth', label: 'maxWidth' },
  { key: 'slidesNumber', label: 'slidesNumber' },
  { key: 'spaceBetween', label: 'spaceBetween' }
]

export const NEW_CONFIG_ITEM: ConfigType = {
  maxWidth: 640,
  slidesNumber: 1,
  spaceBetween: 10
}

export const EMPTY_FIELD_VALUE = 0

export const SLIDES_NUMBER_LIMITS = { min: 1, max: 6 }

export const SLIDE_WIDTH_LIMITS = { min: 0, max: 600, step: 10 }

export const SPACE_BETWEEN_LIMITS = { min: 0, max: 80 }

export const AUTOPLAY_SPEED_LIMITS = { min: 500, max: 10000, step: 100 }

export const ANIMATION_SPEED_LIMITS = { min: 0, max: 2000, step: 50 }

export const STAGE_WIDTH_LIMITS = { min: 240, max: 1440, step: 10 }

export const STAGE_HEIGHT_LIMITS = { min: 160, max: 900, step: 10 }

export const FIRST_INDEX = 0

export const LAST_INDEX_OFFSET = 1

export const DEFAULT_MIN = 0

export const DEFAULT_MAX = 100

export const DEFAULT_STEP = 1
