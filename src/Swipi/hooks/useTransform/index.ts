import { useCallback, useEffect, useRef } from 'react'
import { easeOutCubic } from '../../helpers'
import { INITIAL_TRANSFORM, PROGRESS_END } from '../../constants'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'
import { UseTransformProps, UseTransformReturn } from './types'

export const useTransform = ({
  animationSpeed,
  render,
  onTarget
}: UseTransformProps): UseTransformReturn => {
  const prefersReducedMotion = usePrefersReducedMotion()

  /** Neither the position nor the destination lives in React state. */
  const transformRef = useRef(INITIAL_TRANSFORM)
  const targetRef = useRef(INITIAL_TRANSFORM)
  const frameRef = useRef<number | null>(null)
  const renderRef = useRef(render)
  const onTargetRef = useRef(onTarget)

  renderRef.current = render
  onTargetRef.current = onTarget

  const cancelAnimation = useCallback((): void => {
    if (frameRef.current === null) return

    cancelAnimationFrame(frameRef.current)
    frameRef.current = null
  }, [])

  const applyTransform = useCallback((value: number): void => {
    transformRef.current = value
    renderRef.current(value)
  }, [])

  const applyTarget = useCallback((value: number): void => {
    targetRef.current = value
    onTargetRef.current(value)
  }, [])

  const moveTo = useCallback(
    (value: number): void => {
      cancelAnimation()
      applyTarget(value)
      applyTransform(value)
    },
    [applyTarget, applyTransform, cancelAnimation]
  )

  const animateTo = useCallback(
    (value: number): void => {
      cancelAnimation()
      applyTarget(value)

      const from = transformRef.current
      const distance = value - from

      if (!distance || animationSpeed <= 0 || prefersReducedMotion) {
        applyTransform(value)
        return
      }

      /** Taken from the first frame, so it always shares the frame clock. */
      let startedAt: number | null = null

      const step = (now: number): void => {
        startedAt ??= now

        const progress = Math.min(
          (now - startedAt) / animationSpeed,
          PROGRESS_END
        )

        applyTransform(from + distance * easeOutCubic(progress))

        frameRef.current =
          progress < PROGRESS_END ? requestAnimationFrame(step) : null
      }

      frameRef.current = requestAnimationFrame(step)
    },
    [
      animationSpeed,
      applyTarget,
      applyTransform,
      cancelAnimation,
      prefersReducedMotion
    ]
  )

  useEffect(() => cancelAnimation, [cancelAnimation])

  return { transformRef, targetRef, moveTo, animateTo }
}
