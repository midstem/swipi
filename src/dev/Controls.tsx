import type { JSX } from 'react'
import { useId } from 'react'
import {
  ColorFieldProps,
  NumberFieldProps,
  SectionProps,
  SelectFieldProps,
  TextFieldProps,
  ToggleProps
} from './types'

export const Section = ({ title, children }: SectionProps): JSX.Element => (
  <details className="pg-section" open>
    <summary className="pg-section__title">{title}</summary>
    <div className="pg-section__body">{children}</div>
  </details>
)

export const Toggle = ({
  label,
  hint,
  checked,
  onChange
}: ToggleProps): JSX.Element => (
  <label className="pg-toggle">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span className="pg-toggle__text">
      <span className="pg-label">{label}</span>
      {hint && <span className="pg-hint">{hint}</span>}
    </span>
  </label>
)

export const NumberField = ({
  label,
  hint,
  value,
  min = 0,
  max = 100,
  step = 1,
  withSlider = true,
  disabled = false,
  onChange
}: NumberFieldProps): JSX.Element => {
  const id = useId()

  const handleChange = (next: string): void => {
    const parsed = Number(next)

    if (Number.isNaN(parsed)) return

    onChange(Math.min(Math.max(parsed, min), max))
  }

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
            onChange={(event) => handleChange(event.target.value)}
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
          onChange={(event) => handleChange(event.target.value)}
        />
      </div>
      {hint && <span className="pg-hint">{hint}</span>}
    </div>
  )
}

export const TextField = ({
  label,
  hint,
  value,
  placeholder,
  onChange
}: TextFieldProps): JSX.Element => {
  const id = useId()

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
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && <span className="pg-hint">{hint}</span>}
    </div>
  )
}

export const ColorField = ({
  label,
  hint,
  value,
  onChange
}: ColorFieldProps): JSX.Element => {
  const id = useId()

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
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          type="text"
          className="pg-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      {hint && <span className="pg-hint">{hint}</span>}
    </div>
  )
}

export const SelectField = <Value extends string>({
  label,
  hint,
  value,
  options,
  onChange
}: SelectFieldProps<Value>): JSX.Element => {
  const id = useId()

  return (
    <div className="pg-field">
      <label className="pg-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="pg-input"
        value={value}
        onChange={(event) => onChange(event.target.value as Value)}
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
