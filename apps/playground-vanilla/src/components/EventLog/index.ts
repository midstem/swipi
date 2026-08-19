import type { EventLogProps } from '@swipi/playground-core'
import { clear, element } from '../../dom'
import type { Component } from '../../types'

export const createEventLog = (
  props: EventLogProps
): Component<EventLogProps> => {
  let current = props

  const clearButton = element('button', {
    type: 'button',
    class: 'pg-button pg-button--ghost'
  })

  clearButton.textContent = 'Clear'
  clearButton.addEventListener('click', () => current.onClear())

  const list = element('ul', { class: 'pg-events' })

  const card = element('div', { class: 'pg-card' }, [
    element('div', { class: 'pg-card__header' }, [
      element('h2', { class: 'pg-card__title' }, ['Events']),
      clearButton
    ]),
    list
  ])

  const update = (next: EventLogProps): void => {
    current = next

    clear(list)

    if (!next.events.length) {
      list.append(element('li', { class: 'pg-hint' }, ['No events yet']))

      return
    }

    list.append(
      ...next.events.map((event) =>
        element('li', {}, [
          element('span', { class: 'pg-events__name' }, [event.name]),
          element('code', {}, [event.payload])
        ])
      )
    )
  }

  update(props)

  return { element: card, update }
}
