import type { SectionProps } from '@swipi/playground-core'
import { element } from '../../dom'
import type { SectionComponent } from '../../types'

const BADGE = {
  hook: 'engine option',
  playground: 'playground only'
} as const

export const createSection = ({
  title,
  origin,
  hint
}: SectionProps): SectionComponent => {
  const body = element('div', { class: 'pg-section__body' })

  if (hint) body.append(element('p', { class: 'pg-hint' }, [hint]))

  const section = element(
    'details',
    { class: `pg-section pg-section--${origin}`, open: true },
    [
      element('summary', { class: 'pg-section__title' }, [
        title,
        element('span', { class: 'pg-section__badge' }, [BADGE[origin]])
      ]),
      body
    ]
  )

  return { element: section, body }
}
