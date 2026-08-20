import type { JSX } from 'react'
import { STYLES, NumberFieldProps } from '@swipi/playground-core'
import { DEFAULT_MAX, DEFAULT_MIN, DEFAULT_STEP } from '@swipi/playground-core'
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
    <div className={STYLES.field} data-pg="field" data-disabled={disabled}>
      <label className={STYLES.label} data-pg="label" htmlFor={id}>
        {label}
      </label>
      <div className={STYLES.fieldRow}>
        {withSlider && (
          <input
            type="range"
            className={STYLES.range}
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
          className={STYLES.numberInput}
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={handleChange}
        />
      </div>
      {hint && <span className={STYLES.hint}>{hint}</span>}
    </div>
  )
}

export default NumberField
