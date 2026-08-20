import {
  STYLES,
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
        class: STYLES.configInput,
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

      const cell = element('label', { class: STYLES.configCell }, [
        element('span', { class: STYLES.hint }, [label]),
        input
      ])

      return { key, cell, input }
    })

    const bias = element('input', {
      type: 'checkbox',
      class: STYLES.checkbox
    })

    bias.addEventListener('change', () =>
      current.onChange(
        updateConfigItem(current.config, index, { biasRight: bias.checked })
      )
    )

    const remove = element('button', {
      type: 'button',
      class: STYLES.ghostButton
    })

    remove.textContent = 'Remove'
    remove.addEventListener('click', () =>
      current.onChange(removeConfigItem(current.config, index))
    )

    const row = element('div', { class: STYLES.configItem }, [
      element(
        'div',
        { class: STYLES.configGrid },
        inputs.map(({ cell }) => cell)
      ),
      element('div', { class: STYLES.configFooter }, [
        element('label', { class: STYLES.toggleInline }, [
          bias,
          element('span', { class: STYLES.label, 'data-pg': 'label' }, [
            'biasRight'
          ])
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

  const add = element('button', { type: 'button', class: STYLES.button })

  add.textContent = '+ Add breakpoint'
  add.addEventListener('click', () =>
    current.onChange(addConfigItem(current.config))
  )

  const editor = element('div', { class: STYLES.config, 'data-pg': 'config' }, [
    list,
    add,
    element('p', { class: STYLES.hint }, [HINT])
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
    editor.dataset.disabled = String(next.disabled)
  }

  update(props)

  return { element: editor, update }
}
