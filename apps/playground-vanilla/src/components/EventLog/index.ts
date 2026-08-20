import type { EventLogProps } from '@swipi/playground-core'
import { clear, element } from '../../dom'
import type { Component } from '../../types'
import { STYLES } from '@swipi/playground-core'

export const createEventLog = (
  props: EventLogProps
): Component<EventLogProps> => {
  let current = props

  const clearButton = element('button', {
    type: 'button',
    class: STYLES.ghostButton
  })

  clearButton.textContent = 'Clear'
  clearButton.addEventListener('click', () => current.onClear())

  const list = element('ul', { class: STYLES.events })

  const card = element('div', { class: STYLES.card }, [
    element('div', { class: STYLES.cardHeader }, [
      element('h2', { class: STYLES.cardTitle }, ['Events']),
      clearButton
    ]),
    list
  ])

  const update = (next: EventLogProps): void => {
    current = next

    clear(list)

    if (!next.events.length) {
      list.append(element('li', { class: STYLES.hint }, ['No events yet']))

      return
    }

    list.append(
      ...next.events.map((event) =>
        element('li', { class: STYLES.event }, [
          element('span', { class: STYLES.eventName }, [event.name]),
          element('code', {}, [event.payload])
        ])
      )
    )
  }

  update(props)

  return { element: card, update }
}
