import type { JSX } from 'react'
import { useMemo, useState } from 'react'
import { STYLES, PlaygroundState } from '@swipi/playground-core'
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
    <section className={STYLES.card}>
      <header className={STYLES.cardHeader}>
        <h2 className={STYLES.cardTitle}>Generated code</h2>
        <div className={STYLES.row}>
          <div className={STYLES.toolbarGroup}>
            <span className={STYLES.toolbarLabel}>Markup</span>
            <div className={STYLES.segmented}>
              {VARIANTS.map((variant) => (
                <button
                  key={variant.title}
                  type="button"
                  className={
                    variant.minimal === minimal
                      ? STYLES.segmentActive
                      : STYLES.segment
                  }
                  aria-pressed={variant.minimal === minimal}
                  onClick={() => setMinimal(variant.minimal)}
                >
                  {variant.title}
                </button>
              ))}
            </div>
          </div>

          <div className={STYLES.toolbarGroup}>
            <span className={STYLES.toolbarLabel}>Styles</span>
            <div className={STYLES.segmented}>
              {FLAVOURS.map((flavour) => (
                <button
                  key={flavour.title}
                  type="button"
                  className={
                    flavour.tailwind === tailwind
                      ? STYLES.segmentActive
                      : STYLES.segment
                  }
                  aria-pressed={flavour.tailwind === tailwind}
                  onClick={() => setTailwind(flavour.tailwind)}
                >
                  {flavour.title}
                </button>
              ))}
            </div>
          </div>

          <span className={STYLES.toolbarDivider} />

          <button type="button" className={STYLES.button} onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </header>

      <p className={STYLES.hint}>
        {minimal
          ? `The same carousel with everything optional taken off: no roles, no labels, no live region, no arrow keys — the layout as ${
              tailwind ? 'Tailwind classes' : 'CSS'
            }. Shortest thing that works; reach for the accessible variant before you ship.`
          : `Everything the current settings need: the hook options, the accessible markup around them, the rest as ${
              tailwind ? 'Tailwind classes' : 'CSS'
            }. The roles, labels and the live region are yours to edit and translate once you paste this.`}
      </p>

      <pre className={STYLES.code}>{markup}</pre>
      {styles && <pre className={STYLES.code}>{styles}</pre>}
    </section>
  )
}

export default CodeSnippet
