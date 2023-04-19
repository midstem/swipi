import { SetWithPrev } from '../../types'

export type Navigation = {
  putInTheInitialPosition: (callback?: () => void) => () => void
  checkSliderCorner: () => boolean
  setAnimation: (animation: boolean) => void
  setTransform: SetWithPrev
  slideWidth: number
  children: JSX.Element[]
}
