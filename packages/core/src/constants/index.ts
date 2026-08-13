import { SlidesGeometry, SlidesMeasurement } from '#src/types'
import { HORIZONTAL_AXIS } from '../modules/axis/constants'

export const DEFAULT_AXIS = HORIZONTAL_AXIS

export const DEFAULT_START_INDEX = 0

export const DEFAULT_AUTOPLAY_SPEED = 4000

export const DEFAULT_ANIMATION_SPEED = 300

export const DRAG_THRESHOLD = 5

export const PRIMARY_BUTTON = 0

export const VELOCITY_STALE_TIME = 100

export const NO_VELOCITY = 0

export const ONE_STEP = 1

export const FIRST_SLIDE_INDEX = 0

export const INITIAL_TRANSFORM = 0

export const NO_WIDTH = 0

export const NO_SLIDES = 0

export const GEOMETRY_TOLERANCE = 0.01

export const EMPTY_TRANSFORM = ''

export const PROGRESS_END = 1

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export const SLIDE_WIDTH_VARIABLE = '--swipi-slide-width'

export const SLIDE_GAP_VARIABLE = '--swipi-slide-gap'

export const EMPTY_MEASUREMENT: SlidesMeasurement = {
  positions: [],
  sizes: [],
  contentSize: 0,
  loopSize: 0
}

export const EMPTY_GEOMETRY: SlidesGeometry = {
  ...EMPTY_MEASUREMENT,
  snaps: []
}
