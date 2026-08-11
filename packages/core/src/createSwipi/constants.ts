import {
  DEFAULT_ANIMATION_SPEED,
  DEFAULT_AUTOPLAY_SPEED,
  DEFAULT_START_INDEX
} from '../constants'
import { ResolvedSwipiOptions } from '../types'

export const DEFAULT_OPTIONS: ResolvedSwipiOptions = {
  loop: false,
  dragFree: false,
  autoplay: false,
  startIndex: DEFAULT_START_INDEX,
  autoplaySpeed: DEFAULT_AUTOPLAY_SPEED,
  animationSpeed: DEFAULT_ANIMATION_SPEED,
  respectReducedMotion: false
}

export const MISSING_TRACK_ERROR =
  'Swipi: Viewport must have at least one child element (the track).'
