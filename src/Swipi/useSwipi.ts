import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useEvents } from './hooks/useEvents'
import { useTrack } from './hooks/useTrack'
import { useAutoplay } from './hooks/useAutoplay'
import { useTransform } from './hooks/useTransform'
import { useLatestRef } from './hooks/useLatestRef'
import { useNavigation } from './hooks/useNavigation'
import { useElementWidth } from './hooks/useElementWidth'
import { useSlidesGeometry } from './hooks/useSlidesGeometry'
import { useTrackVariables } from './hooks/useTrackVariables'
import { useIsomorphicLayoutEffect } from './hooks/useIsomorphicLayoutEffect'
import { FIRST_SLIDE_INDEX, NO_SLIDES } from './constants'
import { SlideOffsets, UseSwipiType } from './types'
import { clamp, getSlidePositions } from './helpers'
import { getSnapIndex, toSnaps } from './geometry'

export const useSwipi = ({
  loop,
  autoplay,
  dragFree,
  slideWidth,
  spaceBetween,
  startIndex,
  autoplaySpeed,
  animationSpeed,
  onChange,
  onSelect
}: UseSwipiType) => {
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const trackRef = useRef<HTMLElement | null>(null)
  const viewportRef = useRef<HTMLElement | null>(null)
  const isStartIndexApplied = useRef<boolean>(false)
  const slideOffsetsRef = useRef<SlideOffsets>(new WeakMap())

  const carouselRef = useCallback((node: HTMLElement | null): void => {
    viewportRef.current = node
    trackRef.current = (node?.firstElementChild as HTMLElement | null) ?? null
  }, [])

  const onChangeRef = useLatestRef(onChange)
  const onSelectRef = useLatestRef(onSelect)

  useTrackVariables({ trackRef, slideWidth, spaceBetween })

  const measurement = useSlidesGeometry({
    trackRef,
    offsetsRef: slideOffsetsRef,
    slideWidth,
    spaceBetween
  })

  const containerWidth = useElementWidth(viewportRef)
  const slidesCount = measurement.sizes.length
  const isMeasured = slidesCount > NO_SLIDES

  const hasOverflow = measurement.contentSize > containerWidth
  const isLoop = loop && hasOverflow

  const geometry = useMemo(
    () => ({
      ...measurement,
      snaps: toSnaps({
        ...measurement,
        viewportWidth: containerWidth,
        loop: isLoop
      })
    }),
    [measurement, containerWidth, isLoop]
  )

  const countShowDots = geometry.snaps.length
  const lastIndex = Math.max(countShowDots - 1, FIRST_SLIDE_INDEX)

  const { render } = useTrack({
    trackRef,
    loop: isLoop,
    geometry,
    offsetsRef: slideOffsetsRef
  })

  const [slideIndex, setSlideIndex] = useState<number>(FIRST_SLIDE_INDEX)

  const syncSlideIndex = useCallback(
    (target: number): void => {
      const index = getSnapIndex(target, geometry, isLoop)

      setSlideIndex((previous) => (previous === index ? previous : index))
    },
    [geometry, isLoop]
  )

  const { transformRef, targetRef, moveTo, animateTo } = useTransform({
    animationSpeed,
    render,
    onTarget: syncSlideIndex
  })

  const slideIndexRef = useLatestRef(slideIndex)

  const canScrollNext = isLoop || slideIndex < lastIndex
  const canScrollPrev = isLoop || slideIndex > FIRST_SLIDE_INDEX

  const { nextImg, prevImg, scrollTo } = useNavigation({
    isLoop,
    geometry,
    targetRef,
    animateTo,
    canScrollNext,
    canScrollPrev
  })

  useEvents({
    isLoop,
    moveTo,
    dragFree,
    animateTo,
    geometry,
    hasOverflow,
    viewportRef,
    animationSpeed,
    transformRef
  })

  useAutoplay({
    timeout,
    autoplay,
    slideIndex,
    autoplaySpeed,
    nextImg
  })

  useIsomorphicLayoutEffect(() => {
    if (!geometry.snaps.length) return

    moveTo(geometry.snaps[clamp(slideIndexRef.current, 0, lastIndex)])
  }, [geometry, lastIndex, moveTo, slideIndexRef])

  useIsomorphicLayoutEffect(() => {
    render(transformRef.current)
    syncSlideIndex(targetRef.current)
  })

  useEffect(() => {
    if (!isMeasured || isStartIndexApplied.current) return

    isStartIndexApplied.current = true

    moveTo(geometry.snaps[clamp(startIndex, FIRST_SLIDE_INDEX, lastIndex)])
  }, [isMeasured, startIndex, lastIndex, geometry, moveTo])

  useEffect(() => {
    if (!isMeasured) return

    onChangeRef.current(getSlidePositions(slideIndex, countShowDots, isLoop))
  }, [isMeasured, countShowDots, isLoop, slideIndex, onChangeRef])

  useEffect(() => {
    if (!isMeasured) return

    onSelectRef.current({
      selectedIndex: slideIndex,
      snapCount: countShowDots,
      canScrollNext,
      canScrollPrev
    })
  }, [
    isMeasured,
    slideIndex,
    countShowDots,
    canScrollNext,
    canScrollPrev,
    onSelectRef
  ])

  return {
    carouselRef,
    state: {
      slideIndex,
      slidesCount,
      countShowDots,
      viewportWidth: containerWidth,
      hasOverflow,
      canScrollNext,
      canScrollPrev
    },
    handlers: { nextImg, prevImg, scrollTo }
  }
}
