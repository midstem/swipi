import type { ToggleProps } from '@swipi/playground-core'
import { element, setText } from '../../dom'
import type { Component } from '../../types'
import { STYLES } from '@swipi/playground-core'

export const createToggle = (props: ToggleProps): Component<ToggleProps> => {
  let current = props

  const input = element('input', {
    type: 'checkbox',
    class: STYLES.checkbox
  })
  const label = element(
    'span',
    {
      class: STYLES.label,
      'data-pg': 'label'
    },
    [props.label]
  )
  const hint = element('span', { class: STYLES.hint }, [props.hint ?? ''])

  const text = element('span', { class: STYLES.toggleText }, [label])

  if (props.hint) text.append(hint)

  input.addEventListener('change', () => current.onChange(input.checked))

  const toggle = element(
    'label',
    { class: STYLES.toggle, 'data-pg': 'toggle' },
    [input, text]
  )

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
