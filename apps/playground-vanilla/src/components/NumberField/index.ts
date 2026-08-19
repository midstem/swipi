import {
  DEFAULT_MAX,
  DEFAULT_MIN,
  DEFAULT_STEP,
  clamp
} from '@swipi/playground-core'
import type { NumberFieldProps } from '@swipi/playground-core'
import { createId, element, setAttributes, setText, setValue } from '../../dom'
import type { Component } from '../../types'

const WITH_SLIDER = true

export const createNumberField = (
  props: NumberFieldProps
): Component<NumberFieldProps> => {
  let current = props

  const id = createId('pg-number')

  const range = element('input', { type: 'range' })
  const number = element('input', {
    id,
    type: 'number',
    class: 'pg-input pg-input--number'
  })

  const handleChange = (event: Event): void => {
    const { min = DEFAULT_MIN, max = DEFAULT_MAX } = current
    const raw = parseFloat((event.currentTarget as HTMLInputElement).value)

    current.onChange(clamp(Number.isNaN(raw) ? min : raw, min, max))
  }

  const inputs = [range, number]

  inputs.forEach((input) => {
    input.addEventListener('input', handleChange)
    input.addEventListener('change', handleChange)
  })

  const label = element('label', { class: 'pg-label', for: id }, [props.label])
  const hint = element('span', { class: 'pg-hint' }, [props.hint ?? ''])

  const row = element('div', { class: 'pg-field__row' })

  if (props.withSlider ?? WITH_SLIDER) row.append(range)

  row.append(number)

  const field = element('div', { class: 'pg-field' }, [label, row])

  if (props.hint) field.append(hint)

  const update = (next: NumberFieldProps): void => {
    current = next

    const {
      min = DEFAULT_MIN,
      max = DEFAULT_MAX,
      step = DEFAULT_STEP,
      disabled = false
    } = next

    inputs.forEach((input) => {
      setAttributes(input, { min, max, step })
      setValue(input, String(next.value))

      input.disabled = disabled
    })

    field.classList.toggle('pg-field--disabled', disabled)

    setText(label, next.label)
    setText(hint, next.hint ?? '')
  }

  update(props)

  return { element: field, update }
}
