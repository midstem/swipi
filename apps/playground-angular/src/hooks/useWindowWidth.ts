import { DestroyRef, inject, signal } from '@angular/core'
import type { Signal } from '@angular/core'

const RESIZE = 'resize'

export const useWindowWidth = (): Signal<number> => {
  const width = signal(window.innerWidth)

  const update = (): void => width.set(window.innerWidth)

  window.addEventListener(RESIZE, update)

  inject(DestroyRef).onDestroy(() => window.removeEventListener(RESIZE, update))

  return width.asReadonly()
}
