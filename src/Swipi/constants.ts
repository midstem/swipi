import Default from '../DotsAnimations/Default'
import Sliding from '../DotsAnimations/Sliding'
import { AnimationsTypes } from './types'

export const DEFAULT_SWIPI_WIDTH = 934

export const REDUCE_SLIDE = 0.35

export const NAVIGATION_DEBOUNCE_DELAY = 100

export const ANIMATIONS: AnimationsTypes = {
  default: Default,
  sliding: Sliding
}

export enum SwipeDirections {
  TOP = 'top',
  LEFT = 'left',
  RIGHT = 'right',
  BOTTOM = 'bottom'
}

export const FIRST_SLIDE_IDENTIFIER = 1

export const DISTANCE = 1

export const FAST_SWIPE_TIME = 200

export const ONE_SLIDE = 1

export const ONE_STEP = 1

export const FIRST_SLIDE = 1

export const FIRST_SLIDE_INDEX = 0

export const HALF = 0.5

export const INITIAL_TRANSFORM = 0

export const NO_OFFSET = 0

export const NO_WIDTH = 0

export const EMPTY_TRANSFORM = ''

export const PROGRESS_END = 1

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
