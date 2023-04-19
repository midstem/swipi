import { useRef, useState, useEffect, useCallback } from 'react'
import { defaultDotsLeftOffsets } from './constants'
import { DotsLeftOffsetsTypes } from './types'
import { getDotsLeftOffsets, getWidthDifference } from './helpers'

const useSliding = (slideIndex: number) => {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([])
  const activeDotRef = useRef<HTMLDivElement>(null)
  const [activeDotLeft, setActiveDotLeft] = useState<number>(0)
  const [dotWidth, setDotWidth] = useState<number>(0)
  const [activeDotWidth, setActiveDotWidth] = useState<number>(0)
  //prettier-ignore
  const [dotsLeftOffsets, setDotsLeftOffsets] = 
  useState<DotsLeftOffsetsTypes[]>(defaultDotsLeftOffsets)

  const initializeData = (): void => {
    setDotsLeftOffsets(getDotsLeftOffsets(dotsRef))
    setDotWidth(dotsRef.current[0]?.clientWidth ?? 0)
    setActiveDotWidth(activeDotRef.current?.clientWidth ?? 0)
  }

  const moveActiveDot = useCallback(() => {
    const activeDotIndent = dotsLeftOffsets[slideIndex].left
    const dotAlignment = getWidthDifference(dotWidth, activeDotWidth)

    if (!slideIndex) return setActiveDotLeft(activeDotIndent + dotAlignment)

    setActiveDotLeft(activeDotIndent + dotAlignment)
  }, [activeDotWidth, dotWidth, dotsLeftOffsets, slideIndex])

  useEffect(() => {
    initializeData()
  }, [])

  useEffect(() => {
    moveActiveDot()
  }, [moveActiveDot])

  return { dotsRef, activeDotRef, activeDotLeft }
}

export default useSliding
