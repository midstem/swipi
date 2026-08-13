import { ChangeEvent, useId } from 'react'
import { UseFieldReturn, UseTextFieldProps } from '../../types'

export const useTextField = ({
  onChange
}: UseTextFieldProps): UseFieldReturn<HTMLInputElement> => ({
  id: useId(),
  handleChange: (event: ChangeEvent<HTMLInputElement>): void =>
    onChange(event.target.value)
})
