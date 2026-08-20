import type { SlidePositions, SwipiState } from '@midstem/swipi'
import { DEFAULT_STATE, MAX_EVENTS, SLIDE_COLORS } from '@swipi/playground-core'
import type {
  CarouselRef,
  PlaygroundEvent,
  PlaygroundState,
  UpdateState
} from '@swipi/playground-core'
import type { Playground, PlaygroundSnapshot } from './types'

const FIRST_EVENT_ID = 0

const FIRST_REMOUNT_TOKEN = 0

export const createPlayground = (): Playground => {
  let state: PlaygroundState = { ...DEFAULT_STATE }
  let events: PlaygroundEvent[] = []
  let carousel: CarouselRef | null = null
  let swipiState: SwipiState | undefined
  let positions: SlidePositions | undefined
  let remountToken = FIRST_REMOUNT_TOKEN
  let eventId = FIRST_EVENT_ID

  const listeners = new Set<() => void>()

  const build = (): PlaygroundSnapshot => ({
    state,
    events,
    carousel,
    swipiState,
    positions,
    slides: SLIDE_COLORS.slice(0, state.slidesCount),
    remountKey: `${remountToken}-${state.startIndex}`
  })

  let snapshot = build()

  const notify = (): void => {
    snapshot = build()

    listeners.forEach((listener) => listener())
  }

  const update: UpdateState = (key, value) => {
    state = { ...state, [key]: value }

    notify()
  }

  const pushEvent = (name: PlaygroundEvent['name'], payload: object): void => {
    eventId += 1

    events = [
      { id: eventId, name, payload: JSON.stringify(payload) },
      ...events
    ].slice(0, MAX_EVENTS)
  }

  return {
    update,
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)

      return () => listeners.delete(listener)
    },
    remount: () => {
      remountToken += 1
      notify()
    },
    reset: () => {
      state = { ...DEFAULT_STATE }
      events = []
      remountToken += 1

      notify()
    },
    clearEvents: () => {
      events = []
      notify()
    },
    handleSelect: (next) => {
      swipiState = next
      pushEvent('onSelect', next)
      notify()
    },
    handleChange: (next) => {
      positions = next
      pushEvent('onChange', next)
      notify()
    },
    handleReady: (next) => {
      carousel = next
      notify()
    }
  }
}
