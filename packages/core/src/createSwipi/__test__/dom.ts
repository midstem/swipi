export const SLIDE_WIDTH = 900

export const SLIDES_COUNT = 4

export const mountViewport = (slidesCount = SLIDES_COUNT): HTMLElement => {
  const viewport = document.createElement('div')
  const track = document.createElement('div')

  for (let index = 0; index < slidesCount; index += 1) {
    track.appendChild(document.createElement('article'))
  }

  viewport.appendChild(track)
  document.body.appendChild(viewport)

  return viewport
}

export const getTrack = (viewport: HTMLElement): HTMLElement =>
  viewport.firstElementChild as HTMLElement

export const getSlides = (viewport: HTMLElement): HTMLElement[] =>
  Array.from(getTrack(viewport).children) as HTMLElement[]

const TRANSLATE_PATTERN = {
  x: /translate3d\((-?[\d.]+)px/,
  y: /translate3d\([^,]+,\s*(-?[\d.]+)px/
}

export const getTrackOffset = (
  viewport: HTMLElement,
  axis: 'x' | 'y' = 'x'
): number => {
  const offset = TRANSLATE_PATTERN[axis].exec(
    getTrack(viewport).style.transform
  )

  return offset ? Number(offset[1]) : 0
}
