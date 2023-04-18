import { SetWithPrev } from 'src/Slider/types'

export type Navigation = {
  putInTheInitialPosition: (callback?: () => void) => () => void
  checkSliderCorner: () => boolean
  setAnimation: (animation: boolean) => void
  setTransform: SetWithPrev
  slideWidth: number
  children: JSX.Element[]
  nextDot: (prev: number, children: JSX.Element[]) => void
  prevDot: (prev: number, children: JSX.Element[]) => void
}
