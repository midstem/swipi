import Default from '../DotsAnimations/Default'
import Sliding from '../DotsAnimations/Sliding'
import { AnimationsTypes } from './types'

export const DEFAULT_SWIPI_WIDTH = 934

export const REDUCE_SLIDE = 0.75

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
