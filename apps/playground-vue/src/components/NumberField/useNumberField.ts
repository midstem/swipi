// @ts-nocheck
import { ChangeEvent, useId } from 'react'
import { UseFieldReturn, UseNumberFieldProps } from '@swipi/playground-core'
const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

export const useNumberField = ({
  min,
  max,
  onChange
}: UseNumberFieldProps): UseFieldReturn<HTMLInputElement> => {
  const id = useId()

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.target.value)

    if (Number.isNaN(value)) return

    onChange(clamp(value, min, max))
  }

  return { id, handleChange }
}
