import { ref, reactive, computed, watch, shallowRef } from 'vue'
import { SlidePositions, SwipiState } from '@midstem/swipi-vue'
import { CarouselRef } from '@swipi/playground-core'
import { DEFAULT_STATE, MAX_EVENTS, SLIDE_COLORS } from '@swipi/playground-core'
import { loadState, saveState } from '@swipi/playground-core'
import {
  PlaygroundEvent,
  PlaygroundState,
  UpdateState
} from '@swipi/playground-core'
import { UsePlaygroundReturn } from './types'

export const usePlayground = (): UsePlaygroundReturn => {
  const state = reactive<PlaygroundState>(loadState())
  const swipiState = ref<SwipiState>()
  const positions = ref<SlidePositions>()
  const events = ref<PlaygroundEvent[]>([])
  const remountToken = ref<number>(0)

  const swipiRef = shallowRef<CarouselRef | null>(null)
  let eventId = 0

  watch(
    state,
    (newState) => {
      saveState(newState)
    },
    { deep: true }
  )

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

    events.value = [event, ...events.value].slice(0, MAX_EVENTS)
  }

  const handleSelect = (next: SwipiState): void => {
    swipiState.value = next
    pushEvent('onSelect', next)
  }

  const handleChange = (next: SlidePositions): void => {
    positions.value = next
    pushEvent('onChange', next)
  }

  const handleReady = (carousel: CarouselRef): void => {
    swipiRef.value = carousel
  }

  const remount = (): void => {
    remountToken.value += 1
  }

  const clearEvents = (): void => {
    events.value = []
  }

  const reset = (): void => {
    Object.assign(state, DEFAULT_STATE)
    events.value = []
    remount()
  }

  const slides = computed(() => SLIDE_COLORS.slice(0, state.slidesCount))

  const remountKey = computed(() => `${remountToken.value}-${state.startIndex}`)

  return {
    state,
    slides,
    events,
    swipiRef,
    swipiState,
    positions,
    remountKey,
    update,
    remount,
    reset,
    clearEvents,
    handleSelect,
    handleChange,
    handleReady
  }
}
