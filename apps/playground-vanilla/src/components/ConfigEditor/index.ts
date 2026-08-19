import {
  CONFIG_NUMBER_FIELDS,
  EMPTY_FIELD_VALUE,
  addConfigItem,
  removeConfigItem,
  updateConfigItem
} from '@swipi/playground-core'
import type { ConfigEditorProps, ConfigType } from '@swipi/playground-core'
import { clear, element, setValue } from '../../dom'
import type { Component } from '../../types'

type ConfigItem = {
  element: HTMLElement
  update: (item: ConfigType, disabled: boolean) => void
}

const HINT =
  'Breakpoints are matched against window.innerWidth: every item with maxWidth >= window width matches and the last matching one wins — keep them ordered from the widest to the narrowest.'

export const createConfigEditor = (
  props: ConfigEditorProps
): Component<ConfigEditorProps> => {
  let current = props
  let items: ConfigItem[] = []

  const createItem = (index: number): ConfigItem => {
    const inputs = CONFIG_NUMBER_FIELDS.map(({ key, label }) => {
      const input = element('input', {
        type: 'number',
        class: 'pg-input pg-input--number',
        min: EMPTY_FIELD_VALUE
      })

      const handleChange = (): void => {
        const raw = parseFloat(input.value)

        current.onChange(
          updateConfigItem(current.config, index, {
            [key]: Number.isNaN(raw) ? EMPTY_FIELD_VALUE : raw
          })
        )
      }

      input.addEventListener('input', handleChange)
      input.addEventListener('change', handleChange)

      const cell = element('label', { class: 'pg-config__cell' }, [
        element('span', { class: 'pg-hint' }, [label]),
        input
      ])

      return { key, cell, input }
    })

    const bias = element('input', { type: 'checkbox' })

    bias.addEventListener('change', () =>
      current.onChange(
        updateConfigItem(current.config, index, { biasRight: bias.checked })
      )
    )

    const remove = element('button', {
      type: 'button',
      class: 'pg-button pg-button--ghost'
    })

    remove.textContent = 'Remove'
    remove.addEventListener('click', () =>
      current.onChange(removeConfigItem(current.config, index))
    )

    const row = element('div', { class: 'pg-config__item' }, [
      element(
        'div',
        { class: 'pg-config__grid' },
        inputs.map(({ cell }) => cell)
      ),
      element('div', { class: 'pg-config__footer' }, [
        element('label', { class: 'pg-toggle pg-toggle--inline' }, [
          bias,
          element('span', { class: 'pg-label' }, ['biasRight'])
        ]),
        remove
      ])
    ])

    return {
      element: row,
      update: (item, disabled) => {
        inputs.forEach(({ key, input }) => {
          setValue(input, String(item[key] ?? EMPTY_FIELD_VALUE))

          input.disabled = disabled
        })

        bias.checked = Boolean(item.biasRight)
        bias.disabled = disabled
        remove.disabled = disabled
      }
    }
  }

  const list = element('div')

  const add = element('button', { type: 'button', class: 'pg-button' })

  add.textContent = '+ Add breakpoint'
  add.addEventListener('click', () =>
    current.onChange(addConfigItem(current.config))
  )

  const editor = element('div', { class: 'pg-config' }, [
    list,
    add,
    element('p', { class: 'pg-hint' }, [HINT])
  ])

  const update = (next: ConfigEditorProps): void => {
    current = next

    if (items.length !== next.config.length) {
      clear(list)

      items = next.config.map((_, index) => createItem(index))

      list.append(...items.map((item) => item.element))
    }

    items.forEach((item, index) =>
      item.update(next.config[index], next.disabled)
    )

    add.disabled = next.disabled
    editor.classList.toggle('pg-field--disabled', next.disabled)
  }

  update(props)

  return { element: editor, update }
}
