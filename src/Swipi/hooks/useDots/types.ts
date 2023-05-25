import { SetWithPrev } from '../../types'

export type DotsProps = {
  setTransform: SetWithPrev
  slideWidth: number
  dotsAnimation: string
  customActiveDot?: JSX.Element
  customDot?: JSX.Element
  setAnimation: (value: boolean) => void
  dotColor?: string
  activeDotColor?: string
  loop: boolean
  children: JSX.Element[]
  visibleCountSlides: number
}
