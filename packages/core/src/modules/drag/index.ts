import { clamp } from '#src/modules/math'
import {
  EASE_SPEED_FACTOR,
  MAX_DRAG_VELOCITY,
  MAX_MOMENTUM_DURATION,
  MIN_MOMENTUM_DURATION,
  MIN_SAMPLE_TIME
} from './constants'
import { DragVelocityType, MomentumDurationType } from './types'

export * from './types'

export const getDragVelocity = ({
  distance,
  duration
}: DragVelocityType): number =>
  clamp(
    distance / Math.max(duration, MIN_SAMPLE_TIME),
    -MAX_DRAG_VELOCITY,
    MAX_DRAG_VELOCITY
  )

export const getMomentumDuration = ({
  distance,
  velocity,
  animationSpeed
}: MomentumDurationType): number => {
  if (!velocity) return animationSpeed

  return clamp(
    (EASE_SPEED_FACTOR * Math.abs(distance)) / Math.abs(velocity),
    MIN_MOMENTUM_DURATION,
    MAX_MOMENTUM_DURATION
  )
}
