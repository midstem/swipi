import { DotsAnimation } from '../Swipi/types'
import { SlidesAnimation, ValueOf } from '../types'
import { PlaygroundState, SelectOption, StagePreset } from './types'

export const STORAGE_KEY = 'swipi-playground-state'

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

/** Props defaults taken from `Swipi` — used to keep the code snippet minimal. */
export const SWIPI_DEFAULTS = {
  loop: false,
  biasRight: false,
  showDots: false,
  autoplay: false,
  showArrows: true,
  initialSlide: 0,
  slidesNumber: 3,
  autoplaySpeed: 4000,
  animationSpeed: 300,
  spaceBetweenSlides: 0,
  dotColor: '#c7c7c7',
  activeDotColor: '#000000',
  sizeForDefaultDot: 12,
  sizeForDefaultActiveDot: 13,
  dotsAnimation: 'default',
  slidesAnimation: 'default',
  nextButton: 'ᐳ',
  prevButton: 'ᐸ',
  className: '',
  ariaLabel: 'Slides'
}

export const DEFAULT_STATE: PlaygroundState = {
  slidesCount: 5,
  loop: true,
  biasRight: false,
  showDots: true,
  autoplay: false,
  showArrows: true,
  initialSlide: 0,
  slidesNumber: 1,
  autoplaySpeed: 4000,
  animationSpeed: 300,
  spaceBetweenSlides: 15,
  dotColor: SWIPI_DEFAULTS.dotColor,
  activeDotColor: SWIPI_DEFAULTS.activeDotColor,
  sizeForDefaultDot: SWIPI_DEFAULTS.sizeForDefaultDot,
  sizeForDefaultActiveDot: SWIPI_DEFAULTS.sizeForDefaultActiveDot,
  dotsAnimation: 'default',
  slidesAnimation: 'default',
  customDot: false,
  customActiveDot: false,
  nextButton: SWIPI_DEFAULTS.nextButton,
  prevButton: SWIPI_DEFAULTS.prevButton,
  className: '',
  ariaLabel: SWIPI_DEFAULTS.ariaLabel,
  useConfig: false,
  config: [
    { maxWidth: 1200, slidesNumber: 3, spaceBetween: 20 },
    { maxWidth: 768, slidesNumber: 2, spaceBetween: 12 },
    { maxWidth: 480, slidesNumber: 1, spaceBetween: 8 }
  ],
  stageWidth: 640
}

export const DOTS_ANIMATION_OPTIONS: SelectOption<DotsAnimation>[] = [
  { value: 'default', label: 'default' },
  { value: 'sliding', label: 'sliding' }
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
