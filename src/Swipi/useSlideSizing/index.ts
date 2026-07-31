import { useLayoutEffect, useMemo, useState } from 'react'
import { ConfigService } from '../configService'
import { calculateSlideWidthWithCorner, returnSlideWidth } from '../helpers'
import { useWindowResize } from '../hooks/useWindowResize'
import { ConfigType } from '../types'

type UseSlideSizingProps = {
  config: ConfigType[]
  biasRight?: boolean
  slidesNumber: number
  viewportWidth: number
  spaceBetweenSlides: number
}

type UseSlideSizingReturn = {
  slideWidth: number
  spaceBetween: number
}

export const useSlideSizing = ({
  config,
  biasRight,
  slidesNumber,
  viewportWidth,
  spaceBetweenSlides
}: UseSlideSizingProps): UseSlideSizingReturn => {
  const [windowWidth, setWindowWidth] = useState<number>(0)

  useWindowResize(() => setWindowWidth(window.innerWidth))

  useLayoutEffect(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  const { returnSpaceBetween, getSwipiUpdatesParam, returnCountSlides } =
    ConfigService(config, windowWidth)

  const visibleCountSlides = returnCountSlides(slidesNumber)
  const spaceBetween = returnSpaceBetween(spaceBetweenSlides)
  const isCornerSlide = getSwipiUpdatesParam('biasRight') ?? biasRight

  const slideWidth = useMemo(() => {
    const width = returnSlideWidth({
      visibleCountSlides,
      spaceBetween,
      current: viewportWidth
    })

    return isCornerSlide
      ? calculateSlideWidthWithCorner(width, visibleCountSlides)
      : width
  }, [isCornerSlide, visibleCountSlides, spaceBetween, viewportWidth])

  return { slideWidth, spaceBetween }
}
