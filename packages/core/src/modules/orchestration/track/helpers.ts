import { EMPTY_TRANSFORM } from '#src/constants'
import { isVertical } from '#src/modules/axis'
import { SwipiAxis } from '#src/types'

export const toTranslate = (value: number, axis: SwipiAxis): string => {
  if (!value) return EMPTY_TRANSFORM

  return isVertical(axis)
    ? `translate3d(0, ${value}px, 0)`
    : `translate3d(${value}px, 0, 0)`
}

export const forEachSlide = (
  track: HTMLElement,
  visit: (slide: HTMLElement, index: number) => void
): void => {
  const { children } = track

  for (let index = 0; index < children.length; index += 1) {
    visit(children[index] as HTMLElement, index)
  }
}
