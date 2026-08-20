import type { JSX } from 'react'
import { useMemo } from 'react'
import { CODE_TOKEN_STYLES, STYLES, highlight } from '@swipi/playground-core'
import type { CodeBlockProps } from '@swipi/playground-core'

const CodeBlock = ({ code, language }: CodeBlockProps): JSX.Element => {
  const tokens = useMemo(() => highlight(code, language), [code, language])

  return (
    <pre className={STYLES.code}>
      {tokens.map((token, index) => (
        <span key={index} className={CODE_TOKEN_STYLES[token.kind]}>
          {token.text}
        </span>
      ))}
    </pre>
  )
}

export default CodeBlock
