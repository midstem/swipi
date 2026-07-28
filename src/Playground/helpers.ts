import { DEFAULT_STATE, STORAGE_KEY } from './constants'
import { PlaygroundState, PlaygroundStateKey } from './types'

const isSameShape = (key: PlaygroundStateKey, value: unknown): boolean => {
  if (key === 'config') return Array.isArray(value)

  return typeof value === typeof DEFAULT_STATE[key]
}

export const loadState = (): PlaygroundState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) return DEFAULT_STATE

    const parsed = JSON.parse(raw) as Record<string, unknown>
    const state = { ...DEFAULT_STATE }

    Object.keys(DEFAULT_STATE).forEach((key) => {
      const stateKey = key as PlaygroundStateKey
      const value = parsed[key]

      if (value === undefined || !isSameShape(stateKey, value)) return

      Object.assign(state, { [stateKey]: value })
    })

    return state
  } catch {
    return DEFAULT_STATE
  }
}

export const saveState = (state: PlaygroundState): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* storage is not available — the playground still works */
  }
}
