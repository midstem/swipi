import { SetWithPrev } from '../../types'

export type Navigation = {
  setAnimation: (animation: boolean) => void
  setTransform: SetWithPrev
  slideWidth: number
  normalizeTransform: (value: number) => number
  isDisableMove: (value: boolean) => boolean
}
