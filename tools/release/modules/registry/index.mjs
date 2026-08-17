import { firstLine } from '../../helpers/index.mjs'
import { attempt } from '../shell/index.mjs'

import { MISSING_PACKAGE_CODE } from './constants.mjs'

export const readPublished = (name) => {
  const view = attempt('npm', ['view', name, 'versions', '--json'])

  if (view.ok) {
    const parsed = JSON.parse(view.output)

    return { versions: Array.isArray(parsed) ? parsed : [parsed] }
  }

  if (view.output.includes(MISSING_PACKAGE_CODE)) return { versions: [] }

  return { versions: null, error: firstLine(view.output) }
}

export const describePublished = ({ versions }, version) => {
  if (versions === null) return 'npm unreachable'
  if (!versions.length) return 'never published'
  if (versions.includes(version)) return 'this version is published'

  return `published: ${versions[versions.length - 1]}`
}

export const isPublished = ({ versions }, version) =>
  Boolean(versions?.includes(version))
