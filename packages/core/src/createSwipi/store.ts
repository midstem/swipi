import { SwipiSnapshot, SlidePositions } from '../types'

export type StoreState = {
  slideIndex: number
  snapCount: number
  slidesCount: number
  hasOverflow: boolean
  canScrollNext: boolean
  canScrollPrev: boolean
}

export type SetupStoreProps = {
  onChange?: (positions: SlidePositions) => void
  onSelect?: (state: {
    selectedIndex: number
    snapCount: number
    canScrollNext: boolean
    canScrollPrev: boolean
  }) => void
  getSlidePositions: (
    selectedIndex: number,
    snapCount: number,
    isLoop: boolean
  ) => SlidePositions
  getIsMeasured: () => boolean
  getIsLoop: () => boolean
}

export const setupStore = ({
  onChange,
  onSelect,
  getSlidePositions,
  getIsMeasured,
  getIsLoop
}: SetupStoreProps) => {
  const subscribers = new Set<() => void>()
  let cachedSnapshot: SwipiSnapshot | null = null

  const notify = () => {
    subscribers.forEach((listener) => listener())
  }

  const subscribe = (listener: () => void) => {
    subscribers.add(listener)
    return () => {
      subscribers.delete(listener)
    }
  }

  const updateSnapshot = (nextSnapshot: StoreState) => {
    if (
      !cachedSnapshot ||
      cachedSnapshot.selectedIndex !== nextSnapshot.slideIndex ||
      cachedSnapshot.snapCount !== nextSnapshot.snapCount ||
      cachedSnapshot.slidesCount !== nextSnapshot.slidesCount ||
      cachedSnapshot.hasOverflow !== nextSnapshot.hasOverflow ||
      cachedSnapshot.canScrollNext !== nextSnapshot.canScrollNext ||
      cachedSnapshot.canScrollPrev !== nextSnapshot.canScrollPrev
    ) {
      cachedSnapshot = {
        selectedIndex: nextSnapshot.slideIndex,
        snapCount: nextSnapshot.snapCount,
        slidesCount: nextSnapshot.slidesCount,
        hasOverflow: nextSnapshot.hasOverflow,
        canScrollNext: nextSnapshot.canScrollNext,
        canScrollPrev: nextSnapshot.canScrollPrev
      }

      notify()

      if (getIsMeasured()) {
        onChange?.(
          getSlidePositions(
            cachedSnapshot.selectedIndex,
            cachedSnapshot.snapCount,
            getIsLoop()
          )
        )
        onSelect?.({
          selectedIndex: cachedSnapshot.selectedIndex,
          snapCount: cachedSnapshot.snapCount,
          canScrollNext: cachedSnapshot.canScrollNext,
          canScrollPrev: cachedSnapshot.canScrollPrev
        })
      }
    }
  }

  const getSnapshot = (fallback: StoreState): SwipiSnapshot => {
    if (!cachedSnapshot) {
      cachedSnapshot = {
        selectedIndex: fallback.slideIndex,
        snapCount: fallback.snapCount,
        slidesCount: fallback.slidesCount,
        hasOverflow: fallback.hasOverflow,
        canScrollNext: fallback.canScrollNext,
        canScrollPrev: fallback.canScrollPrev
      }
    }
    return cachedSnapshot
  }

  return { subscribe, updateSnapshot, getSnapshot }
}
