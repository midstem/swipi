import { SetWithPrev } from '../../types'

export type Navigation = {
  putInTheInitialPosition: (callback?: () => void) => () => void
  checkSwipiCorner: () => boolean
  setAnimation: (animation: boolean) => void
  setTransform: SetWithPrev
  slideWidth: number
  isDisableMove: (value: boolean) => boolean
}
