import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

const DEFAULT_CONTAINER_WIDTH = 900

let containerWidth = DEFAULT_CONTAINER_WIDTH

export const setContainerWidth = (width: number): void => {
  containerWidth = width
}

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = []

  private readonly callback: () => void

  constructor(callback: () => void) {
    this.callback = callback
    ResizeObserverMock.instances.push(this)
  }

  observe(): void {}

  unobserve(): void {}

  disconnect(): void {
    ResizeObserverMock.instances = ResizeObserverMock.instances.filter(
      (instance) => instance !== this
    )
  }

  trigger(): void {
    this.callback()
  }
}

export const triggerResize = (): void =>
  ResizeObserverMock.instances.forEach((instance) => instance.trigger())

Object.defineProperty(globalThis, 'ResizeObserver', {
  configurable: true,
  writable: true,
  value: ResizeObserverMock
})

const SLIDE_WIDTH_VARIABLE = '--swipi-slide-width'

const SLIDE_GAP_VARIABLE = '--swipi-slide-gap'

const TEST_WIDTH_ATTRIBUTE = 'data-test-width'

const TRANSLATE_PATTERN = /translate3d\((-?[\d.]+)px/

const simulateWidth = (element: Element): number => {
  const override = element.getAttribute(TEST_WIDTH_ATTRIBUTE)

  if (override) return Number(override)

  const parent = element.parentElement

  if (!parent) return containerWidth

  const width =
    parseFloat(parent.style.getPropertyValue(SLIDE_WIDTH_VARIABLE)) || 0

  if (!width) return containerWidth

  if (element !== parent.lastElementChild) return width

  const gap = parseFloat(parent.style.getPropertyValue(SLIDE_GAP_VARIABLE)) || 0

  return width - gap
}

const simulateTranslate = (element: Element): number => {
  const match = TRANSLATE_PATTERN.exec((element as HTMLElement).style.transform)

  return match ? Number(match[1]) : 0
}

const simulateLeft = (element: Element): number => {
  const parent = element.parentElement

  if (!parent || element === document.body) return 0

  let left = simulateLeft(parent) + simulateTranslate(element)

  for (let index = 0; index < parent.children.length; index += 1) {
    const sibling = parent.children[index]

    if (sibling === element) break

    left += simulateWidth(sibling)
  }

  return left
}

Element.prototype.getBoundingClientRect = function getBoundingClientRect(
  this: Element
): DOMRect {
  const width = simulateWidth(this)
  const left = simulateLeft(this)

  return {
    x: left,
    y: 0,
    top: 0,
    left,
    right: left + width,
    bottom: 0,
    width,
    height: 0,
    toJSON: () => ({})
  }
}

const capturedPointers = new Set<number>()

Element.prototype.setPointerCapture = function setPointerCapture(
  pointerId: number
): void {
  capturedPointers.add(pointerId)
}

Element.prototype.releasePointerCapture = function releasePointerCapture(
  pointerId: number
): void {
  capturedPointers.delete(pointerId)
}

Element.prototype.hasPointerCapture = function hasPointerCapture(
  pointerId: number
): boolean {
  return capturedPointers.has(pointerId)
}

export const isPointerCaptured = (pointerId: number): boolean =>
  capturedPointers.has(pointerId)

afterEach(() => {
  cleanup()
  containerWidth = DEFAULT_CONTAINER_WIDTH
  capturedPointers.clear()
})
