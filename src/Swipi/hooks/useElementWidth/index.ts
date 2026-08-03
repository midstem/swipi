import { RefObject, useLayoutEffect, useState } from 'react'
import { NO_WIDTH } from '../../constants'

export const useElementWidth = (ref: RefObject<HTMLElement | null>): number => {
  const [width, setWidth] = useState<number>(NO_WIDTH)

  useLayoutEffect(() => {
    const element = ref.current

    if (!element) return

    const measure = (): void => setWidth(element.getBoundingClientRect().width)

    measure()

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
