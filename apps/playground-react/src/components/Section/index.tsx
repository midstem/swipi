import type { JSX } from 'react'
import { SectionProps } from '../../types'
import { STYLES } from '@swipi/playground-core'

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
  <details
    className={STYLES.section}
    data-pg="section"
    data-origin={origin}
    open
  >
    <summary className={STYLES.sectionTitle}>
      {title}
      <span className={STYLES.sectionBadge}>{BADGE[origin]}</span>
    </summary>
    <div className={STYLES.sectionBody}>
      {hint && <p className={STYLES.hint}>{hint}</p>}
      {children}
    </div>
  </details>
)

export default Section
