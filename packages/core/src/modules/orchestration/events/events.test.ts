import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { DRAG_THRESHOLD } from '#src/constants'
import { SlidesGeometry, SwipiAxis } from '#src/types'
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

const START = 200

type Carousel = {
  moveTo: ReturnType<typeof vi.fn>
  destroy: () => void
}

let outer: HTMLElement
let inner: HTMLElement
let link: HTMLAnchorElement
let mounted: Carousel[]

const mount = (viewport: HTMLElement, axis: SwipiAxis = 'x'): Carousel => {
  const moveTo = vi.fn()

  const carousel = {
    moveTo,
    destroy: setupEvents({
      viewport,
      getAxis: () => axis,
      getIsLoop: () => false,
      getDragFree: () => false,
      getGeometry: () => GEOMETRY,
      getHasOverflow: () => true,
      getAnimationSpeed: () => 0,
      getTransform: () => 0,
      moveTo,
      animateTo: vi.fn()
    })
  }

  mounted.push(carousel)

  return carousel
}

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

const drag = (toX: number, toY = 0): void => {
  pointer('pointerdown', START, START)
  pointer('pointermove', toX, toY)
  pointer('pointerup', toX, toY)
}

const click = (): boolean =>
  link.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true })
  )

beforeEach(() => {
  outer = document.createElement('div')
  inner = document.createElement('div')
  link = document.createElement('a')
  mounted = []

  inner.appendChild(link)
  outer.appendChild(inner)
  document.body.appendChild(outer)
})

afterEach(() => {
  mounted.forEach((carousel) => carousel.destroy())
  document.body.innerHTML = ''
})

describe('setupEvents', () => {
  test('should swallow the click that ends a drag', () => {
    mount(inner)

    const listener = vi.fn()
    link.addEventListener('click', listener)

    drag(100, START)

    expect(click()).toEqual(false)
    expect(listener).not.toHaveBeenCalled()
  })

  test('should let a click through when the pointer barely moved', () => {
    mount(inner)

    const listener = vi.fn()
    link.addEventListener('click', listener)

    drag(START - DRAG_THRESHOLD + 1, START)

    expect(click()).toEqual(true)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('should let a click through when the drag turned to the cross axis', () => {
    mount(inner)

    drag(START, 100)

    expect(click()).toEqual(true)
  })

  test('should swallow only the click that follows the drag', () => {
    mount(inner)

    drag(100, START)

    expect(click()).toEqual(false)
    expect(click()).toEqual(true)
  })

  test('should forget a stale drag when the next press starts', () => {
    mount(inner)

    drag(100, START)

    pointer('pointerdown', 100, START)
    pointer('pointerup', 100, START)

    expect(click()).toEqual(true)
  })

  test('should stop swallowing clicks after destroy', () => {
    const carousel = mount(inner)

    drag(100, START)
    carousel.destroy()

    expect(click()).toEqual(true)
  })

  test('should leave the outer carousel alone while the inner one drags', () => {
    const outerCarousel = mount(outer)
    const innerCarousel = mount(inner)

    drag(100, START)

    expect(innerCarousel.moveTo).toHaveBeenCalled()
    expect(outerCarousel.moveTo).not.toHaveBeenCalled()
  })

  test('should hand the drag to the outer carousel when the axes differ', () => {
    const outerCarousel = mount(outer, 'y')
    const innerCarousel = mount(inner)

    drag(START, 100)

    expect(outerCarousel.moveTo).toHaveBeenCalled()
    expect(innerCarousel.moveTo).not.toHaveBeenCalled()
  })

  test('should release the pointer for the next nested drag', () => {
    const outerCarousel = mount(outer)
    const innerCarousel = mount(inner)

    drag(100, START)
    innerCarousel.moveTo.mockClear()
    drag(100, START)

    expect(innerCarousel.moveTo).toHaveBeenCalled()
    expect(outerCarousel.moveTo).not.toHaveBeenCalled()
  })

  test('should release the pointer when the inner carousel is destroyed mid drag', () => {
    const outerCarousel = mount(outer)
    const innerCarousel = mount(inner)

    pointer('pointerdown', START, START)
    pointer('pointermove', 100, START)
    innerCarousel.destroy()

    drag(100, START)

    expect(outerCarousel.moveTo).toHaveBeenCalled()
  })
})
