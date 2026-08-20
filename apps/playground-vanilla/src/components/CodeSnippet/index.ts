import { STYLES, buildStyles } from '@swipi/playground-core'
import type { CodeSnippetProps } from '@swipi/playground-core'
import { element, setText } from '../../dom'
import type { Component } from '../../types'
import { buildMarkup, buildScript } from './helpers'

const COPIED_TIMEOUT = 1500

const VARIANTS = [
  { value: false, title: 'Accessible' },
  { value: true, title: 'Minimal' }
]

const FLAVOURS = [
  { value: true, title: 'Tailwind' },
  { value: false, title: 'CSS' }
]

const getHint = (minimal: boolean, tailwind: boolean): string => {
  const styles = tailwind ? 'Tailwind classes' : 'CSS'

  if (minimal) {
    return `The same carousel with everything optional taken off: no roles, no labels, no live region, no arrow keys — the layout as ${styles}. Shortest thing that works; reach for the accessible variant before you ship.`
  }

  return `Everything the current settings need: the options of createSwipi, the accessible markup around them, the rest as ${styles}. The roles, labels and the live region are yours to edit and translate once you paste this.`
}

export const createCodeSnippet = (
  props: CodeSnippetProps
): Component<CodeSnippetProps> => {
  let current = props
  let minimal = true
  let tailwind = true
  let copied = false

  const hint = element('p', { class: STYLES.hint })
  const markupCode = element('pre', { class: STYLES.code })
  const scriptCode = element('pre', { class: STYLES.code })
  const stylesCode = element('pre', { class: STYLES.code })
  const copy = element('button', { type: 'button', class: STYLES.button })

  const updates: (() => void)[] = []

  const render = (): void => {
    const styles = tailwind ? '' : buildStyles(current.state, minimal)

    setText(markupCode, buildMarkup(current.state, minimal, tailwind))
    setText(scriptCode, buildScript(current.state, minimal))
    setText(stylesCode, styles)
    setText(hint, getHint(minimal, tailwind))
    setText(copy, copied ? 'Copied' : 'Copy')

    stylesCode.hidden = !styles

    updates.forEach((apply) => apply())
  }

  const createSegmented = <Value>(
    title: string,
    options: { value: Value; title: string }[],
    isPressed: (value: Value) => boolean,
    onSelect: (value: Value) => void
  ): HTMLElement => {
    const segments = options.map((option) => {
      const segment = element('button', {
        type: 'button',
        class: STYLES.segment
      })

      segment.textContent = option.title
      segment.addEventListener('click', () => {
        onSelect(option.value)
        render()
      })

      return segment
    })

    updates.push(() =>
      segments.forEach((segment, index) => {
        const pressed = isPressed(options[index].value)

        segment.setAttribute('aria-pressed', String(pressed))
        segment.className = pressed ? STYLES.segmentActive : STYLES.segment
      })
    )

    return element('div', { class: STYLES.toolbarGroup }, [
      element('span', { class: STYLES.toolbarLabel }, [title]),
      element('div', { class: STYLES.segmented }, segments)
    ])
  }

  const getSource = (): string =>
    [
      buildMarkup(current.state, minimal, tailwind),
      buildScript(current.state, minimal),
      tailwind ? '' : `/* CSS */\n${buildStyles(current.state, minimal)}`
    ]
      .filter(Boolean)
      .join('\n\n')

  copy.addEventListener('click', () => {
    void navigator.clipboard.writeText(getSource())

    copied = true
    render()

    setTimeout(() => {
      copied = false
      render()
    }, COPIED_TIMEOUT)
  })

  const card = element('section', { class: STYLES.card }, [
    element('header', { class: STYLES.cardHeader }, [
      element('h2', { class: STYLES.cardTitle }, ['Generated code']),
      element('div', { class: STYLES.row }, [
        createSegmented(
          'Markup',
          VARIANTS,
          (value) => value === minimal,
          (value) => {
            minimal = value
          }
        ),
        createSegmented(
          'Styles',
          FLAVOURS,
          (value) => value === tailwind,
          (value) => {
            tailwind = value
          }
        ),
        element('span', { class: STYLES.toolbarDivider }),
        copy
      ])
    ]),
    hint,
    markupCode,
    scriptCode,
    stylesCode
  ])

  render()

  return {
    element: card,
    update: (next) => {
      current = next

      render()
    }
  }
}
