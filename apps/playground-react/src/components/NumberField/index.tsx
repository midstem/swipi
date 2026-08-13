import type { JSX } from 'react'
import { NumberFieldProps } from '@swipi/playground-core'
import { DEFAULT_MAX, DEFAULT_MIN, DEFAULT_STEP } from './constants'
import { useNumberField } from './useNumberField'

const NumberField = ({
  label,
  hint,
  value,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  step = DEFAULT_STEP,
  withSlider = true,
  disabled = false,
  onChange
}: NumberFieldProps): JSX.Element => {
  const { id, handleChange } = useNumberField({ min, max, onChange })

  return (
    <div className={`pg-field${disabled ? ' pg-field--disabled' : ''}`}>
      <label className="pg-label" htmlFor={id}>
        {label}
      </label>
      <div className="pg-field__row">
        {withSlider && (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={handleChange}
          />
        )}
        <input
          id={id}
          type="number"
          className="pg-input pg-input--number"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={handleChange}
        />
      </div>
      {hint && <span className="pg-hint">{hint}</span>}
    </div>
  )
}

export default NumberField
