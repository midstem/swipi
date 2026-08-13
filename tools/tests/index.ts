import { afterEach } from 'vitest'

const DEFAULT_CONTAINER_WIDTH = 900

const DEFAULT_AXIS = 'x'

let containerWidth = DEFAULT_CONTAINER_WIDTH

let axis: 'x' | 'y' = DEFAULT_AXIS

export const setContainerWidth = (width: number): void => {
  containerWidth = width
}

export const setAxis = (next: 'x' | 'y'): void => {
  axis = next
}

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = []

  private readonly callback: () => void

  private readonly targets = new Set<Element>()

  constructor(callback: () => void) {
    this.callback = callback
    ResizeObserverMock.instances.push(this)
  }

  observe(target: Element): void {
    this.targets.add(target)
  }

  unobserve(target: Element): void {
    this.targets.delete(target)
  }

  disconnect(): void {
    this.targets.clear()
  }

  trigger(target?: Element): void {
    if (target ? this.targets.has(target) : this.targets.size) this.callback()
  }
}

export const triggerResize = (target?: Element): void =>
  ResizeObserverMock.instances.forEach((instance) => instance.trigger(target))

Object.defineProperty(globalThis, 'ResizeObserver', {
  configurable: true,
  writable: true,
  value: ResizeObserverMock
})

const SLIDE_WIDTH_VARIABLE = '--swipi-slide-width'

const SLIDE_GAP_VARIABLE = '--swipi-slide-gap'

const TEST_WIDTH_ATTRIBUTE = 'data-test-width'

const TRANSLATE_PATTERN: Record<string, RegExp> = {
  x: /translate3d\((-?[\d.]+)px/,
  y: /translate3d\([^,]+,\s*(-?[\d.]+)px/
}

const simulateSize = (element: Element): number => {
  const override = element.getAttribute(TEST_WIDTH_ATTRIBUTE)

  if (override) return Number(override)

  const parent = element.parentElement

  if (!parent) return containerWidth

  const width =
    parseFloat(parent.style.getPropertyValue(SLIDE_WIDTH_VARIABLE)) || 0

  return width || containerWidth
}

const simulateGap = (parent: HTMLElement): number =>
  parseFloat(parent.style.getPropertyValue(SLIDE_GAP_VARIABLE)) || 0

const simulateTranslate = (element: Element): number => {
  const match = TRANSLATE_PATTERN[axis].exec(
    (element as HTMLElement).style.transform
  )

  return match ? Number(match[1]) : 0
}

const simulateStart = (element: Element): number => {
  const parent = element.parentElement

  if (!parent || element === document.body) return 0

  const gap = simulateGap(parent)

  let left = simulateStart(parent) + simulateTranslate(element)

  for (let index = 0; index < parent.children.length; index += 1) {
    const sibling = parent.children[index]

    if (sibling === element) break

    left += simulateSize(sibling) + gap
  }

  return left
}

Element.prototype.getBoundingClientRect = function getBoundingClientRect(
  this: Element
): DOMRect {
  const size = simulateSize(this)
  const start = simulateStart(this)
  const isVertical = axis === 'y'

  return {
    x: isVertical ? 0 : start,
    y: isVertical ? start : 0,
    top: isVertical ? start : 0,
    left: isVertical ? 0 : start,
    right: isVertical ? 0 : start + size,
    bottom: isVertical ? start + size : 0,
    width: isVertical ? 0 : size,
    height: isVertical ? size : 0,
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
  containerWidth = DEFAULT_CONTAINER_WIDTH
  axis = DEFAULT_AXIS
  capturedPointers.clear()
  ResizeObserverMock.instances = []
})
