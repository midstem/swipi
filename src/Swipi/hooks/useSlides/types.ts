import { ConfigType } from '../../types'
import { SlidesAnimation, ValueOf } from '../../../types'

export type Slides = {
  endX: number
  startX: number
  movePath: number
  showArrows: boolean
  windowWidth: number
  config: ConfigType[]
  slidesNumber: number
  children: JSX.Element[]
  spaceBetweenSlides: number
  currentRef: HTMLDivElement | null
  slidesAnimation: ValueOf<SlidesAnimation>
  setMovePath: (value: number) => void
}
