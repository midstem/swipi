import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useEvents } from './hooks/useEvents'
import { useTrack } from './hooks/useTrack'
import { useAutoplay } from './hooks/useAutoplay'
import { useTransform } from './hooks/useTransform'
import { useLatestRef } from './hooks/useLatestRef'
import { useNavigation } from './hooks/useNavigation'
import { useElementWidth } from './hooks/useElementWidth'
import { useSlidesGeometry } from './hooks/useSlidesGeometry'
import { useTrackVariables } from './hooks/useTrackVariables'
import { FIRST_SLIDE, FIRST_SLIDE_INDEX, NO_SLIDES } from './constants'
import { SlideOffsets, UseSwipiType } from './types'
import { clamp, getSlidePositions } from './helpers'
import { getSnapIndex, toSnaps } from './geometry'

export const useSwipi = ({
  loop,
  autoplay,
  dragFree,
  slideWidth,
  spaceBetween,
  initialSlide,
  autoplaySpeed,
  animationSpeed,
  onChange,
  onSelect
}: UseSwipiType) => {
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const trackRef = useRef<HTMLElement | null>(null)
  const viewportRef = useRef<HTMLElement | null>(null)
  const isInitialSlideApplied = useRef<boolean>(false)
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

  const isDisableButton = useCallback(
    (isNext?: boolean): boolean => !(isNext ? canScrollNext : canScrollPrev),
    [canScrollNext, canScrollPrev]
  )

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

  useLayoutEffect(() => {
    if (!geometry.snaps.length) return

    moveTo(geometry.snaps[clamp(slideIndexRef.current, 0, lastIndex)])
  }, [geometry, lastIndex, moveTo, slideIndexRef])

  useLayoutEffect(() => {
    render(transformRef.current)
    syncSlideIndex(targetRef.current)
  })

  useEffect(() => {
    if (!isMeasured || !initialSlide || isInitialSlideApplied.current) return

    isInitialSlideApplied.current = true

    moveTo(
      geometry.snaps[
        clamp(initialSlide, FIRST_SLIDE, countShowDots) - FIRST_SLIDE
      ]
    )
  }, [isMeasured, initialSlide, countShowDots, geometry, moveTo])

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
      canScrollPrev,
      isDisableButton
    },
    handlers: { nextImg, prevImg, scrollTo }
  }
}
