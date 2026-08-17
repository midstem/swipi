import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SlidePositions, SwipiState } from '@midstem/swipi-react'
import { CarouselRef } from '@swipi/playground-core'
import { DEFAULT_STATE, MAX_EVENTS, SLIDE_COLORS } from '@swipi/playground-core'
import { loadState, saveState } from '@swipi/playground-core'
import { PlaygroundEvent, PlaygroundState } from '@swipi/playground-core'
import { UsePlaygroundReturn } from './types'

export const usePlayground = (): UsePlaygroundReturn => {
  const [state, setState] = useState<PlaygroundState>(loadState)
  const [swipiState, setSwipiState] = useState<SwipiState>()
  const [positions, setPositions] = useState<SlidePositions>()
  const [events, setEvents] = useState<PlaygroundEvent[]>([])
  const [remountToken, setRemountToken] = useState<number>(0)

  const swipiRef = useRef<CarouselRef>(null)
  const eventId = useRef<number>(0)

  useEffect(() => saveState(state), [state])

  const update = useCallback(
    <Key extends keyof PlaygroundState>(
      key: Key,
      value: PlaygroundState[Key]
    ): void => setState((previous) => ({ ...previous, [key]: value })),
    []
  )

  const pushEvent = useCallback(
    (name: PlaygroundEvent['name'], payload: object): void => {
      eventId.current += 1

      const event: PlaygroundEvent = {
        id: eventId.current,
        name,
        payload: JSON.stringify(payload)
      }

      setEvents((previous) => [event, ...previous].slice(0, MAX_EVENTS))
    },
    []
  )

  const handleSelect = useCallback(
    (next: SwipiState): void => {
      setSwipiState(next)
      pushEvent('onSelect', next)
    },
    [pushEvent]
  )

  const handleChange = useCallback(
    (next: SlidePositions): void => {
      setPositions(next)
      pushEvent('onChange', next)
    },
    [pushEvent]
  )

  const remount = useCallback(
    (): void => setRemountToken((token) => token + 1),
    []
  )

  const clearEvents = useCallback((): void => setEvents([]), [])

  const reset = useCallback((): void => {
    setState(DEFAULT_STATE)
    setEvents([])
    remount()
  }, [remount])

  const slides = useMemo(
    () => SLIDE_COLORS.slice(0, state.slidesCount),
    [state.slidesCount]
  )

  return {
    state,
    slides,
    events,
    swipiRef,
    swipiState,
    positions,
    remountKey: `${remountToken}-${state.startIndex}`,
    update,
    remount,
    reset,
    clearEvents,
    handleSelect,
    handleChange
  }
}
