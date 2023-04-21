import { SetWithPrev } from '../../types'

export type DotsProps = {
  setTransform: SetWithPrev
  slideWidth: number
  slideIndex: number
  setSlideIndex: (index: number) => void
  customActiveDot?: JSX.Element
  customDot?: JSX.Element
  setAnimation: (value: boolean) => void
  dotColor?: string
  activeDotColor?: string
}
