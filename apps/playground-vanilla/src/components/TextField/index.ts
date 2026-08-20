import type { TextFieldProps } from '@swipi/playground-core'
import { createId, element, setText, setValue } from '../../dom'
import type { Component } from '../../types'
import { STYLES } from '@swipi/playground-core'

export const createTextField = (
  props: TextFieldProps
): Component<TextFieldProps> => {
  let current = props

  const id = createId('pg-text')

  const input = element('input', {
    id,
    type: 'text',
    class: STYLES.input,
    placeholder: props.placeholder
  })

  input.addEventListener('change', () => current.onChange(input.value))

  const label = element(
    'label',
    { class: STYLES.label, 'data-pg': 'label', for: id },
    [props.label]
  )
  const hint = element('span', { class: STYLES.hint }, [props.hint ?? ''])

  const field = element('div', { class: STYLES.field, 'data-pg': 'field' }, [
    label,
    input
  ])

  if (props.hint) field.append(hint)

  const update = (next: TextFieldProps): void => {
    current = next

    setValue(input, next.value)
    setText(label, next.label)
    setText(hint, next.hint ?? '')
  }

  update(props)

  return { element: field, update }
}
