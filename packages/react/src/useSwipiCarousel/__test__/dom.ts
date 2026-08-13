import { fireEvent, screen } from '@testing-library/react'

export const SLIDES_COUNT = 4

export const SLIDE_WIDTH = 900

export const POINTER_ID = 1

export const PAUSE_BEFORE_RELEASE = 150

export const readState = (): string => screen.getByTestId('state').textContent

export const getViewport = (): HTMLElement => screen.getByTestId('viewport')

export const getTrack = (): HTMLElement => screen.getByTestId('track')

export const getSlides = (): HTMLElement[] =>
  Array.from(getTrack().children) as HTMLElement[]

export const getDot = (index: number): HTMLElement =>
  screen.getByRole('button', { name: `dot ${index}` })

const TRANSLATE_PATTERN = {
  x: /translate3d\((-?[\d.]+)px/,
  y: /translate3d\([^,]+,\s*(-?[\d.]+)px/
}

export const getTrackOffset = (axis: 'x' | 'y' = 'x'): number => {
  const offset = TRANSLATE_PATTERN[axis].exec(getTrack().style.transform)

  return offset ? Number(offset[1]) : 0
}

export const lastOf = <Item>(items: Item[]): Item => items[items.length - 1]

export const addSlide = (): void => {
  getTrack().appendChild(document.createElement('article'))
}

export const drag = (points: [number, number][]): void => {
  const viewport = getViewport()

  fireEvent.pointerDown(viewport, {
    pointerId: POINTER_ID,
    button: 0,
    clientX: points[0][0],
    clientY: points[0][1]
  })

  points.slice(1).forEach(([clientX, clientY]) => {
    fireEvent.pointerMove(viewport, { pointerId: POINTER_ID, clientX, clientY })
  })
}

export const release = (): void => {
  fireEvent.pointerUp(getViewport(), { pointerId: POINTER_ID })
}

export const cancelDrag = (): void => {
  fireEvent.pointerCancel(getViewport(), { pointerId: POINTER_ID })
}

export const rest = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, PAUSE_BEFORE_RELEASE))
