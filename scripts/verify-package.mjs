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
const css = readDist('index.css')

check(
  'the ESM bundle does not import the stylesheet',
  /import\s*['"]\.\/index\.css['"]/.test(esm)
)

check(
  'the CJS bundle does not require the stylesheet',
  /require\(['"]\.\/index\.css['"]\)/.test(cjs)
)

const criticalRules = [
  '.swipi-viewport',
  '.swipi-track',
  '.swipi-slide',
  'overflow:hidden',
  'var(--swipi-slide-width)'
]

criticalRules.forEach((rule) =>
  check(`the stylesheet is missing "${rule}"`, css.includes(rule))
)

check(
  'the stylesheet leaks a global "button" selector',
  !/(^|[},])button\s*\{/.test(css)
)

const packed = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json'], { encoding: 'utf8' })
)

const packedFiles = packed[0].files.map((file) => file.path)

const requiredFiles = [
  'dist/index.js',
  'dist/index.cjs',
  'dist/index.css',
  'dist/index.d.ts'
]

requiredFiles.forEach((file) =>
  check(`"${file}" is not published`, packedFiles.includes(file))
)

if (failures.length) {
  console.error('Package verification failed:')
  failures.forEach((failure) => console.error(`  - ${failure}`))
  process.exit(1)
}

console.log(`Package verification passed (${packedFiles.length} files packed).`)
