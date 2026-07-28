import { useRef } from 'react'
import { TouchEvents, UseEventsReturn } from './types'
import { clampTransform, getSwipeDirection, snapToSlide } from '../../helpers'

const noop = (): void => {}

export const useEvents = ({
  isLoop,
  moveTo,
  animateTo,
  lastIndex,
  slideWidth,
  isHideArrows,
  transformRef
}: TouchEvents): UseEventsReturn => {
  const isDragging = useRef(false)
  const startXRef = useRef(0)
  const lastXRef = useRef(0)
  const startTransformRef = useRef(0)
  const startedAtRef = useRef(new Date())

  const onStart = (x: number): void => {
    isDragging.current = true
    startXRef.current = x
    lastXRef.current = x
    startTransformRef.current = transformRef.current
    startedAtRef.current = new Date()
  }

  const onMove = (x: number): void => {
    if (!isDragging.current) return

    lastXRef.current = x

    moveTo(
      clampTransform({
        transform: startTransformRef.current + (x - startXRef.current),
        slideWidth,
        lastIndex,
        loop: isLoop
      })
    )
  }

  const onEnd = (): void => {
    if (!isDragging.current) return

    isDragging.current = false

    const transform = snapToSlide({
      transform: transformRef.current,
      slideWidth,
      swipedSide: getSwipeDirection({
        touchStartX: startXRef.current,
        touchEndX: lastXRef.current
      }),
      timeTouch: startedAtRef.current
    })

    animateTo(
      clampTransform({ transform, slideWidth, lastIndex, loop: isLoop })
    )
  }

  return {
    onEnd: isHideArrows ? onEnd : noop,
    onMove: isHideArrows ? onMove : noop,
    onStart: isHideArrows ? onStart : noop
  }
}
