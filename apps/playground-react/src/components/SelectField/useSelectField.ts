import { ChangeEvent, useId } from 'react'
import { UseFieldReturn, UseSelectFieldProps } from '@swipi/playground-core'

export const useSelectField = <Value extends string>({
  onChange
}: UseSelectFieldProps<Value>): UseFieldReturn<HTMLSelectElement> => ({
  id: useId(),
  handleChange: (event: ChangeEvent<HTMLSelectElement>): void =>
    onChange(event.target.value as Value)
})
