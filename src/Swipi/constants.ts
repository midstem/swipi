import Default from '../DotsAnimations/Default'
import Sliding from '../DotsAnimations/Sliding'
import { AnimationsTypes } from './types'

export const defaultSwipiWidth = 934

export const reduceSlide = 0.75

export const navigationDebounceDelay = 300

export const ANIMATIONS: AnimationsTypes = {
  default: Default,
  sliding: Sliding
}
