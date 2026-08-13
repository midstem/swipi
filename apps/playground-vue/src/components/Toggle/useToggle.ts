// @ts-nocheck
import { ChangeEvent } from 'react'
import { UseToggleProps, UseToggleReturn } from '@swipi/playground-core'

export const useToggle = ({ onChange }: UseToggleProps): UseToggleReturn => ({
  handleChange: (event: ChangeEvent<HTMLInputElement>): void =>
    onChange(event.target.checked)
})
