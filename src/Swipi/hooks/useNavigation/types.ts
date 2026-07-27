import { SetWithPrev } from '../../types'

export type Navigation = {
  setAnimation: (animation: boolean) => void
  setTransform: SetWithPrev
  slideWidth: number
  animationSpeed: number
  isLoopEnabled: boolean
  isDisableMove: (value: boolean) => boolean
}
