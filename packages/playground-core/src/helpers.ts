import { FIRST_INDEX, LAST_INDEX_OFFSET, NEW_CONFIG_ITEM } from './constants'
import { ConfigType, SlidesAnimation, ValueOf } from './types'

export const isFadeInAnimation = (
  animation: ValueOf<SlidesAnimation>
): boolean => animation === SlidesAnimation.FADE_IN

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
