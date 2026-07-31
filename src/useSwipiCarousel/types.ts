import {
  DragEventHandler,
  KeyboardEventHandler,
  PointerEventHandler,
  RefObject
} from 'react'
import { SlidePositions, SwipiState } from '../Swipi/types'

export type CarouselLabels = {
  carousel: string
  slide: (index: number, total: number) => string
  dot: (index: number) => string
  announcement: (index: number, total: number) => string
}

export type SwipiCarouselOptions = {
  loop?: boolean
  dragFree?: boolean
  autoplay?: boolean
  slideWidth?: number
  spaceBetween?: number
  initialSlide?: number
  autoplaySpeed?: number
  animationSpeed?: number
  labels?: Partial<CarouselLabels>
  onChange?: (positions: SlidePositions) => void
  onSelect?: (state: SwipiState) => void
}

export type ViewportProps = {
  ref: RefObject<HTMLDivElement | null>
  role: string
  tabIndex: number
  'aria-roledescription': string
  'aria-label': string
  onKeyDown: KeyboardEventHandler<HTMLElement>
  onPointerDown: PointerEventHandler<HTMLDivElement>
  onPointerMove: PointerEventHandler<HTMLDivElement>
  onPointerUp: PointerEventHandler<HTMLDivElement>
  onPointerCancel: PointerEventHandler<HTMLDivElement>
}

export type TrackProps = {
  ref: RefObject<HTMLDivElement | null>
  onDragStart: DragEventHandler<HTMLElement>
}

export type SlidePropsGetter = {
  role: string
  'aria-roledescription': string
  'aria-label': string
}

export type DotPropsGetter = {
  type: 'button'
  'aria-label': string
  'aria-current': boolean
  onClick: () => void
}

export type LiveRegionProps = {
  'aria-live': 'polite'
  'aria-atomic': true
}

export type SwipiCarouselState = SwipiState & {
  slidesCount: number
  hasOverflow: boolean
  announcement: string
}

export type SwipiCarousel = {
  state: SwipiCarouselState
  scrollNext: () => void
  scrollPrev: () => void
  scrollTo: (index: number) => void
  getViewportProps: () => ViewportProps
  getTrackProps: () => TrackProps
  getSlideProps: (index: number) => SlidePropsGetter
  getDotProps: (index: number) => DotPropsGetter
  getLiveRegionProps: () => LiveRegionProps
}
