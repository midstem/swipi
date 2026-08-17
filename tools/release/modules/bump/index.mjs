import { LOCKFILE } from '../../constants.mjs'
import { pad } from '../../helpers/index.mjs'
import { fail, lines, step } from '../log/index.mjs'
import { writeVersion } from '../manifest/index.mjs'
import { isVersion, suggestVersions } from '../version/index.mjs'

import { CUSTOM_CHOICE, LABEL_WIDTH } from './constants.mjs'

export const bump = async ({ entry, prompt, dryRun }) => {
  step(
    `${entry.name} ${entry.version} is on npm already, so this run only bumps the version`
  )

  const suggestions = suggestVersions(entry.version)

  if (!suggestions.length) {
    fail(
      `${entry.name} sits at "${entry.version}", which this tool cannot read.`
    )
  }

  const chosen = await prompt.choose([
    ...suggestions.map(({ label, version }) => ({
      label: `${pad(label, LABEL_WIDTH)}${version}`,
      value: version
    })),
    { label: CUSTOM_CHOICE, value: CUSTOM_CHOICE }
  ])

  const version =
    chosen === CUSTOM_CHOICE ? await prompt.ask('Version: ') : chosen

  if (!isVersion(version)) {
    fail(`"${version}" is not a version this tool can tag.`)
  }

  if (dryRun) {
    step(`dry run, so ${entry.location}/package.json keeps ${entry.version}`)

    return
  }

  writeVersion(entry, version)

  step(`wrote ${version} to ${entry.location}/package.json and ${LOCKFILE}`)

  lines(
    '',
    'Commit it, get it onto main, then run npm run release again to tag it:',
    '',
    `  git switch -c release/${entry.name}-${version}`,
    `  git commit -am "release ${entry.name} ${version}"`,
    '',
    'Open a pull request, merge it, and the second run creates the release.'
  )
}
