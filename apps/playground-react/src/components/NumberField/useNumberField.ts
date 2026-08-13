import { ChangeEvent, useId } from 'react'
import { UseNumberFieldProps } from '@swipi/playground-core'
import { UseFieldReturn } from '../../types'
import { clamp } from '@swipi/playground-core'

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
