export const SLIDES_COUNT = 4

export const SLIDE_WIDTH = 900

const query = (testId: string): HTMLElement => {
  const element = document.querySelector<HTMLElement>(
    `[data-testid="${testId}"]`
  )

  if (!element) throw new Error(`no element with data-testid="${testId}"`)

  return element
}

export const getViewport = (): HTMLElement => query('viewport')

export const getTrack = (): HTMLElement => query('track')

export const getSlides = (): HTMLElement[] =>
  Array.from(getTrack().children) as HTMLElement[]

export const buildSlides = (track: HTMLElement, count: number): void => {
  while (track.children.length > count) track.lastElementChild?.remove()

  while (track.children.length < count) {
    const slide = document.createElement('article')

    slide.textContent = String(track.children.length + 1)
    track.appendChild(slide)
  }
}

const TRANSLATE_PATTERN: Record<string, RegExp> = {
  x: /translate3d\((-?[\d.]+)px/,
  y: /translate3d\([^,]+,\s*(-?[\d.]+)px/
}

export const getTrackOffset = (axis: 'x' | 'y' = 'x'): number => {
  const offset = TRANSLATE_PATTERN[axis].exec(getTrack().style.transform)

  return offset ? Number(offset[1]) : 0
}
