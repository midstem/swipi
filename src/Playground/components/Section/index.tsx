import type { JSX } from 'react'
import { SectionProps } from '../../types'

const Section = ({ title, children }: SectionProps): JSX.Element => (
  <details className="pg-section" open>
    <summary className="pg-section__title">{title}</summary>
    <div className="pg-section__body">{children}</div>
  </details>
)

export default Section
