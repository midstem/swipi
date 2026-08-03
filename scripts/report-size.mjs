import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

const BUNDLES = ['index.js', 'index.cjs', 'index.css']

const args = process.argv.slice(2)

const readOption = (name) => {
  const index = args.indexOf(name)

  if (index === -1) return undefined

  const value = args[index + 1]

  if (!value || value.startsWith('--')) {
    console.error(`${name} needs a file path`)
    process.exit(1)
  }

  return value
}

const measureDist = () =>
  BUNDLES.flatMap((bundle) => {
    const path = resolve('dist', bundle)

    if (!existsSync(path)) return []

    const contents = readFileSync(path)

    return [
      {
        file: `dist/${bundle}`,
        raw: contents.length,
        gzip: gzipSync(contents, { level: 9 }).length
      }
    ]
  })

const readMeasurements = (path) => JSON.parse(readFileSync(path, 'utf8'))

const sumBy = (measurements, key) =>
  measurements.reduce((total, entry) => total + entry[key], 0)

const totalOf = (measurements) => ({
  file: 'Total',
  raw: sumBy(measurements, 'raw'),
  gzip: sumBy(measurements, 'gzip')
})

const formatBytes = (bytes) => `${bytes.toLocaleString('en-US')} B`

const formatDiff = (bytes) => {
  if (bytes === 0) return 'no change'

  const sign = bytes > 0 ? '+' : '-'

  return `${sign}${formatBytes(Math.abs(bytes))}`
}

const formatChange = (bytes, baseBytes) => {
  if (bytes === undefined) return `removed (was ${formatBytes(baseBytes)})`

  if (baseBytes === undefined) return `${formatBytes(bytes)} (new)`

  return `${formatBytes(bytes)} (${formatDiff(bytes - baseBytes)})`
}

const buildRows = (current) =>
  [...current, totalOf(current)].map(({ file, raw, gzip }) => [
    file,
    formatBytes(raw),
    formatBytes(gzip)
  ])

const buildComparedRows = (current, base) => {
  const files = [...new Set([...current, ...base].map(({ file }) => file))]

  return [...files, 'Total'].map((file) => {
    const head =
      file === 'Total'
        ? totalOf(current)
        : current.find((entry) => entry.file === file)
    const previous =
      file === 'Total'
        ? totalOf(base)
        : base.find((entry) => entry.file === file)

    return [
      file,
      formatChange(head?.raw, previous?.raw),
      formatChange(head?.gzip, previous?.gzip)
    ]
  })
}

const formatFile = (file) =>
  file.includes('/') ? `\`${file}\`` : `**${file}**`

const renderTable = (rows) =>
  [
    '| File | Size | Gzip |',
    '| --- | ---: | ---: |',
    ...rows.map(
      ([file, ...cells]) => `| ${formatFile(file)} | ${cells.join(' | ')} |`
    )
  ].join('\n')

const currentPath = readOption('--current')
const basePath = readOption('--base')
const jsonPath = readOption('--json')

const current = currentPath ? readMeasurements(currentPath) : measureDist()

if (!current.length) {
  console.error('dist is empty — run "npm run build" first')
  process.exit(1)
}

if (jsonPath) writeFileSync(jsonPath, `${JSON.stringify(current, null, 2)}\n`)

const base = basePath ? readMeasurements(basePath) : []

console.log('## Bundle size\n')
console.log(
  renderTable(
    base.length ? buildComparedRows(current, base) : buildRows(current)
  )
)
console.log(
  base.length
    ? '\nSizes are compared against the base branch.'
    : '\nThere is no base branch to compare against.'
)
