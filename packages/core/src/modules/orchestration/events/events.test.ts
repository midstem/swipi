import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { DRAG_THRESHOLD } from '#src/constants'
import { SlidesGeometry } from '#src/types'
import { setupEvents } from '.'

const SLIDE_WIDTH = 300

const GEOMETRY: SlidesGeometry = {
  positions: [0, SLIDE_WIDTH, SLIDE_WIDTH * 2],
  sizes: [SLIDE_WIDTH, SLIDE_WIDTH, SLIDE_WIDTH],
  contentSize: SLIDE_WIDTH * 3,
  loopSize: SLIDE_WIDTH * 3,
  snaps: [0, -SLIDE_WIDTH, -SLIDE_WIDTH * 2]
}

const POINTER_ID = 1

let viewport: HTMLElement
let link: HTMLAnchorElement
let destroy: () => void

const pointer = (type: string, clientX: number, clientY = 0): void => {
  link.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      pointerId: POINTER_ID,
      button: 0,
      clientX,
      clientY
    })
  )
}

const click = (): boolean =>
  link.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true })
  )

beforeEach(() => {
  viewport = document.createElement('div')
  link = document.createElement('a')
  viewport.appendChild(link)
  document.body.appendChild(viewport)

  destroy = setupEvents({
    viewport,
    getAxis: () => 'x',
    getIsLoop: () => false,
    getDragFree: () => false,
    getGeometry: () => GEOMETRY,
    getHasOverflow: () => true,
    getAnimationSpeed: () => 0,
    getTransform: () => 0,
    moveTo: vi.fn(),
    animateTo: vi.fn()
  })
})

afterEach(() => {
  destroy()
  document.body.innerHTML = ''
})

describe('setupEvents', () => {
  test('should swallow the click that ends a drag', () => {
    const listener = vi.fn()
    link.addEventListener('click', listener)

    pointer('pointerdown', 200)
    pointer('pointermove', 100)
    pointer('pointerup', 100)

    expect(click()).toEqual(false)
    expect(listener).not.toHaveBeenCalled()
  })

  test('should let a click through when the pointer barely moved', () => {
    const listener = vi.fn()
    link.addEventListener('click', listener)

    pointer('pointerdown', 200)
    pointer('pointermove', 200 - DRAG_THRESHOLD + 1)
    pointer('pointerup', 200 - DRAG_THRESHOLD + 1)

    expect(click()).toEqual(true)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('should let a click through when the drag turned to the cross axis', () => {
    pointer('pointerdown', 200, 200)
    pointer('pointermove', 200, 100)
    pointer('pointerup', 200, 100)

    expect(click()).toEqual(true)
  })

  test('should swallow only the click that follows the drag', () => {
    pointer('pointerdown', 200)
    pointer('pointermove', 100)
    pointer('pointerup', 100)

    expect(click()).toEqual(false)
    expect(click()).toEqual(true)
  })

  test('should forget a stale drag when the next press starts', () => {
    pointer('pointerdown', 200)
    pointer('pointermove', 100)
    pointer('pointerup', 100)

    pointer('pointerdown', 100)
    pointer('pointerup', 100)

    expect(click()).toEqual(true)
  })

  test('should stop swallowing clicks after destroy', () => {
    pointer('pointerdown', 200)
    pointer('pointermove', 100)
    pointer('pointerup', 100)

    destroy()

    expect(click()).toEqual(true)
  })
})
