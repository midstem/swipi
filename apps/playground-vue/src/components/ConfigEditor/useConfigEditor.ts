// @ts-nocheck
import { ChangeEvent } from 'react'
import {
  ConfigNumberField,
  UseConfigEditorProps,
  UseConfigEditorReturn
} from '@swipi/playground-core'
import { addConfigItem, removeConfigItem, updateConfigItem } from './helpers'

export const useConfigEditor = ({
  config,
  onChange
}: UseConfigEditorProps): UseConfigEditorReturn => {
  const addItem = (): void => onChange(addConfigItem(config))

  const removeItem = (index: number) => (): void =>
    onChange(removeConfigItem(config, index))

  const changeNumber =
    (index: number, field: ConfigNumberField) =>
    (event: ChangeEvent<HTMLInputElement>): void =>
      onChange(
        updateConfigItem(config, index, { [field]: Number(event.target.value) })
      )

  const changeBiasRight =
    (index: number) =>
    (event: ChangeEvent<HTMLInputElement>): void =>
      onChange(
        updateConfigItem(config, index, { biasRight: event.target.checked })
      )

  return { addItem, removeItem, changeNumber, changeBiasRight }
}
