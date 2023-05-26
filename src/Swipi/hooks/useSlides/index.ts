import { useState, useMemo } from 'react'
import { ConfigService } from '../../configService'
import {
  addUniqueId,
  calculateSlideWidthWithCorner,
  isHideArrowsFn,
  returnSlideWidth,
  setKeyToChildren
} from '../../helpers'
import { cloneArray } from '../../../helpers'

import { Slides } from './types'

export const useSlides = ({
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
  const isCornerSlide = 
    slidesAnimation === 'default' ? getSwipiUpdatesParam('biasRight') ?? biasRight : false


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
    return isHideArrows
      ? addUniqueId(cloneArray(setKeyToChildren(children), 3))
      : addUniqueId(setKeyToChildren(children))
  }, [isHideArrows, children])

  const startTransform = -slideWidth * children.length

  const checkAreaBeyondSwipi = (): boolean =>
    transform <= startTransform * 2 - slideWidth || transform >= slideWidth / 2

  const moveSlides = (): void => {
    const pathTaken = endX && startX - endX
    setTransform((prev) => prev - pathTaken + movePath)
    setMovePath(pathTaken)
  }

  const jumpToTheLastSlide = (): void => {
    const lineLengthOfSlides = slideWidth * slides.length
    const numberOfSlidesBack = visibleCountSlides === 1 ? 2 : visibleCountSlides
    const rightJump = -(lineLengthOfSlides - slideWidth * numberOfSlidesBack)
    setTransform(movePath > 0 ? rightJump : 0)
  }

  return {
    slides,
    transform,
    slideWidth,
    isHideArrows,
    spaceBetween,
    startTransform,
    moveSlides,
    setTransform,
    jumpToTheLastSlide,
    checkAreaBeyondSwipi,
    visibleCountSlides
  }
}
