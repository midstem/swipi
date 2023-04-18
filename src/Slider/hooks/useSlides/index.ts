import { useState, useMemo } from 'react'
import { Slides } from 'src/Slider/hooks/useSlides/types'
import {
  returnSlideWidth,
  addUniqueId,
  isButton as isButtonFn
} from 'src/Slider/helpers'
import { ConfigService } from 'src/Slider/configService'
import { reduceSlide } from 'src/Slider/constants'

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
  setMovePath
}: Slides) => {
  const [transform, setTransform] = useState<number>(0)

  const { returnCountSlides, returnSpaceBetween, getSliderUpdatesParam } =
    ConfigService(config, windowWidth)

  const visibleCountSlides = returnCountSlides(slidesNumber)
  const spaceBetween = returnSpaceBetween(spaceBetweenSlides)
  const isButton = isButtonFn(children, returnCountSlides(slidesNumber))
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
    [returnSlideWidthArgs, , isCornerSlide]
  )

  const slides = useMemo(
    () =>
      isButton
        ? addUniqueId([...children, ...children, ...children])
        : addUniqueId(children),
    [isButton, children]
  )

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
