import type { JSX } from 'react'
import { CodeSnippetProps } from '../../types'
import { useCodeSnippet } from './useCodeSnippet'

const CodeSnippet = ({ state }: CodeSnippetProps): JSX.Element => {
  const { code, isCopied, copy } = useCodeSnippet({ state })

  return (
    <div className="pg-card">
      <div className="pg-card__header">
        <h2 className="pg-card__title">Generated code</h2>
        <button type="button" className="pg-button" onClick={copy}>
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="pg-code">{code}</pre>
    </div>
  )
}

export default CodeSnippet
