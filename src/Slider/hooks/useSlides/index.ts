import { useState, useMemo, useEffect, useCallback } from 'react'
import { SlideWidthArgs, Slides } from './types'
import { ConfigService } from '../../configService'
import {
  addUniqueId,
  isButtonFn,
  returnSlideWidth,
  setKeyToChildren
} from '../../helpers'
import { cloneArray } from '../../../helpers'
import { reduceSlide } from '../../constants'
import { defaultSlideWidthArgs } from './constants'

export const useSlides = ({
  children,
  config,
  windowWidth,
  currentRef,
  slidesNumber,
  spaceBetweenSlides,
  startX,
  endX,
  movePath,
  setMovePath,
  slidesAnimation
}: Slides) => {
  const [transform, setTransform] = useState<number>(0)
  const [slideWidthArgs, setSlideWidthArgs] = useState<SlideWidthArgs>(
    defaultSlideWidthArgs
  )

  const { returnSpaceBetween, getSliderUpdatesParam, getRightSlidesCount } =
    ConfigService(config, windowWidth)

  const visibleCountSlides = getRightSlidesCount(slidesNumber, slidesAnimation)
  const spaceBetween = returnSpaceBetween(spaceBetweenSlides)
  const isButton = isButtonFn(children, visibleCountSlides)
  const isCornerSlide = !!getSliderUpdatesParam('biasRight')

  const currentRefWidth = currentRef?.getBoundingClientRect().width

  const slideWidth = useMemo(
    () =>
      isCornerSlide
        ? returnSlideWidth(slideWidthArgs) * reduceSlide
        : returnSlideWidth(slideWidthArgs),
    [slideWidthArgs, isCornerSlide]
  )

  const updateSlideWidthArgs = useCallback(() => {
    setSlideWidthArgs({
      visibleCountSlides,
      spaceBetween,
      current: currentRef
    })
  }, [currentRef, spaceBetween, visibleCountSlides])

  const slides = useMemo(() => {
    return isButton
      ? addUniqueId(cloneArray(setKeyToChildren(children), 3))
      : addUniqueId(setKeyToChildren(children))
  }, [isButton, children])

  const startTransform = -slideWidth * children.length

  const checkAreaBeyondSlider = (): boolean =>
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

  useEffect(() => {
    updateSlideWidthArgs()
  }, [currentRefWidth, updateSlideWidthArgs])

  return {
    transform,
    setTransform,
    slideWidth,
    spaceBetween,
    isButton,
    slides,
    checkAreaBeyondSlider,
    jumpToTheLastSlide,
    moveSlides,
    startTransform
  }
}
