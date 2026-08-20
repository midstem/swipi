import type { SlidePositions, SwipiState } from '@midstem/swipi-svelte'
import { DEFAULT_STATE, MAX_EVENTS, SLIDE_COLORS } from '@swipi/playground-core'
import type {
  CarouselRef,
  PlaygroundEvent,
  PlaygroundState,
  UpdateState
} from '@swipi/playground-core'
import type { UsePlaygroundReturn } from './types'

export const usePlayground = (): UsePlaygroundReturn => {
  const state = $state<PlaygroundState>({ ...DEFAULT_STATE })

  let swipiState = $state<SwipiState | undefined>(undefined)
  let positions = $state<SlidePositions | undefined>(undefined)
  let events = $state<PlaygroundEvent[]>([])
  let carousel = $state<CarouselRef | null>(null)
  let remountToken = $state(0)

  let eventId = 0

  const slides = $derived(SLIDE_COLORS.slice(0, state.slidesCount))

  const remountKey = $derived(`${remountToken}-${state.startIndex}`)

  const update: UpdateState = (key, value) => {
    state[key] = value
  }

  const pushEvent = (name: PlaygroundEvent['name'], payload: object): void => {
    eventId += 1

    const event: PlaygroundEvent = {
      id: eventId,
      name,
      payload: JSON.stringify(payload)
    }

    events = [event, ...events].slice(0, MAX_EVENTS)
  }

  const handleSelect = (next: SwipiState): void => {
    swipiState = next
    pushEvent('onSelect', next)
  }

  const handleChange = (next: SlidePositions): void => {
    positions = next
    pushEvent('onChange', next)
  }

  const handleReady = (next: CarouselRef): void => {
    carousel = next
  }

  const remount = (): void => {
    remountToken += 1
  }

  const clearEvents = (): void => {
    events = []
  }

  const reset = (): void => {
    Object.assign(state, DEFAULT_STATE)
    events = []
    remount()
  }

  return {
    state,
    get slides() {
      return slides
    },
    get events() {
      return events
    },
    get remountKey() {
      return remountKey
    },
    get carousel() {
      return carousel
    },
    get swipiState() {
      return swipiState
    },
    get positions() {
      return positions
    },
    update,
    remount,
    reset,
    clearEvents,
    handleSelect,
    handleChange,
    handleReady
  }
}
