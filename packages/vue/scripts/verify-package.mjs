import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))

const failures = []

const check = (description, condition) => {
  if (condition) return

  failures.push(description)
}

const readDist = (file) => {
  const path = resolve('dist', file)

  if (!existsSync(path)) {
    failures.push(`dist/${file} is missing`)

    return ''
  }

  return readFileSync(path, 'utf8')
}

const collectExportTargets = (entry) =>
  typeof entry === 'string'
    ? [entry]
    : Object.values(entry).flatMap(collectExportTargets)

const exportTargets = collectExportTargets(packageJson.exports)

exportTargets.forEach((target) =>
  check(`exports target "${target}" is missing on disk`, existsSync(target))
)

const legacyEntries = [packageJson.main, packageJson.module, packageJson.types]

legacyEntries.forEach((entry) =>
  check(`"${entry}" is missing on disk`, existsSync(entry))
)

const esm = readDist('index.js')
const cjs = readDist('index.cjs')

const publicExports = ['useSwipiCarousel']

publicExports.forEach((name) => {
  check(
    `the ESM bundle does not export "${name}"`,
    new RegExp(`export\\s*\\{[^}]*\\b${name}\\b`).test(esm)
  )

  check(
    `the CJS bundle does not export "${name}"`,
    new RegExp(`exports\\.${name}\\s*=`).test(cjs)
  )
})

const types = readDist('index.d.ts')

publicExports.forEach((name) =>
  check(`the type entry does not export "${name}"`, types.includes(name))
)

const publicTypes = [
  'SwipiCarousel',
  'SwipiCarouselOptions',
  'SwipiCarouselRef',
  'SwipiState',
  'SlidePositions'
]

publicTypes.forEach((name) =>
  check(`the type entry does not export "${name}"`, types.includes(name))
)

const bundles = [
  ['ESM', esm],
  ['CJS', cjs]
]

bundles.forEach(([format, bundle]) =>
  check(
    `the ${format} bundle still pulls a stylesheet in`,
    !/['"][^'"]*\.css['"]/.test(bundle)
  )
)

check(
  'the package still exposes a stylesheet entry',
  !JSON.stringify(packageJson.exports).includes('.css')
)

const WORKSPACE_ONLY = '@swipi/core'

check(
  `"${WORKSPACE_ONLY}" is a dependency, but it is not published to the registry`,
  !Object.keys(packageJson.dependencies ?? {}).includes(WORKSPACE_ONLY)
)

const artifacts = [
  ['ESM', esm],
  ['CJS', cjs],
  ['type', types]
]

artifacts.forEach(([kind, artifact]) =>
  check(
    `the ${kind} bundle imports "${WORKSPACE_ONLY}" instead of inlining it`,
    !artifact.includes(WORKSPACE_ONLY)
  )
)

const PEER = 'vue'

check(
  `"${PEER}" is not a peer dependency`,
  Object.keys(packageJson.peerDependencies ?? {}).includes(PEER)
)

check(
  `the ESM bundle inlines "${PEER}" instead of importing it`,
  new RegExp(`from\\s*['"]${PEER}['"]`).test(esm)
)

check(
  `the CJS bundle inlines "${PEER}" instead of requiring it`,
  new RegExp(`require\\(['"]${PEER}['"]\\)`).test(cjs)
)

const packed = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json'], { encoding: 'utf8' })
)

const packedFiles = packed[0].files.map((file) => file.path)

const requiredFiles = [
  'dist/index.js',
  'dist/index.cjs',
  'dist/index.d.ts',
  'README.md',
  'LICENSE'
]

requiredFiles.forEach((file) =>
  check(`"${file}" is not published`, packedFiles.includes(file))
)

const excludedFiles = ['MIGRATION.md', 'PUBLISH.md', 'SIZE.md']

excludedFiles.forEach((file) =>
  check(`"${file}" is published`, !packedFiles.includes(file))
)

const stylesheets = packedFiles.filter((file) => file.endsWith('.css'))

check(
  `the package still publishes a stylesheet (${stylesheets.join(', ')})`,
  !stylesheets.length
)

if (failures.length) {
  console.error('Package verification failed:')
  failures.forEach((failure) => console.error(`  - ${failure}`))
  process.exit(1)
}

console.log(`Package verification passed (${packedFiles.length} files packed).`)
