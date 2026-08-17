import { MAIN_BRANCH } from '../../constants.mjs'
import { firstLine } from '../../helpers/index.mjs'
import { attempt, capture } from '../shell/index.mjs'

const committedVersion = (location) => {
  const shown = attempt('git', ['show', `HEAD:${location}/package.json`])

  return shown.ok ? JSON.parse(shown.output).version : null
}

export const collectProblems = ({ name, version, location }, tag) => {
  const problems = []

  const branch = capture('git', ['rev-parse', '--abbrev-ref', 'HEAD'])

  if (branch !== MAIN_BRANCH) {
    problems.push(
      `you are on "${branch}", and a release is cut from ${MAIN_BRANCH}`
    )
  }

  if (capture('git', ['status', '--porcelain'])) {
    problems.push('the working tree has changes that are not committed')
  }

  const fetched = attempt('git', ['fetch', '--tags', '--quiet'])

  if (!fetched.ok) {
    problems.push(`git fetch failed: ${firstLine(fetched.output)}`)
  }

  const remote = attempt('git', ['rev-parse', `origin/${MAIN_BRANCH}`])

  if (!remote.ok) {
    problems.push(`origin/${MAIN_BRANCH} is unknown to this clone`)
  } else if (remote.output !== capture('git', ['rev-parse', 'HEAD'])) {
    problems.push(
      `HEAD is not origin/${MAIN_BRANCH} — push or pull so the tag lands on a commit GitHub has`
    )
  }

  const committed = committedVersion(location)

  if (committed !== version) {
    problems.push(
      `HEAD has ${name} at ${committed ?? 'no version'}, not ${version} — commit the bump first`
    )
  }

  if (attempt('git', ['rev-parse', '-q', '--verify', `refs/tags/${tag}`]).ok) {
    problems.push(`the tag ${tag} already exists`)
  }

  if (attempt('gh', ['release', 'view', tag]).ok) {
    problems.push(`a GitHub release ${tag} already exists`)
  }

  return problems
}
