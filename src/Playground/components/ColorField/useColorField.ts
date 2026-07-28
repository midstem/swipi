import { ChangeEvent, useId } from 'react'
import { UseColorFieldProps, UseFieldReturn } from '../../types'

export const useColorField = ({
  onChange
}: UseColorFieldProps): UseFieldReturn<HTMLInputElement> => ({
  id: useId(),
  handleChange: (event: ChangeEvent<HTMLInputElement>): void =>
    onChange(event.target.value)
})
