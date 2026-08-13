import { SwipiAxis } from '#src/types'
import { VERTICAL_AXIS } from './constants'

export * from './constants'

export const isVertical = (axis: SwipiAxis): boolean => axis === VERTICAL_AXIS

export const getRectStart = (rect: DOMRect, axis: SwipiAxis): number =>
  isVertical(axis) ? rect.top : rect.left

export const getRectSize = (rect: DOMRect, axis: SwipiAxis): number =>
  isVertical(axis) ? rect.height : rect.width

export const getElementSize = (element: Element, axis: SwipiAxis): number =>
  getRectSize(element.getBoundingClientRect(), axis)

export const getMainPoint = (event: PointerEvent, axis: SwipiAxis): number =>
  isVertical(axis) ? event.clientY : event.clientX

export const getCrossPoint = (event: PointerEvent, axis: SwipiAxis): number =>
  isVertical(axis) ? event.clientX : event.clientY
