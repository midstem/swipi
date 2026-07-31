import { DragEvent, KeyboardEvent } from 'react'
import { FIRST_SLIDE } from '../Swipi/constants'

const ARROW_LEFT = 'ArrowLeft'

const ARROW_RIGHT = 'ArrowRight'

export const preventDragStart = (event: DragEvent<HTMLElement>): void =>
  event.preventDefault()

export const handleArrowKeys = (
  event: KeyboardEvent<HTMLElement>,
  scrollPrev: () => void,
  scrollNext: () => void
): void => {
  if (event.key === ARROW_LEFT) scrollPrev()
  if (event.key === ARROW_RIGHT) scrollNext()
}

export const getPositionLabel = (index: number, total: number): string =>
  `${index + FIRST_SLIDE} of ${total}`

export const getDotLabel = (index: number): string =>
  `Go to slide ${index + FIRST_SLIDE}`

export const getAnnouncement = (index: number, total: number): string =>
  `Slide ${index + FIRST_SLIDE} of ${total}`
