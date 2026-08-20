import type { JSX } from 'react'
import { STYLES, SelectFieldProps } from '@swipi/playground-core'
import { useSelectField } from './useSelectField'

const SelectField = <Value extends string>({
  label,
  hint,
  value,
  options,
  onChange
}: SelectFieldProps<Value>): JSX.Element => {
  const { id, handleChange } = useSelectField({ onChange })

  return (
    <div className={STYLES.field} data-pg="field">
      <label className={STYLES.label} data-pg="label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={STYLES.select}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && <span className={STYLES.hint}>{hint}</span>}
    </div>
  )
}

export default SelectField
