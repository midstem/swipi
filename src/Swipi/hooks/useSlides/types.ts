import { ConfigType } from '../../types'
import { SlidesAnimation, ValueOf } from '../../../types'

export type Slides = {
  loop: boolean
  windowWidth: number
  containerWidth: number
  config: ConfigType[]
  biasRight?: boolean
  slidesCount: number
  slidesNumber: number
  spaceBetweenSlides: number
  slidesAnimation: ValueOf<SlidesAnimation>
}

export type UseSlidesReturn = {
  isLoop: boolean
  lastIndex: number
  slideWidth: number
  isHideArrows: boolean
  spaceBetween: number
  visibleCountSlides: number
}
