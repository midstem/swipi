import { MutableRefObject } from 'react'

export type Navigation = {
  isLoop: boolean
  lastIndex: number
  slideWidth: number
  slidesCount: number
  canScrollNext: boolean
  canScrollPrev: boolean
  targetRef: MutableRefObject<number>
  animateTo: (value: number) => void
}

export type UseNavigationReturn = {
  nextImg: () => void
  prevImg: () => void
  scrollTo: (index: number) => void
}
