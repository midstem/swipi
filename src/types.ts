export type DotsTypes = {
  customDot?: JSX.Element
  slideIndex: number
  customActiveDot?: JSX.Element
  sizeForDefaultDot?: number
  sizeForDefaultActiveDot: number
  activeDotColor?: string
  dotColor?: string
  animationSpeed: number
  handleDotClick: (index: number) => void
  returnDots: (index: number) => React.ReactNode
  countShowDots: number
}

export enum SlidesAnimation {
  DEFAULT = 'default',
  FADE_IN = 'fade-in'
}

export type ValueOf<T extends string> = `${T}`
