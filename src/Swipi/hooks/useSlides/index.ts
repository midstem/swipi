import { useState, useMemo } from 'react'
import { ConfigService } from '../../configService'
import { SlidesAnimation } from '../../../types'
import {
  addUniqueId,
  calculateSlideWidthWithCorner,
  isHideArrowsFn,
  returnSlideWidth,
  setKeyToChildren
} from '../../helpers'
import { Slides } from './types'

export const useSlides = ({
  loop,
  endX,
  startX,
  config,
  movePath,
  children,
  biasRight,
  currentRef,
  windowWidth,
  slidesNumber,
  slidesAnimation,
  spaceBetweenSlides,
  setMovePath
}: Slides) => {
  const [transform, setTransform] = useState<number>(0)

  const { returnSpaceBetween, getSwipiUpdatesParam, getRightSlidesCount } =
    ConfigService(config, windowWidth)

  const visibleCountSlides = getRightSlidesCount(slidesNumber, slidesAnimation)
  const spaceBetween = returnSpaceBetween(spaceBetweenSlides)
  const isHideArrows = isHideArrowsFn(children, visibleCountSlides)
  const isLoopEnabled = loop && isHideArrows
  const cloneCount = isLoopEnabled ? visibleCountSlides + 1 : 0
  const isCornerSlide =
    slidesAnimation === SlidesAnimation.DEFAULT
      ? (getSwipiUpdatesParam('biasRight') ?? biasRight)
      : false

  const currentRefWidth = currentRef?.clientWidth

  const updateSlideWidthArgs = useMemo(
    () => ({
      visibleCountSlides,
      spaceBetween,
      current: currentRefWidth
    }),
    [spaceBetween, visibleCountSlides, currentRefWidth]
  )

  const slideWidth = useMemo(() => {
    const width = returnSlideWidth(updateSlideWidthArgs)

    return isCornerSlide
      ? calculateSlideWidthWithCorner(width, visibleCountSlides)
      : width
  }, [isCornerSlide, updateSlideWidthArgs, visibleCountSlides])

  const slides = useMemo(() => {
    const keyed = setKeyToChildren(children)

    if (!isLoopEnabled) return addUniqueId(keyed)

    const headClones = keyed.slice(children.length - cloneCount)
    const tailClones = keyed.slice(0, cloneCount)

    return addUniqueId([...headClones, ...keyed, ...tailClones])
  }, [isLoopEnabled, cloneCount, children])

  const normalizeTransform = (value: number): number => {
    if (!isLoopEnabled || !slideWidth) return value

    const setWidth = children.length * slideWidth
    let result = value

    while (result > -cloneCount * slideWidth) result -= setWidth
    while (result <= -(cloneCount + children.length) * slideWidth)
      result += setWidth

    return result
  }

  const moveSlides = (): void => {
    const pathTaken = endX && startX - endX
    setTransform((prev) => normalizeTransform(prev - pathTaken + movePath))
    setMovePath(pathTaken)
  }

  return {
    slides,
    transform,
    slideWidth,
    isHideArrows,
    spaceBetween,
    cloneCount,
    isLoopEnabled,
    moveSlides,
    setTransform,
    normalizeTransform,
    visibleCountSlides
  }
}
