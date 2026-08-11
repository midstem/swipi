import { MutableRefObject } from 'react'
import { SlidesGeometry } from '@swipi/core'

export type Navigation = {
  isLoop: boolean
  geometry: SlidesGeometry
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
