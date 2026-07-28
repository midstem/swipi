import type { JSX } from 'react'
import { ColorFieldProps } from '../../types'
import { useColorField } from './useColorField'

const ColorField = ({
  label,
  hint,
  value,
  onChange
}: ColorFieldProps): JSX.Element => {
  const { id, handleChange } = useColorField({ onChange })

  return (
    <div className="pg-field">
      <label className="pg-label" htmlFor={id}>
        {label}
      </label>
      <div className="pg-field__row">
        <input
          id={id}
          type="color"
          className="pg-input pg-input--color"
          value={value}
          onChange={handleChange}
        />
        <input
          type="text"
          className="pg-input"
          aria-label={`${label} value`}
          value={value}
          onChange={handleChange}
        />
      </div>
      {hint && <span className="pg-hint">{hint}</span>}
    </div>
  )
}

export default ColorField
