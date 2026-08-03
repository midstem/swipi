import {
  PlaygroundState,
  SelectOption,
  SlidesAnimation,
  StagePreset,
  ValueOf
} from './types'

export const STORAGE_KEY = 'swipi-playground-state'

export const ONE_SLIDE = 1

// How much of a slide the next one takes over when biasRight is on.
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

export const SWIPI_DEFAULTS = {
  loop: false,
  dragFree: false,
  biasRight: false,
  showDots: false,
  autoplay: false,
  showArrows: true,
  initialSlide: 0,
  slidesNumber: 3,
  autoplaySpeed: 4000,
  animationSpeed: 300,
  spaceBetweenSlides: 0,
  slidesAnimation: 'default',
  ariaLabel: 'Slides'
}

export const DEFAULT_STATE: PlaygroundState = {
  slidesCount: 5,
  loop: true,
  dragFree: false,
  biasRight: false,
  showDots: true,
  autoplay: false,
  showArrows: true,
  initialSlide: 0,
  slidesNumber: 1,
  autoplaySpeed: 4000,
  animationSpeed: 300,
  spaceBetweenSlides: 15,
  slidesAnimation: 'default',
  ariaLabel: SWIPI_DEFAULTS.ariaLabel,
  useConfig: false,
  config: [
    { maxWidth: 1200, slidesNumber: 3, spaceBetween: 20 },
    { maxWidth: 768, slidesNumber: 2, spaceBetween: 12 },
    { maxWidth: 480, slidesNumber: 1, spaceBetween: 8 }
  ],
  stageWidth: 640
}

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
