// @ts-nocheck
import { ConfigNumberFieldOption, ConfigType } from '@swipi/playground-core'

export const CONFIG_NUMBER_FIELDS: ConfigNumberFieldOption[] = [
  { key: 'maxWidth', label: 'maxWidth' },
  { key: 'slidesNumber', label: 'slidesNumber' },
  { key: 'spaceBetween', label: 'spaceBetween' }
]

export const NEW_CONFIG_ITEM: ConfigType = {
  maxWidth: 640,
  slidesNumber: 1,
  spaceBetween: 10
}

export const EMPTY_FIELD_VALUE = 0
