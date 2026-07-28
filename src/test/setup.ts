import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

const DEFAULT_CONTAINER_WIDTH = 900

let containerWidth = DEFAULT_CONTAINER_WIDTH

/** jsdom has no layout, so the measured width is driven from the tests. */
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

/** jsdom ships no ResizeObserver — tests trigger it through this mock. */
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

afterEach(() => {
  cleanup()
  containerWidth = DEFAULT_CONTAINER_WIDTH
})
