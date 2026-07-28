import { SWIPI_DEFAULTS } from '../../constants'

export type SnippetPropKey = keyof typeof SWIPI_DEFAULTS

export const SNIPPET_PROPS: SnippetPropKey[] = [
  'loop',
  'autoplay',
  'autoplaySpeed',
  'showDots',
  'showArrows',
  'biasRight',
  'initialSlide',
  'slidesNumber',
  'spaceBetweenSlides',
  'animationSpeed',
  'slidesAnimation',
  'dotsAnimation',
  'dotColor',
  'activeDotColor',
  'sizeForDefaultDot',
  'sizeForDefaultActiveDot',
  'prevButton',
  'nextButton',
  'className',
  'ariaLabel'
]

export const INDENT = '  '

export const COPIED_MESSAGE_DELAY = 1500
