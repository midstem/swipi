import { fail, lines, step } from '../log/index.mjs'
import { collectProblems } from '../preflight/index.mjs'
import { capture, forward } from '../shell/index.mjs'
import { readPreviousTag } from '../tags/index.mjs'
import { isPrerelease } from '../version/index.mjs'

import { buildArgs, summary } from './helpers.mjs'

export const release = async ({ entry, published, prompt, dryRun }) => {
  const tag = `${entry.name}@${entry.version}`
  const previousTag = readPreviousTag(entry.name)
  const prerelease = isPrerelease(entry.version)

  step(
    published.versions === null
      ? `npm is unreachable, so ${tag} is unchecked against the registry`
      : `${entry.name} ${entry.version} is not on npm yet`
  )

  const problems = collectProblems(entry, tag)

  if (problems.length) {
    fail(
      `${tag} is not ready to be released:`,
      ...problems.map((problem) => `  - ${problem}`)
    )
  }

  lines(`main is clean, pushed, and carries ${entry.name} ${entry.version}`)

  const note = await prompt.ask(
    '\nA line for the top of the release notes (Enter to skip): '
  )

  const args = buildArgs({
    tag,
    previousTag,
    location: entry.location,
    note,
    prerelease
  })

  step('about to create the GitHub release')

  lines(
    ...summary({
      entry,
      tag,
      previousTag,
      note,
      prerelease,
      head: capture('git', ['rev-parse', '--short', 'HEAD'])
    }),
    '',
    'Creating it starts the build workflow: every gate, then npm publish.',
    'A version that reaches npm cannot be replaced, only superseded.'
  )

  if (dryRun) {
    step('dry run, so nothing was created')
    lines(`  gh ${args.join(' ')}`)

    return
  }

  if (!(await prompt.confirm('\nCreate it? [y/N] '))) {
    step('nothing was created')

    return
  }

  forward('gh', args)

  step(`${tag} is released`)

  lines(
    '  gh run watch',
    `  gh release view ${tag} --web`,
    `  npm view ${entry.name} version`
  )
}
