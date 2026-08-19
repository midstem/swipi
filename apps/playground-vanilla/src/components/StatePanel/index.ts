import { JSON_INDENT } from '@swipi/playground-core'
import type { StatePanelProps } from '@swipi/playground-core'
import { element, setText } from '../../dom'
import type { Component } from '../../types'

const createBlock = (title: string): [HTMLElement, HTMLElement] => {
  const code = element('pre', { class: 'pg-code' })

  return [
    element('div', {}, [
      element('h2', { class: 'pg-card__title' }, [title]),
      code
    ]),
    code
  ]
}

export const createStatePanel = (
  props: StatePanelProps
): Component<StatePanelProps> => {
  const [selectBlock, selectCode] = createBlock('onSelect state')
  const [changeBlock, changeCode] = createBlock('onChange positions')

  const card = element('div', { class: 'pg-card pg-card--split' }, [
    selectBlock,
    changeBlock
  ])

  const update = (next: StatePanelProps): void => {
    setText(selectCode, JSON.stringify(next.swipiState, null, JSON_INDENT))
    setText(changeCode, JSON.stringify(next.positions, null, JSON_INDENT))
  }

  update(props)

  return { element: card, update }
}
