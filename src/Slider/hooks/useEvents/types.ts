import { SetWithPrev } from '../../types'

export type TouchEvents = {
  isButton: boolean
  transform: number
  slideWidth: number
  startTransform: number
  children: JSX.Element[]
  startX: number
  endX: number
  setAnimation: (animation: boolean) => void
  setTransform: SetWithPrev
  setSlideIndex: (index: number) => void
  checkSliderCorner: () => boolean
  checkAreaBeyondSlider: () => boolean
  jumpToTheLastSlide: () => void
  moveSlides: () => void
  setStartX: (value: number) => void
  setEndX: (value: number) => void
  setMovePath: (value: number) => void
  isNavigationAllowed: (nextSlide?: boolean) => boolean
}
