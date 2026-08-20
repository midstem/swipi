import { computed, signal } from '@angular/core'
import { SlidePositions, SwipiState } from '@midstem/swipi-angular'
import { CarouselRef } from '@swipi/playground-core'
import { DEFAULT_STATE, MAX_EVENTS, SLIDE_COLORS } from '@swipi/playground-core'
import {
  PlaygroundEvent,
  PlaygroundState,
  UpdateState
} from '@swipi/playground-core'
import { UsePlaygroundReturn } from './types'

const FIRST_EVENT_ID = 0

const NEXT_TOKEN = 1

export const usePlayground = (): UsePlaygroundReturn => {
  const state = signal<PlaygroundState>(DEFAULT_STATE)
  const swipiState = signal<SwipiState | undefined>(undefined)
  const positions = signal<SlidePositions | undefined>(undefined)
  const events = signal<PlaygroundEvent[]>([])
  const carousel = signal<CarouselRef | null>(null)
  const remountToken = signal(FIRST_EVENT_ID)

  let eventId = FIRST_EVENT_ID

  const update: UpdateState = (key, value) =>
    state.update((previous) => ({ ...previous, [key]: value }))

  const pushEvent = (name: PlaygroundEvent['name'], payload: object): void => {
    eventId += NEXT_TOKEN

    const event: PlaygroundEvent = {
      id: eventId,
      name,
      payload: JSON.stringify(payload)
    }

    events.update((previous) => [event, ...previous].slice(0, MAX_EVENTS))
  }

  const handleSelect = (next: SwipiState): void => {
    swipiState.set(next)
    pushEvent('onSelect', next)
  }

  const handleChange = (next: SlidePositions): void => {
    positions.set(next)
    pushEvent('onChange', next)
  }

  const handleReady = (next: CarouselRef): void => carousel.set(next)

  const remount = (): void => remountToken.update((token) => token + NEXT_TOKEN)

  const clearEvents = (): void => events.set([])

  const reset = (): void => {
    state.set({ ...DEFAULT_STATE })
    events.set([])
    remount()
  }

  return {
    state: state.asReadonly(),
    slides: computed(() => SLIDE_COLORS.slice(0, state().slidesCount)),
    events: events.asReadonly(),
    remountKey: computed(() => `${remountToken()}-${state().startIndex}`),
    carousel: carousel.asReadonly(),
    swipiState: swipiState.asReadonly(),
    positions: positions.asReadonly(),
    update,
    remount,
    reset,
    clearEvents,
    handleSelect,
    handleChange,
    handleReady
  }
}
