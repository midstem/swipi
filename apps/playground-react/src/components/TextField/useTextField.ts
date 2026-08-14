import { ChangeEvent, useId } from 'react'
import { UseTextFieldProps } from '@swipi/playground-core'
import { UseFieldReturn } from '../../types'

export const useTextField = ({
  onChange
}: UseTextFieldProps): UseFieldReturn<HTMLInputElement> => ({
  id: useId(),
  handleChange: (event: ChangeEvent<HTMLInputElement>): void =>
    onChange(event.target.value)
})
