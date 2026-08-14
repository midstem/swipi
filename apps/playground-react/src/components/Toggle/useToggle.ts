import { ChangeEvent } from 'react'
import { UseToggleProps } from '@swipi/playground-core'
import { UseToggleReturn } from '../../types'

export const useToggle = ({ onChange }: UseToggleProps): UseToggleReturn => ({
  handleChange: (event: ChangeEvent<HTMLInputElement>): void =>
    onChange(event.target.checked)
})
