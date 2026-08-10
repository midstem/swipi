import { ChangeEvent, useId } from 'react'
import { UseFieldReturn, UseNumberFieldProps } from '../../types'
import { clamp } from './helpers'

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
