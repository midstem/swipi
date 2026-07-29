import { useLayoutEffect, useRef, useState } from 'react'
import { NO_OFFSET, NO_WIDTH } from '../../Swipi/constants'
import { defaultDotsLeftOffsets } from './constants'
import {
  DotsLeftOffsetsTypes,
  UseSlidingProps,
  UseSlidingReturn
} from './types'
import { getDotsLeftOffsets, getWidthDifference } from './helpers'

const useSliding = ({
  slideIndex,
  countShowDots
}: UseSlidingProps): UseSlidingReturn => {
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([])
  const activeDotRef = useRef<HTMLDivElement>(null)
  const dotsLeftOffsetsRef = useRef<DotsLeftOffsetsTypes[]>(
    defaultDotsLeftOffsets
  )

  const [activeDotLeft, setActiveDotLeft] = useState<number>(NO_OFFSET)
  const [dotWidth, setDotWidth] = useState<number>(NO_WIDTH)
  const [activeDotWidth, setActiveDotWidth] = useState<number>(NO_WIDTH)

  useLayoutEffect(() => {
    dotsRef.current.length = countShowDots
    dotsLeftOffsetsRef.current = getDotsLeftOffsets(dotsRef)

    setDotWidth(dotsRef.current[0]?.clientWidth ?? NO_WIDTH)
    setActiveDotWidth(activeDotRef.current?.clientWidth ?? NO_WIDTH)
  }, [countShowDots])

  useLayoutEffect(() => {
    const dotIndent = dotsLeftOffsetsRef.current[slideIndex]?.left ?? NO_OFFSET

    setActiveDotLeft(dotIndent + getWidthDifference(dotWidth, activeDotWidth))
  }, [slideIndex, countShowDots, dotWidth, activeDotWidth])

  return { dotsRef, activeDotRef, activeDotLeft }
}

export default useSliding
