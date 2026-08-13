import type { JSX } from 'react'
import { ToggleProps } from '../../types'
import { useToggle } from './useToggle'

const Toggle = ({
  label,
  hint,
  checked,
  disabled = false,
  onChange
}: ToggleProps): JSX.Element => {
  const { handleChange } = useToggle({ onChange })

  return (
    <label className="pg-toggle">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className="pg-toggle__text">
        <span className="pg-label">{label}</span>
        {hint && <span className="pg-hint">{hint}</span>}
      </span>
    </label>
  )
}

export default Toggle
