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

export const FIRST_SLIDE_IDENTIFIER = 1

/** Movement that has to happen before a gesture counts as a drag, px. */
export const DRAG_THRESHOLD = 5

export const PRIMARY_BUTTON = 0

/** How long the release speed keeps carrying the track, ms. */
export const MOMENTUM_DECAY_TIME = 250

/** A flick can hardly be faster than this, px per ms. */
export const MAX_DRAG_VELOCITY = 3

/** A pointer that rested longer than this before the release carries no speed. */
export const VELOCITY_STALE_TIME = 100

export const MIN_SAMPLE_TIME = 1

export const NO_VELOCITY = 0

/** Initial slope of `easeOutCubic`, used to match the speed of the finger. */
export const EASE_SPEED_FACTOR = 3

export const MIN_MOMENTUM_DURATION = 120

export const MAX_MOMENTUM_DURATION = 600

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
