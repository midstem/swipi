import { RefObject, useLayoutEffect, useState } from 'react'
import { NO_WIDTH } from '../../constants'

/**
 * Tracks the width of an element, so a container resize is picked up even when
 * the window itself does not change (collapsed sidebar, opened modal).
 */
export const useElementWidth = (ref: RefObject<HTMLElement | null>): number => {
  const [width, setWidth] = useState<number>(NO_WIDTH)

  useLayoutEffect(() => {
    const element = ref.current

    if (!element) return

    const measure = (): void => setWidth(element.clientWidth)

    measure()

    /** Falls back to the window when the observer is not available. */
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)

      return () => window.removeEventListener('resize', measure)
    }

    const observer = new ResizeObserver(measure)

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref])

  return width
}
