import { useCallback, useEffect, useRef, useState } from 'react'
import { easeOutCubic } from '../../helpers'
import { INITIAL_TRANSFORM, PROGRESS_END } from '../../constants'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'
import { UseTransformReturn } from './types'

export const useTransform = (animationSpeed: number): UseTransformReturn => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const [transform, setTransform] = useState(INITIAL_TRANSFORM)
  const [target, setTarget] = useState(INITIAL_TRANSFORM)

  const transformRef = useRef(INITIAL_TRANSFORM)
  const targetRef = useRef(INITIAL_TRANSFORM)
  const frameRef = useRef<number | null>(null)

  const cancelAnimation = useCallback((): void => {
    if (frameRef.current === null) return

    cancelAnimationFrame(frameRef.current)
    frameRef.current = null
  }, [])

  const applyTransform = useCallback((value: number): void => {
    transformRef.current = value
    setTransform(value)
  }, [])

  const applyTarget = useCallback((value: number): void => {
    targetRef.current = value
    setTarget(value)
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

      const startedAt = performance.now()

      const step = (now: number): void => {
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

  return { transform, target, transformRef, targetRef, moveTo, animateTo }
}
