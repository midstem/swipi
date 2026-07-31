import { DragEvent, KeyboardEvent } from 'react'
import { CarouselLabels } from './types'
import { DEFAULT_LABELS } from './constants'

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

export const withDefaultLabels = (
  labels?: Partial<CarouselLabels>
): CarouselLabels => ({ ...DEFAULT_LABELS, ...labels })
