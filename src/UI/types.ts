import { ReactNode, RefObject } from 'react'

export type ComponentBasicProps = {
  children: React.ReactNode
  className?: string
}

export type SwipiButtonProps = {
  children: ReactNode
  onClick: () => void
  className: string
  disabled: boolean
}

export type SlidesWrapperProps = {
  children: ReactNode
  slidesWrapperRef: RefObject<HTMLDivElement>
  startTouchByScreen: (a: number) => void
  moveTouchScreen: (a: number) => void
  endTouchScreen: () => void
}

export type SlidesContainerProps = {
  children: ReactNode
  animation: boolean
  transform: number
  animationSpeed: number
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
  slideWidth: number
  spaceBetween: number
  children: JSX.Element
  animation?: React.CSSProperties
}
