import { stdin } from 'node:process'

import { isDryRun, pad } from './helpers/index.mjs'
import { bump } from './modules/bump/index.mjs'
import { fail, step } from './modules/log/index.mjs'
import { isCancelled, openPrompt } from './modules/prompt/index.mjs'
import {
  describePublished,
  isPublished,
  readPublished
} from './modules/registry/index.mjs'
import { release } from './modules/release/index.mjs'
import { attempt } from './modules/shell/index.mjs'
import { readPackages } from './modules/workspaces/index.mjs'

const dryRun = isDryRun()

const describe = (entry, published, width) =>
  `${pad(entry.name, width)}  ${pad(entry.location, 16)}${pad(entry.version, 12)}${describePublished(published, entry.version)}`

const main = async () => {
  if (!stdin.isTTY) {
    fail(
      'This CLI asks which package and which version, so it needs a terminal.'
    )
  }

  if (!attempt('gh', ['auth', 'status']).ok) {
    fail(
      'gh is missing or not logged in, and gh is what creates the release.',
      'Install https://cli.github.com, then run gh auth login.'
    )
  }

  const packages = readPackages()

  if (!packages.length) fail('This repository publishes no packages.')

  const published = new Map(
    packages.map((entry) => [entry.name, readPublished(entry.name)])
  )

  const width = Math.max(...packages.map(({ name }) => name.length))
  const prompt = openPrompt()

  try {
    step('publishable packages')

    const entry = await prompt.choose(
      packages.map((candidate) => ({
        label: describe(candidate, published.get(candidate.name), width),
        value: candidate
      }))
    )

    const state = published.get(entry.name)
    const run = isPublished(state, entry.version) ? bump : release

    await run({ entry, published: state, prompt, dryRun })
  } finally {
    prompt.close()
  }
}

try {
  await main()
} catch (error) {
  if (!isCancelled(error)) throw error

  step('cancelled, nothing was created')
}
