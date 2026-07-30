import { RefObject, useCallback, useLayoutEffect, useState } from 'react'
import { NO_SLIDES } from '../../constants'

export const useSlidesCount = (
  trackRef: RefObject<HTMLElement | null>
): number => {
  const [slidesCount, setSlidesCount] = useState<number>(NO_SLIDES)

  const measure = useCallback((): void => {
    const track = trackRef.current

    if (!track) return

    setSlidesCount(track.children.length)
  }, [trackRef])

  useLayoutEffect(() => {
    measure()
  })

  useLayoutEffect(() => {
    const track = trackRef.current

    if (!track || typeof MutationObserver === 'undefined') return

    const observer = new MutationObserver(measure)

    observer.observe(track, { childList: true })

    return () => observer.disconnect()
  }, [trackRef, measure])

  return slidesCount
}
