import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const TAG_PATTERN = /^(.+)@(\d+\.\d+\.\d+.*)$/

const EXAMPLES = '@midstem/swipi-react@1.0.1, @midstem/swipi-vue@1.0.0'

const fail = (...messages) => {
  console.error(messages.join('\n'))
  process.exit(1)
}

const readManifest = (location) => {
  const path = join(location, 'package.json')

  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null
}

const expand = (pattern) => {
  if (!pattern.endsWith('/*')) return [pattern]

  const base = pattern.slice(0, -2)

  if (!existsSync(base)) return []

  return readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(base, entry.name))
}

const readWorkspaces = () =>
  (readManifest('.')?.workspaces ?? [])
    .flatMap(expand)
    .map((location) => ({ location, manifest: readManifest(location) }))
    .filter(({ manifest }) => manifest?.name)

const tag = process.env.TAG ?? ''

const match = TAG_PATTERN.exec(tag)

if (!match) {
  fail(
    `a release tag names one package: ${EXAMPLES}`,
    `it is tagged ${tag || 'nothing'}`
  )
}

const [, name, tagged] = match

const workspace = readWorkspaces().find(
  ({ manifest }) => manifest.name === name
)

if (!workspace) fail(`${name} is not a workspace of this repository`)

const { manifest, location } = workspace

if (manifest.private) fail(`${name} is private, so it is never published`)

if (manifest.version !== tagged) {
  fail(
    `${name} is ${manifest.version}, so the release must be tagged ${name}@${manifest.version}`,
    `it is tagged ${tag}`
  )
}

const npmTag = manifest.version.includes('-') ? 'next' : 'latest'

console.log(`PACKAGE=${name}`)
console.log(`NPM_TAG=${npmTag}`)

console.error(
  `Publishing ${name}@${manifest.version} from ${location} as ${tag} on the ${npmTag} dist-tag`
)
