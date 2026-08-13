import type { JSX } from 'react'
import { SelectFieldProps } from '@swipi/playground-core'
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
    <div className="pg-field">
      <label className="pg-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="pg-input"
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && <span className="pg-hint">{hint}</span>}
    </div>
  )
}

export default SelectField
