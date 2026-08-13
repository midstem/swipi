import type { JSX } from 'react'
import { SectionProps } from '../../types'

const BADGE = {
  hook: 'hook option',
  playground: 'playground only'
}

const Section = ({
  title,
  origin,
  hint,
  children
}: SectionProps): JSX.Element => (
  <details className={`pg-section pg-section--${origin}`} open>
    <summary className="pg-section__title">
      {title}
      <span className="pg-section__badge">{BADGE[origin]}</span>
    </summary>
    <div className="pg-section__body">
      {hint && <p className="pg-hint">{hint}</p>}
      {children}
    </div>
  </details>
)

export default Section
