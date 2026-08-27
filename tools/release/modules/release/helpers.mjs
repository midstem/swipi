import { MAIN_BRANCH } from '../../constants.mjs'
import { capture } from '../shell/index.mjs'

const generateNotes = ({ previousTag, location }) => {
  if (!previousTag) return ''

  const paths = [location]

  if (location !== 'packages/core') paths.push('packages/core')

  const lines = capture('git', [
    'log',
    `${previousTag}..HEAD`,
    '--format=* %s',
    '--',
    ...paths
  ])
    .split('\n')
    .filter((line) => line !== '' && !line.includes('update version of'))

  if (!lines.length) {
    return location === 'packages/core'
      ? ''
      : 'Rebuilt with the latest `@midstem/swipi` engine.'
  }

  return lines.join('\n')
}

export const buildArgs = ({
  tag,
  previousTag,
  location,
  note,
  prerelease
}) => {
  const changes = generateNotes({ previousTag, location })
  const body = [note, changes].filter(Boolean).join('\n\n')

  const args = [
    'release',
    'create',
    tag,
    '--target',
    MAIN_BRANCH,
    '--title',
    tag,
    '--notes',
    body || 'Maintenance release.'
  ]

  if (prerelease) args.push('--prerelease')

  return args
}

export const summary = ({
  entry,
  tag,
  previousTag,
  note,
  prerelease,
  head
}) => {
  const scope =
    entry.location !== 'packages/core'
      ? `${entry.location} + packages/core`
      : entry.location

  return [
    `  tag         ${tag}`,
    `  target      ${MAIN_BRANCH} (${head})`,
    `  notes       changes in ${scope} since ${previousTag ?? 'the first commit'}${note ? ', under your line' : ''}`,
    `  npm         ${entry.name}@${entry.version} on the ${prerelease ? 'next' : 'latest'} dist-tag`
  ]
}
