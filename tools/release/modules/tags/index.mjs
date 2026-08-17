import { capture } from '../shell/index.mjs'

import { LEGACY_TAG_PACKAGE, LEGACY_TAG_PATTERN } from './constants.mjs'

const listTags = (pattern) =>
  capture('git', ['tag', '--list', pattern, '--sort=-v:refname'])
    .split('\n')
    .filter(Boolean)

export const readPreviousTag = (name) => {
  const tags = listTags(`${name}@*`)

  if (tags.length) return tags[0]

  if (name !== LEGACY_TAG_PACKAGE) return null

  return listTags(LEGACY_TAG_PATTERN)[0] ?? null
}
