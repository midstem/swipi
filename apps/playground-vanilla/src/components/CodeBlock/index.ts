import { CODE_TOKEN_STYLES, STYLES, highlight } from '@swipi/playground-core'
import type { CodeBlockProps } from '@swipi/playground-core'
import { element } from '../../dom'
import type { Component } from '../../types'

export const createCodeBlock = (
  props: CodeBlockProps
): Component<CodeBlockProps> => {
  const block = element('pre', { class: STYLES.code })

  const render = ({ code, language }: CodeBlockProps): void =>
    block.replaceChildren(
      ...highlight(code, language).map(({ text, kind }) =>
        element('span', { class: CODE_TOKEN_STYLES[kind] }, [text])
      )
    )

  render(props)

  return {
    element: block,
    update: render
  }
}
