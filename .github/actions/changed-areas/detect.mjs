import { execFileSync } from 'node:child_process'
import { appendFileSync } from 'node:fs'

const AREAS = [
  {
    name: 'core',
    package: '@midstem/swipi',
    workspaces: ['@midstem/swipi', '@swipi/playground-vanilla'],
    sources: [/^apps\/playground-vanilla\//]
  },
  {
    name: 'react',
    package: '@midstem/swipi-react',
    workspaces: ['@midstem/swipi-react', '@swipi/playground-react'],
    sources: [/^packages\/react\//, /^apps\/playground-react\//]
  },
  {
    name: 'vue',
    package: '@midstem/swipi-vue',
    workspaces: ['@midstem/swipi-vue', '@swipi/playground-vue'],
    sources: [/^packages\/vue\//, /^apps\/playground-vue\//]
  },
  {
    name: 'svelte',
    package: '@midstem/swipi-svelte',
    workspaces: ['@midstem/swipi-svelte', '@swipi/playground-svelte'],
    sources: [/^packages\/svelte\//, /^apps\/playground-svelte\//]
  },
  {
    name: 'angular',
    package: '@midstem/swipi-angular',
    workspaces: ['@midstem/swipi-angular', '@swipi/playground-angular'],
    sources: [/^packages\/angular\//, /^apps\/playground-angular\//]
  },
  {
    name: 'playground-core',
    package: '',
    workspaces: ['@swipi/playground-core'],
    sources: []
  }
]

const GLOBAL = [
  /^package\.json$/,
  /^package-lock\.json$/,
  /^tsconfig\.base\.json$/,
  /^eslint\.config\.js$/,
  /^\.prettierrc$/,
  /^LICENSE$/,
  /^tools\//,
  /^\.github\//
]

const readChangedFiles = () => {
  const base = process.env.BASE_SHA
  const head = process.env.HEAD_SHA

  if (process.env.RUN_ALL === 'true') return null
  if (!base || !head || /^0+$/.test(base)) return null

  try {
    return execFileSync('git', ['diff', '--name-only', `${base}...${head}`], {
      encoding: 'utf8'
    })
      .split('\n')
      .filter(Boolean)
  } catch {
    return null
  }
}

const files = readChangedFiles()

const touched = (...patterns) =>
  files === null || files.some((file) => patterns.some((p) => p.test(file)))

const global = touched(...GLOBAL)
const engine = global || touched(/^packages\/core\//)
const shared = engine || touched(/^packages\/playground-core\//)

const hit = (area) => shared || touched(...area.sources)

const matrix = AREAS.filter(hit).map(({ name, package: pkg, workspaces }) => ({
  name,
  package: pkg,
  workspaces: workspaces.map((w) => `--workspace ${w}`).join(' ')
}))

const published = AREAS.filter((area) => area.package).map((area) => ({
  ...area,
  needed: engine || touched(new RegExp(`^packages/${area.name}/`))
}))

const output = [
  ...published.map((area) => `${area.name}=${area.needed}`),
  `pages=${shared || touched(/^packages\//, /^apps\//)}`,
  `areas=${JSON.stringify(matrix)}`,
  `packages=${JSON.stringify(published.filter((a) => a.needed).map((a) => a.package))}`
]

appendFileSync(process.env.GITHUB_OUTPUT, `${output.join('\n')}\n`)

console.error(
  files === null
    ? 'no diff available, treating every area as changed'
    : `${files.length} changed file(s)`
)
console.error(output.join('\n'))
