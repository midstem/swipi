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

const capturedPointers = new Set<number>()

/** jsdom implements no pointer capture — these keep the drag path testable. */
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
