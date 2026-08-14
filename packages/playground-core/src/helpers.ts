import {
  AXIS_OPTIONS,
  DEFAULT_STATE,
  FIRST_INDEX,
  LAST_INDEX_OFFSET,
  NEW_CONFIG_ITEM,
  SLIDES_ANIMATION_OPTIONS,
  STORAGE_KEY
} from './constants'
import {
  ConfigType,
  PlaygroundState,
  PlaygroundStateKey,
  SlidesAnimation,
  ValueOf
} from './types'

export const isFadeInAnimation = (
  animation: ValueOf<SlidesAnimation>
): boolean => animation === SlidesAnimation.FADE_IN

const isConfigItem = (value: unknown): value is ConfigType =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as ConfigType).maxWidth === 'number' &&
  typeof (value as ConfigType).slidesNumber === 'number'

const isSameShape = (key: PlaygroundStateKey, value: unknown): boolean => {
  if (key === 'config') return Array.isArray(value) && value.every(isConfigItem)

  if (key === 'slidesAnimation') {
    return SLIDES_ANIMATION_OPTIONS.some((option) => option.value === value)
  }

  if (key === 'axis') {
    return AXIS_OPTIONS.some((option) => option.value === value)
  }

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

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export const getLastIndex = (slidesCount: number): number =>
  Math.max(slidesCount - LAST_INDEX_OFFSET, FIRST_INDEX)

export const clampIndex = (index: number, slidesCount: number): number => {
  if (Number.isNaN(index)) return FIRST_INDEX

  return Math.min(Math.max(index, FIRST_INDEX), getLastIndex(slidesCount))
}

export const updateConfigItem = (
  config: ConfigType[],
  index: number,
  patch: Partial<ConfigType>
): ConfigType[] =>
  config.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item
  )

export const removeConfigItem = (
  config: ConfigType[],
  index: number
): ConfigType[] => config.filter((_, itemIndex) => itemIndex !== index)

export const addConfigItem = (config: ConfigType[]): ConfigType[] => [
  ...config,
  { ...NEW_CONFIG_ITEM }
]
