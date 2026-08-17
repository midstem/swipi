import { MAIN_BRANCH } from '../../constants.mjs'

export const buildArgs = ({ tag, previousTag, note, prerelease }) => {
  const args = [
    'release',
    'create',
    tag,
    '--target',
    MAIN_BRANCH,
    '--title',
    tag,
    '--generate-notes'
  ]

  if (previousTag) args.push('--notes-start-tag', previousTag)
  if (note) args.push('--notes', note)
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
}) => [
  `  tag         ${tag}`,
  `  target      ${MAIN_BRANCH} (${head})`,
  `  notes       pull requests since ${previousTag ?? 'the first commit'}${note ? ', under your line' : ''}`,
  `  npm         ${entry.name}@${entry.version} on the ${prerelease ? 'next' : 'latest'} dist-tag`
]
