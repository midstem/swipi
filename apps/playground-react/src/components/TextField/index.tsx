import type { JSX } from 'react'
import { STYLES, TextFieldProps } from '@swipi/playground-core'
import { useTextField } from './useTextField'

const TextField = ({
  label,
  hint,
  value,
  placeholder,
  onChange
}: TextFieldProps): JSX.Element => {
  const { id, handleChange } = useTextField({ onChange })

  return (
    <div className={STYLES.field} data-pg="field">
      <label className={STYLES.label} data-pg="label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        className={STYLES.input}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
      />
      {hint && <span className={STYLES.hint}>{hint}</span>}
    </div>
  )
}

export default TextField
