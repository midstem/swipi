import { SetWithPrev } from '../../types'

export type TouchEvents = {
  transform: number
  slideWidth: number
  isShowArrows: boolean
  startTransform: number
  children: JSX.Element[]
  moveSlides: () => void
  setTransform: SetWithPrev
  jumpToTheLastSlide: () => void
  checkSwipiCorner: () => boolean
  setEndX: (value: number) => void
  setStartX: (value: number) => void
  checkAreaBeyondSwipi: () => boolean
  setMovePath: (value: number) => void
  setSlideIndex: (index: number) => void
  setAnimation: (animation: boolean) => void
}
