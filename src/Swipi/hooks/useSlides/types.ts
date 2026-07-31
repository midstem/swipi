import { ConfigType } from '../../types'

export type Slides = {
  loop: boolean
  windowWidth: number
  containerWidth: number
  config: ConfigType[]
  biasRight?: boolean
  slidesCount: number
  slidesNumber: number
  spaceBetweenSlides: number
}

export type UseSlidesReturn = {
  isLoop: boolean
  slideWidth: number
  hasOverflow: boolean
  spaceBetween: number
}
