import { EMPTY_TRANSFORM } from '../../index'

export const toTranslate = (value: number): string =>
  value ? `translate3d(${value}px, 0, 0)` : EMPTY_TRANSFORM

export const forEachSlide = (
  track: HTMLElement,
  visit: (slide: HTMLElement, index: number) => void
): void => {
  const { children } = track

  for (let index = 0; index < children.length; index += 1) {
    visit(children[index] as HTMLElement, index)
  }
}
