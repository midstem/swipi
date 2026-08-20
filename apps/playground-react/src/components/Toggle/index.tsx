import type { JSX } from 'react'
import { STYLES, ToggleProps } from '@swipi/playground-core'
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
    <label className={STYLES.toggle} data-pg="toggle">
      <input
        type="checkbox"
        className={STYLES.checkbox}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className={STYLES.toggleText}>
        <span className={STYLES.label} data-pg="label">
          {label}
        </span>
        {hint && <span className={STYLES.hint}>{hint}</span>}
      </span>
    </label>
  )
}

export default Toggle
