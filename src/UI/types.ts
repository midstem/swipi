import type { JSX } from 'react'
import { HTMLAttributes, ReactNode, RefObject } from 'react'

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
  slidesWrapperRef: RefObject<HTMLDivElement | null>
  startTouchByScreen: (a: number) => void
  moveTouchScreen: (a: number) => void
  endTouchScreen: () => void
}

export type SlidesContainerProps = {
  children: ReactNode
  transform: number
}

export type DotProps = {
  index?: number
  slideIndex?: number
  sizeForDefaultDot?: number
  sizeForDefaultActiveDot?: number
  dotColor?: string
  activeDotColor?: string
}

export type ActiveDotProps = {
  sizeForDefaultActiveDot?: number
  activeDotColor?: string | undefined
}

export type SlideProps = {
  /** Loop shift that moves the slide a whole lap forward or backward. */
  offset: number
  slideWidth: number
  spaceBetween: number
  children: JSX.Element
  animation?: React.CSSProperties
  ariaLabel: string
}
