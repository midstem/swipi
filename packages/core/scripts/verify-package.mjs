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

const publicExports = ['createSwipi', 'resolveOptions']

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
  'ResolvedSwipiOptions',
  'SwipiApi',
  'SwipiOptions',
  'SwipiSnapshot',
  'SwipiState',
  'SlidePositions',
  'SwipiAxis'
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

check(
  'the package declares dependencies, but the engine stands alone',
  packageJson.dependencies === undefined
)

check(
  'the package declares peer dependencies, but the engine needs no framework',
  packageJson.peerDependencies === undefined
)

const esmImports = [...esm.matchAll(/from\s*['"]([^'"]+)['"]/g)].map(
  ([, source]) => source
)

const cjsImports = [...cjs.matchAll(/require\(['"]([^'"]+)['"]\)/g)].map(
  ([, source]) => source
)

check(
  `the ESM bundle is not self-contained (${esmImports.join(', ')})`,
  !esmImports.length
)

check(
  `the CJS bundle is not self-contained (${cjsImports.join(', ')})`,
  !cjsImports.length
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

const excludedFiles = ['PUBLISH.md']

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
