import { SlidesAnimation, ValueOf } from '../../../types'
import { ConfigType } from '../../types'

export type Slides = {
  children: JSX.Element[]
  config: ConfigType[]
  windowWidth: number
  currentRef: HTMLDivElement | null
  slidesNumber: number
  spaceBetweenSlides: number
  startX: number
  endX: number
  movePath: number
  loop: boolean
  setMovePath: (value: number) => void
  slidesAnimation: ValueOf<SlidesAnimation>
}
