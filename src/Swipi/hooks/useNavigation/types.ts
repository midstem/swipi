import { SetWithPrev } from '../../types'

export type Navigation = {
  setAnimation: (animation: boolean) => void
  setTransform: SetWithPrev
  slideWidth: number
  isDisableMove: (value: boolean) => boolean
}
