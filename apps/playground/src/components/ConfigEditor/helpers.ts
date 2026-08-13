import { ConfigType } from '../../types'
import { NEW_CONFIG_ITEM } from './constants'

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
