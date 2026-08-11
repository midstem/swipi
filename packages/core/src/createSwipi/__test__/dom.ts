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

export const getTrackOffset = (viewport: HTMLElement): number => {
  const offset = /translate3d\((-?[\d.]+)px/.exec(
    getTrack(viewport).style.transform
  )

  return offset ? Number(offset[1]) : 0
}
