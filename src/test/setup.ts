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

Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  get: () => containerWidth
})

const SLIDE_WIDTH_VARIABLE = '--swipi-slide-width'

const TEST_WIDTH_ATTRIBUTE = 'data-test-width'

const simulateWidth = (element: Element): number => {
  const override = element.getAttribute(TEST_WIDTH_ATTRIBUTE)

  if (override) return Number(override)

  const parent = element.parentElement

  if (!parent) return 0

  return parseFloat(parent.style.getPropertyValue(SLIDE_WIDTH_VARIABLE)) || 0
}

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  get(this: HTMLElement): number {
    return simulateWidth(this)
  }
})

Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
  configurable: true,
  get(this: HTMLElement): number {
    const siblings = this.parentElement?.children

    if (!siblings) return 0

    let offset = 0

    for (let index = 0; index < siblings.length; index += 1) {
      if (siblings[index] === this) break

      offset += simulateWidth(siblings[index])
    }

    return offset
  }
})

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
