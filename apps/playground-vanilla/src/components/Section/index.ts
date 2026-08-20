import type { SectionProps } from '@swipi/playground-core'
import { element } from '../../dom'
import type { SectionComponent } from '../../types'
import { STYLES } from '@swipi/playground-core'

const BADGE = {
  hook: 'engine option',
  playground: 'playground only'
} as const

export const createSection = ({
  title,
  origin,
  hint
}: SectionProps): SectionComponent => {
  const body = element('div', { class: STYLES.sectionBody })

  if (hint) body.append(element('p', { class: STYLES.hint }, [hint]))

  const section = element(
    'details',
    {
      class: STYLES.section,
      'data-pg': 'section',
      'data-origin': origin,
      open: true
    },
    [
      element('summary', { class: STYLES.sectionTitle }, [
        title,
        element('span', { class: STYLES.sectionBadge }, [BADGE[origin]])
      ]),
      body
    ]
  )

  return { element: section, body }
}
