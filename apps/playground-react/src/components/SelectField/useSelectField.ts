import { ChangeEvent, useId } from 'react'
import { UseSelectFieldProps } from '@swipi/playground-core'
import { UseFieldReturn } from '../../types'

export const useSelectField = <Value extends string>({
  onChange
}: UseSelectFieldProps<Value>): UseFieldReturn<HTMLSelectElement> => ({
  id: useId(),
  handleChange: (event: ChangeEvent<HTMLSelectElement>): void =>
    onChange(event.target.value as Value)
})
