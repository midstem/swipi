import Default from 'src/DotsAnimations/Default'
import Sliding from 'src/DotsAnimations/Sliding'
import { AnimationsTypes } from 'src/Slider/types'

export const defaultSliderWidth = 934

export const reduceSlide = 0.75

export const ANIMATIONS: AnimationsTypes = {
  default: Default,
  sliding: Sliding
}
