import type { ToggleProps } from '@swipi/playground-core'
import { element, setText } from '../../dom'
import type { Component } from '../../types'

export const createToggle = (props: ToggleProps): Component<ToggleProps> => {
  let current = props

  const input = element('input', { type: 'checkbox' })
  const label = element('span', { class: 'pg-label' }, [props.label])
  const hint = element('span', { class: 'pg-hint' }, [props.hint ?? ''])

  const text = element('span', { class: 'pg-toggle__text' }, [label])

  if (props.hint) text.append(hint)

  input.addEventListener('change', () => current.onChange(input.checked))

  const toggle = element('label', { class: 'pg-toggle' }, [input, text])

  const update = (next: ToggleProps): void => {
    current = next

    input.checked = next.checked
    input.disabled = Boolean(next.disabled)

    setText(label, next.label)
    setText(hint, next.hint ?? '')
  }

  update(props)

  return { element: toggle, update }
}
