import type { JSX } from 'react'
import { useMemo, useState } from 'react'
import { PlaygroundState } from '@swipi/playground-core'
import { buildStyles } from '@swipi/playground-core'
import { buildMarkup } from './helpers'

type CodeSnippetProps = {
  state: PlaygroundState
}

const COPIED_TIMEOUT = 1500

const VARIANTS = [
  { minimal: false, title: 'Accessible' },
  { minimal: true, title: 'Minimal' }
]

const FLAVOURS = [
  { tailwind: true, title: 'Tailwind' },
  { tailwind: false, title: 'CSS' }
]

const CodeSnippet = ({ state }: CodeSnippetProps): JSX.Element => {
  const [copied, setCopied] = useState(false)
  const [minimal, setMinimal] = useState(true)
  const [tailwind, setTailwind] = useState(true)

  const markup = useMemo(
    () => buildMarkup(state, minimal, tailwind),
    [state, minimal, tailwind]
  )

  const styles = useMemo(
    () => (tailwind ? '' : buildStyles(state, minimal)),
    [state, minimal, tailwind]
  )

  const copy = (): void => {
    const source = styles ? `${markup}\n\n/* CSS */\n${styles}` : markup

    void navigator.clipboard.writeText(source)
    setCopied(true)
    setTimeout(() => setCopied(false), COPIED_TIMEOUT)
  }

  return (
    <section className="pg-card">
      <header className="pg-card__header">
        <h2 className="pg-card__title">Generated code</h2>
        <div className="pg-row">
          <div className="pg-toolbar-group">
            <span className="pg-toolbar-label">Markup</span>
            <div className="pg-segmented">
              {VARIANTS.map((variant) => (
                <button
                  key={variant.title}
                  type="button"
                  className="pg-segment"
                  aria-pressed={variant.minimal === minimal}
                  onClick={() => setMinimal(variant.minimal)}
                >
                  {variant.title}
                </button>
              ))}
            </div>
          </div>

          <div className="pg-toolbar-group">
            <span className="pg-toolbar-label">Styles</span>
            <div className="pg-segmented">
              {FLAVOURS.map((flavour) => (
                <button
                  key={flavour.title}
                  type="button"
                  className="pg-segment"
                  aria-pressed={flavour.tailwind === tailwind}
                  onClick={() => setTailwind(flavour.tailwind)}
                >
                  {flavour.title}
                </button>
              ))}
            </div>
          </div>

          <span className="pg-toolbar-divider" />

          <button type="button" className="pg-button" onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </header>

      <p className="pg-hint">
        {minimal
          ? `The same carousel with everything optional taken off: no roles, no labels, no live region, no arrow keys — the layout as ${
              tailwind ? 'Tailwind classes' : 'CSS'
            }. Shortest thing that works; reach for the accessible variant before you ship.`
          : `Everything the current settings need: the hook options, the accessible markup around them, the rest as ${
              tailwind ? 'Tailwind classes' : 'CSS'
            }. The roles, labels and the live region are yours to edit and translate once you paste this.`}
      </p>

      <pre className="pg-code">{markup}</pre>
      {styles && <pre className="pg-code">{styles}</pre>}
    </section>
  )
}

export default CodeSnippet
