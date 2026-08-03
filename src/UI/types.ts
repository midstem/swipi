import {
  CSSProperties,
  HTMLAttributes,
  MutableRefObject,
  ReactNode
} from 'react'
import { SwipiCarouselRef } from '../useSwipiCarousel/types'

export type ComponentBasicProps = {
  children: ReactNode
  className?: string
}

export type CarouselWrapperProps = ComponentBasicProps &
  HTMLAttributes<HTMLDivElement>

export type LiveRegionProps = {
  current: number
  total: number
}

export type SwipiButtonProps = {
  children: ReactNode
  onClick: () => void
  className: string
  disabled: boolean
  ariaLabel: string
}

export type SlidesWrapperProps = {
  children: ReactNode
  carouselRef: SwipiCarouselRef
}

export type SlidesContainerProps = {
  children: ReactNode
}

export type DotProps = {
  isActive?: boolean
  sizeForDefaultDot?: number
  sizeForDefaultActiveDot?: number
  dotColor?: string
  activeDotColor?: string
}

export type RenderDot = (index: number, isActive: boolean) => ReactNode

export type DotButtonProps = {
  index: number
  isActive: boolean
  onSelect: (index: number) => void
  renderDot: RenderDot
  dotsRef?: MutableRefObject<(HTMLButtonElement | null)[]>
  style?: CSSProperties
}

export type ActiveDotProps = {
  sizeForDefaultActiveDot?: number
  activeDotColor?: string | undefined
}

export type SlideProps = {
  children: ReactNode
  animation: CSSProperties
  ariaLabel: string
}
