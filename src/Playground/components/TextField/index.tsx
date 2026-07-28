import type { JSX } from 'react'
import { TextFieldProps } from '../../types'
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
    <div className="pg-field">
      <label className="pg-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        className="pg-input"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
      />
      {hint && <span className="pg-hint">{hint}</span>}
    </div>
  )
}

export default TextField
