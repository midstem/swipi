import type { JSX } from 'react'
import { useMemo, useState } from 'react'
import { PlaygroundState } from '../../types'
import { buildMarkup, buildStyles } from './helpers'

type CodeSnippetProps = {
  state: PlaygroundState
}

const COPIED_TIMEOUT = 1500

const CodeSnippet = ({ state }: CodeSnippetProps): JSX.Element => {
  const [copied, setCopied] = useState(false)

  const markup = useMemo(() => buildMarkup(state), [state])
  const styles = useMemo(() => buildStyles(state), [state])

  const copy = (): void => {
    void navigator.clipboard.writeText(`${markup}\n\n/* CSS */\n${styles}`)
    setCopied(true)
    setTimeout(() => setCopied(false), COPIED_TIMEOUT)
  }

  return (
    <section className="pg-card">
      <header className="pg-card__header">
        <h2 className="pg-card__title">Generated code</h2>
        <button type="button" className="pg-button" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </header>

      <p className="pg-hint">
        Everything the current settings need — the hook options above, the rest
        as CSS.
      </p>

      <pre className="pg-code">{markup}</pre>
      <pre className="pg-code">{styles}</pre>
    </section>
  )
}

export default CodeSnippet
