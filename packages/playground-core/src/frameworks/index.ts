import { DOCS_URL, PLAYGROUND_FRAMEWORKS } from '../constants'
import { FrameworkLink, PlaygroundFramework } from '../types'

export const getFrameworkLinks = (
  current: PlaygroundFramework
): FrameworkLink[] =>
  PLAYGROUND_FRAMEWORKS.map(({ id, title }) => ({
    id,
    title,
    href: `../${id}/`,
    isCurrent: id === current
  }))

export const getDocsHref = (framework: PlaygroundFramework): string =>
  `${DOCS_URL}?framework=${framework}`
