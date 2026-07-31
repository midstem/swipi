import { RefObject, useCallback, useLayoutEffect, useState } from 'react'
import { EMPTY_GEOMETRY, measureSlides } from '../../geometry'
import { SlidesGeometry } from '../../types'

type UseSlidesGeometryProps = {
  trackRef: RefObject<HTMLDivElement | null>
  viewportWidth: number
  slidesCount: number
  slideWidth: number
  spaceBetween: number
  loop: boolean
}

export const useSlidesGeometry = ({
  trackRef,
  viewportWidth,
  slidesCount,
  slideWidth,
  spaceBetween,
  loop
}: UseSlidesGeometryProps): SlidesGeometry => {
  const [geometry, setGeometry] = useState<SlidesGeometry>(EMPTY_GEOMETRY)

  const measure = useCallback((): void => {
    const track = trackRef.current

    if (!track) return

    setGeometry(measureSlides(track, viewportWidth, loop))
  }, [trackRef, viewportWidth, loop])

  useLayoutEffect(() => {
    measure()
  }, [measure, slidesCount, slideWidth, spaceBetween])

  return geometry
}
