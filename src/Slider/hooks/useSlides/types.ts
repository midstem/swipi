import { ConfigType } from 'Slider/types'

export type Slides = {
  children: JSX.Element[]
  config: ConfigType[]
  windowWidth: number
  currentRef: HTMLDivElement | null
  slidesNumber: number
  spaceBetweenSlides: number
  startX: number
  endX: number
  movePath: number
  setMovePath: (value: number) => void
}
