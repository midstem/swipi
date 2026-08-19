import type { SelectFieldProps } from '@swipi/playground-core'
import { createId, element, setText, setValue } from '../../dom'
import type { Component } from '../../types'

export const createSelectField = <Value extends string>(
  props: SelectFieldProps<Value>
): Component<SelectFieldProps<Value>> => {
  let current = props

  const id = createId('pg-select')

  const select = element(
    'select',
    { id, class: 'pg-input' },
    props.options.map((option) =>
      element('option', { value: option.value }, [option.label])
    )
  )

  select.addEventListener('change', () =>
    current.onChange(select.value as Value)
  )

  const label = element('label', { class: 'pg-label', for: id }, [props.label])
  const hint = element('span', { class: 'pg-hint' }, [props.hint ?? ''])

  const field = element('div', { class: 'pg-field' }, [label, select])

  if (props.hint) field.append(hint)

  const update = (next: SelectFieldProps<Value>): void => {
    current = next

    setValue(select, next.value)
    setText(label, next.label)
    setText(hint, next.hint ?? '')
  }

  update(props)

  return { element: field, update }
}
