import { useState, useMemo } from 'react'
import { Slides } from './types'
import { ConfigService } from '../../configService'
import {
  addUniqueId,
  getSliderBorders,
  isButtonFn,
  returnSlideWidth,
  setKeyToChildren
} from '../../helpers'
import { cloneArray } from '../../../helpers'
import { reduceSlide } from '../../constants'

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
  slidesAnimation,
  loop
}: Slides) => {
  const [transform, setTransform] = useState<number>(0)

  const { returnSpaceBetween, getSliderUpdatesParam, getRightSlidesCount } =
    ConfigService(config, windowWidth, children)

  const visibleCountSlides = getRightSlidesCount(slidesNumber, slidesAnimation)
  const spaceBetween = returnSpaceBetween(spaceBetweenSlides)
  const isButton = isButtonFn(children, visibleCountSlides)
  const isCornerSlide = !!getSliderUpdatesParam('biasRight')

  const returnSlideWidthArgs = useMemo(
    () => ({
      visibleCountSlides,
      spaceBetween,
      current: currentRef
    }),
    [currentRef, spaceBetween, visibleCountSlides]
  )

  const slideWidth = useMemo(
    () =>
      isCornerSlide
        ? returnSlideWidth(returnSlideWidthArgs) * reduceSlide
        : returnSlideWidth(returnSlideWidthArgs),
    [returnSlideWidthArgs, isCornerSlide]
  )

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

    setTransform((prev) => {
      const newTransform = prev - pathTaken + movePath

      const { left, right } = getSliderBorders(
        slideWidth,
        children.length,
        getRightSlidesCount(children.length, slidesAnimation)
      )

      if (loop) {
        return newTransform
      }
      if (newTransform <= right) {
        return right
      }
      if (newTransform >= left) {
        return left
      }
      return newTransform
    })
    setMovePath(pathTaken)
  }

  const jumpToTheLastSlide = (): void => {
    const lineLengthOfSlides = slideWidth * slides.length
    const numberOfSlidesBack = visibleCountSlides === 1 ? 2 : visibleCountSlides
    const rightJump = -(lineLengthOfSlides - slideWidth * numberOfSlidesBack)
    setTransform(movePath > 0 ? rightJump : 0)
  }

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
