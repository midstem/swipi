import Default from '../DotsAnimations/Default'
import Sliding from '../DotsAnimations/Sliding'
import { AnimationsTypes } from './types'

export const defaultSwipiWidth = 934

export const reduceSlide = 0.75

export const navigationDebounceDelay = 100

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
